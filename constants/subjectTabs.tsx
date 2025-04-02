import DocumentsTab from "@/components/features/subject/Documents";
import StudentsTabContent from "@/components/features/subject/StudentsTabContent";
import { SubjectDetailType } from "@/types/Subject";

export function getSubjectTabs(schoolId: string, subject: SubjectDetailType) {
  const SUBJECT_TABS = [
    {
      value: "documents",
      label: "Documents",
      content: (
        <DocumentsTab schoolId={schoolId} subjectId={subject.id}></DocumentsTab>
      ),
    },
    {
      value: "students",
      label: "Students",
      content: <StudentsTabContent schoolId={schoolId} subject={subject} />,
    },
    {
      value: "assignments",
      label: "Assignments",
      content: <div>Assignments</div>,
    },
    {
      value: "marks",
      label: "Marks",
      content: <div>Marks</div>,
    },
  ] as const;
  return SUBJECT_TABS;
}
