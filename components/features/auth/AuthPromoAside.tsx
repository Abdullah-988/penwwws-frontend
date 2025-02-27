import Link from "next/link";
import PenwwwsIcon from "@/components/icons/Penwwws";

export default function AuthPromoAside() {
  return (
    <aside className="text-primary-foreground relative hidden h-screen items-center justify-center bg-green-950 bg-[url(/images/background-image.jpg)] bg-cover bg-no-repeat p-8 md:flex lg:w-1/2">
      {" "}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-lg font-semibold"
      >
        <PenwwwsIcon className="size-6" />
        <span>Penwwws</span>
      </Link>
      <div className="flex flex-col items-center justify-center gap-4 text-center lg:w-[30rem]">
        <h1 className="center text-center font-bold text-white md:text-4xl lg:text-5xl">
          Effortlessly manage your school with ease.
        </h1>
        <p className="text-muted mt-4 text-center text-lg">
          Simplify administrative tasks, track student progress, and enhance
          learning experiences—all in one place.
        </p>
      </div>
    </aside>
  );
}
