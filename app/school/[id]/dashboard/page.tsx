import Stats from "@/components/features/dashboard/home/Stats";
import InviteMember from "@/components/features/dashboard/home/InviteMember";
import { HomeTable } from "@/components/features/dashboard/home/HomeTable";
import { getMembers } from "@/fetches/member";
import { MembershipRequest } from "@/components/features/dashboard/home/MembershipRequest";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  const members = await getMembers(schoolId);

  return (
    <div className="w-screen px-6 pb-20 sm:w-auto">
      <Stats schoolId={schoolId} />
      <div className="flex w-full flex-col justify-between pt-6 sm:flex-row sm:items-center">
        <h1 className="text-primary text-xl font-bold">Members</h1>
        <div className="flex flex-row items-center gap-3">
          <MembershipRequest schoolId={schoolId} />
          <InviteMember schoolId={schoolId} />
        </div>
      </div>
      <HomeTable schoolId={schoolId} data={members} />
    </div>
  );
}
