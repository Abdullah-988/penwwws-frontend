import { SchoolUserType } from "@/types/SchoolUser";
import { StudentAssignmentCard } from "./StudentAssignmentCard";
import { TeacherAssignmentCard } from "./TeacherAssignmentCard";
import { AssignmentType } from "@/types/AssignmentType";

type Props = {
  schoolId: string;
  subjectId: number;
  user: SchoolUserType;
  assignments: AssignmentType[];
};
export default function AssignmentsList({
  schoolId,
  subjectId,
  user,
  assignments,
}: Props) {
  return (
    <section className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {assignments.map((assignment) =>
        user.role !== "STUDENT" ? (
          <TeacherAssignmentCard
            key={assignment.id}
            schoolId={schoolId}
            subjectId={subjectId}
            assignment={assignment}
          />
        ) : (
          <StudentAssignmentCard
            key={assignment.id}
            schoolId={schoolId}
            subjectId={subjectId}
            assignment={assignment}
          />
        ),
      )}
    </section>
  );
}
