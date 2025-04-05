import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export async function getUser(schoolId: string) {
  try {
    const token = await getCookie("token", { cookies });
    const res = await axios.get(`/me/${schoolId}`, {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
