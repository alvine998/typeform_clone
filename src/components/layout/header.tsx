"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Search, Bell, ChevronDown, User, LogOut, Globe, MessageSquare, FileText, Users as UsersIcon, Settings, CheckCheck } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

const pageTitles: Record<string, string> = {
  "/main/dashboard": "nav.dashboard",
  "/main/forms": "nav.forms",
  "/main/users": "nav.users",
  "/main/activity-logs": "nav.activityLogs",
  "/main/finance-report": "nav.financeReport",
  "/main/profile": "nav.profile",
  "/main/notifications": "notifications.title",
};

const typeIcons: Record<string, typeof Bell> = {
  response: MessageSquare,
  form: FileText,
  user: UsersIcon,
  system: Settings,
};

const typeColors: Record<string, string> = {
  response: "bg-blue-100 text-blue-600",
  form: "bg-purple-100 text-purple-600",
  user: "bg-emerald-100 text-emerald-600",
  system: "bg-gray-100 text-gray-600",
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setSidebarOpen, notifications, markNotificationRead, markAllNotificationsRead, fetchNotifications } = useStore();
  const { t, locale, setLocale } = useI18n();
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const titleKey = pageTitles[pathname] || "nav.dashboard";

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const recentNotifications = useMemo(() => notifications.filter((n) => !n.read).slice(0, 5), [notifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "id" : "en");
  };

  const handleNotifClick = (notification: typeof notifications[0]) => {
    markNotificationRead(notification.id);
    setNotifOpen(false);
    if (notification.entityType === "form" && notification.entityId) {
      router.push(`/main/forms/${notification.entityId}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        
        <h1 className="text-lg font-semibold text-gray-900 md:text-xl">
          {t(titleKey)}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        <button
          onClick={toggleLocale}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl animate-slide-down">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">{t("notifications.title")}</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => { markAllNotificationsRead(); }}
                    className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700"
                  >
                    <CheckCheck className="h-3 w-3" />
                    {t("notifications.markAllRead")}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {recentNotifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">{t("notifications.noNotifications")}</p>
                  </div>
                ) : (
                  recentNotifications.map((notification) => {
                    const Icon = typeIcons[notification.type] || Bell;
                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotifClick(notification)}
                        className="flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
                      >
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", typeColors[notification.type])}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{notification.message}</p>
                          <p className="mt-1 text-xs text-gray-400">{formatDateTime(notification.createdAt)}</p>
                        </div>
                        {!notification.read && (
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-gray-100 p-2">
                <Link
                  href="/main/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="block rounded-lg px-4 py-2 text-center text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  {t("notifications.viewAll")}
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
              ) : (
                <span className="text-sm font-semibold text-purple-600">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="hidden text-sm font-medium text-gray-700 md:inline">
              {user?.name}
            </span>
            <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", userMenuOpen && "rotate-180")} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg animate-slide-down">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <Link
                href="/main/profile"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User className="h-4 w-4" />
                <span>{t("nav.profile")}</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("auth.logout")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
