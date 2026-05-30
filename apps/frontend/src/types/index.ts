export interface Cat {
  id: number;
  name: string;
  breedId?: number | null;
  color?: string | null;
  gender: string;
  ageMonths?: number | null;
  weightKg?: number | null;
  description?: string | null;
  isAvailable: boolean;
  createdAt: string;
}

export interface Application {
  id: number;
  catId: number;
  applicantName: string;
  applicantEmail: string;
  phone?: string | null;
  message?: string | null;
  status: string;
  createdAt: string;
}

export interface AuthUser {
  sub: number;
  name: string;
  email: string;
  role: string;
}

export type View = "cats" | "applications";
