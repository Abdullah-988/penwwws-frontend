import Stats from "@/components/features/dashboard/home/Stats";
import InviteMember from "@/components/features/dashboard/home/InviteMember";
import axios from "@/lib/axiosInstance";
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
    <div className="w-screen px-6 sm:w-auto">
      <Stats schoolId={schoolId} />
      <div className="flex w-full items-center justify-between pt-6">
        <h1 className="text-primary text-xl font-bold">Members</h1>
        <InviteMember schoolId={schoolId} />
      </div>
      <MembersTable schoolId={schoolId} data={members} />
    </div>
  );
}
