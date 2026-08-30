import React from "react";
import { Education, EducationItem, createEmptyEducation } from "../types";
import { Card, Button, Input, Icon } from "@/components/ui";

export interface EducationFormProps {
  data: Education;
  onChange: (data: Education) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  data,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([...data, createEmptyEducation()]);
  };

  const handleItemChange = (index: number, field: keyof EducationItem, value: string) => {
    const next = [...data];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const handleDelete = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <Card
      title="Education"
      subtitle="University, college, start date, and graduation date"
      icon={<Icon name="education" size={18} />}
      badge={
        <span className="text-xs bg-zinc-800 font-mono px-2 py-0.5 rounded text-zinc-300 border border-zinc-700">
          {data.length} {data.length === 1 ? "entry" : "entries"}
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
          Add Education
        </Button>
      }
      collapsible
      defaultExpanded
    >
      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
          <p className="text-sm text-zinc-400 mb-2">No education entries added yet.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            icon={<Icon name="plus" size={14} />}
          >
            Add School / Degree
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={item.id}
              className="p-3.5 border border-zinc-800 rounded-lg bg-zinc-950/40 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-black text-[11px] font-mono flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-zinc-100">
                    {item.school ? `${item.degree || "Degree"} — ${item.school}` : "New Education Entry"}
                  </h4>
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  aria-label="Delete education"
                  className="p-1 h-7 w-7"
                >
                  <Icon name="trash" size={13} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="School / University"
                  placeholder="e.g. University of California, Berkeley"
                  value={item.school}
                  onChange={(e) => handleItemChange(index, "school", e.target.value)}
                  required
                />
                <Input
                  label="Degree / Major"
                  placeholder="e.g. B.S. in Computer Science"
                  value={item.degree}
                  onChange={(e) => handleItemChange(index, "degree", e.target.value)}
                />
                <Input
                  label="Start Date"
                  placeholder="e.g. 2014"
                  value={item.startDate}
                  onChange={(e) => handleItemChange(index, "startDate", e.target.value)}
                />
                <Input
                  label="End Date"
                  placeholder="e.g. 2018"
                  value={item.endDate}
                  onChange={(e) => handleItemChange(index, "endDate", e.target.value)}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Details / Honors / Relevant Coursework (Optional)"
                    placeholder="e.g. Dean's Honor List, Distributed Systems, Compilers"
                    value={item.details}
                    onChange={(e) => handleItemChange(index, "details", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
