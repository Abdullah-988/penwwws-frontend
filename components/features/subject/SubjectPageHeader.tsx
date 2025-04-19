"use client";

import { TeachersAvatars } from "@/components/shared/TeacherAvatars";
import { SubjectDetailType } from "@/types/Subject";
import Image from "next/image";
import EditSubject from "@/components/features/subject/EditSubject";
import DeleteSubject from "./DeleteSubject";
import { SchoolUserType } from "@/types/SchoolUser";

type Props = {
  schoolId: string;
  subject: SubjectDetailType;
  user: SchoolUserType;
};

export default function SubjectPageHeader({ subject, schoolId, user }: Props) {
  const teachers = subject.users.filter((user) => user.role === "TEACHER");

  return (
    <section className="flex w-full justify-between gap-10 md:h-36">
      <div className="flex flex-col justify-between">
        <div className="flex flex-row items-start gap-2 md:items-center">
          <h1 className="text-lg font-bold sm:text-2xl md:text-5xl">
            {subject.name}{" "}
          </h1>
          {user.role !== "STUDENT" && (
            <div className="flex h-10 items-end gap-2">
              <EditSubject subject={subject} schoolId={schoolId} />
              <DeleteSubject subject={subject} schoolId={schoolId} />
            </div>
          )}
        </div>
        <TeachersAvatars teachers={teachers} className="md:size-12" />
      </div>
      {subject.imageUrl && (
        <Image
          src={subject.imageUrl}
          width={400}
          height={250}
          alt={"Subject image"}
          className="size-40 rounded-md object-cover md:h-auto md:w-auto md:p-0"
          priority
        />
      )}
    </section>
  );
}
