"use client";

import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailValidation } from "@/lib/validations";
import { useState } from "react";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
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
    try {
      await axios.post("/user/reset-password", data);
      setIsResetModalOpen(false);
      form.reset();
      toast({
        title: "Reset Link Sent",
        description: `A password reset link has been sent to ${data.email}. Please check your inbox.`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Reset Link Failed",
        description:
          ((err as AxiosError).response?.data as string) ||
          "An unexpected error occurred.",
      });
    }
  }

  return (
    <>
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="text-primary p-1 text-sm font-semibold"
            aria-label="Open reset password dialog"
          >
            Forgot your password?
          </Button>
        </DialogTrigger>

        <DialogContent className="flex w-full flex-col justify-between">
          <DialogHeader>
            <DialogTitle className="text-primary text-xl">
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
                        placeholder="abdullah@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                onClick={form.handleSubmit(handleSendResetLinkRequest)}
                className="w-full"
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
