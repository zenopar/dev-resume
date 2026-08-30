import React, { useState } from "react";
import { WorkExperienceItem } from "../types";
import { Input, Textarea, Badge, Button, Icon } from "@/components/ui";

export interface ExperienceItemProps {
  item: WorkExperienceItem;
  index: number;
  total: number;
  onChange: (updated: WorkExperienceItem) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const ExperienceItem: React.FC<ExperienceItemProps> = ({
  item,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const [techInput, setTechInput] = useState("");

  const handleChange = (field: keyof WorkExperienceItem, value: any) => {
    onChange({
      ...item,
      [field]: value,
    });
  };

  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !item.technologies.includes(trimmed)) {
      onChange({
        ...item,
        technologies: [...item.technologies, trimmed],
      });
      setTechInput("");
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    onChange({
      ...item,
      technologies: item.technologies.filter((t) => t !== techToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTech();
    }
  };

  return (
    <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-950/40 space-y-3.5 transition-all hover:border-zinc-700">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-white text-black text-[11px] font-mono flex items-center justify-center font-bold">
            {index + 1}
          </span>
          <h4 className="text-sm font-semibold text-zinc-100">
            {item.role || item.company ? `${item.role || "Role"} @ ${item.company || "Company"}` : "New Experience"}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={index === 0}
            onClick={onMoveUp}
            aria-label="Move item up"
            className="p-1 h-7 w-7 text-zinc-400 hover:text-white"
          >
            <Icon name="arrow-up" size={13} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={index === total - 1}
            onClick={onMoveDown}
            aria-label="Move item down"
            className="p-1 h-7 w-7 text-zinc-400 hover:text-white"
          >
            <Icon name="arrow-down" size={13} />
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onDelete}
            aria-label="Delete experience"
            className="p-1 h-7 w-7"
          >
            <Icon name="trash" size={13} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="What (Role / Job Title)"
          placeholder="e.g. Staff Backend & Systems Engineer"
          value={item.role}
          onChange={(e) => handleChange("role", e.target.value)}
          required
        />
        <Input
          label="Where (Company / Organization)"
          placeholder="e.g. CloudScale Systems"
          value={item.company}
          onChange={(e) => handleChange("company", e.target.value)}
          required
        />
        <Input
          label="Location"
          placeholder="e.g. San Francisco, CA (Remote)"
          value={item.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Start Date"
            placeholder="e.g. 2022"
            value={item.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
          <Input
            label="End Date"
            placeholder={item.current ? "Present" : "e.g. Present"}
            value={item.current ? "Present" : item.endDate}
            disabled={item.current}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`current-job-${item.id}`}
          checked={item.current}
          onChange={(e) => handleChange("current", e.target.checked)}
          className="rounded border-zinc-700 bg-zinc-900 accent-white text-black cursor-pointer h-4 w-4"
        />
        <label
          htmlFor={`current-job-${item.id}`}
          className="text-xs text-zinc-300 font-medium cursor-pointer select-none"
        >
          I currently work here
        </label>
      </div>

      <Textarea
        label="What I Did There (Action + Impact Metrics)"
        placeholder="• Architected event-driven microservices platform handling 85k+ RPS with Go and Kafka&#10;• Reduced cloud infrastructure spend by 35% via automated Kubernetes cluster autoscaling&#10;• Mentored 8 engineers and championed zero-trust observability with Prometheus"
        rows={3}
        value={item.description}
        onChange={(e) => handleChange("description", e.target.value)}
        helperText="Psychology tip: Begin each bullet with a strong action verb and quantify your results with metrics."
      />

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 select-none">
          Technologies Used (Optional tags)
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Type technology (e.g. Go, Kafka, Docker) and press Enter"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddTech}
            disabled={!techInput.trim()}
          >
            Add
          </Button>
        </div>
        {item.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.technologies.map((tech) => (
              <Badge
                key={tech}
                size="sm"
                variant="default"
                onRemove={() => handleRemoveTech(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
