"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoaderCircle as SpinnerIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { SubjectDetailType } from "@/types/Subject";
import { useRouter } from "next/navigation";

const addTopicSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Topic title must be at least 2 characters." }),
});

type FormData = z.infer<typeof addTopicSchema>;

type Props = {
  schoolId: string;
  subject: SubjectDetailType;
};

export default function AddTopic({ schoolId, subject }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(addTopicSchema),
    defaultValues: {
      name: "",
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function onSubmit(data: FormData) {
    const token = await getCookie("token");
    try {
      await axios.post(
        `/school/${schoolId}/subject/${subject.id}/topic`,
        data,
        {
          headers: { Authorization: token },
        },
      );
      router.refresh();
      setIsModalOpen(false);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error adding subject:", error.response?.data);
      toast({
        title: "Subject Add Failed",
        description:
          (error.response?.data as string) || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      form.reset();
    }
  }, [isModalOpen, form]);
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus size={10} />
          New topic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add topic</DialogTitle>
            </DialogHeader>

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Lecture 1: e.g., Introduction, Algebra Basics"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                size="sm"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting ? <SpinnerIcon /> : "Add Topic"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
