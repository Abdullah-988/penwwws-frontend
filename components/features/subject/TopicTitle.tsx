"use client";

import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { TopicType } from "@/types/Topic";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { SchoolUserType } from "@/types/SchoolUser";
import { SubjectDetailType } from "@/types/Subject";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

const editTopicFormSchema = z.object({
  name: z
    .string()
    .min(2, "Topic title should be at least 2 characters")
    .nonempty(),
});
type FormDataType = z.infer<typeof editTopicFormSchema>;

type Props = {
  schoolId: string;
  topic: TopicType;
  editingTopicId: number | null;
  subject: SubjectDetailType;
  setEditingTopicId: Dispatch<SetStateAction<number | null>>;
  user: SchoolUserType;
};

export default function TopicTitle({
  schoolId,
  topic,
  editingTopicId,
  setEditingTopicId,
  subject,
  user,
}: Props) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormDataType>({
    mode: "onBlur",
    defaultValues: { name: topic.name },
    resolver: zodResolver(editTopicFormSchema),
  });

  async function onSubmit(data: FormDataType) {
    const token = await getCookie("token");

    try {
      if (form.getFieldState("name").isDirty) {
        await axios.put(
          `/school/${schoolId}/subject/${subject.id}/topic/${topic.id}/`,
          data,
          {
            headers: { Authorization: token },
          },
        );

        router.refresh();
        toast({
          title: "Topic Title Updated",
          description: `The topic title has been updated to "${data.name}" successfully.`,
        });
      }
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error updating subject:", error.response?.data);
      toast({
        title: "Update Failed",
        description:
          (error.response?.data as string) || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsInputFocused(false);
    }
  }

  useEffect(() => {
    if (isInputFocused) {
      form.reset({ name: topic.name });
    }
  }, [isInputFocused, form, topic.name]);

  return (
    <>
      {editingTopicId === topic.id && isInputFocused ? (
        <Form {...form}>
          <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormMessage className="mt-1" />

                  <FormControl className="w-full">
                    <div className="flex w-full items-center gap-4">
                      <Input
                        {...field}
                        autoFocus
                        onClick={(e) => {
                          e.preventDefault();
                          setIsInputFocused(true);
                        }}
                        onBlur={form.handleSubmit(onSubmit)}
                        className="shadow-0 h-8 w-full border-none p-2 text-start !text-xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Topic title"
                      />
                      <div className="flex items-center gap-2"></div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        <div className="group ml-2 flex h-full cursor-pointer items-center gap-2 font-semibold md:text-xl">
          {form.getValues("name") || topic.name}
          {user.role !== "STUDENT" && (
            <Pencil
              onClick={(e) => {
                e.preventDefault();
                setIsInputFocused(true);
                setEditingTopicId(topic.id);
              }}
              className="h-6 w-6 rounded-md p-1 text-yellow-800 transition-colors hover:text-yellow-900 lg:opacity-0 lg:group-hover:opacity-100"
            />
          )}
        </div>
      )}
    </>
  );
}
