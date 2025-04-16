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
import { DocumentType } from "@/types/Document";

type Props = {
  schoolId: string;
  subjectId: number;
  document: DocumentType;
};

export default function DeleteDocument({
  schoolId,
  subjectId,
  document,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["document", document.topicId, document.id],
    mutationFn: async () => {
      const token = await getCookie("token");
      await axios.delete(
        `/school/${schoolId}/subject/${subjectId}/topic/${document.topicId}/document/${document.id}`,
        { headers: { Authorization: token } },
      );
    },
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Document Deleted",
        description: `The document ${document.name} has been successfully deleted.`,
      });
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Couldn't Delete Document",
        description:
          (err.response?.data as string) ||
          `There was an error deleting the document ${document.name}. Please try again.`,
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
          <DialogTitle>Delete {document.name} Document</DialogTitle>
          <DialogDescription>
            By clicking delete, the {document.name} topic and all its documents
            will be permanently deleted. This action cannot be undone.
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
