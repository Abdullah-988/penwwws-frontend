import AddSubjectMembersModal from "@/components/features/subject/AddSubjectMembersModal";
import AssignmentTabContent from "@/components/features/subject/AssignmentTabContent";
import AttendanceTabContent from "@/components/features/subject/AttendanceTabContent";
import DocumentsTab from "@/components/features/subject/DocumentsTab";
import GradesTabContent from "@/components/features/subject/GradesTabContent";
import LogsTabContent from "@/components/features/subject/LogsTabContent";
import MarksTabContent from "@/components/features/subject/MarksTabContent";
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
      value: "members",
      label: "Members",
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
      value: "attendance",
      label: "Attendance",
      content: (
        <AttendanceTabContent
          schoolId={schoolId}
          subjectId={subject.id}
          user={user}
        />
      ),
    },
  ];

  if (user.role !== "STUDENT") {
    SUBJECT_TABS.push({
      value: "marks",
      label: "Marks",
      content: <MarksTabContent schoolId={schoolId} subjectId={subject.id} />,
    });
  } else {
    SUBJECT_TABS.push({
      value: "grades",
      label: "Grades",
      content: <GradesTabContent schoolId={schoolId} subjectId={subject.id} />,
    });
  }
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
    SUBJECT_TABS.push({
      value: "logs",
      label: "Logs",
      content: <LogsTabContent schoolId={schoolId} subjectId={subject.id} />,
    });
  }
  return SUBJECT_TABS;
}
