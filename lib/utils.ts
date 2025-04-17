import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RoleType } from "@/types/Role";
import { GroupType } from "@/types/Group";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  if (!name.trim()) return "";

  const words = name.trim().toUpperCase().split(" ");
  const firstInitial = words[0][0] || "";

  const secondInitial = words.length > 1 ? words[1][0] || "" : "";

  return firstInitial + secondInitial;
}

export function getRoleRedirectPath(role: RoleType): string {
  const roleRedirectMap = {
    SUPER_ADMIN: "dashboard",
    ADMIN: "dashboard",
    STUDENT: "home",
    TEACHER: "home",
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

export function formatNumber(number: number) {
  const formattedNumber = new Intl.NumberFormat().format(number);
  return formattedNumber;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytes")
      : (sizes[i] ?? "Bytes")
  }`;
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
