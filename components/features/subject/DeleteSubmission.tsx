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

type Props = {
  schoolId: string;
  subjectId: number;
  assignmentId: number;
  submissionId: number;
};

export default function DeleteSubmission({
  schoolId,
  subjectId,
  assignmentId,
  submissionId,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["submission", submissionId],
    mutationFn: async () => {
      const token = await getCookie("token");
      await axios.delete(
        `/school/${schoolId}/subject/${subjectId}/assignment/${assignmentId}/submission/${submissionId}`,
        { headers: { Authorization: token } },
      );
    },
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Submission Deleted",
        description: "The submission has been permanently removed.",
      });
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Deletion Failed",
        description:
          (err.response?.data as string) ||
          "Failed to delete submission. Please try again.",
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
          <DialogTitle>Delete Submission</DialogTitle>
          <DialogDescription>
            This will permanently delete this submission. This action cannot be
            undone.
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
