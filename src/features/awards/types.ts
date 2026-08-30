export interface AwardItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
}

export type Awards = AwardItem[];

export const createEmptyAward = (): AwardItem => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
  name: "",
  issuer: "",
  date: "",
  description: "",
});
