import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dentroDoHorario } from "./app/lib/horario";

export function proxy(request: NextRequest) {
  if (!dentroDoHorario()) {
    return NextResponse.redirect(new URL("/fora-do-horario", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/conversas/:path*",
    "/chat/:path*",
    "/grupos/:path*",
    "/perfil/:path*",
    "/ti/:path*",
  ],
};