import GoogleIcon from "@/components/icons/Google";
import Link from "next/link";

type Props = {
  redirectUrl?: string;
};

export default function GoogleOAuthBtn({ redirectUrl }: Props) {
  const state = !!redirectUrl ? `&state=${redirectUrl}` : "";

  const URL = `https://accounts.google.com/o/oauth2/auth?redirect_uri=http://localhost:3000/auth/session/callback&response_type=token&client_id=${process.env.GOOGLE_CLIENT_ID}&scope=openid%20email%20profile${state}`;
  return (
    <button className="hover:bg-muted w-full cursor-pointer rounded-md border font-semibold duration-100">
      <Link href={URL} className="flex items-center justify-center p-1">
        <GoogleIcon className="size-8" />
        <span>Google</span>
      </Link>
    </button>
  );
}
