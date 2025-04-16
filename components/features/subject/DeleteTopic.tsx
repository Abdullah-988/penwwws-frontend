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
import { TopicType } from "@/types/Topic";
import { Trash2, LoaderCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";

type Props = {
  schoolId: string;
  subjectId: number;
  topic: TopicType;
};

export default function DeleteTopic({ schoolId, subjectId, topic }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["topic", topic.name],
    mutationFn: async () => {
      const token = await getCookie("token");
      await axios.delete(
        `/school/${schoolId}/subject/${subjectId}/topic/${topic.id}`,
        { headers: { Authorization: token } },
      );
    },
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Topic Deleted",
        description: `The topic ${topic.name} has been successfully deleted.`,
      });
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Couldn't Delete Topic",
        description:
          (err.response?.data as string) ||
          `There was an error deleting the topic ${topic.name}. Please try again.`,
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
          <DialogTitle>Delete {topic.name} topic</DialogTitle>
          <DialogDescription>
            By clicking delete, the {topic.name} topic and all its documents
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
