import React from "react";
import { Projects, ProjectItem as ProjectItemType, createEmptyProject } from "../types";
import { ProjectItem } from "./ProjectItem";
import { Card, Button, Icon } from "@/components/ui";

export interface ProjectsFormProps {
  data: Projects;
  onChange: (data: Projects) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({
  data,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([...data, createEmptyProject()]);
  };

  const handleItemChange = (index: number, updated: ProjectItemType) => {
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
      title="Projects"
      subtitle="Open source tools, architectures, side projects, and libraries"
      icon={<Icon name="projects" size={18} />}
      badge={
        <span className="text-xs bg-zinc-100 font-mono px-2 py-0.5 rounded text-zinc-700">
          {data.length} {data.length === 1 ? "project" : "projects"}
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
          Add Project
        </Button>
      }
      collapsible
      defaultExpanded
    >
      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-zinc-300 rounded-lg">
          <p className="text-sm text-zinc-500 mb-2">No projects added yet.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            icon={<Icon name="plus" size={14} />}
          >
            Add First Project
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <ProjectItem
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
