"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoaderCircle as SpinnerIcon, Plus } from "lucide-react";
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
import { emailValidation } from "@/lib/validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inviteMemberSchema = z.object({
  email: emailValidation,
  role: z.enum(["TEACHER", "STUDENT", "ADMIN"], {
    required_error: "Please select a role.",
  }),
});

type FormData = z.infer<typeof inviteMemberSchema>;

type Props = {
  schoolId: string;
};

export default function InviteMember({ schoolId }: Props) {
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: undefined,
    },
  });

  async function onSubmit(data: FormData) {
    const token = await getCookie("token");
    try {
      await axios.post(`/school/${schoolId}/invite`, data, {
        headers: { Authorization: token },
      });
      setIsModalOpen(false);
      form.reset();
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${data.email} as ${data.role}.`,
      });
    } catch (err) {
      const error = err as AxiosError;
      form.setError("root", { message: error.response?.data as string });
      console.error("Error sending invitation:", error.response?.data);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full px-4 text-sm font-semibold">
          <Plus size={10} />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Invite Member</DialogTitle>
              <DialogDescription>
                Enter the email address and select a role for the person you
                want to invite.
              </DialogDescription>
            </DialogHeader>
            {!!form.formState.errors.root && (
              <FormMessage className="rounded-md border border-red-500 bg-red-500/15 p-2">
                {form.formState.errors.root?.message}
              </FormMessage>
            )}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g., abdullah.ahmad@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Role</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEACHER">Teacher</SelectItem>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              size="sm"
              className="w-full rounded-full font-semibold"
            >
              {form.formState.isSubmitting ? (
                <SpinnerIcon className="animate-spin" />
              ) : (
                "Send Invitation"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
