"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      type = "text",
      id,
      placeholder,
      value,
      defaultValue,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      Boolean(value || defaultValue)
    );

    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const isFloating = focused || hasValue;

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            placeholder={label ? " " : placeholder}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              "peer w-full rounded-lg border bg-white px-4 pt-5 pb-2 text-sm text-gray-900 transition-all duration-200",
              "placeholder:text-transparent focus:outline-none focus:ring-2",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-purple-500 focus:ring-purple-500/20",
              className
            )}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              setHasValue(Boolean(e.target.value));
              onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(Boolean(e.target.value));
              props.onChange?.(e);
            }}
            {...props}
          />
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "pointer-events-none absolute left-4 transition-all duration-200",
                "peer-focus:text-xs peer-focus:top-2 peer-focus:translate-y-0",
                leftIcon && "left-10",
                isFloating
                  ? "top-2 text-xs translate-y-0"
                  : "top-1/2 -translate-y-1/2 text-sm",
                error
                  ? "text-red-500 peer-focus:text-red-500"
                  : focused
                  ? "text-purple-600"
                  : "text-gray-400"
              )}
            >
              {label}
            </label>
          )}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "mt-1.5 text-xs",
              error ? "text-red-500" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
