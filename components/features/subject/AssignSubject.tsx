"use client";

import { useRouter } from "next/navigation";

import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { SubjectDetailType } from "@/types/Subject";
import { RefObject } from "react";
import { ResetSelectionType } from "@/components/shared/DataTable";
import { Library } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";

type Props = {
  schoolId: string;
  selectedMemberIds: number[];
  subject: SubjectDetailType;
  resetSelectionRef?: RefObject<ResetSelectionType | null>;
  className?: string;
};

export default function AssignSubject({
  selectedMemberIds,
  schoolId,
  subject,
  resetSelectionRef,
  className,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();

  async function handleAssign(role: "student" | "teacher") {
    const token = await getCookie("token");

    await axios
      .post(
        `/school/${schoolId}/subject/${subject.id}/member`,
        {
          userIds: selectedMemberIds,
          as: role,
        },
        { headers: { Authorization: token } },
      )
      .then(() => {
        router.refresh();
        if (resetSelectionRef?.current) {
          resetSelectionRef.current?.resetSelection();
        }
        toast({
          title: "Success",
          description: `Member(s) have been successfully assigned to ${subject.name}.`,
        });
      })
      .catch((err: AxiosError) => {
        toast({
          title: "Error",
          description:
            (err.response?.data as string) ||
            `Failed to assign member(s) to ${subject.name}. Please try again.`,
          variant: "destructive",
        });
      });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={selectedMemberIds.length === 0}
          className={clsx(
            "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary border-none",
            className,
          )}
          size="sm"
          variant="outline"
        >
          <Library size={6} />
          Assign as
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleAssign("student")}>
          Student
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAssign("teacher")}>
          Teacher
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
