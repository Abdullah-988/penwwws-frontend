"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { MemberType } from "@/types/member";
import clsx from "clsx";

type Props = {
  teachers: MemberType[] | Omit<MemberType, "groups">[];
  maxDisplayed?: number;
  className?: string;
};

export function TeachersAvatars({
  teachers = [],
  maxDisplayed = 5,
  className,
}: Props) {
  const displayedTeachers = teachers.slice(0, maxDisplayed);
  const overflowCount = teachers.length - maxDisplayed;

  return (
    <div className="flex items-center justify-start p-2">
      {displayedTeachers.map((teacher, index) => (
        <Avatar
          key={teacher.id}
          className={clsx(
            "border-background size-8 rounded-full border-2",
            className,
          )}
          style={{
            zIndex: displayedTeachers.length - index,
            right: index * 12,
          }}
        >
          <AvatarImage src={teacher.avatarUrl} alt={teacher.fullName} />
          <AvatarFallback>{getInitials(teacher.fullName)}</AvatarFallback>
        </Avatar>
      ))}

      {overflowCount > 0 && (
        <Avatar
          className={clsx(
            "border-background size-8 rounded-full border-2",
            className,
          )}
          style={{
            zIndex: 0,
            right: maxDisplayed * 12,
          }}
        >
          <AvatarFallback>+{overflowCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
