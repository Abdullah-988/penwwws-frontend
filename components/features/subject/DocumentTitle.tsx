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
import { FileText, Pencil, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import DeleteDocument from "./DeleteDocument";
import { Badge } from "@/components/ui/badge";

const editDocumentFormSchema = z.object({
  name: z
    .string()
    .min(2, "Document name must be at least 2 characters")
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsInputFocused(false);
      form.reset({ name: document.name });
    }
  };

  async function onSubmit(data: FormDataType) {
    const token = await getCookie("token");

    try {
      if (form.getFieldState("name").isDirty) {
        await axios.put(
          `/school/${schoolId}/subject/${subjectId}/topic/${topicId}/document/${document.id}`,
          data,
          { headers: { Authorization: token } },
        );

        router.refresh();
        toast({
          title: "Document Updated",
          description: `Document name changed to "${data.name}"`,
        });
      }
    } catch (err) {
      const error = err as AxiosError;
      console.error("Update error:", error.response?.data);
      toast({
        title: "Update Failed",
        description: error.response?.data?.toString() || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsInputFocused(false);
      setEditingDocumentId(null);
    }
  }

  useEffect(() => {
    form.reset({ name: document.name });
  }, [isInputFocused, form, document.name]);

  return (
    <div className="group relative flex items-center justify-between rounded-md px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
      {editingDocumentId === document.id && isInputFocused ? (
        <div className="flex w-full items-center gap-3">
          <FileText className="text-muted-foreground size-4 shrink-0" />
          <Form {...form}>
            <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        onKeyDown={handleKeyDown}
                        onBlur={form.handleSubmit(onSubmit)}
                        className="h-8 w-full border-none bg-transparent p-2 text-base font-medium shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Document name"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      ) : (
        <>
          <div className="group ml-5 flex items-center gap-3">
            <FileText className="text-muted-foreground size-4 shrink-0" />
            <Link
              href={document.url}
              className="flex items-center gap-2 hover:underline"
            >
              <div className="flex items-center gap-1">
                <span className="text-base font-medium">{document.name}</span>
                <SquareArrowOutUpRight className="text-primary size-3.5" />
              </div>
            </Link>
            <Badge
              variant="secondary"
              className="rounded-full px-1 py-0 !text-[0.7rem]"
            >
              {document.format.toUpperCase()}
            </Badge>
            {user.role !== "STUDENT" && (
              <Pencil
                onClick={(e) => {
                  e.preventDefault();
                  setIsInputFocused(true);
                  setEditingDocumentId(document.id);
                }}
                className="h-4 w-4 text-yellow-800 transition-colors hover:text-yellow-900 md:opacity-0 md:group-hover:opacity-100"
              />
            )}
          </div>

          {user.role !== "STUDENT" && (
            <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <DeleteDocument
                schoolId={schoolId}
                subjectId={subjectId}
                topicId={topicId}
                document={document}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
