"use client";

import { useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";

const addSubjectSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .regex(/^[A-Za-z0-9 ]+$/, {
      message: "Only letters and numbers are allowed.",
    }),
});

type FormData = z.infer<typeof addSubjectSchema>;

type Props = {
  schoolId: string;
};

export default function AddSubject({ schoolId }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(addSubjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function onSubmit(data: FormData) {
    const token = await getCookie("token");
    try {
      await axios.post(`/school/${schoolId}/subject`, data, {
        headers: { Authorization: token },
      });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setIsModalOpen(false);
      form.reset();
      toast({
        title: "Subject Added",
        description: `The subject ${data.name} has been added.`,
      });
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

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full px-4 text-sm font-semibold">
          <Plus size={10} />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add subject</DialogTitle>
            </DialogHeader>

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Subject Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g., Mathematics, Science, History"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="rounded-full font-semibold"
              >
                {form.formState.isSubmitting ? <SpinnerIcon /> : "Add Subject"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
