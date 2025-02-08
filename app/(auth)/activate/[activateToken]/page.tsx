import axios from "@/lib/axiosInstance";
import { redirect } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { AxiosError } from "axios";

export default async function activateTokenPage({
  params,
}: {
  params: Promise<{ activateToken: string }>;
}) {
  const activateToken = (await params).activateToken;
  let errorMessage = "";

  try {
    await axios.post(`/activate/${activateToken}`, {
      headers: { Authorization: getCookie("token") },
    });
  } catch (err) {
    const error = err as AxiosError;
    errorMessage =
      (error.response?.data as string) || "An unexpected error occurred";
  }

  if (!errorMessage) {
    redirect("/console");
  }

  return (
    <div className="text-destructive flex h-screen w-full items-center justify-center text-3xl">
      <h1>{errorMessage}</h1>
    </div>
  );
}
