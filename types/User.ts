import { RoleType } from "./Role";

export type UserType = {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  role: RoleType;
};
