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
  let schoolId = "";
  const token = await getCookie("token", { cookies });
  let errorMessage = "";

  try {
    const res = await axios.post(
      `/invite/${inviteToken}`,
      {},
      {
        headers: { Authorization: token },
      },
    );
    schoolId = res.data.schoolId;
  } catch (err) {
    const error = err as AxiosError;
    errorMessage =
      (error.response?.data as string) || "An unexpected error occurred.";
    console.error(errorMessage);
  }
  if (!errorMessage) {
    redirect(`/school/${schoolId}/home`);
  }
  return (
    <div className="flex h-screen w-full items-center justify-center text-3xl">
      <h1 className="text-destructive">{errorMessage}</h1>
    </div>
  );
}
