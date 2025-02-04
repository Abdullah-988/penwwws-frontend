import Link from "next/link";
import GoogleOAuthBtn from "@/components/GoogleOAuthBtn";
import PenwwwsIcon from "@/public/assets/PenwwwsIcon";
import SignupForm from "@/components/features/auth/SignupForm";
import AuthPromoAside from "@/components/features/auth/AuthPromoAside";

export default function SignupPage() {
  return (
    <div className="flex">
      <aside className="flex min-h-screen w-full flex-col items-center justify-between p-4 md:h-screen md:w-2/3 lg:w-1/2">
        <Link
          href="/"
          className="text-primary mb-auto flex items-center gap-1 self-start py-2 text-lg font-semibold md:hidden"
        >
          <PenwwwsIcon className="h-5 w-5" />
          <span>Penwwws</span>
        </Link>
        <div className="flex h-full w-full flex-col items-start justify-center gap-6 md:w-[30rem]">
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

          <GoogleOAuthBtn />
        </div>
      </aside>
      <AuthPromoAside />
    </div>
  );
}
