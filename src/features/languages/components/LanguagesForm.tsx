import React from "react";
import { Languages, LanguageItem, PROFICIENCY_OPTIONS, createEmptyLanguage } from "../types";
import { Card, Button, Input, Select, Icon } from "@/components/ui";

export interface LanguagesFormProps {
  data: Languages;
  onChange: (data: Languages) => void;
}

export const LanguagesForm: React.FC<LanguagesFormProps> = ({
  data,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([...data, createEmptyLanguage()]);
  };

  const handleItemChange = (
    index: number,
    field: keyof LanguageItem,
    value: string
  ) => {
    const next = [...data];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <Card
      title="Languages"
      subtitle="Spoken and written languages with proficiency level"
      icon={<Icon name="languages" size={18} />}
      badge={
        <span className="text-xs bg-zinc-800 font-mono px-2 py-0.5 rounded text-zinc-300 border border-zinc-700">
          {data.length}
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
          Add Language
        </Button>
      }
      collapsible
      defaultExpanded
    >
      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
          <p className="text-sm text-zinc-400 mb-2">No languages added yet.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            icon={<Icon name="plus" size={14} />}
          >
            Add First Language
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={item.id}
              className="p-3 border border-zinc-800 rounded-lg bg-zinc-950/40 flex flex-col md:flex-row items-center gap-3"
            >
              <div className="flex-1 w-full">
                <Input
                  label="Language"
                  placeholder="e.g. English, German, Czech, Spanish"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                  required
                />
              </div>

              <div className="w-full md:w-56">
                <Select
                  label="Proficiency Level"
                  options={PROFICIENCY_OPTIONS}
                  value={item.proficiency}
                  onChange={(e) => handleItemChange(index, "proficiency", e.target.value)}
                />
              </div>

              <div className="self-end md:self-center mt-2 md:mt-5">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  aria-label="Delete language"
                  className="p-1 h-8 w-8"
                >
                  <Icon name="trash" size={13} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
