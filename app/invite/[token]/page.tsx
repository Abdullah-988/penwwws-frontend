import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";

export default async function InviteTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const inviteToken = (await params).token;
  const token = await getCookie("token", { cookies });
  let errorMessage = "";
  try {
    await axios.post(
      `/invite/${inviteToken}`,
      {},
      {
        headers: { Authorization: token },
      },
    );
  } catch (err) {
    const error = err as AxiosError;

    if (error.response?.status === 401) {
      redirect(`/sign-in?invite_token=${inviteToken}`);
    }

    errorMessage =
      (error.response?.data as string) || "An unexpected error occurred.";
    console.error(errorMessage);
  }

  if (!errorMessage) {
    redirect("/console");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center text-3xl">
      <h1 className="text-destructive">{errorMessage}</h1>
    </div>
  );
}
