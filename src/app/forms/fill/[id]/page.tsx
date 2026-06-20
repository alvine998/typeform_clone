"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle, Star, Sparkles, ChevronLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { FormField } from "@/types";

export default function PublicFormPage() {
  const { t } = useI18n();
  const params = useParams();
  const formId = params.id as string;
  const { forms, addResponse, fetchForms } = useStore();

  const form = useMemo(() => forms.find((f) => f.id === formId), [forms, formId]);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [respondentName, setRespondentName] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");
  const [ratingHover, setRatingHover] = useState<Record<string, number>>({});

  const allSteps = useMemo(() => {
    if (!form) return [];
    const steps: { type: "name" | "email" | "field"; field?: FormField }[] = [
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
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, totalSteps, canGoNext]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    if (!form) return;
    await addResponse(form.id, {
      respondentName: respondentName || "Anonymous",
      respondentEmail: respondentEmail || "",
      answers,
    });
    setSubmitted(true);
  }, [form, addResponse, respondentName, respondentEmail, answers]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <p className="text-gray-500">{t("common.noData")}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
        <div className="animate-in zoom-in-95 fade-in duration-500">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg shadow-purple-200">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">{t("forms.thankYou")}</h2>
        <p className="mt-2 text-center text-gray-500">{t("forms.thankYouDesc")}</p>
      </div>
    );
  }

  const step = allSteps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-semibold text-gray-700">{t("app.name")}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-purple-100">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Counter */}
      <div className="px-6 pt-6">
        <span className="text-sm font-medium text-gray-400">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>

      {/* Question Area */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div
          key={currentStep}
          className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Name Step */}
          {step.type === "name" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{t("preview.whatsYourName")}</h2>
                <p className="mt-2 text-base text-gray-500">{t("preview.letUsKnow")}</p>
              </div>
              <input
                type="text"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                placeholder={t("preview.typeYourName")}
                autoFocus
                className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-1 py-3 text-xl text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500 focus:ring-0"
              />
            </div>
          )}

          {/* Email Step */}
          {step.type === "email" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{t("preview.whatsYourEmail")}</h2>
                <p className="mt-2 text-base text-gray-500">{t("preview.followUp")}</p>
              </div>
              <input
                type="email"
                value={respondentEmail}
                onChange={(e) => setRespondentEmail(e.target.value)}
                placeholder={t("preview.emailPlaceholder")}
                autoFocus
                className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-1 py-3 text-xl text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500 focus:ring-0"
              />
            </div>
          )}

          {/* Field Steps */}
          {step.type === "field" && step.field && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {step.field.label}
                  {step.field.required && <span className="ml-1 text-red-500">*</span>}
                </h2>
              </div>

              {step.field.type === "text" && (
                <input
                  type="text"
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  placeholder={step.field.placeholder || t("preview.typeYourAnswer")}
                  autoFocus
                  className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-1 py-3 text-xl text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500 focus:ring-0"
                />
              )}

              {step.field.type === "email" && (
                <input
                  type="email"
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  placeholder={step.field.placeholder || t("preview.emailPlaceholder")}
                  autoFocus
                  className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-1 py-3 text-xl text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500 focus:ring-0"
                />
              )}

              {step.field.type === "number" && (
                <input
                  type="number"
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  placeholder={step.field.placeholder || t("preview.enterNumber")}
                  autoFocus
                  className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-1 py-3 text-xl text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500 focus:ring-0"
                />
              )}

              {step.field.type === "date" && (
                <input
                  type="date"
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  autoFocus
                  className="w-full border-0 border-b-2 border-gray-200 bg-transparent px-1 py-3 text-xl text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-0"
                />
              )}

              {step.field.type === "textarea" && (
                <textarea
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  placeholder={step.field.placeholder || t("preview.shareThoughts")}
                  rows={4}
                  autoFocus
                  className="w-full resize-none border-0 border-b-2 border-gray-200 bg-transparent px-1 py-3 text-xl text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-purple-500 focus:ring-0"
                />
              )}

              {step.field.type === "radio" && step.field.options && (
                <div className="space-y-3">
                  {step.field.options.map((opt) => (
                    <label
                      key={opt}
                      onClick={() => setAnswer(step.field!.id, opt)}
                      className={cn(
                        "flex cursor-pointer items-center gap-4 rounded-xl border-2 px-5 py-4 text-lg transition-all",
                        answers[step.field!.id] === opt
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 text-gray-700 hover:border-purple-200 hover:bg-purple-50/50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                          answers[step.field!.id] === opt
                            ? "border-purple-500 bg-purple-500"
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
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 text-gray-700 hover:border-purple-200 hover:bg-purple-50/50"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                            checked ? "border-purple-500 bg-purple-500" : "border-gray-300"
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

              {step.field.type === "select" && step.field.options && (
                <select
                  value={(answers[step.field.id] as string) || ""}
                  onChange={(e) => setAnswer(step.field!.id, e.target.value)}
                  autoFocus
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-5 py-4 text-lg text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-0"
                >
                  <option value="">{t("common.select")}...</option>
                  {step.field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

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
                            filled ? "fill-amber-400 text-amber-400" : "text-gray-300"
                          )}
                        />
                      </button>
                    );
                  })}
                  {(answers[step.field!.id] as number) > 0 && (
                    <span className="ml-3 text-lg font-medium text-gray-500">
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
            "flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-white/80 hover:text-gray-700",
            currentStep === 0 && "opacity-0"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          {t("common.back")}
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={goNext}
            disabled={!canGoNext()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-40 disabled:shadow-none"
          >
            {t("common.continue")}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canGoNext()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-40 disabled:shadow-none"
          >
            {t("common.submit")}
            <CheckCircle className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Keyboard Hints */}
      <div className="flex justify-center gap-6 pb-4 text-xs text-gray-400">
        <span>press <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">Enter ↵</kbd> {t("preview.pressEnterToContinue")}</span>
        <span><kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">Shift + Enter</kbd> {t("preview.shiftEnterToGoBack")}</span>
      </div>
    </div>
  );
}
