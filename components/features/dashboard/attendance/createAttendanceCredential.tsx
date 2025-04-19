"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle as SpinnerIcon, KeyRound } from "lucide-react";
import { AxiosError } from "axios";

const formSchema = z.object({
  password: z.string().min(4, "Password should be atleast 4 character long"),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  schoolId: string;
};

export default function CreateAttendanceCredential({ schoolId }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(formData: FormData) {
    try {
      const token = await getCookie("token");
      await axios.post(`/school/${schoolId}/device`, formData, {
        headers: { Authorization: token },
      });

      toast({
        title: "Success",
        description: "Credential created successfully",
      });
      router.refresh();
      setIsModalOpen(false);
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError;
      toast({
        title: "Error",
        description:
          (axiosError.response?.data as string) ||
          "Failed to create credential",
        variant: "destructive",
      });
    }
  }
  useEffect(() => {
    if (isModalOpen) {
      form.reset();
    }
  }, [form, isModalOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <KeyRound className="mr-1 h-4 w-4" />
          Create Credential
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create New Credential</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter a password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className=""
              >
                {form.formState.isSubmitting ? (
                  <SpinnerIcon className="animate-spin" />
                ) : (
                  "Create Credential"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
