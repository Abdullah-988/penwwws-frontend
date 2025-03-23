import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export async function getMembers(schoolId: string) {
  const token = await getCookie("token", { cookies });
  const res = await axios.get(`/school/${schoolId}/member`, {
    headers: { Authorization: token },
  });
  return res.data;
}
