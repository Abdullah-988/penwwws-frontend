import { getSubjects } from "@/fetches/subjects";
import { getUser } from "@/fetches/schoolUser";
import { SubjectType } from "@/types/Subject";
import { format } from "date-fns";
import SubjectCard from "@/components/features/dashboard/subjects/SubjectCard";
import Navbar from "@/components/shared/Navbar";

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  const subjects: SubjectType[] = await getSubjects(schoolId);
  const user = await getUser(schoolId);
  const currentDate = format(new Date(), "EEE d MMMM yyyy");

  return (
    <>
      <Navbar schoolId={schoolId} user={user} />
      <div className="p-8">
        <header className="mt-16 mb-4">
          <h1 className="text-3xl font-semibold">Hello, {user.fullName} 👋</h1>
          <h2 className="mt-1 text-lg font-medium text-neutral-400">
            Today, {currentDate}
          </h2>
        </header>
        <h2 className="text-xl font-medium">Your Subjects</h2>
        <div className="mt-4 grid w-full grid-cols-1 items-start gap-2 md:grid-cols-3 lg:grid-cols-4">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              schoolId={schoolId}
            />
          ))}
        </div>
      </div>
    </>
  );
}
