import { getCookie } from "cookies-next";
import axios from "@/lib/axiosInstance";
import { AxiosError } from "axios";

export async function getSchools() {
  try {
    const token = await getCookie("token");
    const res = await axios.get("/school", {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error(error.response?.data || "Unexpected error occurred");
  }
}
