"use client";

import { DataTable } from "@/components/shared/data-table";
import { getColumns } from "@/components/shared/columns";
import { MemberType } from "@/types/member";
import { useState } from "react";
import AssignGroup from "@/components/shared/assign-group";
import UnassignGroup from "@/components/shared/unassign-group";
import DeleteMember from "@/components/shared/deleteMember";

type Props = {
  data: MemberType[];
  schoolId: string;
};

export const MembersTable = ({ data, schoolId }: Props) => {
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);

  return (
    <>
      <DataTable
        columns={getColumns(schoolId)}
        data={data}
        schoolId={schoolId}
        setSelectedMemberIds={setSelectedMemberIds}
      >
        {selectedMemberIds && selectedMemberIds.length > 0 && (
          <>
            <AssignGroup
              schoolId={schoolId}
              selectedMemberIds={selectedMemberIds}
            />
            <UnassignGroup
              schoolId={schoolId}
              selectedMemberIds={selectedMemberIds}
            />
            <DeleteMember
              schoolId={schoolId}
              selectedMemberIds={selectedMemberIds}
            />
          </>
        )}
      </DataTable>
    </>
  );
};
