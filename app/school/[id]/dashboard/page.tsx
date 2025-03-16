import Stats from "@/components/features/dashboard/home/Stats";
import InviteMember from "@/components/features/dashboard/home/InviteMember";
import Members from "@/components/shared/Members";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  return (
    <div className="h-full w-full px-6">
      <Stats schoolId={schoolId} />
      <div className="flex w-full items-center justify-between py-6">
        <h1 className="text-primary text-xl font-bold">Members</h1>
        <InviteMember schoolId={schoolId} />
      </div>
      <Members schoolId={schoolId} />
    </div>
  );
}
