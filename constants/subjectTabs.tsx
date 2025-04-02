import AddSubjectMembersModal from "@/components/features/subject/AddSubjectMembersModal";
import DocumentsTab from "@/components/features/subject/Documents";
import StudentsTabContent from "@/components/features/subject/StudentsTabContent";
import { SchoolUserType } from "@/types/SchoolUser";
import { SubjectDetailType } from "@/types/Subject";

export function getSubjectTabs(
  schoolId: string,
  subject: SubjectDetailType,
  user: SchoolUserType,
) {
  console.log("hello", user.role !== "STUDENT");
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
      content: (
        <StudentsTabContent user={user} schoolId={schoolId} subject={subject}>
          {user.role !== "STUDENT" && (
            <AddSubjectMembersModal schoolId={schoolId} subject={subject} />
          )}
        </StudentsTabContent>
      ),
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
