"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { DocumentType } from "@/types/Document";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { SchoolUserType } from "@/types/SchoolUser";
import { AccordionContent } from "@/components/ui/accordion";
import { FileText, Pencil } from "lucide-react";
import Link from "next/link";
import DeleteDocument from "./DeleteDocument";

const editDocumentFormSchema = z.object({
  name: z
    .string()
    .min(2, "Topic title should be at least 2 characters")
    .nonempty(),
});
type FormDataType = z.infer<typeof editDocumentFormSchema>;

type Props = {
  schoolId: string;
  document: DocumentType;
  editingDocumentId: number | null;
  setEditingDocumentId: Dispatch<SetStateAction<number | null>>;
  topicId: number;
  subjectId: number;
  user: SchoolUserType;
};

export default function DocumentTitle({
  schoolId,
  document,
  editingDocumentId,
  setEditingDocumentId,
  topicId,
  subjectId,
  user,
}: Props) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormDataType>({
    mode: "onBlur",
    defaultValues: { name: document.name },
    resolver: zodResolver(editDocumentFormSchema),
  });

  async function onSubmit(data: FormDataType) {
    const token = await getCookie("token");

    try {
      if (form.getFieldState("name").isDirty) {
        await axios.put(
          `/school/${schoolId}/subject/${subjectId}/topic/${topicId}/document/${document.id}`,
          data,
          {
            headers: { Authorization: token },
          },
        );

        router.refresh();
        toast({
          title: "Topic Title Updated",
          description: `The document name has been updated to "${data.name}" successfully.`,
        });
      }
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error updating document:", error.response?.data);
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
    form.reset({ name: document.name });
  }, [isInputFocused, form, document.name]);

  return (
    <>
      {editingDocumentId === document.id && isInputFocused ? (
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
        <AccordionContent
          key={document.id}
          className="text-md group hover:bg-primary/5 relative z-0 ml-2 flex h-12 w-full cursor-default items-center justify-between rounded-md px-4 font-medium"
        >
          <div className="relative z-0 flex items-center gap-1">
            <Link
              href={document.url}
              className="flex cursor-pointer items-center gap-2 py-2 text-lg hover:underline"
            >
              <FileText className="text-muted-foreground" size={16} />
              <div>
                {document.name}.
                <small className="p-0 font-normal">{document.format}</small>
              </div>
            </Link>

            {user.role !== "STUDENT" && (
              <Pencil
                onClick={() => {
                  setIsInputFocused(true);
                  setEditingDocumentId(document.id);
                }}
                className="hover:text-primary relative z-50"
              />
            )}
          </div>
          {user.role !== "STUDENT" && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
              <DeleteDocument
                schoolId={schoolId}
                subjectId={subjectId}
                topicId={topicId}
                document={document}
              />
            </div>
          )}
        </AccordionContent>
      )}
    </>
  );
}
