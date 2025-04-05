import AddAssignment from "@/components/features/subject/AddAssignment";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import axios from "@/lib/axiosInstance";
import { SchoolUserType } from "@/types/SchoolUser";
import AssignmentsList from "./AssignmentsList";
import { AssignmentType } from "@/types/AssignmentType";

type Props = {
  schoolId: string;
  subjectId: number;
  user: SchoolUserType;
};
async function getAssignments(schoolId: string, subjectId: number) {
  const token = await getCookie("token", { cookies });
  const res = await axios.get(
    `/school/${schoolId}/subject/${subjectId}/assignment`,
    {
      headers: { Authorization: token },
    },
  );
  return res.data;
}
export default async function AssignmentTabContent({
  schoolId,
  subjectId,
  user,
}: Props) {
  const assignments: AssignmentType[] = await getAssignments(
    schoolId,
    subjectId,
  );
  return (
    <div>
      <div className="mt-5 flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">Assignments</h1>
        {user.role !== "STUDENT" && (
          <AddAssignment schoolId={schoolId} subjectId={subjectId} />
        )}
      </div>
      <AssignmentsList
        assignments={assignments}
        schoolId={schoolId}
        subjectId={subjectId}
        user={user}
      />
    </div>
  );
}
