"use client";

import { DataTable } from "@/components/shared/DataTable";
import { GetColumns } from "@/components/shared/columns";
import { MemberType } from "@/types/member";
import { useState, useRef } from "react";
import AssignGroup from "@/components/shared/AssignGroup";
import UnassignGroup from "@/components/shared/UnassignGroup";
import RemoveMember from "@/components/shared/RemoveMember";
import { ResetSelectionType } from "@/components/shared/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

type Props = {
  data: MemberType[];
  schoolId: string;
};

export const HomeTable = ({ data, schoolId }: Props) => {
  const resetSelectionRef = useRef<ResetSelectionType | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);

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
        <div className="flex w-full flex-col">
          <AssignGroup
            schoolId={schoolId}
            selectedMemberIds={[member.id]}
            assignGroupMode="multiple"
            className="bg-card hover:bg-secondary justify-start shadow-none"
          />
          <UnassignGroup
            schoolId={schoolId}
            selectedMemberIds={[member.id]}
            className="bg-card hover:bg-secondary w-full justify-start shadow-none"
            unassignGroupMode="multiple"
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(member.email)}
        >
          Copy member email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <RemoveMember
          schoolId={schoolId}
          selectedMemberIds={[member.id]}
          resetSelectionRef={resetSelectionRef}
          className="text-destructive bg-card hover:bg-muted w-full shadow-none"
          btnText="Remove member"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  ));
  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        schoolId={schoolId}
        setSelectedMemberIds={setSelectedMemberIds}
        resetSelectionRef={resetSelectionRef}
      >
        {selectedMemberIds && selectedMemberIds.length > 0 && (
          <>
            <AssignGroup
              schoolId={schoolId}
              selectedMemberIds={selectedMemberIds}
              assignGroupMode="multiple"
            />
            <UnassignGroup
              schoolId={schoolId}
              selectedMemberIds={selectedMemberIds}
              unassignGroupMode="multiple"
            />
            <RemoveMember
              schoolId={schoolId}
              selectedMemberIds={selectedMemberIds}
              resetSelectionRef={resetSelectionRef}
            />
          </>
        )}
      </DataTable>
    </>
  );
};
