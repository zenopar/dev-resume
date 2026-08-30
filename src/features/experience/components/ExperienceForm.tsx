import React from "react";
import { WorkExperience, WorkExperienceItem, createEmptyExperience } from "../types";
import { ExperienceItem } from "./ExperienceItem";
import { Card, Button, Icon } from "@/components/ui";

export interface ExperienceFormProps {
  data: WorkExperience;
  onChange: (data: WorkExperience) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  data,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([...data, createEmptyExperience()]);
  };

  const handleItemChange = (index: number, updated: WorkExperienceItem) => {
    const next = [...data];
    next[index] = updated;
    onChange(next);
  };

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.length) return;
    const next = [...data];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
  };

  return (
    <Card
      title="Work Experience"
      subtitle="Where you worked, your role, and what you delivered"
      icon={<Icon name="briefcase" size={18} />}
      badge={
        <span className="text-xs bg-zinc-100 font-mono px-2 py-0.5 rounded text-zinc-700">
          {data.length} {data.length === 1 ? "role" : "roles"}
        </span>
      }
      action={
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAdd}
          icon={<Icon name="plus" size={14} />}
        >
          Add Experience
        </Button>
      }
      collapsible
      defaultExpanded
    >
      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-zinc-300 rounded-lg">
          <p className="text-sm text-zinc-500 mb-2">No work experience added yet.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            icon={<Icon name="plus" size={14} />}
          >
            Add First Job / Role
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <ExperienceItem
              key={item.id}
              item={item}
              index={index}
              total={data.length}
              onChange={(updated) => handleItemChange(index, updated)}
              onDelete={() => handleDelete(index)}
              onMoveUp={() => handleMove(index, "up")}
              onMoveDown={() => handleMove(index, "down")}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
