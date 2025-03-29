import { RoleType } from "./Role";

export type SchoolType = {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members: { role: RoleType }[];
<<<<<<< HEAD
  _count: { subjects: number; students: number; teachers: number };
=======
>>>>>>> ako-mawlood/feature/dashboard/invite
};
