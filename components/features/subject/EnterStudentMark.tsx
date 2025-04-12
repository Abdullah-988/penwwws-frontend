"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "@/lib/axiosInstance";
import z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { StudentMarksTableRowType } from "@/app/school/[id]/subjects/[subjectId]/students/[studentId]/page";

type Props = {
  schoolId: string;
  subjectId: number;
  row: StudentMarksTableRowType;
  studentId: number;
};

const getEnterStudentMarkSchema = (max: number) =>
  z.object({
    value: z.coerce.number().max(max, `Mark cannot exceed ${max}.`),
  });

export default function EnterStudentMark({
  schoolId,
  subjectId,
  row,
  studentId,
}: Props) {
  const EnterStudentMarkSchema = getEnterStudentMarkSchema(row.max);
  type FormDataType = z.infer<typeof EnterStudentMarkSchema>;
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormDataType>({
    mode: "onBlur",
    resolver: zodResolver(EnterStudentMarkSchema),
    defaultValues: {
      value: row.marks.length ? row.marks[0].value : 0,
    },
  });

  async function onSubmit(data: FormDataType) {
    const token = await getCookie("token");
    const formData = {
      marks: [{ rowId: row.id, value: data.value }],
    };

    try {
      if (!form.getFieldState("value").isDirty) return;
      await axios.post(
        `/school/${schoolId}/subject/${subjectId}/table/student/${studentId}`,
        formData,
        {
          headers: { Authorization: token },
        },
      );
      router.refresh();
      toast({
        title: "Marks Updated",
        description: "The student's marks have been successfully updated.",
      });
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error updating marks:", error.response?.data);
      toast({
        title: "Failed to Update Marks",
        description:
          (error.response?.data as string) ||
          "An unexpected error occurred while updating the student's marks.",
        variant: "destructive",
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="relative">
              <FormMessage className="absolute top-1/2 right-16 -translate-y-1/2 text-xs" />
              <FormControl>
                <Input
                  className="h-6 w-14 text-center focus-within:ring-1"
                  {...field}
                  onBlur={form.handleSubmit(onSubmit)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
