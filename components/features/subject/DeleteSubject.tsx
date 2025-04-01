"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle as SpinnerIcon, Trash2 } from "lucide-react";
import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Props {
  schoolId: string;
  subjectId: string;
  subjectName: string;
}

export default function DeleteSubject({
  schoolId,
  subjectId,
  subjectName,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getCookie("token");
      return axios.delete(`/school/${schoolId}/subject/${subjectId}`, {
        headers: { Authorization: token },
      });
    },
    onSuccess: () => {
      router.push(`/school/${schoolId}/dashboard/subjects`);
      setIsOpen(false);
      toast({
        title: "Subject Deleted",
        description: `${subjectName} has been permanently deleted.`,
      });
    },
    onError: (error: AxiosError) => {
      console.error("Delete failed:", error.response?.data);
      toast({
        title: "Deletion Failed",
        description:
          (error.response?.data as string) || "Could not delete subject",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <section className="mt-6 flex items-center justify-between gap-10 rounded-md p-3 py-3">
        <div className="flex flex-col">
          <h1 className="text-destructive font-semibold">Delete Subject</h1>
          <p className="text-muted-foreground text-sm">
            Deleting this subject is irreversible and will remove all associated
            data. Please confirm before proceeding.
          </p>
        </div>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-destructive/10 text-destructive hover:bg-destructive/15"
            variant="destructive"
          >
            <Trash2 size={14} />
          </Button>
        </DialogTrigger>
      </section>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Subject</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong className="text-destructive">{subjectName}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <SpinnerIcon className="animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
