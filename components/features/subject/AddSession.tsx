"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { DateTimePicker } from "@/components/shared/DateTimePicker";

const addSessionSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  expireDate: z.string(),
});

type FormData = z.infer<typeof addSessionSchema>;

type Props = {
  schoolId: string;
  subjectId: number;
};

export default function AddSession({ schoolId, subjectId }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const form = useForm<FormData>({
    resolver: zodResolver(addSessionSchema),
    defaultValues: {
      name: "",
      expireDate: undefined,
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function onSubmit(data: FormData) {
    const token = await getCookie("token");
    try {
      await axios.post(
        `/school/${schoolId}/subject/${subjectId}/session`,
        { ...data, expireDate: data.expireDate },
        {
          headers: { Authorization: token },
        },
      );
      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error adding session:", error.response?.data);
      toast({
        title: "Session Creation Failed",
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
          New Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Session</DialogTitle>
            </DialogHeader>

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Name</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g.,Lecture 1, Lab Session, Workshop"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="expireDate"
              control={form.control}
              render={() => (
                <FormItem>
                  <FormLabel>Expire date</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <DateTimePicker
                      value={date}
                      onChange={(newDate) => {
                        setDate(newDate);
                        form.setValue(
                          "expireDate",
                          newDate?.toISOString() || "",
                        );
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                size="sm"
              >
                {form.formState.isSubmitting ? (
                  <SpinnerIcon />
                ) : (
                  "Create Session"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
