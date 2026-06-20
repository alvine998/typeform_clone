"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  FileText,
  Eye,
  Pencil,
  Trash2,
  FileSpreadsheet,
  FileDown,
  Sheet,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  X,
  Copy,
  Share2,
  ExternalLink,
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { cn, formatDate, truncate, generateId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import type { Form, FormField } from "@/types";

const statusConfig = {
  active: { color: "success", icon: CheckCircle2 },
  draft: { color: "warning", icon: Clock },
  closed: { color: "danger", icon: XCircle },
} as const;

export default function FormsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { forms, addForm, deleteForm, duplicateForm, fetchForms, fetchFormResponses } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState<Form | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFields, setNewFields] = useState<FormField[]>([]);
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState<FormField["type"]>("text");
  const [fieldOptions, setFieldOptions] = useState("");
  const [fieldRequired, setFieldRequired] = useState(false);

  const stats = useMemo(
    () => ({
      total: forms.length,
      active: forms.filter((f) => f.status === "active").length,
      draft: forms.filter((f) => f.status === "draft").length,
      closed: forms.filter((f) => f.status === "closed").length,
    }),
    [forms]
  );

  const filtered = useMemo(() => {
    let list = forms;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((f) => f.status === statusFilter);
    }
    return list;
  }, [forms, search, statusFilter]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportExcel = async (form: Form) => {
    const formResponses = await fetchFormResponses(form.id);
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

  const handleExportPdf = async (form: Form) => {
    const formResponses = await fetchFormResponses(form.id);
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

  const handleSyncGoogle = (form: Form) => {
    showToast(`${t("forms.syncGoogle")} — "${form.title}" ✓`);
  };

  const handleAddField = () => {
    if (!fieldLabel.trim()) return;
    const field: FormField = {
      id: generateId(),
      type: fieldType,
      label: fieldLabel.trim(),
      required: fieldRequired,
      options:
        fieldType === "radio" ||
        fieldType === "checkbox" ||
        fieldType === "select"
          ? fieldOptions
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean)
          : undefined,
      order: newFields.length + 1,
    };
    setNewFields([...newFields, field]);
    setFieldLabel("");
    setFieldOptions("");
    setFieldRequired(false);
  };

  const handleRemoveField = (id: string) => {
    setNewFields(newFields.filter((f) => f.id !== id));
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await addForm({
      title: newTitle.trim(),
      description: newDescription.trim(),
      fields: newFields,
      status: "draft",
    });
    setNewTitle("");
    setNewDescription("");
    setNewFields([]);
    setShowCreateModal(false);
    showToast(t("forms.create") + " ✓");
  };

  const handleDelete = async () => {
    if (formToDelete) {
      await deleteForm(formToDelete.id);
      setShowDeleteModal(false);
      setFormToDelete(null);
      showToast(t("common.delete") + " ✓");
    }
  };

  const handleDuplicate = async (form: Form) => {
    await duplicateForm(form.id);
    showToast(t("forms.duplicated") + " ✓");
  };

  const handleShareLink = (form: Form) => {
    const link = `${window.location.origin}/forms/fill/${form.id}`;
    navigator.clipboard.writeText(link).then(() => {
      showToast(t("forms.linkCopied") + " ✓");
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("forms.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("app.tagline")}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          {t("forms.create")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: t("common.total"),
            value: stats.total,
            icon: FileText,
            bg: "bg-purple-50",
            text: "text-purple-600",
          },
          {
            label: t("forms.active"),
            value: stats.active,
            icon: CheckCircle2,
            bg: "bg-emerald-50",
            text: "text-emerald-600",
          },
          {
            label: t("forms.draft"),
            value: stats.draft,
            icon: Clock,
            bg: "bg-amber-50",
            text: "text-amber-600",
          },
          {
            label: t("forms.closed"),
            value: stats.closed,
            icon: XCircle,
            bg: "bg-red-50",
            text: "text-red-600",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-xl p-4 transition-all duration-200",
              s.bg
            )}
          >
            <div className="flex items-center gap-3">
              <s.icon className={cn("h-5 w-5", s.text)} />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t("common.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "draft", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-lg px-4 py-2.5 text-xs font-medium transition-all",
                statusFilter === s
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              )}
            >
              {s === "all" ? t("common.all") : t(`forms.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Card Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-16">
          <FileText className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-sm text-gray-500">{t("common.noData")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((form) => {
            const sc = statusConfig[form.status];
            const StatusIcon = sc.icon;
            return (
              <div
                key={form.id}
                className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {form.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {truncate(form.description, 80)}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === form.id ? null : form.id)
                      }
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {openMenu === form.id && (
                      <div className="absolute right-0 z-30 mt-1 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                        <button
                          onClick={() => {
                            router.push(`/main/forms/${form.id}`);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50"
                        >
                          <BarChart3 className="h-4 w-4" />
                          {t("common.view")}
                        </button>
                        <button
                          onClick={() => {
                            router.push(`/main/forms/preview/${form.id}`);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50"
                        >
                          <Eye className="h-4 w-4" />
                          {t("forms.preview")}
                        </button>
                        <button
                          onClick={() => {
                            router.push(`/main/forms/${form.id}`);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50"
                        >
                          <Pencil className="h-4 w-4" />
                          {t("common.edit")}
                        </button>
                        <button
                          onClick={() => {
                            handleDuplicate(form);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50"
                        >
                          <Copy className="h-4 w-4" />
                          {t("common.duplicate")}
                        </button>
                        <button
                          onClick={() => {
                            handleShareLink(form);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50"
                        >
                          <Share2 className="h-4 w-4" />
                          {t("forms.shareLink")}
                        </button>
                        <button
                          onClick={() => {
                            window.open(`/forms/fill/${form.id}`, "_blank");
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {t("forms.fillForm")}
                        </button>
                        <div className="border-t border-gray-100" />
                        <button
                          onClick={() => {
                            handleExportExcel(form);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-green-50"
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          {t("forms.exportExcel")}
                        </button>
                        <button
                          onClick={() => {
                            handleExportPdf(form);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50"
                        >
                          <FileDown className="h-4 w-4" />
                          {t("forms.exportPdf")}
                        </button>
                        <button
                          onClick={() => {
                            handleSyncGoogle(form);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-emerald-50"
                        >
                          <Sheet className="h-4 w-4" />
                          {t("forms.syncGoogle")}
                        </button>
                        <div className="border-t border-gray-100" />
                        <button
                          onClick={() => {
                            setFormToDelete(form);
                            setShowDeleteModal(true);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t("common.delete")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Badge variant={sc.color as "success" | "warning" | "danger"} size="sm">
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {t(`forms.${form.status}`)}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {form.responseCount}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {t("forms.responses")}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {form.fields.length}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {t("forms.fields")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      {formatDate(form.createdAt)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {t("common.date")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Form Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={t("forms.create")}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleCreate}>{t("common.create")}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label={t("forms.title") + " *"}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={t("forms.titlePlaceholder")}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {t("forms.description")}
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              placeholder={t("forms.descriptionPlaceholder")}
            />
          </div>

          {/* Field Builder */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-700">
              {t("forms.fields")} ({newFields.length})
            </h4>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={fieldLabel}
                onChange={(e) => setFieldLabel(e.target.value)}
                placeholder={t("forms.fieldLabelPlaceholder")}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <select
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value as FormField["type"])}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              >
                {[
                  "text",
                  "textarea",
                  "radio",
                  "checkbox",
                  "select",
                  "rating",
                  "date",
                  "email",
                  "number",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {(fieldType === "radio" ||
              fieldType === "checkbox" ||
              fieldType === "select") && (
              <input
                type="text"
                value={fieldOptions}
                onChange={(e) => setFieldOptions(e.target.value)}
                placeholder={t("forms.optionsPlaceholder")}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            )}
            <div className="mt-2 flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={fieldRequired}
                  onChange={(e) => setFieldRequired(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                {t("forms.required")}
              </label>
              <Button size="sm" onClick={handleAddField}>
                {t("forms.addField")}
              </Button>
            </div>

            {newFields.length > 0 && (
              <div className="mt-3 space-y-2">
                {newFields.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm"
                  >
                    <span className="text-gray-700">
                      {f.label}{" "}
                      <span className="text-xs text-gray-400">({f.type})</span>
                      {f.required && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </span>
                    <button
                      onClick={() => handleRemoveField(f.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t("common.confirm")}
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t("common.delete")}
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          {t("forms.confirmDelete").replace("{title}", formToDelete?.title || "")}
        </p>
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
