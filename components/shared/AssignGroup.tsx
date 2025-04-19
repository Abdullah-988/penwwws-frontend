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
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { DropdownMenuGroupItem } from "@/components/shared/DropdownMenuGroupItem";
import { useQuery } from "@tanstack/react-query";
import { getGroups } from "@/fetches/groups";
import clsx from "clsx";

type Props = {
  schoolId: string;
  selectedMemberIds: number[];
  assignGroupMode: "single" | "multiple";
  className?: string;
  groupId?: number;
};

const flattenGroups = (groups: GroupType[]): GroupType[] =>
  groups.flatMap((g) => [g, ...flattenGroups(g.children ?? [])]);

export default function AssignGroup({
  selectedMemberIds,
  schoolId,
  className,
  assignGroupMode,
  groupId,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const { data: groups } = useQuery<GroupType[]>({
    queryKey: ["groups", schoolId],
    queryFn: () => getGroups(schoolId),
    enabled: assignGroupMode === "multiple",
  });

  const flatGroups = groups ? flattenGroups(groups) : [];
  const groupNameMap = new Map(flatGroups.map((g) => [g.id, g.name]));

  async function handleAssign(
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
  if (assignGroupMode === "single" && groupId) {
    return (
      <Button
        onClick={() =>
          handleAssign(
            selectedMemberIds,
            schoolId,
            groupId,
            groupNameMap.get(groupId),
          )
        }
        disabled={selectedMemberIds.length === 0}
        className={clsx(
          "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary border-none",
          className,
        )}
        size="sm"
        variant="outline"
      >
        <Users size={6} />
        Assign group
      </Button>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={clsx(
            "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary border-none",
            className,
          )}
          size="sm"
          variant="outline"
        >
          <Users size={6} />
          Assign group
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
                handleAssign(
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
