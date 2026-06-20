"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  FileSpreadsheet,
  FileDown,
  BarChart3,
  Users,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  TrendingUp,
  Share2,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { cn, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import type { FormField, FormResponse, QuestionReport } from "@/types";

function computeQuestionReports(fields: FormField[], responses: FormResponse[]): QuestionReport[] {
  return fields
    .filter((f) => ["radio", "checkbox", "select", "rating"].includes(f.type))
    .map((field) => {
      const answers = responses.map((r) => r.answers[field.id]).filter((v) => v !== undefined && v !== "");
      const totalAnswers = answers.length;

      if (field.type === "rating") {
        const numericAnswers = answers.filter((v): v is number => typeof v === "number");
        const avg = numericAnswers.length > 0 ? numericAnswers.reduce((a, b) => a + b, 0) / numericAnswers.length : 0;
        const distribution = [1, 2, 3, 4, 5].map((n) => {
          const count = numericAnswers.filter((v) => v === n).length;
          return { label: `${n} Star${n > 1 ? "s" : ""}`, count, percentage: totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0 };
        });
        return { fieldId: field.id, fieldLabel: field.label, fieldType: field.type, totalAnswers, distribution, averageRating: Math.round(avg * 10) / 10 };
      }

      // For radio, checkbox, select
      const options = field.options || [];
      const flatAnswers = answers.flatMap((v) => (Array.isArray(v) ? v : [String(v)]));
      const distribution = options.map((opt) => {
        const count = flatAnswers.filter((v) => v === opt).length;
        return { label: opt, count, percentage: totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0 };
      });
      return { fieldId: field.id, fieldLabel: field.label, fieldType: field.type, totalAnswers, distribution };
    });
}

const statusConfig = {
  active: { color: "success", icon: CheckCircle2 },
  draft: { color: "warning", icon: Clock },
  closed: { color: "danger", icon: XCircle },
} as const;

const PIE_COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#a78bfa",
  "#c4b5fd",
  "#ddd6fe",
  "#4ade80",
  "#f59e0b",
];

