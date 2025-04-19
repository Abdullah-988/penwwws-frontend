import { RefObject, useState } from "react";
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
import { ResetSelectionType } from "./DataTable";

type Props = {
  schoolId: string;
  selectedMemberIds: number[];
  className?: string;
  btnText?: string;
  resetSelectionRef: RefObject<ResetSelectionType | null>;
};

export default function RemoveMember({
  schoolId,
  selectedMemberIds,
  className,
  btnText = "Remove Member(s)",
  resetSelectionRef,
}: Props) {
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
        title: "Member(s) removed successfully",
        description: `${selectedMemberIds.length} member(s) remove from you school`,
      });
      resetSelectionRef.current?.resetSelection();
      setIsModalOpen(false);
      router.refresh();
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Member(s) removal failed",
        description: err.response && (err.response.data as string),
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger className={className} asChild>
        <Button variant="destructive" size="sm">
          {btnText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> {btnText}</DialogTitle>
          <DialogDescription>
            Please note that removing a member is an irreversible action. Once
            confirmed, all associated data will be deleted and cannot be
            recovered.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={() => mutate()}>
            {isPending ? <LoaderCircle /> : <span>Remove</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
