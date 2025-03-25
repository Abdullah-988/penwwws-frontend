import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RoleType } from "@/types/Role";
import { GroupType } from "@/types/Group";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function getRoleRedirectPath(role: RoleType): string {
  const roleRedirectMap = {
    SUPER_ADMIN: "dashboard",
    ADMIN: "dashboard",
    STUDENT: "home",
    TEACHER: "teacher/dashboard",
  };
  return roleRedirectMap[role];
}

export function formatGroups(groups: GroupType[]): GroupType[] {
  const groupMap = new Map<string | number, GroupType>();

  groups.forEach((group) => {
    groupMap.set(group.id, { ...group, children: [] });
  });

  const rootGroups: GroupType[] = [];

  groups.forEach((group) => {
    if (group.parentId) {
      const parentGroup = groupMap.get(group.parentId);
      if (parentGroup) {
        if (!parentGroup.children) {
          parentGroup.children = [];
        }
        parentGroup.children.push(groupMap.get(group.id)!);
      }
    } else {
      rootGroups.push(groupMap.get(group.id)!);
    }
  });

  return rootGroups;
}
