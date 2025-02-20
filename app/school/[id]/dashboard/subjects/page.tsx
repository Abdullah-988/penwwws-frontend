import AddSubject from "@/components/features/dashboard/subjects/addSubject";

export default async function SubjectsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  return (
    <div className="relative w-full p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold">Subjects</h1>
        <AddSubject schoolId={schoolId} />
      </div>
    </div>
  );
}
