import axios from "@/lib/axiosInstance";
import { getCookie } from "cookies-next";

export async function getUser() {
  try {
    const token = await getCookie("token");
    const res = await axios.get("/me", { headers: { Authorization: token } });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
