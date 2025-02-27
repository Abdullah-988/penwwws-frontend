import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getSubjects } from "@/fetches/subjects";
import { getUser } from "@/fetches/userServer";
import { getInitials } from "@/lib/utils";
import { SubjectType } from "@/types/Subject";
import { AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import PenwwwsIcon from "@/components/icons/Penwwws";

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const schoolId = (await params).id;
  const subjects: SubjectType[] = await getSubjects(schoolId);
  const user = await getUser();

  const currentDate = format(new Date(), "EEE d MMMM yyyy");

  return (
    <>
      <nav className="fixed flex w-full border-b bg-white p-4 px-8">
        <Link
          href="/"
          className="text-primary flex items-center gap-2 rounded-xl p-2 font-semibold"
        >
          <PenwwwsIcon className="size-8" />
        </Link>
      </nav>
      <div className="p-8">
        <header className="mt-16 mb-4">
          <h1 className="text-3xl font-medium">Hello, {user.fullName} 👋</h1>
          <h2 className="mt-1 text-lg font-medium text-neutral-400">
            Today, {currentDate}
          </h2>
        </header>
        <h2 className="text-xl font-medium">Your Subjects</h2>
        <div className="mt-4 flex flex-col items-start gap-4 md:flex-row md:flex-wrap">
          {subjects.map((subject) => (
            <Link
              href={`/school/${schoolId}/subject/${subject.id}`}
              className="w-full overflow-hidden rounded-xl border border-neutral-200 md:w-[300px]"
              key={subject.id}
            >
              {!!subject.imageUrl && (
                <Image
                  src={subject.imageUrl}
                  width={200}
                  height={100}
                  className="h-[150px] w-full object-cover"
                  priority={true}
                  draggable={false}
                  alt={subject.name}
                />
              )}
              <h1 className="mt-2 px-2 text-lg font-semibold">
                {subject.name}
              </h1>
              <div className="flex p-2">
                {subject.teachers.map((teacher, index) => (
                  <Avatar
                    key={teacher.id}
                    className="border-background size-8 rounded-full border-[2px]"
                    style={{
                      zIndex: subject.teachers.length - index,
                      right: 12 * index,
                    }}
                  >
                    <AvatarFallback>
                      {getInitials(teacher.fullName)}
                    </AvatarFallback>
                    <AvatarImage src={teacher.avatarUrl} />
                  </Avatar>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
