import Stats from "@/components/features/dashboard/home/Stats";
import InviteMember from "@/components/features/dashboard/home/InviteMember";
import { MembersTable } from "@/components/features/dashboard/home/HomeMembersTable";
import { getMembers } from "@/fetches/member";

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
