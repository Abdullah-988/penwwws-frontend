import { useState } from "react";
import axios from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { LoaderCircle } from "lucide-react";
import { AxiosError } from "axios";

type Props = {
  schoolId: string;
  selectedMemberIds: number[];
};

export default function DeleteMember({ schoolId, selectedMemberIds }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["member", schoolId, selectedMemberIds],
    mutationFn: async () => {
      const token = await getCookie("token");
      await axios.delete(`/school/${schoolId}/member`, {
        headers: { Authorization: token },
        data: { userIds: selectedMemberIds },
      });
    },
    onSuccess: () => {
      toast({
        title: "Member(s) deleted successfully",
        description: `${selectedMemberIds.length} member(s) deleted from you school`,
      });
      setIsModalOpen(false);
      router.refresh();
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Member(s) deletion failed",
        description: err.response && (err.response.data as string),
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete Member(s)
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Member(s)</DialogTitle>
          <DialogDescription>
            Please note that deleting a member is an irreversible action. Once
            confirmed, all associated data will be deleted and cannot be
            recovered.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={() => mutate()}>
            {isPending ? <LoaderCircle /> : <span>Delete</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
