import LandingPageNavbar from "@/components/features/landing/LandingPageNavbar";
import Footer from "@/components/shared/Footer";

import Features from "@/components/features/landing/Features";
import Hero from "@/components/features/landing/Hero";
import FAQ from "@/components/features/landing/FAQ";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <LandingPageNavbar />
      <Hero />
      <Features />
      <FAQ />
      <section className="p-8 text-white md:px-16">
        <div className="bg-primary-900 rounded-xl p-8 md:p-16">
          <h2 className="font-jakarta text-xl font-bold sm:text-4xl sm:leading-12 md:text-6xl md:leading-16 lg:w-1/2">
            Ready to Run Your School Smarter?
          </h2>
          <p className="mb-4 text-sm sm:mt-6 sm:text-lg md:mb-8 lg:w-1/2">
            From enrollment to attendance, get everything set up quickly and
            start managing with confidence.
          </p>
          <Link
            href="/sign-in"
            className="text-primary-900 rounded-md bg-white p-2 px-3 text-sm font-semibold duration-200 hover:opacity-90 md:p-3 md:px-5 md:text-base"
          >
            Get Started
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
