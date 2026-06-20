"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, Star, Sparkles, ChevronLeft, Palette } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { FormField } from "@/types";

const templates = {
  ocean: {
    name: "Ocean",
    bg: "bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50",
    accent: "from-blue-600 to-cyan-500",
    accentText: "text-blue-600",
    accentBg: "bg-blue-600",
    accentBorder: "border-blue-500",
    accentRing: "ring-blue-500/20",
    progressBg: "bg-blue-100",
    progressFill: "bg-gradient-to-r from-blue-500 to-cyan-400",
    optionSelected: "border-blue-500 bg-blue-50",
    optionHover: "hover:border-blue-200 hover:bg-blue-50/50",
    cardBg: "bg-white/80 backdrop-blur-sm",
  },
  sunset: {
    name: "Sunset",
    bg: "bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50",
    accent: "from-orange-500 to-rose-500",
    accentText: "text-orange-600",
    accentBg: "bg-orange-500",
    accentBorder: "border-orange-500",
    accentRing: "ring-orange-500/20",
    progressBg: "bg-orange-100",
    progressFill: "bg-gradient-to-r from-orange-400 to-rose-400",
    optionSelected: "border-orange-500 bg-orange-50",
    optionHover: "hover:border-orange-200 hover:bg-orange-50/50",
    cardBg: "bg-white/80 backdrop-blur-sm",
  },
  forest: {
    name: "Forest",
    bg: "bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50",
    accent: "from-emerald-600 to-green-500",
    accentText: "text-emerald-600",
    accentBg: "bg-emerald-600",
    accentBorder: "border-emerald-500",
    accentRing: "ring-emerald-500/20",
    progressBg: "bg-emerald-100",
    progressFill: "bg-gradient-to-r from-emerald-500 to-green-400",
    optionSelected: "border-emerald-500 bg-emerald-50",
    optionHover: "hover:border-emerald-200 hover:bg-emerald-50/50",
    cardBg: "bg-white/80 backdrop-blur-sm",
  },
  midnight: {
    name: "Midnight",
    bg: "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800",
    accent: "from-purple-500 to-indigo-500",
    accentText: "text-purple-400",
    accentBg: "bg-purple-500",
    accentBorder: "border-purple-500",
    accentRing: "ring-purple-500/20",
    progressBg: "bg-gray-700",
    progressFill: "bg-gradient-to-r from-purple-500 to-indigo-400",
    optionSelected: "border-purple-500 bg-purple-500/20",
    optionHover: "hover:border-purple-400 hover:bg-purple-500/10",
    cardBg: "bg-gray-800/80 backdrop-blur-sm",
  },
  minimal: {
    name: "Minimal",
    bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
    accent: "from-gray-800 to-gray-600",
    accentText: "text-gray-800",
    accentBg: "bg-gray-800",
    accentBorder: "border-gray-800",
    accentRing: "ring-gray-800/20",
    progressBg: "bg-gray-200",
    progressFill: "bg-gray-800",
    optionSelected: "border-gray-800 bg-gray-100",
    optionHover: "hover:border-gray-300 hover:bg-gray-50",
    cardBg: "bg-white/80 backdrop-blur-sm",
  },
  purple: {
    name: "Purple Haze",
    bg: "bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50",
    accent: "from-purple-600 to-fuchsia-500",
    accentText: "text-purple-600",
    accentBg: "bg-purple-600",
    accentBorder: "border-purple-500",
    accentRing: "ring-purple-500/20",
    progressBg: "bg-purple-100",
    progressFill: "bg-gradient-to-r from-purple-500 to-fuchsia-400",
    optionSelected: "border-purple-500 bg-purple-50",
    optionHover: "hover:border-purple-200 hover:bg-purple-50/50",
    cardBg: "bg-white/80 backdrop-blur-sm",
  },
};

type TemplateKey = keyof typeof templates;

