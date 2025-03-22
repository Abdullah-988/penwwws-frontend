"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "@/lib/axiosInstance";
import { GroupType } from "@/types/Group";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { GroupItem } from "@/components/shared/groupItem";
import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/fetches/groups";
import { Trash2 } from "lucide-react";

type Props = {
  schoolId: string;
  selectedMemberIds: number[];
};

const flattenGroups = (groups: GroupType[]): GroupType[] =>
  groups.flatMap((g) => [g, ...flattenGroups(g.children ?? [])]);

export default function UnAssignGroup({ selectedMemberIds, schoolId }: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const { data: groups } = useQuery<GroupType[]>({
    queryKey: ["groups", schoolId],
    queryFn: () => getGroups(schoolId),
  });

  const flatGroups = groups ? flattenGroups(groups) : [];
  const groupNameMap = new Map(flatGroups.map((g) => [g.id, g.name]));

  async function handleUnassign(
    selectedMemberIds: number[],
    schoolId: string,
    groupId: number,
    UnAssignedGroupName: string | undefined,
  ) {
    const token = await getCookie("token");

    await axios
      .delete(`/school/${schoolId}/group/${groupId}/member`, {
        headers: { Authorization: token },
        data: { userIds: selectedMemberIds },
      })
      .then(() => {
        router.refresh();
        toast({
          title: "Success",
          description: `Member(s) have been successfully unassigned to ${UnAssignedGroupName}.`,
        });
      })
      .catch((err: AxiosError) => {
        toast({
          title: "Error",
          description:
            (err.response?.data as string) ||
            `Failed to unassign member(s) to ${UnAssignedGroupName}. Please try again.`,
          variant: "destructive",
        });
      });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive bg-destructive/10 hover:text-destructive hover:bg-destructive/15 border-none"
        >
          <Trash2 size={6} />
          Unassign group
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {groups &&
          groups.map((group) => (
            <GroupItem
              key={group.id}
              group={group}
              selectedGroupIds={[]}
              handleGroupClick={(groupId) =>
                handleUnassign(
                  selectedMemberIds,
                  schoolId,
                  groupId,
                  groupNameMap.get(groupId),
                )
              }
            />
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
