"use client";

import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { GroupType } from "@/types/Group";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
type Props = {
  schoolId: string;
};

async function getGroup(schoolId: string) {
  const token = await getCookie("token");
  const res = await axios.get(`/school/${schoolId}/group`, {
    headers: { Authorization: token },
  });
  return res.data;
}

export default function GroupList({ schoolId }: Props) {
  const { data: group, isLoading } = useQuery<GroupType[]>({
    queryKey: ["groups"],
    queryFn: () => getGroup(schoolId),
  });

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="border-border flex items-center justify-between rounded-xl border p-4"
          >
            <div className="flex h-full flex-col items-start justify-between gap-2">
              <Skeleton className="h-6 w-36" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  //TODO: Add default image url value
  if (group?.length === 0) return <div>No groups yet</div>;

  if (!group) return null;
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {group.map((group) => (
        <div
          key={group.id}
          className="border-border flex items-center justify-between rounded-xl border p-4"
        >
          <div className="flex h-full flex-col items-start justify-between gap-2">
            <h2 className="font-semibold">{group.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <h1>
              {new Intl.NumberFormat("en-US").format(group._count.members)}
            </h1>
          </div>
        </div>
      ))}
    </div>
  );
}
