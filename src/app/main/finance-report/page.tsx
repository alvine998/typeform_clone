"use client";

import { useState, useMemo, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import {
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Download,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FinanceRecord } from "@/types";

const COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#22c55e", "#eab308", "#ef4444"];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount || 0);

export default function FinanceReportPage() {
  const { t } = useI18n();
  const { financeRecords, fetchFinanceRecords, approveFinanceRecord, rejectFinanceRecord } = useStore();

  useEffect(() => {
    fetchFinanceRecords();
  }, [fetchFinanceRecords]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: "approve" | "reject";
    record: FinanceRecord | null;
  }>({ open: false, type: "approve", record: null });

  const [detailModal, setDetailModal] = useState<FinanceRecord | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(financeRecords.map((r) => r.category))),
    [financeRecords]
  );

  const filtered = useMemo(() => {
    let data = [...financeRecords];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.formTitle.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") data = data.filter((r) => r.status === statusFilter);
    if (categoryFilter !== "all") data = data.filter((r) => r.category === categoryFilter);
    if (dateFrom) data = data.filter((r) => r.date >= dateFrom);
    if (dateTo) data = data.filter((r) => r.date <= dateTo);
    return data;
  }, [financeRecords, search, statusFilter, categoryFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(() => {
    const total = financeRecords.reduce((s, r) => s + (r.amount || 0), 0);
    const approved = financeRecords.filter((r) => r.status === "approved").reduce((s, r) => s + (r.amount || 0), 0);
    const pending = financeRecords.filter((r) => r.status === "pending").reduce((s, r) => s + (r.amount || 0), 0);
    const rejected = financeRecords.filter((r) => r.status === "rejected").reduce((s, r) => s + (r.amount || 0), 0);
    return { total, approved, pending, rejected };
  }, [financeRecords]);

  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    financeRecords.forEach((r) => {
      map[r.category] = (map[r.category] || 0) + (r.amount || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [financeRecords]);

  const barData = useMemo(() => {
    const map: Record<string, number> = {};
    financeRecords.forEach((r) => {
      const key = r.date.slice(0, 7);
      map[key] = (map[key] || 0) + (r.amount || 0);
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));
  }, [financeRecords]);

  const statusBadge = (status: FinanceRecord["status"]) => {
    const styles: Record<string, string> = {
      approved: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      rejected: "bg-red-100 text-red-700",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {t(`finance.${status}`)}
      </span>
    );
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      financeRecords.map((r) => ({
        Form: r.formTitle,
        Category: r.category,
        Description: r.description,
        Amount: r.amount,
        Date: r.date,
        Status: r.status,
        ApprovedBy: r.approvedBy || "-",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Finance");
    XLSX.writeFile(wb, "finance-report.xlsx");
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text(t("finance.title"), 14, 22);
    autoTable(doc, {
      startY: 30,
      head: [[t("finance.formTitle"), t("finance.category"), t("finance.amount"), t("finance.status")]],
      body: financeRecords.map((r) => [
        r.formTitle,
        r.category,
        formatCurrency(r.amount),
        r.status,
      ]),
    });
    doc.save("finance-report.pdf");
  };

  const handleAction = async () => {
    if (!confirmModal.record) return;
    if (confirmModal.type === "approve") {
      await approveFinanceRecord(confirmModal.record.id);
    } else {
      await rejectFinanceRecord(confirmModal.record.id);
    }
    setConfirmModal({ open: false, type: "approve", record: null });
  };

  const statCards = [
    { label: t("finance.totalAmount"), value: stats.total, icon: Wallet, color: "from-purple-500 to-violet-600", iconBg: "bg-purple-100 text-purple-600" },
    { label: t("finance.approvedAmount"), value: stats.approved, icon: CheckCircle, color: "from-green-500 to-emerald-600", iconBg: "bg-green-100 text-green-600" },
    { label: t("finance.pendingAmount"), value: stats.pending, icon: Clock, color: "from-yellow-500 to-amber-600", iconBg: "bg-yellow-100 text-yellow-600" },
    { label: t("finance.rejectedAmount"), value: stats.rejected, icon: XCircle, color: "from-red-500 to-rose-600", iconBg: "bg-red-100 text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t("finance.title")}</h1>
          <p className="text-gray-500 mt-1">{filtered.length} {t("common.total").toLowerCase()}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            {t("finance.exportExcel")}
          </button>
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            {t("finance.exportPdf")}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{formatCurrency(card.value)}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("common.search")}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
          >
            <option value="all">{t("finance.allStatus")}</option>
            <option value="pending">{t("finance.pending")}</option>
            <option value="approved">{t("finance.approved")}</option>
            <option value="rejected">{t("finance.rejected")}</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
          >
            <option value="all">{t("finance.allCategories")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            placeholder="From"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            placeholder="To"
          />
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("finance.formTitle")}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("finance.category")}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("finance.description")}</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("finance.amount")}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("finance.date")}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("finance.status")}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("finance.approvedBy")}</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("finance.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">{t("common.noData")}</td>
                </tr>
              ) : (
                paginated.map((r) => (
                  <tr key={r.id} className="hover:bg-purple-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.formTitle}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{r.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">{r.description}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">{formatCurrency(r.amount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(r.date)}</td>
                    <td className="px-6 py-4">{statusBadge(r.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.approvedBy || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {r.status === "pending" && (
                          <>
                            <button
                              onClick={() => setConfirmModal({ open: true, type: "approve", record: r })}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title={t("finance.approve")}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setConfirmModal({ open: true, type: "reject", record: r })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title={t("finance.reject")}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setDetailModal(r)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title={t("finance.viewDetails")}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} / {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    p === page ? "bg-purple-600 text-white" : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-4 mb-8">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm border border-gray-100">
            {t("common.noData")}
          </div>
        ) : (
          paginated.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{r.formTitle}</h3>
                  <span className="inline-flex px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-xs font-medium mt-1">{r.category}</span>
                </div>
                {statusBadge(r.status)}
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{r.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-900">{formatCurrency(r.amount)}</span>
                <span className="text-xs text-gray-400">{formatDate(r.date)}</span>
              </div>
              {r.approvedBy && (
                <p className="text-xs text-gray-400 mb-3">{t("finance.approvedBy")}: {r.approvedBy}</p>
              )}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                {r.status === "pending" && (
                  <>
                    <button
                      onClick={() => setConfirmModal({ open: true, type: "approve", record: r })}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-medium hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {t("finance.approve")}
                    </button>
                    <button
                      onClick={() => setConfirmModal({ open: true, type: "reject", record: r })}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-xl text-xs font-medium hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {t("finance.reject")}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setDetailModal(r)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-medium hover:bg-purple-100 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {t("common.details")}
                </button>
              </div>
            </div>
          ))
        )}

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-2 py-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> {t("common.back")}
            </button>
            <span className="text-sm text-gray-500">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-40"
            >
              {t("common.next")} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{t("finance.amountByCategory")}</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{t("finance.monthlyAmounts")}</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal.open && confirmModal.record && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmModal({ open: false, type: "approve", record: null })} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${confirmModal.type === "approve" ? "bg-green-100" : "bg-red-100"}`}>
                <AlertCircle className={`w-5 h-5 ${confirmModal.type === "approve" ? "text-green-600" : "text-red-600"}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {confirmModal.type === "approve" ? t("finance.approve") : t("finance.reject")}
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {confirmModal.type === "approve" ? t("finance.confirmApprove") : t("finance.confirmReject")}
            </p>
            <div className="bg-gray-50 rounded-xl p-3 mb-6">
              <p className="text-sm font-medium text-gray-900">{confirmModal.record.formTitle}</p>
              <p className="text-sm text-gray-500">{formatCurrency(confirmModal.record.amount)}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ open: false, type: "approve", record: null })}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleAction}
                className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium transition-colors ${
                  confirmModal.type === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {t("common.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t("finance.recordDetails")}</h3>
              <button onClick={() => setDetailModal(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: t("finance.formTitle"), value: detailModal.formTitle },
                { label: t("finance.category"), value: detailModal.category },
                { label: t("finance.description"), value: detailModal.description },
                { label: t("finance.amount"), value: formatCurrency(detailModal.amount) },
                { label: t("finance.date"), value: formatDate(detailModal.date) },
                { label: t("finance.status"), value: detailModal.status },
                { label: t("finance.approvedBy"), value: detailModal.approvedBy || "-" },
                { label: t("finance.createdAt"), value: formatDate(detailModal.createdAt) },
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500 font-medium sm:w-32 shrink-0">{item.label}</span>
                  <span className="text-sm text-gray-900 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button
                onClick={() => setDetailModal(null)}
                className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-sm font-medium transition-colors"
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
