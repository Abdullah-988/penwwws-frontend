"use client";

import axios from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";

const AuthCallback = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;

      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get("access_token");

        if (token) {
          axios
            .post("/oauth", { token, provider: "google" })
            .then(async (res) => {
              const redirectUrl = params.get("state") ?? "/console";
              setCookie("token", res.headers.authorization, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/",
              });
              router.push(redirectUrl);
            })

            .catch((err) => {
              console.error("Error during authentication:", err);
              setError(err.response.data);
            });
        }
      }
    }
  }, [router]);

  return (
    <div className="text-destructive flex h-screen w-full items-center justify-center text-xl font-semibold">
      <h1>{error}</h1>
    </div>
  );
};

export default AuthCallback;
