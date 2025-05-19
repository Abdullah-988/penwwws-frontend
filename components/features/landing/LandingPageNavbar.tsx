"use client";

import { useEffect, useState } from "react";
import PenwwwsIcon from "@/components/icons/Penwwws";
import clsx from "clsx";
import Link from "next/link";

export default function LandingPageNavbar({
  autoScrolled = false,
}: {
  autoScrolled?: boolean;
}) {
  const [scrolled, setScrolled] = useState(autoScrolled);

  useEffect(() => {
    if (autoScrolled) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [autoScrolled]);

  return (
    <nav
      className={clsx(
        "fixed z-20 flex w-full items-center justify-between px-8 md:px-16 lg:px-32",
        {
          "bg-white p-5 duration-400": scrolled,
          "p-10 duration-200 md:p-16": !scrolled,
        },
      )}
    >
      <Link
        href="/"
        className={clsx(
          "flex items-center justify-center gap-2 p-2 pl-0 duration-200 hover:opacity-80",
          {
            "text-primary-900": scrolled,
            "text-white": !scrolled,
          },
        )}
      >
        <PenwwwsIcon className="size-5 md:size-8" />
        <h1 className="font-bold md:text-2xl">Penwwws</h1>
      </Link>
      <div className="text-sm md:text-base">
        <Link
          className={clsx(
            "mr-2 rounded-md px-4 py-2 font-semibold duration-200",
            {
              "text-primary-900 hover:opacity-80": scrolled,
              "text-white hover:bg-white/20": !scrolled,
            },
          )}
          href="/sign-in"
        >
          Sign In
        </Link>
        <Link
          className={clsx(
            "rounded-md px-4 py-2 font-semibold duration-200 hover:opacity-80",
            {
              "bg-primary-900 text-white": scrolled,
              "text-primary-900 bg-white": !scrolled,
            },
          )}
          href="/sign-up"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
