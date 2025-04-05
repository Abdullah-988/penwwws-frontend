import Link from "next/link";
import Image from "next/image";
import { SubjectType } from "@/types/Subject";
import { TeachersAvatars } from "@/components/shared/TeacherAvatars";

type Props = {
  subject: SubjectType;
  schoolId: string;
};

export default function SubjectCard({ subject, schoolId }: Props) {
  return (
    <Link
      href={`/school/${schoolId}/subjects/${subject.id}`}
      className="rounded-lg border"
    >
      {subject.imageUrl && (
        <Image
          src={subject.imageUrl}
          alt={subject.name}
          width={200}
          height={150}
          className="h-[150px] w-full rounded-t-lg object-cover"
        />
      )}
      <div className="flex h-20 flex-col justify-start">
        <h2 className="mt-3 px-2 font-semibold">{subject.name}</h2>
        <TeachersAvatars teachers={subject.teachers} />
      </div>
    </Link>
  );
}
