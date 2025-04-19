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
import { useQuery } from "@tanstack/react-query";
import { DropdownMenuGroupItem } from "./DropdownMenuGroupItem";
import { getGroups } from "@/fetches/groups";
import { Trash2 } from "lucide-react";
import clsx from "clsx";

type Props = {
  schoolId: string;
  selectedMemberIds: number[];
  unassignGroupMode: "single" | "multiple";
  className?: string;
  groupId?: number;
};

const flattenGroups = (groups: GroupType[]): GroupType[] =>
  groups.flatMap((g) => [g, ...flattenGroups(g.children ?? [])]);

export default function UnassignGroup({
  selectedMemberIds,
  schoolId,
  className,
  unassignGroupMode,
  groupId,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const { data: groups } = useQuery<GroupType[]>({
    queryKey: ["groups", schoolId],
    queryFn: () => getGroups(schoolId),
    enabled: unassignGroupMode === "multiple",
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

  if (unassignGroupMode === "single" && groupId) {
    return (
      <Button
        onClick={() =>
          handleUnassign(
            selectedMemberIds,
            schoolId,
            groupId,
            groupNameMap.get(groupId),
          )
        }
        size="sm"
        disabled={selectedMemberIds.length === 0}
        className={clsx(
          "text-destructive bg-destructive/10 hover:text-destructive hover:bg-destructive/15 size-8 w-fit border-none",
          className,
        )}
      >
        <Trash2 size={6} />
        Unassign group
      </Button>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={clsx(
            "text-destructive bg-destructive/10 hover:text-destructive hover:bg-destructive/15 size-8 w-fit border-none",
            className,
          )}
        >
          <Trash2 size={6} />
          Unassign group
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {groups &&
          groups.map((group) => (
            <DropdownMenuGroupItem
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
        {groups?.length === 0 && (
          <span className="text-muted-foreground px-2 text-sm">No groups</span>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
