import AddAssignment from "@/components/features/subject/AddAssignment";

type Props = {
  schoolId: string;
  subjectId: number;
};
export default function AssignmentTabContent({ schoolId, subjectId }: Props) {
  return (
    <div>
      <div className="mt-5 flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <AddAssignment schoolId={schoolId} subjectId={subjectId} />
      </div>
    </div>
  );
}
