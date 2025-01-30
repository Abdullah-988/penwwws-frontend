"use client";

import { useToast } from "@/hooks/use-toast";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailValidation } from "@/lib/validations";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircle as SpinnerIcon } from "lucide-react";

const resetPasswordSchema = z.object({
  email: emailValidation,
});

type FormDataType = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const { toast } = useToast();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const form = useForm<FormDataType>({
    defaultValues: { email: "" },
    resolver: zodResolver(resetPasswordSchema),
  });

  async function handleSendResetLinkRequest(data: FormDataType) {
    const token = await getCookie("token");
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description:
          "No authentication token found. Please log in and try again.",
      });
      return;
    }

    try {
      await axios.post(
        `/api/user/reset-password`,
        { email: data.email },
        { headers: { Authorization: token } },
      );
      setIsResetModalOpen(false);
      form.reset();
      toast({
        title: "Reset Link Sent",
        description: `A password reset link has been sent to ${data.email}. Please check your inbox.`,
      });
    } catch (err: unknown) {
      const error = err as AxiosError;

      toast({
        variant: "destructive",
        title: "Reset Link Failed",
        description:
          (error.response?.data as string) || "An unexpected error occurred.",
      });
    }
  }

  return (
    <>
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogTrigger asChild>
          <button
            className="p-1 text-sm font-semibold text-primary"
            aria-label="Open reset password dialog"
          >
            Forgot your password?
          </button>
        </DialogTrigger>

        <DialogContent className="flex w-full flex-col justify-between">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">
              Reset Your Password
            </DialogTitle>
            <DialogDescription className="mt-4">
              Please provide your email address below. We will send you a link
              to reset your password.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSendResetLinkRequest)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={form.handleSubmit(handleSendResetLinkRequest)}
                className="w-full rounded-full"
              >
                {form.formState.isSubmitting ? (
                  <SpinnerIcon size={25} className="animate-spin" />
                ) : (
                  <span>Send</span>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
