import Link from "next/link";
import GoogleIcon from "@/public/assets/GoogleIcon";
import PenwwwsIcon from "@/public/assets/PenwwwsIcon";
import SignupForm from "@/components/features/auth/SignupForm";
import AuthPromoAside from "@/components/features/auth/AuthPromoAside";

export default function SignupPage() {
  return (
    <div className="flex">
      <aside className="flex min-h-screen w-full items-center justify-center p-4 md:h-screen md:w-3/5 lg:w-1/2">
        <div className="relative flex h-full w-full flex-col items-start justify-center gap-6 md:w-[30rem]">
          <Link
            href="/"
            className="text-primary top-8 left-0 flex items-center gap-1 text-lg font-semibold md:absolute md:hidden"
          >
            <PenwwwsIcon className="h-5 w-5" />
            <span>Penwwws</span>
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="text-primary text-4xl font-bold">Sign up</h1>
            <span className="text-muted-foreground self-start">
              Already have an account?
              <Link
                href="/signin"
                className="text-primary px-1 font-semibold underline"
              >
                Sign in
              </Link>
            </span>
          </div>
          <SignupForm />

          <div className="flex w-full items-center">
            <span className="bg-border h-0.5 flex-grow"></span>
            <span className="text-muted-foreground m-1 text-xs font-semibold uppercase">
              or continue with
            </span>
            <span className="bg-border h-0.5 flex-grow"></span>
          </div>

          <button className="text-primary hover:bg-muted flex w-full cursor-pointer items-center justify-center gap-1 rounded-full border p-2 font-semibold duration-100">
            <GoogleIcon className="h-8 w-8" />
            <span>Google</span>
          </button>
        </div>
      </aside>
      <AuthPromoAside />
    </div>
  );
}