export default function FormPreviewPage() {
  const { t } = useI18n();
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  const { forms, addResponse, fetchForms } = useStore();

  const form = useMemo(() => forms.find((f) => f.id === formId), [forms, formId]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [respondentName, setRespondentName] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");
  const [ratingHover, setRatingHover] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("purple");
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const theme = templates[selectedTemplate];

  const allSteps = useMemo(() => {
    if (!form) return [];
    const steps: { type: "info" | "name" | "email" | "field"; field?: FormField }[] = [
      { type: "name" },
      { type: "email" },
      ...form.fields.map((f) => ({ type: "field" as const, field: f })),
    ];
    return steps;
  }, [form]);

  const totalSteps = allSteps.length;

  const canGoNext = useCallback(() => {
    const step = allSteps[currentStep];
    if (!step) return false;
    if (step.type === "name") return respondentName.trim().length > 0;
    if (step.type === "email") return respondentEmail.trim().length > 0;
    if (step.type === "field" && step.field) {
      const val = answers[step.field.id];
      if (step.field.required) {
        if (val === undefined || val === "" || (Array.isArray(val) && val.length === 0)) return false;
      }
      return true;
    }
    return true;
  }, [currentStep, allSteps, respondentName, respondentEmail, answers]);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1 && canGoNext()) {
      setDirection("forward");
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, totalSteps, canGoNext]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection("backward");
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(() => {
    if (!form) return;
    addResponse(form.id, {
      respondentName: respondentName || t("preview.anonymous"),
      respondentEmail: respondentEmail || "",
      answers,
    });
    setSubmitted(true);
  }, [form, addResponse, respondentName, respondentEmail, answers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (currentStep === totalSteps - 1 && canGoNext()) {
          handleSubmit();
        } else {
          goNext();
        }
      } else if (e.key === "Backspace" || (e.key === "Enter" && e.shiftKey)) {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, totalSteps, goNext, goBack, canGoNext, handleSubmit]);

  const setAnswer = (fieldId: string, value: string | string[] | number) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleCheckbox = (fieldId: string, option: string) => {
    const current = (answers[fieldId] as string[]) || [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setAnswer(fieldId, next);
  };

  if (!form) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-gray-500">{t("common.noData")}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={cn("flex h-full flex-col items-center justify-center", theme.bg)}>
        <div className="animate-in zoom-in-95 fade-in duration-500">
          <div className={cn("flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg", theme.accent)}>
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className={cn("mt-6 text-3xl font-bold", selectedTemplate === "midnight" ? "text-white" : "text-gray-900")}>
          {t("common.submit")}!
        </h2>
        <p className={cn("mt-2 text-center", selectedTemplate === "midnight" ? "text-gray-400" : "text-gray-500")}>
          {t("preview.thankYou")}
        </p>
        <button
          onClick={() => router.push("/main/forms")}
          className={cn("mt-8 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl", `bg-gradient-to-r ${theme.accent}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </button>
      </div>
    );
  }

  const step = allSteps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isDark = selectedTemplate === "midnight";

  return (
    <div className={cn("relative flex h-full flex-col", theme.bg)}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => router.push("/main/forms")}
          className={cn("flex items-center gap-2 text-sm transition-colors", isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700")}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowTemplatePicker(!showTemplatePicker)}
              className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all", isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white/80 text-gray-600 hover:bg-white shadow-sm")}
            >
              <Palette className="h-4 w-4" />
              {theme.name}
            </button>
            {showTemplatePicker && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                {(Object.keys(templates) as TemplateKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedTemplate(key); setShowTemplatePicker(false); }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      selectedTemplate === key ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <div className={cn("h-4 w-4 rounded-full bg-gradient-to-br", templates[key].accent)} />
                    {templates[key].name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={cn("flex items-center gap-2", isDark ? "text-gray-300" : "text-gray-600")}>
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">{t("app.name")}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={cn("h-1", theme.progressBg)}>
        <div
          className={cn("h-full transition-all duration-500 ease-out", theme.progressFill)}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Counter */}
      <div className="px-6 pt-6">
        <span className={cn("text-sm font-medium", isDark ? "text-gray-500" : "text-gray-400")}>
          {currentStep + 1} / {totalSteps}
        </span>
      </div>

      {/* Question Area */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div
          key={currentStep}
          className={cn(
            "w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-300",
            direction === "backward" && "slide-in-from-top-4"
          )}
        >
          {/* Name Step */}
          {step.type === "name" && (
            <div className="space-y-6">
              <div>
                <h2 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {t("preview.whatsYourName")}
                </h2>
                <p className={cn("mt-2 text-base", isDark ? "text-gray-400" : "text-gray-500")}>
                  {t("preview.letUsKnow")}
                </p>
              </div>
              <input
                type="text"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                placeholder={t("preview.typeYourName")}
                autoFocus
                className={cn(
                  "w-full border-0 border-b-2 bg-transparent px-1 py-3 text-xl outline-none transition-all placeholder:text-gray-400 focus:ring-0",
                  isDark
                    ? "border-gray-700 text-white focus:border-purple-500"
                    : `border-gray-200 text-gray-900 focus:${theme.accentBorder}`
                )}
              />
            </div>
          )}

          {/* Email Step */}
          {step.type === "email" && (
            <div className="space-y-6">
              <div>
                <h2 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {t("preview.whatsYourEmail")}
                </h2>
                <p className={cn("mt-2 text-base", isDark ? "text-gray-400" : "text-gray-500")}>
                  {t("preview.followUp")}
                </p>
              </div>
              <input
                type="email"
                value={respondentEmail}
                onChange={(e) => setRespondentEmail(e.target.value)}
                placeholder={t("preview.emailPlaceholder")}
                autoFocus
                className={cn(
                  "w-full border-0 border-b-2 bg-transparent px-1 py-3 text-xl outline-none transition-all placeholder:text-gray-400 focus:ring-0",
                  isDark
                    ? "border-gray-700 text-white focus:border-purple-500"
                    : `border-gray-200 text-gray-900 focus:${theme.accentBorder}`
                )}
              />
            </div>
          )}

          {/* Field Steps */}
          {step.type === "field" && step.field && (
            <div className="space-y-6">
              <div>
                <h2 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                  {step.field.label}
                  {step.field.required && <span className="ml-1 text-red-500">*</span>}
                </h2>
              </div>

              {/* Text Input */}
              {step.field.type === "text" && (
                <input
                  type="text"
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  placeholder={step.field.placeholder || t("preview.typeYourAnswer")}
                  autoFocus
                  className={cn(
                    "w-full border-0 border-b-2 bg-transparent px-1 py-3 text-xl outline-none transition-all placeholder:text-gray-400 focus:ring-0",
                    isDark ? "border-gray-700 text-white focus:border-purple-500" : `border-gray-200 text-gray-900 focus:${theme.accentBorder}`
                  )}
                />
              )}

              {/* Email Input */}
              {step.field.type === "email" && (
                <input
                  type="email"
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  placeholder={step.field.placeholder || t("preview.emailPlaceholder")}
                  autoFocus
                  className={cn(
                    "w-full border-0 border-b-2 bg-transparent px-1 py-3 text-xl outline-none transition-all placeholder:text-gray-400 focus:ring-0",
                    isDark ? "border-gray-700 text-white focus:border-purple-500" : `border-gray-200 text-gray-900 focus:${theme.accentBorder}`
                  )}
                />
              )}

              {/* Number Input */}
              {step.field.type === "number" && (
                <input
                  type="number"
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  placeholder={step.field.placeholder || t("preview.enterNumber")}
                  autoFocus
                  className={cn(
                    "w-full border-0 border-b-2 bg-transparent px-1 py-3 text-xl outline-none transition-all placeholder:text-gray-400 focus:ring-0",
                    isDark ? "border-gray-700 text-white focus:border-purple-500" : `border-gray-200 text-gray-900 focus:${theme.accentBorder}`
                  )}
                />
              )}

              {/* Date Input */}
              {step.field.type === "date" && (
                <input
                  type="date"
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  autoFocus
                  className={cn(
                    "w-full border-0 border-b-2 bg-transparent px-1 py-3 text-xl outline-none transition-all focus:ring-0",
                    isDark ? "border-gray-700 text-white focus:border-purple-500" : `border-gray-200 text-gray-900 focus:${theme.accentBorder}`
                  )}
                />
              )}

              {/* Textarea */}
              {step.field.type === "textarea" && (
                <textarea
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  placeholder={step.field.placeholder || t("preview.shareThoughts")}
                  rows={4}
                  autoFocus
                  className={cn(
                    "w-full resize-none border-0 border-b-2 bg-transparent px-1 py-3 text-xl outline-none transition-all placeholder:text-gray-400 focus:ring-0",
                    isDark ? "border-gray-700 text-white focus:border-purple-500" : `border-gray-200 text-gray-900 focus:${theme.accentBorder}`
                  )}
                />
              )}

              {/* Radio Options */}
              {step.field.type === "radio" && step.field.options && (
                <div className="space-y-3">
                  {step.field.options.map((opt) => (
                    <label
                      key={opt}
                      onClick={() => setAnswer(step.field!.id, opt)}
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-xl border-2 px-5 py-4 text-lg transition-all",
                        answers[step.field!.id] === opt
                          ? theme.optionSelected
                          : cn(isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700", theme.optionHover)
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                          answers[step.field!.id] === opt
                            ? `${theme.accentBorder} ${theme.accentBg}`
                            : "border-gray-300"
                        )}
                      >
                        {answers[step.field!.id] === opt && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {/* Checkbox Options */}
              {step.field.type === "checkbox" && step.field.options && (
                <div className="space-y-3">
                  {step.field.options.map((opt) => {
                    const checked = ((answers[step.field!.id] as string[]) || []).includes(opt);
                    return (
                      <label
                        key={opt}
                        onClick={() => toggleCheckbox(step.field!.id, opt)}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-xl border-2 px-5 py-4 text-lg transition-all",
                          checked
                            ? theme.optionSelected
                            : cn(isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700", theme.optionHover)
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                            checked ? `${theme.accentBorder} ${theme.accentBg}` : "border-gray-300"
                          )}
                        >
                          {checked && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {opt}
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Select */}
              {step.field.type === "select" && step.field.options && (
                <select
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  autoFocus
                  className={cn(
                    "w-full rounded-xl border-2 bg-transparent px-5 py-4 text-lg outline-none transition-all focus:ring-0",
                    isDark ? "border-gray-700 text-white bg-gray-800" : "border-gray-200 text-gray-900 bg-white"
                  )}
                >
                  <option value="">{t("common.select")}...</option>
                  {step.field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {/* Rating */}
              {step.field.type === "rating" && (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const current = (answers[step.field!.id] as number) || 0;
                    const hover = ratingHover[step.field!.id] || 0;
                    const filled = value <= (hover || current);
                    return (
                      <button
                        key={value}
                        type="button"
                        onMouseEnter={() => setRatingHover((prev) => ({ ...prev, [step.field!.id]: value }))}
                        onMouseLeave={() => setRatingHover((prev) => ({ ...prev, [step.field!.id]: 0 }))}
                        onClick={() => setAnswer(step.field!.id, value)}
                        className="p-2 transition-transform duration-150 hover:scale-125"
                      >
                        <Star
                          className={cn(
                            "h-10 w-10 transition-colors duration-150",
                            filled ? "fill-amber-400 text-amber-400" : isDark ? "text-gray-600" : "text-gray-300"
                          )}
                        />
                      </button>
                    );
                  })}
                  {(answers[step.field!.id] as number) > 0 && (
                    <span className={cn("ml-3 text-lg font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
                      {answers[step.field!.id]}/5
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between px-6 py-6">
        <button
          onClick={goBack}
          disabled={currentStep === 0}
          className={cn(
            "flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all",
            currentStep === 0
              ? "opacity-0"
              : isDark
                ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                : "text-gray-500 hover:bg-white/80 hover:text-gray-700"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          {t("common.back")}
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={goNext}
            disabled={!canGoNext()}
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-40 disabled:shadow-none",
              `bg-gradient-to-r ${theme.accent}`
            )}
          >
            {t("common.continue")}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canGoNext()}
            className={cn(
              "flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-40 disabled:shadow-none",
              `bg-gradient-to-r ${theme.accent}`
            )}
          >
            {t("common.submit")}
            <CheckCircle className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Keyboard Hints */}
      <div className={cn("flex justify-center gap-6 pb-4 text-xs", isDark ? "text-gray-600" : "text-gray-400")}>
        <span>press <kbd className={cn("rounded px-1.5 py-0.5 font-mono text-[10px]", isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-500")}>Enter ↵</kbd> {t("preview.pressEnterToContinue")}</span>
        <span><kbd className={cn("rounded px-1.5 py-0.5 font-mono text-[10px]", isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-500")}>Shift + Enter</kbd> {t("preview.shiftEnterToGoBack")}</span>
      </div>
    </div>
  );
}
