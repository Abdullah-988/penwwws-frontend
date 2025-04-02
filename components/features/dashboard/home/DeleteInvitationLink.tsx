"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";

type Props = {
  schoolId: string;
  tokenId: number;
};

export default function DeleteInvitationLink({ schoolId, tokenId }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["invitationTokens", schoolId, tokenId],
    mutationFn: async () => {
      const token = await getCookie("token");
      await axios.delete(`/school/${schoolId}/invitation/${tokenId}`, {
        headers: { Authorization: token },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schoolInvitations"] });
      toast({
        title: "Invitation Link Deleted",
        description: "The invitation link has been successfully removed.",
      });
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Deletion Failed",
        description:
          (err.response?.data as string) || "Failed to delete invitation link",
        variant: "destructive",
      });
    },
    onSettled: () => setIsModalOpen(false),
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          type="button"
          className="bg-destructive/5 text-destructive hover:bg-destructive/10 px-3"
        >
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Invitation Link</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The invitation link will be
            permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            disabled={isPending}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutate()}
            disabled={isPending}
            type="button"
          >
            {isPending ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
