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
import { TableRowType } from "@/types/TableRow";

type Props = {
  schoolId: string;
  subjectId: number;
  row: TableRowType;
};

export default function DeleteRow({ schoolId, subjectId, row }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["table", subjectId, row.id],
    mutationFn: async () => {
      const token = await getCookie("token");
      await axios.delete(
        `/school/${schoolId}/subject/${subjectId}/table/${row.id}`,
        { headers: { Authorization: token } },
      );
    },
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Row Deleted",
        description: `The ${row.name} row has been successfully deleted.`,
      });
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Couldn't Delete row",
        description:
          (err.response?.data as string) ||
          `There was an error deleting the document ${row.name}. Please try again.`,
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
          className="bg-destructive/10 text-destructive hover:bg-destructive/15 top-0 -left-20 z-50 mx-2 lg:opacity-0 lg:group-hover:opacity-100"
        >
          <Trash2 size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {row.name} row </DialogTitle>
          <DialogDescription>
            By clicking delete, the {row.name} row and all its marks will be
            permanently deleted.
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
