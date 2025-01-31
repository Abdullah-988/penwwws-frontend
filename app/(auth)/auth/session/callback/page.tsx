"use client";

import axios from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useEffect } from "react";

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get("access_token");

        if (token) {
          axios
            .post("api/oauth", { token, provider: "google" })
            .then((res) => {
              setCookie("token", res.headers.authorization);
              router.push("/console");
            })
            .catch((err) => {
              console.error("Error during authentication:", err);
            });
        }
      }
    }
  }, [router]);
};

export default AuthCallback;
