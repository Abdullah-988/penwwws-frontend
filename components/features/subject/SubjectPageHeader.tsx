"use client";

import { TeachersAvatars } from "@/components/shared/TeacherAvatars";
import { SubjectDetailType } from "@/types/Subject";
import Image from "next/image";
import EditSubject from "@/components/features/subject/EditSubject";
import { Library } from "lucide-react";

type Props = {
  schoolId: string;
  subject: SubjectDetailType;
};

export default function SubjectPageHeader({ subject, schoolId }: Props) {
  const teachers = subject.users.filter((user) => user.role === "TEACHER");

  return (
    <section className="flex w-full justify-between gap-10 md:h-60">
      <div className="flex flex-col justify-between">
        <div className="flex items-end gap-2">
          <h1 className="text-2xl font-bold md:text-5xl">{subject.name} </h1>
          <EditSubject subject={subject} schoolId={schoolId} />
        </div>
        <TeachersAvatars teachers={teachers} size="lg" />
      </div>
      {subject.imageUrl ? (
        <Image
          src={subject.imageUrl}
          width={400}
          height={250}
          alt={"Subject image"}
          className="size-40 rounded-md object-cover md:h-auto md:w-auto md:p-0"
        />
      ) : (
        <Library className="text-primary size-54" />
      )}
    </section>
  );
}
