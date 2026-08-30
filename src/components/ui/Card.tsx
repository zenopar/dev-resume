import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const cardVariants = cva(
  "rounded-lg shadow-sm overflow-hidden transition-all duration-150 backdrop-blur-xs",
  {
    variants: {
      variant: {
        default: "bg-zinc-900/80 border border-zinc-800",
        subtle: "bg-zinc-950/40 border border-zinc-800/80",
        outline: "bg-transparent border border-zinc-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof cardVariants> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  headerClassName?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  badge,
  action,
  children,
  collapsible = false,
  defaultExpanded = true,
  variant,
  className,
  headerClassName,
  bodyClassName,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn(cardVariants({ variant }), className)} {...props}>
      {(title || action || icon || badge) && (
        <div
          className={cn(
            "flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-950/60 select-none",
            collapsible && "cursor-pointer hover:bg-zinc-850",
            headerClassName
          )}
          onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && <span className="text-zinc-300 shrink-0">{icon}</span>}
            <div className="min-w-0">
              {title && (
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-100 truncate">
                    {title}
                  </h3>
                  {badge}
                </div>
              )}
              {subtitle && (
                <p className="text-xs text-zinc-400 truncate">{subtitle}</p>
              )}
            </div>
          </div>

          <div
            className="flex items-center gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {action}
            {collapsible && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {(!collapsible || isExpanded) && (
        <div className={cn("p-4", bodyClassName)}>{children}</div>
      )}
    </div>
  );
};

Card.displayName = "Card";
