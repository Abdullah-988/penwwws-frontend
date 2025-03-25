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
import { GroupType } from "@/types/Group";
import { Trash2, LoaderCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";

type Props = {
  schoolId: string;
  group: GroupType;
};

export default function DeleteGroup({ schoolId, group }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["group", group.name],
    mutationFn: async () => {
      const token = await getCookie("token");

      await axios.delete(`/school/${schoolId}/group/${group.id}`, {
        headers: { Authorization: token },
      });
    },
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Group Deleted",
        description: `The group ${group.name} has been successfully deleted.`,
      });
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Couldn't Delete Group",
        description:
          (err.response && (err.response.data as string)) ||
          `There was an error deleting the group ${group.name}. Please try again.`,
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
          <DialogTitle>Delete {group.name} group</DialogTitle>
          <DialogDescription>
            By clicking delete, the {group.name} group will be permanently
            deleted. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            {isPending ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              <span>Cancel</span>
            )}
          </Button>
          <Button size="sm" onClick={() => mutate()} variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
