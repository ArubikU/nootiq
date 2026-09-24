import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/register(.*)',
  '/about',
  '/contact',
  '/pricing',
  '/privacy',
  '/api/webhook(.*)',
  '/promo',
  '/landing'
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = req.nextUrl.clone();

  // 🔹 Redirect domain "nootiq.vercel.app" → "nootiq.app"
  if (req.nextUrl.hostname === "nootiq.vercel.app") {
    const newUrl = new URL(req.nextUrl.toString());
    newUrl.hostname = "nootiq.app";
    return NextResponse.redirect(newUrl, 308); // 308 = permanent redirect
  }

  // Si el usuario no está autenticado y trata de acceder a una ruta protegida
  if (!userId && !isPublicRoute(req)) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Si el usuario está autenticado y trata de acceder a login/register
  if (userId && (url.pathname === '/login' || url.pathname === '/register')) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Add pathname and search params to headers for SEO
  const response = NextResponse.next();
  response.headers.set('x-pathname', req.nextUrl.pathname);
  response.headers.set('x-search-params', req.nextUrl.searchParams.toString());
  
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
