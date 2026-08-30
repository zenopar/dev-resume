import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export const selectVariants = cva(
  "w-full bg-zinc-950/80 text-zinc-100 text-sm rounded-md border appearance-none transition-all duration-150 py-2 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-600 disabled:bg-zinc-950 disabled:text-zinc-600 disabled:cursor-not-allowed cursor-pointer",
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

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      className,
      containerClassName,
      id,
      disabled,
      hasError,
      ...props
    },
    ref
  ) => {
    const selectId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const isError = Boolean(error || hasError);

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
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

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(selectVariants({ hasError: isError }), className)}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-zinc-950 text-zinc-100 py-1"
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
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

Select.displayName = "Select";
