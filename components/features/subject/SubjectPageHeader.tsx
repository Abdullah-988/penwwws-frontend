"use client";

import { TeachersAvatars } from "@/components/shared/TeacherAvatars";
import { SubjectDetailType } from "@/types/Subject";
import { Pencil } from "lucide-react";
import Image from "next/image";

type Props = {
  subject: SubjectDetailType;
};

export default function SubjectPageHeader({ subject }: Props) {
  const teachers = subject.users.filter((user) => user.role === "TEACHER");
  return (
    <section className="flex w-full justify-between gap-10 md:h-60">
      <div className="flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold md:text-5xl">{subject.name} </h1>
          <Pencil />
        </div>
        <TeachersAvatars teachers={teachers} size="lg" />
      </div>
      <Image
        src={subject.imageUrl}
        width={400}
        height={250}
        alt={"Subject image"}
        className="size-40 w-[30vw] rounded-md object-cover md:h-auto md:p-0"
      />{" "}
    </section>
  );
}
