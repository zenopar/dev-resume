import React from "react";
import { Awards, AwardItem, createEmptyAward } from "../types";
import { Card, Button, Input, Icon } from "@/components/ui";

export interface AwardsFormProps {
  data: Awards;
  onChange: (data: Awards) => void;
}

export const AwardsForm: React.FC<AwardsFormProps> = ({ data, onChange }) => {
  const handleAdd = () => {
    onChange([...data, createEmptyAward()]);
  };

  const handleItemChange = (
    index: number,
    field: keyof AwardItem,
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
      title="Honors & Awards"
      subtitle="Competitions, hackathons, open source recognitions, or academic awards"
      icon={<Icon name="award" size={18} />}
      badge={
        <span className="text-xs bg-zinc-800 font-mono px-2 py-0.5 rounded text-zinc-300 border border-zinc-700">
          {data.length} {data.length === 1 ? "award" : "awards"}
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
          Add Award
        </Button>
      }
      collapsible
      defaultExpanded
    >
      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
          <p className="text-sm text-zinc-400 mb-2">No awards added yet.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            icon={<Icon name="plus" size={14} />}
          >
            Add First Award
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={item.id}
              className="p-3.5 border border-zinc-800 rounded-lg bg-zinc-950/40 space-y-2.5"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h4 className="text-sm font-semibold text-zinc-100">
                  {item.name ? `${item.name} (${item.issuer || "Issuer"})` : `Award #${index + 1}`}
                </h4>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  aria-label="Delete award"
                  className="p-1 h-7 w-7"
                >
                  <Icon name="trash" size={13} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Input
                    label="Award / Honor Title"
                    placeholder="e.g. 1st Place - Global Hackathon"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Issuer / Organization"
                    placeholder="e.g. Major League Hacking / CNCF"
                    value={item.issuer}
                    onChange={(e) => handleItemChange(index, "issuer", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Year / Date"
                    placeholder="e.g. 2023"
                    value={item.date}
                    onChange={(e) => handleItemChange(index, "date", e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    label="Short Note (Optional)"
                    placeholder="e.g. Developed zero-downtime canary deployment operator for Kubernetes out of 400+ teams"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
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
