"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserType } from "@/types/User";
import { getInitials } from "@/lib/utils";

const sizeClasses = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};
type Props = {
  teachers: UserType[];
  maxDisplayed?: number;
  size: "sm" | "md" | "lg";
};

export function TeachersAvatars({
  teachers = [],
  maxDisplayed = 5,
  size,
}: Props) {
  const sizeClass = sizeClasses[size];
  const displayedTeachers = teachers.slice(0, maxDisplayed);
  const overflowCount = teachers.length - maxDisplayed;

  return (
    <div className="flex items-center justify-start p-2">
      {displayedTeachers.map((teacher, index) => (
        <Avatar
          key={teacher.id}
          className={`border-background ${sizeClass} rounded-full border-2`}
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
          className={`border-background ${sizeClass} rounded-full border-2`}
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
