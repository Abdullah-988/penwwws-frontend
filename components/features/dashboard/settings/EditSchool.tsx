"use client";

import axios from "@/lib/axiosInstance";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { SchoolType } from "@/types/School";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { editSchoolSchema } from "@/lib/validations";
import z from "zod";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderCircle, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FileUploader } from "@/components/shared/upload/file-uploader";
import { useUploadFile } from "@/hooks/use-upload-file";

type Props = {
  school: SchoolType;
};

type FormData = z.infer<typeof editSchoolSchema>;

export default function EditSchool({ school }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { onUpload, progresses, uploadedFiles, setUploadedFiles, isUploading } =
    useUploadFile({
      defaultUploadedFiles: [],
    });

  const lastUploadedFileIndex = uploadedFiles.length - 1;
  const form = useForm<FormData>({
    defaultValues: {
      name: school.name || "",
      description: school.description || "",
      logoUrl: school.logoUrl || "",
    },
    resolver: zodResolver(editSchoolSchema),
  });

  async function onSubmit(data: FormData) {
    try {
      const token = await getCookie("token");

      await axios.put(`/school/${school.id}`, data, {
        headers: { Authorization: token },
      });
      await queryClient.invalidateQueries({
        queryKey: ["schools"],
        type: "active",
      });
      router.refresh();
      setUploadedFiles([]);
      toast({
        title: "School updated",
        description: "The school details have been successfully updated.",
      });

      form.reset(data, { keepDirty: false });
    } catch (err) {
      const error = err as AxiosError;
      console.error(
        (error.response && (error.response.data as string)) ||
          "Unexpected error occur",
      );

      toast({
        title: "Could not edit school",
        description:
          (error.response && (error.response.data as string)) ||
          "Unexpected error occur",
        variant: "destructive",
      });
    }
  }
  useEffect(() => {
    form.reset({
      name: school.name || "",
      description: school.description || "",
      logoUrl: school.logoUrl || "",
    });
  }, [school, form]);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      form.setValue("logoUrl", uploadedFiles[lastUploadedFileIndex].url);
    }
  }, [uploadedFiles, form, lastUploadedFileIndex]);
  return (
    <section className="rounded-md">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <h1 className="text-md font-semibold">Name</h1>
                <FormMessage />
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <h1 className="text-md font-semibold">Description</h1>
                <FormMessage />
                <FormControl>
                  <Textarea className="bg-card h-36 resize-none" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="logoUrl"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                {field.value ? (
                  <div className="mb-4 flex items-center justify-between">
                    {uploadedFiles.length === 0 && (
                      <>
                        <div className="flex w-full items-center gap-2">
                          {school.logoUrl && (
                            <Image
                              src={school.logoUrl}
                              width={68}
                              height={68}
                              loading="lazy"
                              className="size-12 object-contain"
                              alt="Uploaded file"
                            />
                          )}
                          <h1 className="text-sm font-semibold">School logo</h1>
                        </div>
                        <Button
                          onClick={() => {
                            field.onChange("");
                            setUploadedFiles([]);
                          }}
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-7"
                        >
                          <X size="4" />
                        </Button>
                      </>
                    )}

                    {uploadedFiles.length > 0 && (
                      <>
                        <div className="flex w-full items-center gap-3">
                          <Image
                            src={uploadedFiles[lastUploadedFileIndex].url}
                            width={68}
                            height={68}
                            loading="lazy"
                            className="aspect-square size-12 shrink-0 object-cover"
                            alt="Uploaded file"
                          />

                          <h1 className="text-sm font-semibold">
                            {uploadedFiles[lastUploadedFileIndex].name}
                          </h1>
                        </div>
                        <Button
                          onClick={() => {
                            field.onChange("");
                            setUploadedFiles([]);
                          }}
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-7"
                        >
                          <X size="4" />
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <h1 className="text-md font-semibold">Upload Logo</h1>
                )}
                <FormMessage />
                <FormControl>
                  <div className="gap-2">
                    <FileUploader
                      progresses={progresses}
                      onUpload={onUpload}
                      disabled={isUploading}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="ml-auto flex w-fit items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              disabled={
                form.formState.isSubmitting ||
                (!form.formState.isDirty && uploadedFiles.length === 0)
              }
              type="button"
              onClick={() => {
                setUploadedFiles([]);
                form.reset();
                router.refresh();
              }}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={
                form.formState.isSubmitting ||
                isUploading ||
                (!form.formState.isDirty && uploadedFiles.length === 0)
              }
            >
              {form.formState.isSubmitting ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                <span>Save</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
