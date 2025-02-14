import { RoleType } from "./Role";

export type SchoolType = {
  school: {
    id: string;
    name: string;
    logoUrl?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    members: { role: RoleType }[];
  };
};
