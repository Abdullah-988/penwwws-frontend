"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle as SpinnerIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { Form } from "@/components/ui/form";
import { AxiosError } from "axios";
import TableRowFields from "@/components/shared/TableRowFields";
import { MarksTableFormData, marksTableSchema } from "@/lib/validations";

type Props = {
  schoolId: string;
  subjectId: number;
};

export default function AddTableRow({ schoolId, subjectId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<MarksTableFormData>({
    resolver: zodResolver(marksTableSchema),
    defaultValues: {
      name: "",
      max: 0,
      count: false,
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function onSubmit(data: MarksTableFormData) {
    const token = await getCookie("token");
    try {
      await axios.post(`/school/${schoolId}/subject/${subjectId}/table`, data, {
        headers: { Authorization: token },
      });
      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error adding subject:", error.response?.data);
      toast({
        title: "Table row Add Failed",
        description:
          (error.response?.data as string) || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      form.reset();
    }
  }, [isModalOpen, form]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="absolute top-0 left-0 flex w-full rounded-none border-x-0"
        >
          <Plus size={10} />
          New Row
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[700px]">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add table row</DialogTitle>
            </DialogHeader>
            <TableRowFields form={form} />
            <DialogFooter>
              <Button
                onClick={() => setIsModalOpen(false)}
                disabled={form.formState.isSubmitting}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? <SpinnerIcon /> : "Add Row"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
