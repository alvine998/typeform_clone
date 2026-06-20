"use client";

import {
  forwardRef,
  type TextareaHTMLAttributes,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  charCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      charCount,
      maxLength,
      autoResize = false,
      id,
      placeholder,
      value,
      defaultValue,
      onFocus,
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charLength, setCharLength] = useState(
      String(value || defaultValue || "").length
    );
    const internalRef = useRef<HTMLTextAreaElement>(null);

    const textareaId =
      id || label?.toLowerCase().replace(/\s+/g, "-");

    const adjustHeight = useCallback(() => {
      const el = internalRef.current;
      if (el && autoResize) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    }, [autoResize]);

    useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    const setRefs = (el: HTMLTextAreaElement | null) => {
      (internalRef as React.MutableRefObject<HTMLTextAreaElement | null>).current =
        el;
      if (typeof ref === "function") ref(el);
      else if (ref)
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "mb-1.5 block text-sm font-medium",
              error ? "text-red-500" : "text-gray-700"
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={setRefs}
          id={textareaId}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          rows={props.rows || 4}
          className={cn(
            "w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 transition-all duration-200",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:border-purple-500 focus:ring-purple-500/20",
            "bg-white",
            autoResize && "resize-none overflow-hidden",
            className
          )}
          onFocus={(e) => {
            onFocus?.(e);
          }}
          onBlur={(e) => {
            onBlur?.(e);
          }}
          onChange={(e) => {
            setCharLength(e.target.value.length);
            adjustHeight();
            onChange?.(e);
          }}
          {...props}
        />
        <div className="mt-1.5 flex items-center justify-between">
          {error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : helperText ? (
            <p className="text-xs text-gray-500">{helperText}</p>
          ) : (
            <span />
          )}
          {charCount && (
            <span
              className={cn(
                "text-xs",
                maxLength && charLength > maxLength * 0.9
                  ? "text-red-500"
                  : "text-gray-400"
              )}
            >
              {charLength}
              {maxLength ? `/${maxLength}` : ""}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
