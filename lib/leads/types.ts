export type LeadStatus = "new" | "review" | "done";

export type Lead = {
  id: string;
  created_at: string;
  status: LeadStatus;
  // 1. Contact
  name: string;
  company: string;
  contact_method: string;
  // 2. Goals
  project_type: string;
  business_goal: string;
  // 3. Features
  key_features: string;
  references: string;
  // 4. Timeline / budget
  deadline: string;
  budget: string;
  // 5. Optional
  specialist_code: string;
  lang: "ru" | "en" | "uk";
};

export type LeadInput = Omit<Lead, "id" | "created_at" | "status">;
