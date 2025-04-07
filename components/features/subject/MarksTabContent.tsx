import { SchoolUserType } from "@/types/SchoolUser";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import axios from "@/lib/axiosInstance";
import MarksTable from "@/components/features/subject/MarksTable";
import AddTableRow from "@/components/features/subject/AddTableRow";

type Props = {
  schoolId: string;
  subjectId: number;
  user: SchoolUserType;
};

async function getTable(schoolId: string, subjectId: number) {
  const token = await getCookie("token", { cookies });
  const res = await axios.get(
    `/school/${schoolId}/subject/${subjectId}/table`,
    {
      headers: { Authorization: token },
    },
  );
  return res.data;
}
export default async function MarksTabContent({
  schoolId,
  subjectId,
  user,
}: Props) {
  const table = await getTable(schoolId, subjectId);
  console.log(table);
  console.log("hello dude");
  return (
    <section className="my-5 flex w-full flex-col items-center justify-center">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">Marks table design</h1>
        <AddTableRow schoolId={schoolId} subjectId={subjectId} />
      </div>
      <MarksTable table={table} user={user} />
    </section>
  );
}
