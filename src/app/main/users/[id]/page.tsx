"use client";

import { useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn, formatDate, formatDateTime } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  Shield,
  FileText,
  BarChart3,
  Activity,
  UserCheck,
  Users,
} from "lucide-react";

export default function UserDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const userId = params.id as string;
  const { users, forms, responses, activityLogs, fetchUsers, fetchForms, fetchActivityLogs, loading } = useStore();

  useEffect(() => {
    fetchUsers();
    fetchForms();
    fetchActivityLogs();
  }, [fetchUsers, fetchForms, fetchActivityLogs]);

  const user = useMemo(
    () => users.find((u) => u.id === userId),
    [users, userId]
  );

  const userActivityLogs = useMemo(
    () =>
      activityLogs
        .filter((log) => log.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10),
    [activityLogs, userId]
  );

  const assignedForms = useMemo(
    () => forms.filter((f) => f.createdBy === userId),
    [forms, userId]
  );

  const surveyorResponses = useMemo(
    () => responses.filter((r) => r.surveyorId === userId),
    [responses, userId]
  );

  const surveyorStats = useMemo(() => {
    if (user?.role !== "surveyor") return null;
    const totalResponses = surveyorResponses.length;
    const formsAssigned = assignedForms.length;
    const uniqueForms = new Set(surveyorResponses.map((r) => r.formId)).size;
    const lastActive =
      surveyorResponses.length > 0
        ? surveyorResponses.sort(
            (a, b) =>
              new Date(b.submittedAt).getTime() -
              new Date(a.submittedAt).getTime()
          )[0].submittedAt
        : null;
    return { totalResponses, formsAssigned, uniqueForms, lastActive };
  }, [user, surveyorResponses, assignedForms]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: "bg-purple-100 text-purple-700 border-purple-200",
      surveyor: "bg-blue-100 text-blue-700 border-blue-200",
      viewer: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return styles[role] || styles.viewer;
  };

  const getStatusBadge = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      Created: "bg-green-100 text-green-700",
      Updated: "bg-blue-100 text-blue-700",
      Deleted: "bg-red-100 text-red-700",
      Submitted: "bg-purple-100 text-purple-700",
      Exported: "bg-orange-100 text-orange-700",
      Synced: "bg-cyan-100 text-cyan-700",
    };
    return colors[action] || "bg-gray-100 text-gray-700";
  };

  if (!user) {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Loading...</h2>
            <p className="mt-2 text-sm text-gray-500">
              Please wait while we load the user data.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
            <Users className="h-8 w-8 text-purple-500" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            User Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            The user you are looking for does not exist.
          </p>
          <Link
            href="/main/users"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")} to {t("users.title")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Back Button */}
        <Link
          href="/main/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-purple-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")} to {t("users.title")}
        </Link>

        {/* Profile Header */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600" />
          <div className="relative px-6 pb-6">
            <div className="-mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-purple-500 to-purple-600 text-3xl font-bold text-white shadow-lg">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 pt-4 sm:pt-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                      {user.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize",
                          getRoleBadge(user.role)
                        )}
                      >
                        {t(`users.${user.role}`)}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize",
                          getStatusBadge(user.status)
                        )}
                      >
                        {t(`users.${user.status}`)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/main/users?edit=${user.id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    {t("common.edit")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Contact Card */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Mail className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="mt-3 text-sm font-medium text-gray-500">
              {t("users.email")}
            </h3>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {user.email}
            </p>
            {user.phone && (
              <>
                <h3 className="mt-3 text-sm font-medium text-gray-500">
                  {t("users.phone")}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-900">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  {user.phone}
                </p>
              </>
            )}
          </div>

          {/* Department Card */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="mt-3 text-sm font-medium text-gray-500">
              {t("users.department")}
            </h3>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {user.department || "-"}
            </p>
            <h3 className="mt-3 text-sm font-medium text-gray-500">
              {t("users.role")}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-900 capitalize">
              <Shield className="h-3.5 w-3.5 text-gray-400" />
              {t(`users.${user.role}`)}
            </p>
          </div>

          {/* Joined Date Card */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="mt-3 text-sm font-medium text-gray-500">Joined</h3>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {formatDate(user.createdAt)}
            </p>
            <h3 className="mt-3 text-sm font-medium text-gray-500">
              Last Updated
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-900">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              {formatDate(user.updatedAt)}
            </p>
          </div>

          {/* Quick Stats Card */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="mt-3 text-sm font-medium text-gray-500">
              Forms Created
            </h3>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {assignedForms.length}
            </p>
            {user.role === "surveyor" && (
              <>
                <h3 className="mt-3 text-sm font-medium text-gray-500">
                  Responses Collected
                </h3>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {surveyorResponses.length}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Surveyor Stats */}
        {user.role === "surveyor" && surveyorStats && (
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Surveyor Performance
              </h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-sm font-medium text-purple-600">
                  Total Responses
                </p>
                <p className="mt-1 text-3xl font-bold text-purple-900">
                  {surveyorStats.totalResponses}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-600">
                  Forms Assigned
                </p>
                <p className="mt-1 text-3xl font-bold text-blue-900">
                  {surveyorStats.formsAssigned}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm font-medium text-green-600">
                  Unique Forms
                </p>
                <p className="mt-1 text-3xl font-bold text-green-900">
                  {surveyorStats.uniqueForms}
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-4">
                <p className="text-sm font-medium text-orange-600">
                  Last Active
                </p>
                <p className="mt-1 text-sm font-bold text-orange-900">
                  {surveyorStats.lastActive
                    ? formatDate(surveyorStats.lastActive)
                    : "Never"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Forms */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {user.role === "surveyor" ? "Assigned Forms" : "Created Forms"}
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {assignedForms.length > 0 ? (
              assignedForms.map((form) => (
                <div
                  key={form.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        form.status === "active"
                          ? "bg-green-50 text-green-600"
                          : form.status === "draft"
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-gray-50 text-gray-600"
                      )}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{form.title}</p>
                      <p className="text-sm text-gray-500">
                        {form.responseCount} responses •{" "}
                        {formatDate(form.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                      form.status === "active"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : form.status === "draft"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    )}
                  >
                    {form.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <FileText className="h-12 w-12 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">
                  No forms assigned yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Logs */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <Activity className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {t("dashboard.recentActivity")}
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {userActivityLogs.length > 0 ? (
              userActivityLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                      getActionColor(log.action)
                    )}
                  >
                    {log.action.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {log.details}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(log.createdAt)}
                      </span>
                      <span>{log.ipAddress}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      getActionColor(log.action)
                    )}
                  >
                    {log.action}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Activity className="h-12 w-12 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">
                  No activity logs found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
