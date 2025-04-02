"use client";

import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { getColumns } from "@/constants/tableColumns/adminTeacherSubjectMemberColumns";
import { SubjectDetailType } from "@/types/Subject";
import { useState } from "react";

type Props = {
  schoolId: string;
  subject: SubjectDetailType;
};

export default function StudentsTabContent({ schoolId, subject }: Props) {
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);

  return (
    <DataTable
      data={subject.users}
      columns={getColumns(schoolId, subject.id)}
      schoolId={schoolId}
      setSelectedMemberIds={setSelectedMemberIds}
    >
      {selectedMemberIds.length > 0 && <Button>Remove</Button>}
    </DataTable>
  );
}
