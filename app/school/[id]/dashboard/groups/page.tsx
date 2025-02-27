import GroupList from "@/components/features/dashboard/groups/GroupsList";
import AddGroup from "@/components/features/dashboard/groups/AddGroup";

export default async function GroupsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  return (
    <div className="relative flex w-full flex-col gap-8 p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-semibold">Groups</h1>
        <AddGroup schoolId={schoolId} />
      </div>
      <GroupList schoolId={schoolId} />
    </div>
  );
}
