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
import { LoaderCircle as SpinnerIcon, Pencil } from "lucide-react";
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
import { SessionType } from "@/types/session";

const editSessionSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  expireDate: z.string().min(1, { message: "Expiration date is required" }),
});

type FormData = z.infer<typeof editSessionSchema>;

type Props = {
  schoolId: string;
  subjectId: number;
  session: SessionType;
};

export default function EditSession({ schoolId, subjectId, session }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(
    session.expirationDate ? new Date(session.expirationDate) : undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(editSessionSchema),
    defaultValues: {
      name: session.name,
      expireDate: session.expirationDate,
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      form.reset({
        name: session.name,
        expireDate: session.expirationDate,
      });
      setDate(
        session.expirationDate ? new Date(session.expirationDate) : undefined,
      );
    }
  }, [isModalOpen, form, session]);

  async function onSubmit(data: FormData) {
    const token = await getCookie("token");
    try {
      await axios.put(
        `/school/${schoolId}/subject/${subjectId}/session/${session.id}`,
        { ...data, expireDate: data.expireDate },
        {
          headers: { Authorization: token },
        },
      );
      setIsModalOpen(false);
      router.refresh();
      toast({
        title: "Success",
        description: "Session updated successfully",
      });
    } catch (err) {
      const error = err as AxiosError;
      console.error("Error updating session:", error.response?.data);
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
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Session</DialogTitle>
            </DialogHeader>

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Name</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input type="text" placeholder="Session name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="expireDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <DateTimePicker
                      {...field}
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
                  <SpinnerIcon className="animate-spin" />
                ) : (
                  "Update Session"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
