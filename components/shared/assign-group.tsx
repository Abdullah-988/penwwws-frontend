"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "@/lib/axiosInstance";
import { GroupType } from "@/types/Group";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

async function getGroups(schoolId: string) {
  const token = await getCookie("token");
  const res = await axios(`/school/${schoolId}/group`, {
    headers: { Authorization: token },
  });
  return res.data;
}

type Props = {
  schoolId: string;
  selectedMemberIds: number[];
};

export default function AssignGroup({ selectedMemberIds, schoolId }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [groups, setGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    getGroups(schoolId).then((groups) => {
      setGroups(groups);
    });
  }, []);

  async function handleAssignGroup(
    selectedMemberIds: number[],
    schoolId: string,
    groupId: number,
    assignedGroup: GroupType,
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
          description: `Member(s) have been successfully assigned to ${assignedGroup?.name}.`,
        });
      })
      .catch((err: AxiosError) => {
        toast({
          title: "Error",
          description:
            (err.response?.data as string) ||
            `Failed to assign member(s) to ${assignedGroup?.name}. Please try again.`,
          variant: "destructive",
        });
      });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Users size={6} />
          Assign group
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {groups.map((group) => (
          <DropdownMenuItem key={group.id}>
            <Button
              variant="ghost"
              className="w-full"
              size="sm"
              onClick={() => {
                handleAssignGroup(selectedMemberIds, schoolId, group.id, group);
              }}
            >
              {" "}
              {group.name}
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
