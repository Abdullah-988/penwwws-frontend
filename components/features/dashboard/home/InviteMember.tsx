"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  FormMessage,
} from "@/components/ui/form";
import { AxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InvitationLinksList from "@/components/features/dashboard/home/InvitationLinksList";

const generateInvitationLinkSchema = z.object({
  role: z.enum(["TEACHER", "STUDENT", "ADMIN"], {
    required_error: "Please select a role.",
  }),
});

type FormData = z.infer<typeof generateInvitationLinkSchema>;

type Props = {
  schoolId: string;
};

export default function GenerateInvitationLink({ schoolId }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(generateInvitationLinkSchema),
    defaultValues: {
      role: undefined,
    },
  });

  async function onSubmit(data: FormData) {
    const token = await getCookie("token");
    try {
      await axios.post(`/school/${schoolId}/invite`, data, {
        headers: { Authorization: token },
      });
      queryClient.invalidateQueries({ queryKey: ["schoolInvitations"] });
      toast({
        title: "Invitation Link Generated",
        description: `An invitation link has been successfully generated with the role of ${data.role.toLocaleLowerCase()}.`,
      });
    } catch (err) {
      const error = err as AxiosError;
      form.setError("root", { message: error.response?.data as string });
      console.error("Error sending invitation:", error.response?.data);
    }
  }
  return (
    <Dialog onOpenChange={() => form.reset()}>
      <DialogTrigger asChild>
        <Button size="sm" className="px-4 text-sm">
          <Plus size={10} />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Generate and share a link to grant access with the selected
                role.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-end gap-6">
              <FormField
                name="role"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormMessage />
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="mb-0">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STUDENT">Student</SelectItem>
                          <SelectItem value="TEACHER">Teacher</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                size="sm"
              >
                {form.formState.isSubmitting ? (
                  <SpinnerIcon className="animate-spin" />
                ) : (
                  "Generate Link"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <InvitationLinksList schoolId={schoolId} />
      </DialogContent>
    </Dialog>
  );
}
