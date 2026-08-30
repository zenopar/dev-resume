import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const textareaVariants = cva(
  "w-full bg-zinc-950/80 text-zinc-100 placeholder:text-zinc-600 text-sm rounded-md border transition-all duration-150 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-600 disabled:bg-zinc-950 disabled:text-zinc-600 disabled:cursor-not-allowed resize-y",
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

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      containerClassName,
      id,
      disabled,
      rows = 3,
      hasError,
      ...props
    },
    ref
  ) => {
    const textareaId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const isError = Boolean(error || hasError);

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
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

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          className={cn(textareaVariants({ hasError: isError }), className)}
          {...props}
        />

        {error ? (
          <p className="text-xs text-red-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-zinc-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
