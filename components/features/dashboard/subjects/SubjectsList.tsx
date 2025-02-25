"use client";

import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { SubjectType } from "@/types/Subject";
import SubjectCard from "./SubjectCard";
import { SubjectCardSkeleton } from "./SubjectCardSkeleton";

type Props = {
  schoolId: string;
};

async function getSubjects(schoolId: string) {
  const token = await getCookie("token");
  const res = await axios.get(`/school/${schoolId}/subject`, {
    headers: { Authorization: token },
  });
  return res.data;
}

export default function SubjectsList({ schoolId }: Props) {
  const { data: subjects, isLoading } = useQuery<SubjectType[]>({
    queryKey: ["subjects"],
    queryFn: () => getSubjects(schoolId),
  });

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6).keys()].map((key) => (
          <SubjectCardSkeleton key={key} />
        ))}
      </div>
    );
  }
  //  TODO: Add default image url value
  if (subjects?.length === 0) return <div>No subjects yet</div>;
  if (!subjects) return null;
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} schoolId={schoolId} />
      ))}
    </div>
  );
}
