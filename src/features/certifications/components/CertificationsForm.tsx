import React from "react";
import { Certifications, CertificationItem, createEmptyCertification } from "../types";
import { Card, Button, Input, Icon } from "@/components/ui";

export interface CertificationsFormProps {
  data: Certifications;
  onChange: (data: Certifications) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({
  data,
  onChange,
}) => {
  const handleAdd = () => {
    onChange([...data, createEmptyCertification()]);
  };

  const handleItemChange = (
    index: number,
    field: keyof CertificationItem,
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
      title="Certifications"
      subtitle="Industry certificates and credentials (AWS, GCP, CKA, etc.)"
      icon={<Icon name="check" size={18} />}
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
          Add Certification
        </Button>
      }
      collapsible
      defaultExpanded
    >
      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
          <p className="text-sm text-zinc-400 mb-2">No certifications added yet.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            icon={<Icon name="plus" size={14} />}
          >
            Add First Certification
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
                  {item.name ? `${item.name} (${item.issuer || "Issuer"})` : `Certification #${index + 1}`}
                </h4>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  aria-label="Delete certification"
                  className="p-1 h-7 w-7"
                >
                  <Icon name="trash" size={13} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <Input
                    label="Certification Name"
                    placeholder="e.g. AWS Solutions Architect - Professional"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <Input
                    label="Issuer / Organization"
                    placeholder="e.g. Amazon Web Services (AWS)"
                    value={item.issuer}
                    onChange={(e) => handleItemChange(index, "issuer", e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <Input
                    label="Issue Date"
                    placeholder="e.g. 2023"
                    value={item.date}
                    onChange={(e) => handleItemChange(index, "date", e.target.value)}
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
