import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import axios from "@/lib/axiosInstance";
import AddSession from "@/components/features/subject/AddSession";
import SessionsList from "@/components/features/subject/SessionsList";
import { SessionType } from "@/types/session";

type Props = {
  schoolId: string;
  subjectId: number;
};

async function getSessions(schoolId: string, subjectId: number) {
  const token = await getCookie("token", { cookies });
  const res = await axios.get(
    `/school/${schoolId}/subject/${subjectId}/session`,
    {
      headers: { Authorization: token },
    },
  );
  return res.data;
}
export default async function AttendanceTabContent({
  schoolId,
  subjectId,
}: Props) {
  const sessions: SessionType[] = await getSessions(schoolId, subjectId);
  return (
    <div>
      <div className="mt-5 flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <AddSession schoolId={schoolId} subjectId={subjectId} />
      </div>
      <SessionsList
        sessions={sessions}
        schoolId={schoolId}
        subjectId={subjectId}
      />
    </div>
  );
}
