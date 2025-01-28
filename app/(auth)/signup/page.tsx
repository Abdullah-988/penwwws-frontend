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
import { signupFormSchema } from "@/lib/validations";
import { setCookie } from "cookies-next/client";
import { useState } from "react";
import GoogleIcon from "@/public/assets/GoogleIcon";
import PenwwwsIcon from "@/public/assets/PenwwwsIcon";

type formDataType = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const form = useForm<formDataType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData: formDataType) {
    const { fullName, email, password } = formData;
    const signupData = { fullName, email, password };

    try {
      const res = await axiosInstance.post("/api/sign-up", signupData);
      setCookie("token", res.data.token);
      router.push(`/confirm-email?email=${formData.email}`);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Could not sign up: ", error);
      form.setError("root", { message: error.response?.data as string });
    }
  }
  return (
    <div className="flex">
      <aside className="flex h-screen w-full items-center justify-center p-4 md:w-3/5 lg:w-1/2">
        <div className="relative flex h-screen w-full flex-col items-start justify-center gap-6 md:w-[30rem]">
          <Link
            href="/"
            className="left-0 top-8 flex items-center gap-1 text-lg font-semibold text-primary md:absolute"
          >
            <PenwwwsIcon size={20} />
            <span>Penwwws</span>
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-primary">Sign up</h1>
            <span className="self-start text-muted-foreground">
              Already have an account?
              <Link
                href="/signin"
                className="px-1 font-semibold text-primary underline"
              >
                Sign in
              </Link>
            </span>
          </div>

          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {!!form.formState.errors.root && (
                <FormMessage>{form.formState.errors.root?.message}</FormMessage>
              )}
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Full name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ahmad Muhsin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
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
                    <FormLabel className="text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="**********"
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
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                        />

                        <button
                          className="absolute right-1 top-0 p-2 text-muted-foreground"
                          onClick={() =>
                            setIsConfirmPasswordVisible((prev) => !prev)
                          }
                          type="button"
                        >
                          {isConfirmPasswordVisible ? (
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
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !!form.formState.errors.email ||
                  !!form.formState.errors.password ||
                  !!form.formState.errors.confirmPassword
                }
                className="mt-5 w-full rounded-full disabled:cursor-not-allowed"
              >
                {form.formState.isSubmitting ? (
                  <SpinnerIcon className="animate-spin" size={25} />
                ) : (
                  <span>Sign up</span>
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
