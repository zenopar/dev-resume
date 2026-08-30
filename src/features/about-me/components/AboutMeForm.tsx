import React from "react";
import { AboutMe } from "../types";
import { Textarea, Card, Icon } from "@/components/ui";

export interface AboutMeFormProps {
  data: AboutMe;
  onChange: (data: AboutMe) => void;
}

export const AboutMeForm: React.FC<AboutMeFormProps> = ({ data, onChange }) => {
  return (
    <Card
      title="About Me"
      subtitle="Concise summary highlighting your core engineering focus and achievements"
      icon={<Icon name="file-text" size={18} />}
      collapsible
      defaultExpanded
    >
      <Textarea
        placeholder="e.g. Systems engineer with 6+ years specializing in distributed backend infrastructure, high-throughput microservices (Go, Rust, Node.js), and Kubernetes orchestration. Passionate about developer tooling, performance optimization, and reliable system architecture."
        rows={4}
        value={data.summary}
        onChange={(e) => onChange({ summary: e.target.value })}
        helperText="Tip: Keep to 2-4 impactful sentences to ensure optimal single A4 page fit."
      />
    </Card>
  );
};
