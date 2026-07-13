import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Rate limiting simples (por instância) para tentativas de login.
const tentativas = new Map<string, { count: number; inicio: number }>();
const JANELA_MS = 5 * 60 * 1000;
const MAX_TENTATIVAS = 15;

function excedeuLimite(ip: string): boolean {
  const agora = Date.now();
  const entrada = tentativas.get(ip);
  if (!entrada || agora - entrada.inicio > JANELA_MS) {
    tentativas.set(ip, { count: 1, inicio: agora });
    return false;
  }
  entrada.count += 1;
  return entrada.count > MAX_TENTATIVAS;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login")) {
    if (request.method === "POST") {
      const ip = request.headers.get("x-forwarded-for") ?? "local";
      if (excedeuLimite(ip)) {
        return new NextResponse(
          "Demasiadas tentativas de login. Espera alguns minutos e tenta novamente.",
          { status: 429 }
        );
      }
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const valido = await verifySessionToken(token);
  if (!valido) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
