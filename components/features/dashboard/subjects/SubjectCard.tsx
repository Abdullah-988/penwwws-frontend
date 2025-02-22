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
      href={`/school/${schoolId}/dashboard/subject/${subject.id}`}
      className="border-border flex items-center justify-between rounded-xl border p-4"
    >
      <div className="flex h-full flex-col items-start justify-between gap-2">
        <h2 className="font-semibold">{subject.name}</h2>

        <div className="flex items-center justify-start">
          {subject.teachers
            .slice(0, MAX_DISPLAYED_TEACHERS)
            .map((teacher, index) => (
              <Avatar
                key={teacher.id}
                className="border-background size-8 rounded-full border-2"
                style={{
                  zIndex: index,
                  right: index * 10,
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
      {subject.imageUrl && (
        <div className="relative size-24 overflow-hidden rounded-xl">
          <Image
            src={subject.imageUrl}
            alt={subject.name}
            fill
            className="rounded-xl object-cover"
          />
        </div>
      )}
    </Link>
  );
}
