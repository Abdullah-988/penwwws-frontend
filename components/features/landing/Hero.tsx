import { FlipWords } from "@/components/ui/flip-words";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="from-primary-950 via-primary-500 bg-gradient-to-b from-10% via-50% to-transparent to-80% px-8 pt-32 duration-200 md:px-16 md:pt-48 lg:px-32">
      <h1
        data-testid="hero"
        className="font-jakarta w-full text-5xl font-extrabold tracking-tight text-white/90 md:text-6xl lg:text-7xl"
      >
        All-in-One <br className="sm:hidden" />
        <FlipWords
          duration={2000}
          className="z-10 text-white/90"
          words={["Education", "College", "School", "Course"]}
        />{" "}
        <br className="hidden sm:block" />
        Management, Simplified.
      </h1>
      <p className="mt-6 mb-8 w-full text-sm text-white/70 md:w-4/5 md:text-lg lg:w-3/5">
        A smart ecosystem built for schools, with seamless subject and
        attendance management — all with lightning-fast performance and a
        beautifully intuitive interface.
      </p>
      <Link
        href="/sign-up"
        className="text-primary-900 rounded-lg bg-white/90 px-8 py-3 font-semibold duration-200 hover:bg-white"
      >
        Get Started
      </Link>
      <Image
        className="mt-16 rounded-xl"
        src="/images/dashboard.png"
        width={3318}
        height={1616}
        priority={true}
        alt="Dashboard"
      />
    </section>
  );
}
