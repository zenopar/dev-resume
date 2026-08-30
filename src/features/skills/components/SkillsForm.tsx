import React, { useState } from "react";
import { SkillsData, SkillCategory, createEmptySkillCategory } from "../types";
import { Card, Button, Input, Badge, Icon } from "@/components/ui";

export interface SkillsFormProps {
  data: SkillsData;
  onChange: (data: SkillsData) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const [activeCategoryInputs, setActiveCategoryInputs] = useState<Record<string, string>>({});

  const handleAddCategory = (name = "New Category") => {
    onChange([...data, createEmptySkillCategory(name)]);
  };

  const handleCategoryNameChange = (id: string, newName: string) => {
    onChange(
      data.map((cat) => (cat.id === id ? { ...cat, category: newName } : cat))
    );
  };

  const handleDeleteCategory = (id: string) => {
    onChange(data.filter((cat) => cat.id !== id));
  };

  const handleAddSkill = (catId: string) => {
    const inputVal = activeCategoryInputs[catId]?.trim();
    if (!inputVal) return;

    const newSkills = inputVal
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onChange(
      data.map((cat) => {
        if (cat.id !== catId) return cat;
        const combined = Array.from(new Set([...cat.skills, ...newSkills]));
        return { ...cat, skills: combined };
      })
    );

    setActiveCategoryInputs((prev) => ({ ...prev, [catId]: "" }));
  };

  const handleRemoveSkill = (catId: string, skillToRemove: string) => {
    onChange(
      data.map((cat) =>
        cat.id === catId
          ? { ...cat, skills: cat.skills.filter((s) => s !== skillToRemove) }
          : cat
      )
    );
  };

  const handleInputKeyDown = (
    catId: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill(catId);
    }
  };

  const handleAddPresetCategories = () => {
    const presets: SkillCategory[] = [
      {
        id: "cat-languages",
        category: "Languages",
        skills: ["TypeScript", "JavaScript", "Go", "Python", "Rust", "SQL"],
      },
      {
        id: "cat-backend",
        category: "Backend & Systems",
        skills: ["Node.js", "Express", "gRPC", "GraphQL", "PostgreSQL", "Redis", "Kafka"],
      },
      {
        id: "cat-frontend",
        category: "Frontend",
        skills: ["React", "Next.js", "Tailwind CSS", "Redux Toolkit", "HTML5/CSS3"],
      },
      {
        id: "cat-devops",
        category: "Cloud & DevOps",
        skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD (GitHub Actions)", "Linux"],
      },
    ];
    onChange(presets);
  };

  return (
    <Card
      title="Skills & Technologies"
      subtitle="Categorized technical competencies (Languages, Backend, Frontend, DevOps, etc.)"
      icon={<Icon name="code" size={18} />}
      badge={
        <span className="text-xs bg-zinc-800 font-mono px-2 py-0.5 rounded text-zinc-300 border border-zinc-700">
          {data.reduce((acc, cat) => acc + cat.skills.length, 0)} total skills
        </span>
      }
      action={
        <div className="flex items-center gap-2">
          {data.length === 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddPresetCategories}
              icon={<Icon name="sparkles" size={13} />}
            >
              Load Presets
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleAddCategory("New Category")}
            icon={<Icon name="plus" size={14} />}
          >
            Add Category
          </Button>
        </div>
      }
      collapsible
      defaultExpanded
    >
      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
          <p className="text-sm text-zinc-400 mb-3">No skill categories configured yet.</p>
          <div className="flex justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddPresetCategories}
              icon={<Icon name="sparkles" size={14} />}
            >
              Load Developer Category Presets
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleAddCategory("Languages")}
              icon={<Icon name="plus" size={14} />}
            >
              Add Empty Category
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((cat, idx) => (
            <div
              key={cat.id}
              className="p-3.5 border border-zinc-800 rounded-lg bg-zinc-950/40 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-mono text-zinc-500 font-bold">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) => handleCategoryNameChange(cat.id, e.target.value)}
                    placeholder="Category Name (e.g. Backend, DevOps)"
                    className="font-semibold text-sm text-zinc-100 bg-transparent border-b border-dashed border-zinc-700 focus:border-white focus:outline-none px-1 py-0.5 w-full max-w-xs"
                  />
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteCategory(cat.id)}
                  aria-label="Delete category"
                  className="p-1 h-7 w-7"
                >
                  <Icon name="trash" size={13} />
                </Button>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder={`Add skills to ${cat.category || "category"} (comma separated)...`}
                  value={activeCategoryInputs[cat.id] || ""}
                  onChange={(e) =>
                    setActiveCategoryInputs((prev) => ({
                      ...prev,
                      [cat.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => handleInputKeyDown(cat.id, e)}
                  containerClassName="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAddSkill(cat.id)}
                  disabled={!activeCategoryInputs[cat.id]?.trim()}
                >
                  Add
                </Button>
              </div>

              {cat.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.skills.map((skill) => (
                    <Badge
                      key={skill}
                      size="sm"
                      variant="default"
                      onRemove={() => handleRemoveSkill(cat.id, skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
