import type { Application, AuthUser, Cat } from "@/types";
import http from "@/lib/http";

export const fetchCats = async (): Promise<Cat[]> => {
  const { data } = await http.get<Cat[]>("/cat");
  return Array.isArray(data) ? data : [];
};

export const fetchApplications = async (): Promise<Application[]> => {
  const { data } = await http.get<Application[]>("/application");
  return Array.isArray(data) ? data : [];
};

export const fetchMe = async (): Promise<AuthUser | null> => {
  try {
    const { data } = await http.get<AuthUser>("/auth/me");
    return data;
  } catch {
    return null;
  }
};
