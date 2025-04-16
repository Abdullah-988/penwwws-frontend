"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { SubjectDetailType } from "@/types/Subject";
import { RefObject } from "react";
import { ResetSelectionType } from "@/components/shared/DataTable";

type Props = {
  schoolId: string;
  selectedMemberIds: number[];
  subject: SubjectDetailType;
  resetSelectionRef?: RefObject<ResetSelectionType | null>;
  className?: string;
};

export default function UnassignSubject({
  selectedMemberIds,
  schoolId,
  subject,
  resetSelectionRef,
  className,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();

  async function handleUnassign() {
    const token = await getCookie("token");

    await axios
      .delete(`/school/${schoolId}/subject/${subject.id}/member`, {
        headers: { Authorization: token },
        data: { userIds: selectedMemberIds },
      })
      .then(() => {
        router.refresh();
        if (resetSelectionRef?.current) {
          resetSelectionRef.current?.resetSelection();
        }
        toast({
          title: "Success",
          description: `Member(s) have been successfully unassigned to ${subject.name}.`,
        });
      })
      .catch((err: AxiosError) => {
        toast({
          title: "Error",
          description:
            (err.response?.data as string) ||
            `Failed to unassign member(s) to ${subject.name}. Please try again.`,
          variant: "destructive",
        });
      });
  }

  return (
    <Button
      onClick={handleUnassign}
      size="sm"
      className={clsx(
        "text-destructive bg-destructive/10 hover:text-destructive hover:bg-destructive/15 border-none",
        className,
      )}
    >
      <Trash2 size={6} />
      Unassign subject
    </Button>
  );
}
