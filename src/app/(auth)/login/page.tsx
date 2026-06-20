"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { t } = useI18n();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError(t("auth.fillAllFields"));
      setLoading(false);
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push("/main/dashboard");
    } else {
      setError(t("auth.invalidCredentials"));
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - branding */}
      <div className="hidden bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 lg:flex lg:w-1/2 xl:w-[55%]">
        <div className="flex w-full flex-col items-center justify-center p-12">
          <div className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative max-w-md text-center">
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">
                {t("app.name")}
              </span>
            </div>

            <h2 className="mb-4 text-2xl font-bold text-white/90">
              {t("app.tagline")}
            </h2>

            <div className="mt-12 space-y-4">
              {[
                t("auth.featureDragDrop"),
                t("auth.featureAnalytics"),
                t("auth.featureMultiLang"),
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3 backdrop-blur-sm"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white/90">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="relative flex w-full flex-col justify-center px-4 sm:px-8 lg:w-1/2 lg:px-16 xl:w-[45%] xl:px-24">
        <div className="absolute right-4 top-4 sm:right-8 sm:top-6">
          <LanguageSwitcher />
        </div>

        <div className="mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {t("app.name")}
            </span>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("auth.welcomeBack")}
          </h1>
          <p className="mb-8 text-gray-500">{t("auth.loginDesc")}</p>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-slide-down">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@formflow.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm transition-all placeholder:text-gray-400 focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.enterPassword")}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-12 text-sm transition-all placeholder:text-gray-400 focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">{t("auth.rememberMe")}</span>
              </label>
              <a
                href="/reset-password"
                className="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
              >
                {t("auth.forgotPassword")}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {t("auth.login")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* <p className="mt-8 text-center text-sm text-gray-500">
            {t("auth.noAccount")}{" "}
            <a
              href="#"
              className="font-medium text-purple-600 transition-colors hover:text-purple-700"
            >
              {t("landing.getStarted")}
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
}
