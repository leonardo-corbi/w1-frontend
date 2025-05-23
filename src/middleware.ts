import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Obtém o token de acesso dos cookies
  const token = request.cookies.get("access_token")?.value;

  // Verifica se o usuário está tentando acessar uma rota protegida
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname === "/me";

  // Se for uma rota protegida e não tiver token, redireciona para login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se estiver tentando acessar login/registro e já estiver autenticado, redireciona para dashboard
  if (
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register") &&
    token
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configuração para aplicar o middleware apenas nas rotas especificadas
export const config = {
  matcher: ["/dashboard/:path*", "/me", "/login", "/register"],
};
