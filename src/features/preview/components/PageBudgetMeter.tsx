import React from "react";
import { Icon } from "@/components/ui";

export interface PageBudgetMeterProps {
  fillPercentage: number;
  isOverflowing: boolean;
}

export const PageBudgetMeter: React.FC<PageBudgetMeterProps> = ({
  fillPercentage,
  isOverflowing,
}) => {
  const percentageDisplay = Math.min(Math.round(fillPercentage), 200);

  return (
    <div className="flex items-center gap-3 bg-zinc-900 text-white px-3 py-1.5 rounded-md text-xs select-none">
      <div className="flex items-center gap-1.5 font-medium">
        {isOverflowing ? (
          <span className="text-amber-400 flex items-center gap-1">
            <Icon name="alert" size={13} />
            <span>Page Budget: {percentageDisplay}% (Overflows 1 A4 page)</span>
          </span>
        ) : (
          <span className="text-zinc-200 flex items-center gap-1">
            <Icon name="check" size={13} className="text-emerald-400" />
            <span>Page Budget: {percentageDisplay}% (Fits 1 A4 page)</span>
          </span>
        )}
      </div>

      <div className="w-24 h-1.5 bg-zinc-700 rounded-full overflow-hidden shrink-0">
        <div
          className={`h-full transition-all duration-300 ${
            isOverflowing ? "bg-amber-400" : "bg-white"
          }`}
          style={{ width: `${Math.min(fillPercentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
