import PenwwwsIcon from "@/components/icons/Penwwws";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-950 p-8 pt-12 pb-4 text-white md:px-16 lg:px-32">
      <div className="flex flex-col items-start justify-between md:flex-row">
        <div className="mb-8">
          <div className="mt-2 mb-5 flex items-center gap-2">
            <PenwwwsIcon className="h-8 w-8" />
            <h2 className="text-3xl font-bold">Penwwws</h2>
          </div>
          <p className="text-white/80 md:w-1/2">
            An all-in-one platform to manage students, staff, classes, and
            school operations—built to make administration simple and efficient.
          </p>
        </div>
        <div className="flex flex-col gap-8 sm:flex-row">
          <div>
            <h3 className="text-lg font-semibold">Links</h3>
            <ul className="mt-2 flex flex-col gap-2">
              <li>
                <Link
                  href="https://github.com/abdullah-988/penwwws-frontend"
                  className="text-white/80 hover:text-white"
                >
                  Github - Frontend
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/abdullah-988/penwwws-backend"
                  className="text-white/80 hover:text-white"
                >
                  Github - Backend
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Product</h3>
            <ul className="mt-2 flex flex-col gap-2">
              <li>
                <Link
                  href="#features"
                  className="text-white/80 hover:text-white"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-white/80 hover:text-white">
                  Q&A
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-16 border-t border-white/20 py-4 text-white/80">
        <p>&copy; 2025 Penwwws. All rights reserved.</p>
      </div>
    </footer>
  );
}
