import SubjectsList from "@/components/features/dashboard/subjects/SubjectsList";
import AddSubject from "@/components/features/dashboard/subjects/AddSubject";

export default async function SubjectsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  return (
    <div className="relative flex w-full flex-col gap-8 p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-semibold">Subjects</h1>
        <AddSubject schoolId={schoolId} />
      </div>
      <SubjectsList schoolId={schoolId} />
    </div>
  );
}
