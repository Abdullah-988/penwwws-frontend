import AddSubjectMembersModal from "@/components/features/subject/AddSubjectMembersModal";
import AssignmentTabContent from "@/components/features/subject/AssignmentTabContent";
import DocumentsTab from "@/components/features/subject/DocumentsTab";
import StudentsTabContent from "@/components/features/subject/StudentsTabContent";
import { SchoolUserType } from "@/types/SchoolUser";
import { SubjectDetailType } from "@/types/Subject";

export function getSubjectTabs(
  schoolId: string,
  subject: SubjectDetailType,
  user: SchoolUserType,
) {
  const SUBJECT_TABS = [
    {
      value: "documents",
      label: "Documents",
      content: (
        <DocumentsTab schoolId={schoolId} subject={subject} user={user} />
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
      content: (
        <AssignmentTabContent
          schoolId={schoolId}
          subjectId={subject.id}
          user={user}
        />
      ),
    },
    {
      value: "marks",
      label: "Marks",
      content: <div>Marks</div>,
    },
  ];

  return SUBJECT_TABS;
}
