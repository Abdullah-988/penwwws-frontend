import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { cookies } from "next/headers";

export async function getSubjects(schoolId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";

    const res = await axios.get(`/school/${schoolId}/subject`, {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(error.response?.data || "Unexpected error occurred");
  }
}
