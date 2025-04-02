"use client";

import { DataTable, ResetSelectionType } from "@/components/shared/DataTable";
import { getColumns } from "@/constants/tableColumns/adminTeacherSubjectMemberColumns";
import { SubjectDetailType } from "@/types/Subject";
import { useRef, useState } from "react";
import UnassignSubject from "./UnassignSubject";

type Props = {
  schoolId: string;
  subject: SubjectDetailType;
};

export default function StudentsTabContent({ schoolId, subject }: Props) {
  const resetSelectionRef = useRef<ResetSelectionType | null>(null);

  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);

  return (
    <DataTable
      data={subject.users}
      columns={getColumns(schoolId, subject)}
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
    </DataTable>
  );
}
