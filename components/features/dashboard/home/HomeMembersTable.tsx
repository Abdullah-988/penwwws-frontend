"use client";

import { DataTable } from "@/components/shared/DataTable";
import { GetColumns } from "@/components/shared/columns";
import { MemberType } from "@/types/member";
import { useState, useRef } from "react";
import AssignGroup from "@/components/shared/AssignGroup";
import UnassignGroup from "@/components/shared/UnassignGroup";
import RemoveMember from "@/components/shared/RemoveMember";
import { ResetSelectionType } from "@/components/shared/DataTable";

type Props = {
  data: MemberType[];
  schoolId: string;
};

export const MembersTable = ({ data, schoolId }: Props) => {
  const resetSelectionRef = useRef<ResetSelectionType | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);

  return (
    <>
      <DataTable
        columns={GetColumns(schoolId)}
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
