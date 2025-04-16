"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DateTimePicker } from "@/components/shared/DateTimePicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle as SpinnerIcon, FileText, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FileUploader } from "@/components/shared/upload/file-uploader";
import { useUploadFile } from "@/hooks/use-upload-file";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import z from "zod";

type Props = {
  schoolId: string;
  subjectId: number;
};

const addAssignmentSchema = z.object({
  title: z.string().nonempty("Title is required"),
  deadline: z.string(),
  url: z.string().optional(),
});

type FormDataType = z.infer<typeof addAssignmentSchema>;
export default function AddAssignment({ schoolId, subjectId }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { onUpload, progresses, uploadedFiles, setUploadedFiles, isUploading } =
    useUploadFile({
      defaultUploadedFiles: [],
    });
  const lastIndexOfUploadedFiles = uploadedFiles.length - 1;

  const form = useForm<FormDataType>({
    resolver: zodResolver(addAssignmentSchema),
    defaultValues: {
      title: "",
      deadline: "",
      url: "",
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      form.reset();
      setUploadedFiles([]);
    }
  }, [isModalOpen, form, setUploadedFiles]);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      form.setValue("url", uploadedFiles[lastIndexOfUploadedFiles].url);
    }
  }, [uploadedFiles, lastIndexOfUploadedFiles, form]);

  async function onSubmit(data: FormDataType) {
    const token = await getCookie("token");

    try {
      await axios.post(
        `/school/${schoolId}/subject/${subjectId}/assignment`,
        { ...data, deadline: date },
        {
          headers: { Authorization: token },
        },
      );

      router.refresh();
      setIsModalOpen(false);
      toast({
        title: "Assignment Added",
        description: `The assignment "${data.title}" has been added successfully.`,
      });
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error updating subject:", error.response?.data);
      toast({
        title: "Update Failed",
        description:
          (error.response?.data as string) || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      form.reset();
      setDate(undefined);
    }
  }, [isModalOpen, form]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          New Assignment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add assignment</DialogTitle>
              <DialogDescription>
                Provide the assignment details including the title, deadline,
                and an optional document upload.
              </DialogDescription>
            </DialogHeader>
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem {...field}>
                  <div className="space-y-2">
                    <FormLabel className="text-sm font-medium">title</FormLabel>
                    <FormMessage />
                    <Input {...field} />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="deadline"
              control={form.control}
              render={() => (
                <FormItem className="flex w-full flex-col gap-1">
                  <FormLabel>Deadline</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <DateTimePicker value={date} onChange={setDate} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="url"
              control={form.control}
              render={({ field }) => (
                <FormItem {...field}>
                  <div className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Document (optional)
                    </FormLabel>
                    <FormMessage />

                    <div className="flex items-center justify-between">
                      {(field.value || uploadedFiles.length > 0) && (
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText />
                            {uploadedFiles.length > 0 && (
                              <h1 className="text-md font-semibold">
                                {uploadedFiles[lastIndexOfUploadedFiles].name}
                              </h1>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setUploadedFiles([]);
                              form.setValue("url", "");
                            }}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      )}
                    </div>

                    <FileUploader
                      progresses={progresses}
                      onUpload={onUpload}
                      disabled={isUploading}
                      accept={{
                        "application/*": [],
                      }}
                    />
                  </div>
                </FormItem>
              )}
            />
            <div className="ml-auto flex w-fit items-center gap-3">
              <Button
                onClick={() => setIsModalOpen(false)}
                disabled={form.formState.isSubmitting || isUploading}
                type="button"
                variant="outline"
                size="sm"
                className="w-fit rounded-full font-semibold"
              >
                Cancel
              </Button>
              <Button
                disabled={form.formState.isSubmitting || isUploading}
                type="submit"
                size="sm"
                className="w-fit rounded-full font-semibold"
              >
                {form.formState.isSubmitting ? (
                  <SpinnerIcon className="animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
