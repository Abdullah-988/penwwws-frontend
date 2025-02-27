import axios from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";
    const res = await axios.get("/me", { headers: { Authorization: token } });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
