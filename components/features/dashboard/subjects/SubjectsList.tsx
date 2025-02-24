"use client";

import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { SubjectType } from "@/types/Subject";
import SubjectCard from "./SubjectCard";
import { SubjectCardSkeleton } from "./SubjectCardSkeleton";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";

type Props = {
  schoolId: string;
};

async function getSubjects(schoolId: string, search: string) {
  const token = await getCookie("token");
  const res = await axios.get(`/school/${schoolId}/subject`, {
    headers: { Authorization: token },
  });
  if (search) {
    return res.data.filter((subject: SubjectType) =>
      subject.name.toLowerCase().includes(search.toLowerCase()),
    );
  } else {
    return res.data;
  }
}

export default function SubjectsList({ schoolId }: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data: subjects = [], isLoading } = useQuery<SubjectType[]>({
    queryKey: ["subjects", schoolId, debouncedSearch],
    queryFn: () => getSubjects(schoolId, debouncedSearch),
    enabled: !!schoolId,
  });

  return (
    <>
      <Input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        className="w-96 p-2"
        placeholder="Search for Subject"
      />

      {isLoading ? (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6).keys()].map((key) => (
            <SubjectCardSkeleton key={key} />
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <div>No result</div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              schoolId={schoolId}
            />
          ))}
        </div>
      )}
    </>
  );
}
