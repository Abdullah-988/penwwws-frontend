import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";

async function getCurrentUser() {
  try {
    const token = await getCookie("token", { cookies });
    const res = await axios("/me", { headers: { Authorization: token } });
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(error.response?.data || "Unexpected error accrued");
    return null;
  }
}

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <div className="bg-primary relative flex h-screen w-full items-center justify-center md:p-6">
      <main className="bg-card relative flex h-screen w-full flex-col justify-center rounded-md p-6 md:h-fit md:max-w-[40rem] md:p-20">
        <h1 className="text-primary font-extralight">{currentUser?.email}</h1>
        {children}
      </main>
    </div>
  );
}
