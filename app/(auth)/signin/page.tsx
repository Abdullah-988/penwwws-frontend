"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Eye as EyeIcon,
  EyeOffIcon,
  LoaderCircle as SpinnerIcon,
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { signinFormSchema } from "@/lib/validations";
import { setCookie } from "cookies-next/client";
import { useState } from "react";
import GoogleIcon from "@/public/assets/GoogleIcon";
import PenwwwsIcon from "@/public/assets/PenwwwsIcon";
import { ResetPassword } from "@/components/features/auth/ResetPassword";

type formDataType = z.infer<typeof signinFormSchema>;

export default function SigninPage() {
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
      const res = await axiosInstance.post("/api/sign-in", formData);
      setCookie("token", res.data.token);
      router.push("/console");
    } catch (err) {
      const error = err as AxiosError;
      console.error("Could not sign in: ", error);
      form.setError("root", { message: error.response?.data as string });
    }
  }
  return (
    <div className="flex">
      <aside className="flex min-h-[100vh] w-full items-center justify-center p-4 md:h-screen md:w-3/5 lg:w-1/2">
        <div className="relative flex h-full w-full flex-col items-start justify-center gap-6 md:w-[30rem]">
          <Link
            href="/"
            className="left-0 top-8 flex items-center gap-1 text-lg font-semibold text-primary md:absolute"
          >
            <PenwwwsIcon size={20} />
            <span>Penwwws</span>
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-primary">Sign in</h1>
            <span className="self-start text-muted-foreground">
              Don't have an account?
              <Link
                href="/signup"
                className="px-1 font-semibold text-primary underline"
              >
                Sign up
              </Link>
            </span>
          </div>

          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {!!form.formState.errors && (
                <FormMessage>{form.formState.errors.root?.message}</FormMessage>
              )}

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
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
                    <FormLabel className="text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                        />

                        <button
                          className="absolute right-1 top-0 p-2 text-muted-foreground"
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
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !!form.formState.errors.email ||
                  !!form.formState.errors.password
                }
                className="mt-5 w-full rounded-full disabled:cursor-not-allowed"
              >
                {form.formState.isSubmitting ? (
                  <SpinnerIcon className="animate-spin" size={25} />
                ) : (
                  <span>Sign in</span>
                )}
              </Button>
            </form>
          </Form>

          <div className="flex w-full items-center">
            <span className="h-0.5 flex-grow bg-border"></span>
            <span className="m-1 text-xs font-semibold uppercase text-muted-foreground">
              or continue with
            </span>
            <span className="h-0.5 flex-grow bg-border"></span>
          </div>

          <button
            disabled={form.formState.isSubmitting}
            className="flex w-full items-center justify-center gap-1 rounded-full border p-2 font-semibold text-primary duration-100 hover:bg-muted"
          >
            {form.formState.isSubmitting ? (
              <SpinnerIcon className="animate-spin" size={20} />
            ) : (
              <GoogleIcon />
            )}
            <span>Google</span>
          </button>
        </div>
      </aside>
      <aside className="hidden h-screen bg-green-950 md:block md:w-2/5 lg:w-1/2"></aside>
    </div>
  );
}
