import Stats from "@/components/features/dashboard/home/Stats";
import InviteMember from "@/components/features/dashboard/home/InviteMember";
import axios from "@/lib/axiosInstance";
import { columns } from "@/components/shared/columns";
import { MembersTable } from "@/components/shared/members-table";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

async function getMembers(schoolId: string) {
  const token = await getCookie("token", { cookies });
  const res = await axios.get(`/school/${schoolId}/member`, {
    headers: { Authorization: token },
  });
  return res.data;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  const members = await getMembers(schoolId);
  return (
    <div className="w-full px-6">
      <Stats schoolId={schoolId} />
      <div className="flex w-full items-center justify-between py-6">
        <h1 className="text-primary text-xl font-bold">Members</h1>
        <InviteMember schoolId={schoolId} />
      </div>
      <MembersTable data={members} columns={columns} />
    </div>
  );
}
