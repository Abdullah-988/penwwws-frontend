"use client";

import { DataTable } from "@/components/shared/DataTable";
import { getColumns } from "@/components/shared/columns";
import { MemberType } from "@/types/member";
import { useState } from "react";
import AssignGroup from "@/components/shared/AssignGroup";
import UnassignGroup from "@/components/shared/UnassignGroup";
import RemoveMember from "@/components/shared/RemoveMember";

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
            />
          </>
        )}
      </DataTable>
    </>
  );
};
