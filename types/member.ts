import { GroupType } from "@/types/Group";
import { RoleType } from "@/types/Role";

export type MemberType = {
  id: number;
  fullName: string;
  email: string;
  groups: GroupType[];
  avatarUrl?: string;
  role: RoleType;
};
