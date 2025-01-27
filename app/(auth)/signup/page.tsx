"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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
import { useRouter } from "next/navigation";
import { authFormSchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { setCookie } from "cookies-next/client";
import { AxiosError } from "axios";
import { useState } from "react";

type formDataType = z.infer<typeof authFormSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<formDataType>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: formDataType) {
    await axiosInstance
      .post("/api/signup", formData)
      .then((res) => {
        setCookie("token", res.data.token);
        router.push(`/confirm-email?email=${formData.email}`);
      })
      .catch((err: AxiosError) => {
        console.error("Could not sign up: ", err);
        toast({
          variant: "destructive",
          title: "Could not sign up",
          description: (err.response?.data as string) || err.message,
        });
      });
  }

  return (
    <div className="flex">
      <aside className="flex h-screen w-full items-center justify-center p-4 md:w-3/5 lg:w-1/2">
        <div className="relative flex h-screen w-full flex-col items-start justify-center gap-6 md:w-[30rem]">
          <Link
            href="/"
            className="absolute left-0 top-8 flex items-center gap-1 text-lg font-semibold text-primary"
          >
            <Image
              src="/assets/penwwws-icon.svg"
              width={25}
              height={25}
              alt="Penwwws logo"
            />
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
              className="w-full space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
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
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !!form.formState.errors.email ||
                  !!form.formState.errors.password ||
                  !!form.formState.errors.root
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
            className="flex w-full items-center justify-center rounded-full border py-2 font-bold transition duration-100 hover:bg-accent"
          >
            {form.formState.isSubmitting ? (
              <SpinnerIcon className="animate-spin" size={25} />
            ) : (
              <Image
                src="/assets/google-icon.svg"
                width={25}
                height={25}
                alt="Google icon"
              />
            )}
            <span className="px-2 text-primary">Google</span>
          </button>
        </div>
      </aside>
      <aside className="hidden h-screen bg-green-950 md:block md:w-2/5 lg:w-1/2"></aside>
    </div>
  );
}
