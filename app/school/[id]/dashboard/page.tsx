import Stats from "@/components/features/dashboard/home/Stats";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  return (
    <div className="h-full w-full px-6">
      <h1 className="text-primary pb-6 text-xl font-bold">Home</h1>
      <Stats schoolId={schoolId} />
    </div>
  );
}
