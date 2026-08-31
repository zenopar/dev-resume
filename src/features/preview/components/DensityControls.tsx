import React, { useState } from "react";
import { ResumeSettings, LayoutDensity, ResumeTemplate, ResumeLanguage } from "../../resume/types";
import { Slider, Button, Icon } from "@/components/ui";

export interface DensityControlsProps {
  settings: ResumeSettings;
  onChange: (settings: Partial<ResumeSettings>) => void;
}

export const DensityControls: React.FC<DensityControlsProps> = ({
  settings,
  onChange,
}) => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const currentLang = settings.language || "en";

  const densityPresets: { label: string; value: LayoutDensity }[] = [
    { label: "Compact", value: "compact" },
    { label: "Normal", value: "normal" },
    { label: "Spacious", value: "spacious" },
  ];

  const templateOptions: { label: string; value: ResumeTemplate }[] = [
    { label: "Modern Single-Col", value: "modern" },
    { label: "Split Sidebar", value: "split" },
    { label: "LaTeX Minimal", value: "technical" },
  ];

  const languageOptions: { label: string; value: ResumeLanguage; title: string }[] = [
    { label: "EN", value: "en", title: "English CV headings" },
    { label: "CZ", value: "cs", title: "České nadpisy v CV" },
  ];

  return (
    <div className="relative bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5 shadow-xs flex flex-wrap items-center justify-between gap-2">
      {/* Left: Template Switcher & Language Switcher */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 font-mono hidden sm:inline-block">
            Layout:
          </span>
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-md border border-zinc-800 h-6.5">
            {templateOptions.map((t) => {
              const isActive = settings.template === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onChange({ template: t.value })}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded transition-all cursor-pointer h-full flex items-center ${
                    isActive
                      ? "bg-zinc-100 text-zinc-900 font-semibold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CV Language Switcher */}
        <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-2.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 font-mono hidden sm:inline-block">
            CV Lang:
          </span>
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-md border border-zinc-800 h-6.5">
            {languageOptions.map((l) => {
              const isActive = currentLang === l.value;
              return (
                <button
                  key={l.value}
                  type="button"
                  title={l.title}
                  onClick={() => onChange({ language: l.value })}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded transition-all cursor-pointer h-full flex items-center ${
                    isActive
                      ? "bg-zinc-100 text-zinc-900 font-semibold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Density Presets & Fine-Tuning Dropdown */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-zinc-950 p-0.5 rounded-md border border-zinc-800 h-6.5">
          {densityPresets.map((p) => {
            const isActive = settings.density === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => {
                  const multipliers: Record<LayoutDensity, { font: number; space: number }> = {
                    compact: { font: 0.95, space: 0.88 },
                    normal: { font: 1.05, space: 1.0 },
                    spacious: { font: 1.15, space: 1.15 },
                  };
                  onChange({
                    density: p.value,
                    fontSizeMultiplier: multipliers[p.value].font,
                    spacingMultiplier: multipliers[p.value].space,
                  });
                }}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-all cursor-pointer h-full flex items-center ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100 font-semibold shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>


        {/* Fine Tuning Toggle Button */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            icon={<Icon name="sliders" size={13} />}
            className={`text-xs px-2.5 py-1 h-7 border-zinc-700 ${
              showSettingsDropdown ? "bg-zinc-800 text-white border-zinc-500" : ""
            }`}
          >
            Adjust
          </Button>

          {/* Floating Settings Popover */}
          {showSettingsDropdown && (
            <div className="absolute right-0 top-9 w-72 bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-2xl z-40 space-y-3 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                <span className="text-xs font-bold text-zinc-200">Typography & Spacing</span>
                <button
                  type="button"
                  onClick={() => setShowSettingsDropdown(false)}
                  className="text-zinc-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <Slider
                label="Font Scale"
                value={Math.round(settings.fontSizeMultiplier * 100)}
                min={85}
                max={130}
                step={2}
                unit="%"
                onChange={(val) => onChange({ fontSizeMultiplier: val / 100 })}
              />

              <Slider
                label="Spacing Scale"
                value={Math.round(settings.spacingMultiplier * 100)}
                min={75}
                max={125}
                step={5}
                unit="%"
                onChange={(val) => onChange({ spacingMultiplier: val / 100 })}
              />

              <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                <label
                  htmlFor="popover-icons-toggle"
                  className="text-xs text-zinc-300 font-medium cursor-pointer select-none"
                >
                  Show Icons
                </label>
                <input
                  id="popover-icons-toggle"
                  type="checkbox"
                  checked={settings.showIcons}
                  onChange={(e) => onChange({ showIcons: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 accent-white text-black cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