export default function FormDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  const { forms, fetchForms, fetchFormResponses } = useStore();

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const [formResponses, setFormResponses] = useState<FormResponse[]>([]);
  useEffect(() => {
    fetchFormResponses(formId).then(setFormResponses);
  }, [formId, fetchFormResponses]);

  const [activeTab, setActiveTab] = useState<"responses" | "report" | "surveyor">("responses");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const form = useMemo(() => forms.find((f) => f.id === formId), [forms, formId]);

  const questionReports = useMemo(() => {
    if (!form) return [];
    return computeQuestionReports(form.fields, formResponses);
  }, [form, formResponses]);

  const surveyors = useMemo(() => {
    const map = new Map<string, { surveyorId: string; surveyorName: string; totalResponses: number; lastActive: string }>();
    for (const r of formResponses) {
      if (!r.surveyorId) continue;
      const existing = map.get(r.surveyorId);
      if (existing) {
        existing.totalResponses++;
        if (r.submittedAt > existing.lastActive) existing.lastActive = r.submittedAt;
      } else {
        map.set(r.surveyorId, {
          surveyorId: r.surveyorId,
          surveyorName: r.surveyorName || "Unknown",
          totalResponses: 1,
          lastActive: r.submittedAt,
        });
      }
    }
    return Array.from(map.values()).map((s) => ({
      ...s,
      formsAssigned: 1,
      completionRate: 100,
    }));
  }, [formResponses]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportExcel = () => {
    if (!form) return;
    const data = formResponses.map((r) => ({
      Name: r.respondentName,
      Email: r.respondentEmail,
      Submitted: r.submittedAt,
      ...Object.fromEntries(
        form.fields.map((f) => [
          f.label,
          Array.isArray(r.answers[f.id])
            ? (r.answers[f.id] as string[]).join(", ")
            : String(r.answers[f.id] ?? ""),
        ])
      ),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    XLSX.writeFile(wb, `${form.title}.xlsx`);
    showToast(t("forms.exportExcel") + " ✓");
  };

  const handleExportPdf = () => {
    if (!form) return;
    const doc = new jsPDF();
    doc.text(form.title, 14, 22);
    autoTable(doc, {
      startY: 30,
      head: [["Name", "Email", "Date"]],
      body: formResponses.map((r) => [
        r.respondentName,
        r.respondentEmail,
        r.submittedAt,
      ]),
    });
    doc.save(`${form.title}.pdf`);
    showToast(t("forms.exportPdf") + " ✓");
  };

  const handleShareLink = () => {
    if (!form) return;
    const link = `${window.location.origin}/forms/fill/${form.id}`;
    navigator.clipboard.writeText(link).then(() => {
      showToast(t("forms.linkCopied") + " ✓");
    });
  };

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">{t("common.noData")}</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push("/main/forms")}>
          {t("common.back")}
        </Button>
      </div>
    );
  }

  const sc = statusConfig[form.status];
  const StatusIcon = sc.icon;

  const tabs = [
    { key: "responses" as const, label: t("forms.responses"), icon: MessageSquare },
    { key: "report" as const, label: t("forms.reportPerQuestion"), icon: BarChart3 },
    { key: "surveyor" as const, label: t("forms.surveyor"), icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/main/forms")}
        className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-purple-600"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("common.back")}
      </button>

      {/* Form Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {form.title}
            </h1>
            <Badge variant={sc.color as "success" | "warning" | "danger"}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {t(`forms.${form.status}`)}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-gray-500">{form.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            icon={<FileSpreadsheet className="h-4 w-4" />}
          >
            {t("forms.exportExcel")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            icon={<FileDown className="h-4 w-4" />}
          >
            {t("forms.exportPdf")}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/main/forms/preview/${form.id}`)}
            icon={<Pencil className="h-4 w-4" />}
          >
            {t("forms.preview")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleShareLink}
            icon={<Share2 className="h-4 w-4" />}
          >
            {t("forms.shareLink")}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                activeTab === tab.key
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "responses" && (
        <div className="space-y-4">
          {formResponses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-16">
              <MessageSquare className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm text-gray-500">{t("common.noData")}</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3 font-semibold text-gray-600">
                        {t("forms.respondent")}
                      </th>
                      <th className="px-5 py-3 font-semibold text-gray-600">
                        {t("auth.email")}
                      </th>
                      <th className="px-5 py-3 font-semibold text-gray-600">
                        {t("forms.submittedAt")}
                      </th>
                      <th className="px-5 py-3 font-semibold text-gray-600">
                        {t("common.details")}
                      </th>
                      <th className="px-5 py-3 font-semibold text-gray-600">
                        {t("common.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formResponses.map((r) => (
                      <tr
                        key={r.id}
                        className="transition-colors hover:bg-purple-50/50"
                      >
                        <td className="px-5 py-3 font-medium text-gray-900">
                          {r.respondentName}
                        </td>
                        <td className="px-5 py-3 text-gray-500">
                          {r.respondentEmail}
                        </td>
                        <td className="px-5 py-3 text-gray-500">
                          {formatDateTime(r.submittedAt)}
                        </td>
                        <td className="max-w-[200px] truncate px-5 py-3 text-gray-400">
                          {Object.values(r.answers)
                            .map((v) =>
                              Array.isArray(v) ? v.join(", ") : String(v)
                            )
                            .join(" · ")}
                        </td>
                        <td className="px-5 py-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedResponse(r);
                              setShowResponseModal(true);
                            }}
                          >
                            {t("common.view")}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "report" && (
        <div className="space-y-6">
          {questionReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-16">
              <BarChart3 className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm text-gray-500">{t("common.noData")}</p>
            </div>
          ) : (
            questionReports.map((report) => (
              <div
                key={report.fieldId}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {report.fieldLabel}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      {report.totalAnswers} {t("forms.responses")} · {report.fieldType}
                    </p>
                  </div>
                  {report.averageRating && (
                    <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-amber-700">
                        {report.averageRating}
                      </span>
                      <span className="text-xs text-amber-500">
                        {t("forms.totalAvg").replace("{label}", t("common.total"))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Bar Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.distribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 12 }}
                          stroke="#9ca3af"
                        />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {report.distribution.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={report.distribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="count"
                          nameKey="label"
                        >
                          {report.distribution.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Distribution Table */}
                <div className="mt-4 space-y-2">
                  {report.distribution.map((d) => (
                    <div key={d.label} className="flex items-center gap-3">
                      <span className="w-24 text-xs text-gray-500">{d.label}</span>
                      <div className="flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                          style={{ width: `${d.percentage}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-xs font-medium text-gray-700">
                        {d.count} ({d.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "surveyor" && (
        <div className="space-y-4">
          {surveyors.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-16">
              <Users className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm text-gray-500">{t("common.noData")}</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3 font-semibold text-gray-600">
                        {t("users.name")}
                      </th>
                      <th className="px-5 py-3 font-semibold text-gray-600">
                        {t("forms.responses")}
                      </th>
                      <th className="px-5 py-3 font-semibold text-gray-600">
                        {t("forms.completionRate")}
                      </th>
                      <th className="px-5 py-3 font-semibold text-gray-600">
                        {t("forms.lastActive")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {surveyors.map((s) => (
                      <tr
                        key={s.surveyorId}
                        className="transition-colors hover:bg-purple-50/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-bold text-white">
                              {s.surveyorName.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">
                              {s.surveyorName}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                            <span className="font-bold text-gray-900">
                              {s.totalResponses}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-500",
                                  s.completionRate >= 90
                                    ? "bg-emerald-500"
                                    : s.completionRate >= 70
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                )}
                                style={{ width: `${s.completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {s.completionRate}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {formatDateTime(s.lastActive)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Response Detail Modal */}
      <Modal
        open={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        title={t("common.details")}
        size="lg"
      >
        {selectedResponse && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">{t("forms.respondent")}</p>
                <p className="font-medium text-gray-900">
                  {selectedResponse.respondentName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t("auth.email")}</p>
                <p className="font-medium text-gray-900">
                  {selectedResponse.respondentEmail}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t("forms.responses")}
              </p>
              {form.fields.map((field) => (
                <div
                  key={field.id}
                  className="mb-3 rounded-lg bg-gray-50 p-3"
                >
                  <p className="text-xs text-gray-500">{field.label}</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {Array.isArray(selectedResponse.answers[field.id])
                      ? (selectedResponse.answers[field.id] as string[]).join(", ")
                      : String(selectedResponse.answers[field.id] ?? "—")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-2xl">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
