"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircle, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopicType } from "@/types/Topic";
import { DocumentType } from "@/types/Document";
import { AxiosError } from "axios";

const editDocumentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  topicId: z.string(),
});

type Props = {
  schoolId: string;
  subjectId: number;
  document: DocumentType;
  topics: TopicType[];
};

type FormData = z.infer<typeof editDocumentSchema>;

export default function EditDocument({
  schoolId,
  subjectId,
  document,
  topics,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(editDocumentSchema),
    defaultValues: {
      name: document.name,
      topicId: String(document.topicId),
    },
  });

  const onSubmit = async (data: FormData) => {
    const token = await getCookie("token");
    const topicId = parseInt(data.topicId);
    try {
      await axios.put(
        `/school/${schoolId}/subject/${subjectId}/topic/${document.topicId}/document/${document.id}`,
        { name: data.name, topicId },
        {
          headers: { Authorization: token },
        },
      );

      toast({
        title: "Document Updated",
        description: 'The document was updated".',
      });

      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error updating document:", error);
      toast({
        title: "Update Failed",
        description: (error.response?.data as string) || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      form.reset({
        name: document.name,
        topicId: String(document.topicId),
      });
    }
  }, [isModalOpen, document, form]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-amber-800/10 text-amber-800 hover:bg-amber-800/15"
        >
          <Pencil size={12} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
          <DialogDescription>
            Change the name or move it to another topic.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topicId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={String(topic.id)}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full"
            >
              {form.formState.isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Update Document"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
