export type ObligationStatus = "valid" | "expiring_soon" | "expired" | "missing";
export type AppliesTo = "employee" | "site" | "organization";
export type UserRole = "owner" | "admin" | "site_manager" | "employee";

export interface Organization {
  id: string;
  name: string;
  sector: string;
  created_at: string;
}

export interface Site {
  id: string;
  org_id: string;
  name: string;
  address: string;
  manager_email: string | null;
  created_at: string;
}

export interface Employee {
  id: string;
  org_id: string;
  site_id: string;
  full_name: string;
  email: string | null;
  job_title: string;
  active: boolean;
  created_at: string;
}

export interface ObligationTemplate {
  id: string;
  sector: string;
  name: string;
  description: string;
  renewal_months: number;
  applies_to: AppliesTo;
  proof_type: string;
  alert_days: number[];
  created_at: string;
}

export interface Obligation {
  id: string;
  org_id: string;
  template_id: string;
  site_id: string | null;
  employee_id: string | null;
  due_date: string | null;
  status: ObligationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Proof {
  id: string;
  obligation_id: string;
  file_url: string;
  file_name: string;
  uploaded_by: string;
  valid_from: string | null;
  valid_until: string | null;
  uploaded_at: string;
}

export interface Profile {
  id: string;
  org_id: string | null;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: Omit<Organization, "id" | "created_at">;
        Update: Partial<Omit<Organization, "id" | "created_at">>;
      };
      sites: {
        Row: Site;
        Insert: Omit<Site, "id" | "created_at">;
        Update: Partial<Omit<Site, "id" | "created_at">>;
      };
      employees: {
        Row: Employee;
        Insert: Omit<Employee, "id" | "created_at">;
        Update: Partial<Omit<Employee, "id" | "created_at">>;
      };
      obligation_templates: {
        Row: ObligationTemplate;
        Insert: Omit<ObligationTemplate, "id" | "created_at">;
        Update: Partial<Omit<ObligationTemplate, "id" | "created_at">>;
      };
      obligations: {
        Row: Obligation;
        Insert: Omit<Obligation, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Obligation, "id" | "created_at" | "updated_at">>;
      };
      proofs: {
        Row: Proof;
        Insert: Omit<Proof, "id" | "uploaded_at">;
        Update: Partial<Omit<Proof, "id" | "uploaded_at">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at">;
        Update: Partial<Omit<Profile, "created_at">>;
      };
    };
  };
}
