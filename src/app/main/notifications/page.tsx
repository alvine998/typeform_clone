"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, FileText, Users, Settings, Check, CheckCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { cn, formatDateTime } from "@/lib/utils";
import type { Notification } from "@/types";

const typeIcons: Record<string, typeof Bell> = {
  response: MessageSquare,
  form: FileText,
  user: Users,
  system: Settings,
};

const typeColors: Record<string, string> = {
  response: "bg-blue-100 text-blue-600",
  form: "bg-purple-100 text-purple-600",
  user: "bg-emerald-100 text-emerald-600",
  system: "bg-gray-100 text-gray-600",
};

export default function NotificationsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { notifications, fetchNotifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filtered = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.read);
    if (filter === "read") return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, filter]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleClick = (notification: Notification) => {
    markNotificationRead(notification.id);
    if (notification.entityType === "form" && notification.entityId) {
      router.push(`/main/forms/${notification.entityId}`);
    } else if (notification.entityType === "response" && notification.entityId) {
      router.push(`/main/forms`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {t("notifications.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} ${t("notifications.unread").toLowerCase()}`
              : t("notifications.noNotifications")}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-purple-700"
          >
            <CheckCheck className="h-4 w-4" />
            {t("notifications.markAllRead")}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "unread", "read"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg px-4 py-2.5 text-xs font-medium transition-all",
              filter === f
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100"
            )}
          >
            {t(`notifications.${f}`)}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-16">
          <Bell className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-sm text-gray-500">{t("notifications.noNotifications")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notification) => {
            const Icon = typeIcons[notification.type] || Bell;
            return (
              <div
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-md",
                  notification.read
                    ? "border-gray-200 bg-white"
                    : "border-purple-200 bg-purple-50/50"
                )}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", typeColors[notification.type])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={cn("text-sm font-semibold", notification.read ? "text-gray-700" : "text-gray-900")}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-purple-500" />
                    )}
                  </div>
                  <p className={cn("mt-1 text-sm", notification.read ? "text-gray-500" : "text-gray-700")}>
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(notification.id);
                    }}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    title={t("notifications.read")}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
