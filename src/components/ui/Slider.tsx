import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const sliderVariants = cva(
  "w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-1.5",
        lg: "h-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof sliderVariants> {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  displayValue?: string;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  displayValue,
  onChange,
  size,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)} {...props}>
      <div className="flex items-center justify-between text-xs">
        {label && (
          <span className="font-semibold uppercase tracking-wider text-zinc-400">
            {label}
          </span>
        )}
        <span className="font-mono text-zinc-200 bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-[11px]">
          {displayValue || `${value}${unit}`}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={cn(sliderVariants({ size }))}
      />

      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
};

Slider.displayName = "Slider";
