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
import { subjectSchema, SubjectFormData } from "@/lib/validations";
import Image from "next/image";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubjectDetailType } from "@/types/Subject";

type Props = {
  schoolId: string;
  subject: SubjectDetailType;
};

export default function EditSubject({ schoolId, subject }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { onUpload, progresses, uploadedFiles, setUploadedFiles, isUploading } =
    useUploadFile({
      defaultUploadedFiles: [],
    });
  const lastIndexOfUploadedFiles = uploadedFiles.length - 1;

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: subject.name,
      imageUrl: subject.imageUrl || null,
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      form.reset({
        name: subject.name,
        imageUrl: subject.imageUrl || null,
      });
      setUploadedFiles([]);
    }
  }, [subject, isModalOpen, form, setUploadedFiles]);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      form.setValue("imageUrl", uploadedFiles[lastIndexOfUploadedFiles].url);
    }
  }, [uploadedFiles, lastIndexOfUploadedFiles, form]);

  async function onSubmit(data: SubjectFormData) {
    const token = await getCookie("token");
    try {
      await axios.put(`/school/${schoolId}/subject/${subject.id}`, data, {
        headers: { Authorization: token },
      });

      router.refresh();
      setIsModalOpen(false);
      toast({
        title: "Subject Updated",
        description: "Subject details have been updated successfully.",
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

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Subject Settings</DialogTitle>
              <DialogDescription>
                Update the subject name or image. Both fields are optional.
              </DialogDescription>
            </DialogHeader>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem {...field}>
                  <div className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Subject Name
                    </FormLabel>
                    <FormMessage />
                    <Input {...field} />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="imageUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem {...field}>
                  <div className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Subject Cover
                    </FormLabel>
                    <FormMessage />

                    <div className="flex items-center justify-between">
                      {(field.value || uploadedFiles.length > 0) && (
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Image
                              src={
                                (!isUploading &&
                                  uploadedFiles[lastIndexOfUploadedFiles]
                                    ?.url) ||
                                field.value ||
                                form.getValues("imageUrl") ||
                                ""
                              }
                              width={48}
                              height={48}
                              alt="Subject image"
                              className="max-w-96 rounded-md object-cover"
                            />
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
                              form.setValue("imageUrl", null);
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
