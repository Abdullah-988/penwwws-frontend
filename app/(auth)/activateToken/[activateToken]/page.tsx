import axiosInstance from "@/lib/axiosInstance";
import { redirect } from "next/navigation";
import { getCookie } from "cookies-next/client";
import { AxiosError } from "axios";

export default async function activateTokenPage({
  params,
}: {
  params: { activateToken: string };
}) {
  if (!params.activateToken) {
    return (
      <div>
        <h1>Invalid Token</h1>
        <p>Access token is missing or invalid.</p>
      </div>
    );
  }

  await axiosInstance
    .post(
      `/api/activateToken/${params.activateToken}`,
      {},
      { headers: { Authorization: getCookie("token") } },
    )
    .then(() => {
      return redirect("/console");
    })
    .catch((err: AxiosError) => {
      console.error("Error activating token:");

      return (
        <div>
          <h1>Error Activating Token</h1>
          <p>
            {(err.response?.data as string) || "An unexpected error occurred."}
          </p>
        </div>
      );
    });
}
