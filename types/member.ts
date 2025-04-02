import { GroupType } from "./Group";
import { RoleType } from "./Role";

export type MemberType = {
  id: number;
  fullName: string;
  email: string;
  groups: GroupType[];
  avatarUrl?: string;
  role: RoleType;
};
