import GroupList from "@/components/features/dashboard/groups/GroupsList";
import AddGroup from "@/components/features/dashboard/groups/AddGroup";
import { getMembers } from "@/fetches/member";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { GroupType } from "@/types/Group";
import axios from "@/lib/axiosInstance";
import { formatGroups } from "@/lib/utils";

async function getGroups(schoolId: string) {
  const token = await getCookie("token", { cookies });
  const res = await axios.get<GroupType[]>(`/school/${schoolId}/group`, {
    headers: { Authorization: token },
  });
  return formatGroups(res.data);
}

export default async function GroupsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  const members = await getMembers(schoolId);
  const groups = await getGroups(schoolId);
  return (
    <div className="relative flex w-full flex-col gap-8 p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-semibold">Groups</h1>
        <AddGroup groups={groups} schoolId={schoolId} />
      </div>
      <GroupList schoolId={schoolId} groups={groups} data={members} />
    </div>
  );
}
