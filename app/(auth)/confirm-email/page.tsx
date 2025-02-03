import { MailCheck as ConfirmEmailIcon } from "lucide-react";

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams?: Promise<{ email: string }>;
}) {
  const email = (await searchParams)?.email ?? "";

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-green-50 p-8">
      <div className="center text-primary flex w-[35rem] flex-col items-center justify-center gap-6 text-center">
        <ConfirmEmailIcon size={80} />
        <h1 className="text-3xl font-bold">
          Great! Now confirm your email address.
        </h1>
        {email && (
          <p>
            We've sent an email to <strong>{email}</strong>. Click the button
            inside to confirm your email.
          </p>
        )}
      </div>
    </div>
  );
}
