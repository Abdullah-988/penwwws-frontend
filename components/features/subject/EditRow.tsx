"use client";

import { useState, useEffect } from "react";
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
import { LoaderCircle as SpinnerIcon, Pencil } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { Form } from "@/components/ui/form";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { TableRowType } from "@/types/TableRow";
import TableRowFields from "@/components/shared/TableRowFields";
import { MarksTableFormData, marksTableSchema } from "@/lib/validations";

type Props = {
  schoolId: string;
  subjectId: number;
  row: TableRowType;
};

export default function EditRow({ schoolId, subjectId, row }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<MarksTableFormData>({
    resolver: zodResolver(marksTableSchema),
    defaultValues: {
      name: row.name,
      count: row.count,
      max: row.max,
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      form.reset({ name: row.name, count: row.count, max: row.max });
    }
  }, [isModalOpen, form, row]);

  async function onSubmit(data: MarksTableFormData) {
    const token = await getCookie("token");
    try {
      await axios.put(
        `/school/${schoolId}/subject/${subjectId}/table/${row.id}`,
        data,
        {
          headers: { Authorization: token },
        },
      );
      router.refresh();
      setIsModalOpen(false);
      toast({
        title: "Table Row Edited",
        description: `The Row ${data.name} has been edited.`,
      });
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error Editing row:", error.response?.data);
      toast({
        title: "Row Edit Failed",
        description:
          (error.response?.data as string) || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-amber-800/10 text-amber-800 hover:bg-amber-800/15 lg:opacity-0 lg:group-hover:opacity-100"
        >
          <Pencil size={10} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Row</DialogTitle>
              <DialogDescription>
                Edit row info including name, max value and count or not
              </DialogDescription>
            </DialogHeader>
            <TableRowFields form={form} />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                size="sm"
              >
                {form.formState.isSubmitting ? (
                  <SpinnerIcon className="animate-spin" />
                ) : (
                  "Edit Row"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
