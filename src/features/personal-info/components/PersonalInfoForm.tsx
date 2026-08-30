import React from "react";
import { PersonalInfo } from "../types";
import { Input, Card, Icon } from "@/components/ui";

export interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  onChange,
}) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card
      title="Personal Information"
      subtitle="Your contact details, location, and developer profiles"
      icon={<Icon name="user" size={18} />}
      collapsible
      defaultExpanded
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="e.g. Alex"
          value={data.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          required
        />
        <Input
          label="Last Name"
          placeholder="e.g. Vance"
          value={data.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          required
        />
        <div className="md:col-span-2">
          <Input
            label="Professional Title"
            placeholder="e.g. Senior Full-Stack Engineer / Distributed Systems"
            value={data.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
        <Input
          label="Email"
          type="email"
          placeholder="e.g. alex.vance@example.dev"
          leftIcon={<Icon name="mail" size={14} />}
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <Input
          label="Phone Number"
          placeholder="e.g. +1 (555) 234-5678"
          leftIcon={<Icon name="phone" size={14} />}
          value={data.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        <div className="md:col-span-2">
          <Input
            label="City / Residence"
            placeholder="e.g. San Francisco, CA (or Remote)"
            leftIcon={<Icon name="map-pin" size={14} />}
            value={data.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>
        <Input
          label="GitHub"
          placeholder="e.g. github.com/alexvance or alexvance"
          leftIcon={<Icon name="github" size={14} />}
          value={data.github}
          onChange={(e) => handleChange("github", e.target.value)}
        />
        <Input
          label="LinkedIn"
          placeholder="e.g. linkedin.com/in/alexvance"
          leftIcon={<Icon name="linkedin" size={14} />}
          value={data.linkedin}
          onChange={(e) => handleChange("linkedin", e.target.value)}
        />
        <div className="md:col-span-2">
          <Input
            label="Website / Portfolio"
            placeholder="e.g. https://alexvance.dev"
            leftIcon={<Icon name="globe" size={14} />}
            value={data.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};
