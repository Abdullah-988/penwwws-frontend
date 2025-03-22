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
import { Button } from "../ui/button";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { GroupItem } from "./groupItem";
import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/fetches/groups";

type Props = {
  schoolId: string;
  selectedMemberIds: number[];
};

const flattenGroups = (groups: GroupType[]): GroupType[] =>
  groups.flatMap((g) => [g, ...flattenGroups(g.children ?? [])]);

export default function AssignGroup({ selectedMemberIds, schoolId }: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const { data: groups } = useQuery<GroupType[]>({
    queryKey: ["groups", schoolId],
    queryFn: () => getGroups(schoolId),
  });

  const flatGroups = groups ? flattenGroups(groups) : [];
  const groupNameMap = new Map(flatGroups.map((g) => [g.id, g.name]));

  async function handleAssignGroup(
    selectedMemberIds: number[],
    schoolId: string,
    groupId: number,
    assignedGroupName: string | undefined,
  ) {
    const token = await getCookie("token");

    await axios
      .post(
        `/school/${schoolId}/group/${groupId}/member`,
        { userIds: selectedMemberIds },
        {
          headers: { Authorization: token },
        },
      )
      .then(() => {
        router.refresh();
        toast({
          title: "Success",
          description: `Member(s) have been successfully assigned to ${assignedGroupName}.`,
        });
      })
      .catch((err: AxiosError) => {
        toast({
          title: "Error",
          description:
            (err.response?.data as string) ||
            `Failed to assign member(s) to ${assignedGroupName}. Please try again.`,
          variant: "destructive",
        });
      });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <Users className="text-primary" size={6} />
          Assign group
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
                handleAssignGroup(
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
