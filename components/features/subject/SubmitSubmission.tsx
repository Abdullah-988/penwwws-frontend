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
import { LoaderCircle as SpinnerIcon, Upload, FileText, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FileUploader } from "@/components/shared/upload/file-uploader";
import { useUploadFile } from "@/hooks/use-upload-file";
import z from "zod";

type Props = {
  schoolId: string;
  subjectId: number;
  assignmentId: number;
};

const submissionSchema = z.object({
  url: z.string().nonempty("Please upload a file"),
});

type FormDataType = z.infer<typeof submissionSchema>;

export default function SubmitSubmission({
  schoolId,
  subjectId,
  assignmentId,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { onUpload, progresses, uploadedFiles, setUploadedFiles, isUploading } =
    useUploadFile({ defaultUploadedFiles: [] });
  const lastIndexOfUploadedFiles = uploadedFiles.length - 1;

  const form = useForm<FormDataType>({
    resolver: zodResolver(submissionSchema),
    defaultValues: { url: "" },
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
        `/school/${schoolId}/subject/${subjectId}/assignment/${assignmentId}/submission`,
        { url: data.url },
        { headers: { Authorization: token } },
      );

      router.refresh();
      setIsModalOpen(false);
      toast({
        title: "Submission Successful",
        description: "Your assignment has been submitted successfully.",
      });
    } catch (err) {
      const error = err as AxiosError;
      console.error("Submission error:", error.response?.data);
      toast({
        title: "Submission Failed",
        description:
          (error.response?.data as string) ||
          "Failed to submit assignment. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Upload size={16} />
          Submit Assignment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Submit Assignment</DialogTitle>
              <DialogDescription>
                Upload your assignment file. Only one file can be submitted.
              </DialogDescription>
            </DialogHeader>

            <FormField
              name="url"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Submission File
                    </FormLabel>
                    <FormMessage />

                    {(field.value || uploadedFiles.length > 0) && (
                      <div className="flex items-center justify-between rounded p-3 font-semibold">
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span className="text-sm">
                            {uploadedFiles[lastIndexOfUploadedFiles]?.name}
                          </span>
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

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={form.formState.isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isUploading}
              >
                {form.formState.isSubmitting ? (
                  <SpinnerIcon className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
