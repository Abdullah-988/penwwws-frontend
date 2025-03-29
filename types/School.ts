import { RoleType } from "./Role";

export type SchoolType = {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members: { role: RoleType }[];
};
