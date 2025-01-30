"use client";

import Link from "next/link";
import GoogleIcon from "@/public/assets/GoogleIcon";
import PenwwwsIcon from "@/public/assets/PenwwwsIcon";
import SignupForm from "@/components/features/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex">
      <aside className="flex min-h-screen w-full items-center justify-center p-4 md:h-screen md:w-3/5 lg:w-1/2">
        <div className="relative flex h-full w-full flex-col items-start justify-center gap-6 md:w-[30rem]">
          <Link
            href="/"
            className="left-0 top-8 flex items-center gap-1 text-lg font-semibold text-primary md:absolute"
          >
            <PenwwwsIcon width={20} height={20} />
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
          <SignupForm />

          <div className="flex w-full items-center">
            <span className="h-0.5 flex-grow bg-border"></span>
            <span className="m-1 text-xs font-semibold uppercase text-muted-foreground">
              or continue with
            </span>
            <span className="h-0.5 flex-grow bg-border"></span>
          </div>

          <button className="flex w-full items-center justify-center gap-1 rounded-full border p-2 font-semibold text-primary duration-100 hover:bg-muted">
            <GoogleIcon width={25} height={25} />
            <span>Google</span>
          </button>
        </div>
      </aside>
      <aside className="hidden h-screen items-center justify-center bg-green-950 md:flex md:w-2/5 lg:w-1/2">
        {" "}
        <div className="flex w-[20rem] flex-col items-center justify-center gap-4 text-center">
          <h1 className="center w-[30rem] text-center text-5xl font-bold text-white">
            Effortlessly manage your school with ease.
          </h1>
          <p className="mt-4 text-center text-lg text-muted">
            Simplify administrative tasks, track student progress, and enhance
            learning experiences—all in one place.
          </p>
        </div>
      </aside>
    </div>
  );
}
