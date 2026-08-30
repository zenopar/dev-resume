import React, { useState } from "react";
import { ProjectEntry } from "../types";
import { Input, Textarea, Badge, Button, Icon } from "@/components/ui";

export interface ProjectItemProps {
  item: ProjectEntry;
  index: number;
  total: number;
  onChange: (updated: ProjectEntry) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({
  item,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const [techInput, setTechInput] = useState("");

  const handleChange = (field: keyof ProjectEntry, value: any) => {
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
            {item.name || "New Project"} {item.role ? `(${item.role})` : ""}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={index === 0}
            onClick={onMoveUp}
            aria-label="Move project up"
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
            aria-label="Move project down"
            className="p-1 h-7 w-7 text-zinc-400 hover:text-white"
          >
            <Icon name="arrow-down" size={13} />
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onDelete}
            aria-label="Delete project"
            className="p-1 h-7 w-7"
          >
            <Icon name="trash" size={13} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Project Name"
          placeholder="e.g. RaftKV — Distributed Consensus Store"
          value={item.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <Input
          label="Your Role"
          placeholder="e.g. Lead Creator & Maintainer"
          value={item.role}
          onChange={(e) => handleChange("role", e.target.value)}
        />
        <div className="md:col-span-2">
          <Input
            label="Website / Repository Link"
            placeholder="e.g. https://github.com/username/project or https://project.dev"
            leftIcon={<Icon name="external-link" size={14} />}
            value={item.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>
      </div>

      <Textarea
        label="Description & Key Highlights"
        placeholder="High-performance Raft consensus key-value database built in Rust featuring zero-copy deserialization and linearizable reads (1.4k GitHub stars)."
        rows={2}
        value={item.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 select-none">
          Technologies Used
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Rust, Raft, Tokio, gRPC"
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
