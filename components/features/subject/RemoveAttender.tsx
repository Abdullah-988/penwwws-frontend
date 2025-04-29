"use client";

import { useRouter } from "next/navigation";
import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { SessionType } from "@/types/session";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Props = {
  schoolId: string;
  attendanceId: number;
  subjectId: number;
  session: SessionType;
};

export default function RemoveAttenders({
  schoolId,
  attendanceId,
  subjectId,
  session,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();

  async function handleRemove() {
    const token = await getCookie("token");

    await axios
      .delete(
        `/school/${schoolId}/subject/${subjectId}/session/${session.id}/attenders/${attendanceId}`,
        {
          headers: { Authorization: token },
        },
      )
      .then(() => {
        router.refresh();
        toast({
          title: "Success",
          description:
            "Student(s) have been successfully removed from attenders.",
        });
      })
      .catch((err: AxiosError) => {
        toast({
          title: "Error",
          description:
            (err.response?.data as string) ||
            "Failed to remove student(s). Please try again.",
          variant: "destructive",
        });
      });
  }

  return (
    <DropdownMenuItem
      className="hover:text-destructive text-destructive"
      onClick={handleRemove}
    >
      Remove
    </DropdownMenuItem>
  );
}
