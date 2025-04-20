import LandingPageNavbar from "@/components/features/landing/LandingPageNavbar";
import Footer from "@/components/shared/Footer";

export default function NotFound() {
  return (
    <>
      <LandingPageNavbar autoScrolled={true} />
      <section>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-primary-900 text-9xl font-bold">404</h1>
            <p className="mt-4 text-2xl font-semibold text-gray-800">
              Oops! Page not found
            </p>
            <p className="mt-2 text-gray-600">
              The page you are looking for does not exist.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
