import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RoleType } from "@/types/Role";

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
