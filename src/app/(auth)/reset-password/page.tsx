"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import {
  Zap,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
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
              {t("auth.resetPassword")}
            </h2>
            <p className="text-white/70">{t("auth.resetPasswordDesc")}</p>

            <div className="mx-auto mt-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
              <KeyRound className="h-10 w-10 text-white/80" />
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

          {submitted ? (
            <div className="text-center animate-fade-in">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Check your email
              </h1>
              <p className="mb-8 text-gray-500">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-medium text-gray-700">{email}</span>.
                Please check your inbox and follow the instructions.
              </p>
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:brightness-110"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("auth.backToLogin")}
              </a>
            </div>
          ) : (
            <>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {t("auth.resetPassword")}
              </h1>
              <p className="mb-8 text-gray-500">{t("auth.resetPasswordDesc")}</p>

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
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm transition-all placeholder:text-gray-400 focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
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
                      {t("auth.sendResetLink")}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-500">
                {t("auth.hasAccount")}{" "}
                <a
                  href="/login"
                  className="font-medium text-purple-600 transition-colors hover:text-purple-700"
                >
                  {t("auth.signInHere")}
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
