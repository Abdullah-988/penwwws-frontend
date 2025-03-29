import { getInitials } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubjectType } from "@/types/Subject";

type Props = {
  subject: SubjectType;
  schoolId: string;
};

export default function SubjectCard({ subject, schoolId }: Props) {
  const MAX_DISPLAYED_TEACHERS = 5;
  return (
    <Link
      href={`/school/${schoolId}/subjects/${subject.id}`}
      className="overflow-hidden rounded-lg border"
    >
      <div className="flex h-full flex-col items-start justify-between">
        {subject.imageUrl && (
          <Image
            src={subject.imageUrl}
            alt={subject.name}
            width={200}
            height={150}
            className="h-[150px] w-full object-cover"
          />
        )}
        <h2 className="mt-3 px-2 font-semibold">{subject.name}</h2>

        <div className="flex items-center justify-start p-2">
          {subject.teachers
            .slice(0, MAX_DISPLAYED_TEACHERS)
            .map((teacher, index) => (
              <Avatar
                key={teacher.id}
                className="border-background size-8 rounded-full border-2"
                style={{
                  zIndex: subject.teachers.length - index,
                  right: index * 12,
                }}
              >
                <AvatarImage src={teacher.avatarUrl} alt={teacher.fullName} />
                <AvatarFallback>{getInitials(teacher.fullName)}</AvatarFallback>
              </Avatar>
            ))}
          {subject.teachers &&
            subject.teachers.length > MAX_DISPLAYED_TEACHERS && (
              <Avatar
                style={{
                  zIndex: 1,
                  right: MAX_DISPLAYED_TEACHERS * 10,
                }}
                className="border-background size-8 rounded-full border-2"
              >
                <AvatarFallback>
                  +{subject.teachers.length - MAX_DISPLAYED_TEACHERS}
                </AvatarFallback>
              </Avatar>
            )}{" "}
        </div>
      </div>
    </Link>
  );
}
