"use client";

import { DataTable } from "@/components/shared/DataTable";
import { useState } from "react";
import { GetColumns } from "@/components/shared/columns";
import { MemberType } from "@/types/member";
import { GroupType } from "@/types/Group";
import AssignGroup from "@/components/shared/AssignGroup";
import UnassignGroup from "@/components/shared/UnassignGroup";

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
  group: GroupType;
};

export default function GroupTable({ group, schoolId, data }: Props) {
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
      </DropdownMenuContent>
    </DropdownMenu>
  ));

  return (
    <DataTable
      setSelectedMemberIds={setSelectedMemberIds}
      columns={columns}
      data={data}
      defaultFilteredGroupIds={[group.id]}
      schoolId={schoolId}
      defaultFilteredRole="STUDENT"
    >
      <>
        <AssignGroup
          schoolId={schoolId}
          selectedMemberIds={selectedMemberIds}
          assignGroupMode="single"
          groupId={group.id}
        />
        <UnassignGroup
          schoolId={schoolId}
          selectedMemberIds={selectedMemberIds}
          unassignGroupMode="single"
          groupId={group.id}
        />
      </>
    </DataTable>
  );
}
