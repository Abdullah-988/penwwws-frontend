import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const path = request.nextUrl.pathname;

  const protectedRoutes = path == "/console" || path.includes("/school");

  if (protectedRoutes && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
