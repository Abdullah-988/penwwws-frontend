"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { passwordValidation } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LoaderCircle as SpinnerIcon } from "lucide-react";
import clsx from "clsx";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

const resetPasswordFormSchema = z.object({
  password: passwordValidation,
});

type ResetFormValidation = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token;
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<ResetFormValidation>({
    defaultValues: { password: "" },
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const handleResetPassword = async (data: ResetFormValidation) => {
    try {
      await axios.post(`/user/reset-password/${token}`, data, {
        headers: { Authorization: token },
      });
      setIsSuccess(true);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Failed to reset password", err);

      form.setError(
        "root",
        error.response?.data || "An unknown error occurred",
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-5 bg-green-50">
        <h1 className="font-PT text-primary text-4xl">
          Password Reset Successfully
        </h1>
        <p className="text-muted-foreground w-96 text-center">
          Your password has been successfully reset. You can now use your new
          password and close this tab.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10">
      <div className="flex w-full flex-col items-center justify-center p-8 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="font-PT text-primary text-4xl">Reset Your Password</h1>
          <p className="text-muted-foreground text-lg">
            Enter a new password that&apos;s both secure and easy to remember.
          </p>
        </div>
        <Form {...form}>
          <form
            className="flex w-full flex-col items-center justify-center gap-5 p-6 text-center sm:w-[30rem]"
            onSubmit={form.handleSubmit(handleResetPassword)}
          >
            {form.formState.errors.root && (
              <p className="border-destructive text-destructive bg-destructive/15 rounded-md border px-3 py-1.5 text-sm font-semibold">
                {form.formState.errors.root.message}
              </p>
            )}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-muted-foreground">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        autoFocus
                        {...field}
                        type={isPasswordVisible ? "text" : "password"}
                        className={clsx(
                          "w-full border-b bg-transparent p-2 text-center duration-100 outline-none",
                          {
                            "border-b-destructive":
                              form.formState.errors.password,
                          },
                        )}
                      />
                      {isPasswordVisible ? (
                        <EyeOff
                          className="absolute top-2 right-2 size-5 cursor-pointer"
                          onClick={() => setIsPasswordVisible(false)}
                        />
                      ) : (
                        <>
                          <Eye
                            className="absolute top-2 right-2 size-5 cursor-pointer"
                            onClick={() => setIsPasswordVisible(true)}
                          />
                          <div />
                        </>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                form.formState.isSubmitting || !!form.formState.errors.password
              }
              className="w-40 rounded-full"
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <SpinnerIcon className="animate-spin" />
              ) : (
                <span>Reset</span>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
