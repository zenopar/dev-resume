import React, { useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const modalVariants = cva(
  "relative w-full bg-zinc-900 rounded-lg shadow-2xl border border-zinc-700 overflow-hidden z-10 animate-in zoom-in-95",
  {
    variants: {
      maxWidth: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-4xl",
      },
    },
    defaultVariants: {
      maxWidth: "md",
    },
  }
);

export interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div className={cn(modalVariants({ maxWidth }), className)}>
        <div className="flex items-start justify-between p-4 border-b border-zinc-800 bg-zinc-950">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
            {description && (
              <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 max-h-[75vh] overflow-y-auto text-zinc-200">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 p-3 bg-zinc-950 border-t border-zinc-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.displayName = "Modal";
