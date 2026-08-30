import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const inputVariants = cva(
  "w-full bg-zinc-950/80 text-zinc-100 placeholder:text-zinc-600 text-sm rounded-md border transition-all duration-150 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-600 disabled:bg-zinc-950 disabled:text-zinc-600 disabled:cursor-not-allowed",
  {
    variants: {
      hasError: {
        true: "border-red-500 focus:ring-red-500 focus:border-red-500",
        false: "border-zinc-800/90 hover:border-zinc-700",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      id,
      disabled,
      hasError,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const isError = Boolean(error || hasError);

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400 select-none flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && (
              <span className="text-zinc-600 text-[10px] font-normal lowercase">
                (required)
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-zinc-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              inputVariants({ hasError: isError }),
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 flex items-center text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-red-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-zinc-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
