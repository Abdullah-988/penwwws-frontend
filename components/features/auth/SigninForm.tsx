"use client";

import axios from "@/lib/axiosInstance";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next/client";
import { useState } from "react";
import { signinFormSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { EyeOffIcon, EyeIcon, LoaderCircle as SpinnerIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ResetPassword } from "@/components/features/auth/ResetPassword";

type formDataType = z.infer<typeof signinFormSchema>;

type Props = {
  redirectUrl: string;
};

export default function SigninForm({ redirectUrl }: Props) {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<formDataType>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: formDataType) {
    try {
      const res = await axios.post("/login", formData);
      setCookie("token", res.headers.authorization, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      router.push(redirectUrl);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Could not sign in: ", error);
      form.setError("root", { message: error.response?.data as string });
    }
  }
  return (
    <Form {...form}>
      <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
              <FormLabel className="text-muted-foreground">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    {...field}
                  />

                  <button
                    className="text-muted-foreground absolute top-0 right-1 p-2"
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    type="button"
                  >
                    {isPasswordVisible ? (
                      <EyeOffIcon size={25} />
                    ) : (
                      <EyeIcon size={25} />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ResetPassword />

        <Button
          disabled={
            form.formState.isSubmitting ||
            !!form.formState.errors.email ||
            !!form.formState.errors.password
          }
          className="mt-5 w-full disabled:cursor-not-allowed"
        >
          {form.formState.isSubmitting && (
            <SpinnerIcon className="animate-spin" size={25} />
          )}
          <span>Sign in</span>
        </Button>
      </form>
    </Form>
  );
}
