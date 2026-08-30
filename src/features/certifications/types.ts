export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export type Certifications = CertificationItem[];

export const createEmptyCertification = (): CertificationItem => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
  name: "",
  issuer: "",
  date: "",
});
