"use client";

import { DataTable, ResetSelectionType } from "@/components/shared/DataTable";
import { SubjectDetailType } from "@/types/Subject";
import { useRef, useState } from "react";
import UnassignSubject from "@/components/features/subject/UnassignSubject";
import { GetColumns } from "@/components/shared/columns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Clipboard, Copy } from "lucide-react";
import Link from "next/link";
import { SchoolUserType } from "@/types/SchoolUser";
import ClassmatesTable from "./ClassmatesTable";
import { MemberType } from "@/types/member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

type Props = {
  schoolId: string;
  user: SchoolUserType;
  subject: SubjectDetailType;
  children: React.ReactNode;
};

export default function StudentsTabContent({
  schoolId,
  user,
  subject,
  children,
}: Props) {
  const resetSelectionRef = useRef<ResetSelectionType | null>(null);

  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);

  if (user.role === "STUDENT") {
    return <ClassmatesTable members={subject.users} />;
  }
  const columns = GetColumns(
    (member) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <UnassignSubject
            schoolId={schoolId}
            selectedMemberIds={[member.id]}
            subject={subject}
            className="bg-card hover:bg-muted shadow-none"
          />
          {member.role === "STUDENT" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href={`/school/${schoolId}/subjects/${subject.id}/students/${member.id}`}
                  className="flex items-center space-x-2"
                >
                  <Clipboard size={16} />
                  <span>View Marks</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(member.email)}
              >
                <Copy size={16} /> Copy email
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),

    (member) =>
      member.role !== "STUDENT" ? (
        <div className="flex items-center">
          <Avatar className="size-7 rounded-full">
            <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
            <AvatarImage src={member.avatarUrl} />
          </Avatar>
          <span className="ml-2">{member.fullName}</span>
        </div>
      ) : (
        <Link
          href={`/school/${schoolId}/subjects/${subject.id}/students/${member.id}`}
          className="flex items-center hover:underline"
        >
          <Avatar className="size-7 rounded-full">
            <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
            <AvatarImage src={member.avatarUrl} />
          </Avatar>
          <span className="ml-2">{member.fullName}</span>
        </Link>
      ),
  );
  return (
    <DataTable
      data={subject.users as MemberType[]}
      columns={columns}
      schoolId={schoolId}
      setSelectedMemberIds={setSelectedMemberIds}
      resetSelectionRef={resetSelectionRef}
    >
      {selectedMemberIds.length > 0 && (
        <UnassignSubject
          resetSelectionRef={resetSelectionRef}
          selectedMemberIds={selectedMemberIds}
          schoolId={schoolId}
          subject={subject}
        />
      )}
      {children}
    </DataTable>
  );
}
