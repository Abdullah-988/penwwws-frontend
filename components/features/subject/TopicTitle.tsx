"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { TopicType } from "@/types/TopicType";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import { Pencil } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { SchoolUserType } from "@/types/SchoolUser";
import DeleteTopic from "./DeleteTopic";
import { SubjectDetailType } from "@/types/Subject";

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

  return (
    <>
      {editingTopicId === topic.id && isInputFocused ? (
        <div className="flex w-full items-center rounded-md px-4 py-[21px] text-lg font-semibold">
          <Form {...form}>
            <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormMessage />
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={form.handleSubmit(onSubmit)}
                        className="h-full border-none p-0 text-start !text-lg font-semibold focus-visible:ring-0"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      ) : (
        <AccordionTrigger asChild>
          <div className="text-md group ml-2 flex h-12 w-full cursor-default items-center justify-between rounded-md px-4 font-medium">
            <div className="flex w-fit items-center text-start">
              {form.getValues("name") || topic.name}
              {user.role !== "STUDENT" && (
                <Pencil
                  onClick={(e) => {
                    e.preventDefault();
                    setIsInputFocused(true);
                    setEditingTopicId(topic.id);
                  }}
                  className="hover:text-primary z-50 ml-2 size-8 cursor-pointer p-2 opacity-0 group-hover:opacity-100"
                />
              )}
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
              <DeleteTopic
                schoolId={schoolId}
                subjectId={subject.id}
                topic={topic}
              />
            </div>
          </div>
        </AccordionTrigger>
      )}
    </>
  );
}
