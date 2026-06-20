"use client";

import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import {
  MousePointerClick,
  BarChart3,
  FileSpreadsheet,
  Languages,
  ArrowRight,
  Star,
  Zap,
  Shield,
} from "lucide-react";

export default function LandingPage() {
  const { t } = useI18n();

  const features = [
    {
      icon: MousePointerClick,
      title: t("landing.feature1Title"),
      desc: t("landing.feature1Desc"),
    },
    {
      icon: BarChart3,
      title: t("landing.feature2Title"),
      desc: t("landing.feature2Desc"),
    },
    {
      icon: FileSpreadsheet,
      title: t("landing.feature3Title"),
      desc: t("landing.feature3Desc"),
    },
    {
      icon: Languages,
      title: t("landing.feature4Title"),
      desc: t("landing.feature4Desc"),
    },
  ];

  const stats = [
    { value: "10K+", label: "Users" },
    { value: "50K+", label: "Forms Created" },
    { value: "1M+", label: "Responses" },
    { value: "99.9%", label: "Uptime" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      content:
        "FormFlow transformed how we collect customer feedback. The analytics alone saved us hours every week.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Research Lead at DataInsight",
      content:
        "The multi-language support is a game-changer for our international surveys. Highly recommend!",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "HR Director at GrowthCo",
      content:
        "We switched from three different tools to FormFlow. Everything we need in one beautiful platform.",
      rating: 5,
    },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              {t("app.name")}
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollTo("features")}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-purple-600"
            >
              {t("landing.features")}
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-purple-600"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-purple-600"
            >
              About
            </button>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href="/login"
              className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-purple-600 sm:block"
            >
              {t("auth.login")}
            </a>
            <a
              href="/login"
              className="rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:brightness-110"
            >
              {t("landing.getStarted")}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-purple-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-gradient-to-br from-purple-200/40 to-blue-200/40 blur-2xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700">
            <Shield className="h-3.5 w-3.5" />
            Trusted by 10,000+ teams worldwide
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t("landing.hero")}
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
            {t("landing.heroDesc")}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-2xl hover:shadow-purple-500/30 hover:brightness-110"
            >
              {t("landing.getStarted")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              onClick={() => scrollTo("features")}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
            >
              {t("landing.features")}
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("landing.features")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              {t("app.tagline")}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 transition-colors group-hover:from-purple-600 group-hover:to-blue-500">
                  <feature.icon className="h-6 w-6 text-purple-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="mb-2 text-3xl font-extrabold text-white sm:text-4xl">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-purple-100">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="about" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("landing.trustedBy")}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-6 text-gray-600 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="pricing"
        className="px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-purple-600 to-blue-500 p-12 text-center shadow-2xl shadow-purple-500/20 sm:p-16">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            {t("landing.cta")}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-purple-100">
            {t("landing.ctaDesc")}
          </p>
          <a
            href="/login"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-purple-700 shadow-lg transition-all hover:shadow-xl hover:bg-gray-50"
          >
            {t("landing.getStarted")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {t("app.name")}
                </span>
              </div>
              <p className="text-sm text-gray-600">{t("app.tagline")}</p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="transition-colors hover:text-purple-600">
                    {t("landing.features")}
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-purple-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-purple-600">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="transition-colors hover:text-purple-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-purple-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-purple-600">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="transition-colors hover:text-purple-600">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-purple-600">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-purple-600">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {t("app.name")}. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
