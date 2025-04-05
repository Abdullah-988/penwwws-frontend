"use client";

import { DataTable, ResetSelectionType } from "@/components/shared/DataTable";
import { useRef, useState } from "react";
import { GetColumns } from "@/components/shared/columns";
import AssignSubject from "@/components/features/subject/AssignSubject";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal } from "lucide-react";
import { SubjectDetailType } from "@/types/Subject";
import { MemberType } from "@/types/member";

type Props = {
  subject: SubjectDetailType;
  schoolId: string;
  members: MemberType[];
};
export default function AssignSubjectTable({
  subject,
  schoolId,
  members,
}: Props) {
  const columns = GetColumns((member) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <div className="w-full">
          <AssignSubject
            schoolId={schoolId}
            subject={subject}
            selectedMemberIds={[member.id]}
            className="bg-card hover:bg-muted w-full justify-start"
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(member.email)}
        >
          <Copy size={16} /> Copy email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ));

  const resetSelectionRef = useRef<ResetSelectionType | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  return (
    <DataTable
      setSelectedMemberIds={setSelectedMemberIds}
      columns={columns}
      data={members}
      resetSelectionRef={resetSelectionRef}
      schoolId={schoolId}
    >
      <AssignSubject
        resetSelectionRef={resetSelectionRef}
        schoolId={schoolId}
        selectedMemberIds={selectedMemberIds}
        subject={subject}
      />
    </DataTable>
  );
}
