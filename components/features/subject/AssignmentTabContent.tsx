import AddAssignment from "@/components/features/subject/AddAssignment";
import { SchoolUserType } from "@/types/SchoolUser";

type Props = {
  schoolId: string;
  subjectId: number;
  user: SchoolUserType;
};
export default function AssignmentTabContent({
  schoolId,
  subjectId,
  user,
}: Props) {
  return (
    <div>
      <div className="mt-5 flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">Assignments</h1>
        {user.role !== "STUDENT" && (
          <AddAssignment schoolId={schoolId} subjectId={subjectId} />
        )}
      </div>
    </div>
  );
}
