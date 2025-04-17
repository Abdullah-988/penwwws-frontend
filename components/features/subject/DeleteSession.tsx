"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, LoaderCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { SessionType } from "@/types/session";

type Props = {
  schoolId: string;
  subjectId: number;
  session: SessionType;
};

export default function DeleteSession({ schoolId, subjectId, session }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["session", session.name],
    mutationFn: async () => {
      const token = await getCookie("token");
      await axios.delete(
        `/school/${schoolId}/subject/${subjectId}/session/${session.id}`,
        { headers: { Authorization: token } },
      );
    },
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Session Deleted",
        description: `The session ${session.name} has been successfully deleted.`,
      });
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Couldn't Delete Session",
        description:
          (err.response?.data as string) ||
          `There was an error deleting the session ${session.name}. Please try again.`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsModalOpen(false);
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-destructive/10 text-destructive hover:bg-destructive/15"
        >
          <Trash2 size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {session.name} session</DialogTitle>
          <DialogDescription>
            By clicking delete, the {session.name} session and all its
            attendance records will be permanently deleted. This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => mutate()} variant="destructive">
            {isPending ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              <span>Delete</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
