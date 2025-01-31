"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
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
import { signupFormSchema } from "@/lib/validations";

type formDataType = z.infer<typeof signupFormSchema>;

export default function SignupForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
    // TODO:Make it  fullname and remove fullname: after updating backend to use "fullName" instead of "fullname".
    const signupData = { fullname: fullName, email, password };

    try {
      const res = await axios.post("/register", signupData);
      setCookie("token", res.headers.authorization);
      router.push(`/confirm-email?email=${formData.email}`);
    } catch (err) {
      const error = err as AxiosError;
      console.error("Could not sign up: ", error);
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
          name="fullName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Full name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Ahmad Muhsin" {...field} />
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
              <FormLabel className="text-muted-foreground">Email</FormLabel>
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
              <FormLabel className="text-muted-foreground">Password</FormLabel>
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
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Confirm your password"
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
  );
}
