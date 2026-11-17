import {NextRequest, NextResponse} from "next/server";

export function proxy(request: NextRequest) {
  const expectedUser = process.env.ITINERARY_ADMIN_USER;
  const expectedPassword = process.env.ITINERARY_ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) {
    return process.env.VERCEL ? new NextResponse("Not found", {status: 404}) : NextResponse.next();
  }
  const [scheme, encoded] = (request.headers.get("authorization") || "").split(" ");
  let supplied = "";
  try { supplied = scheme === "Basic" && encoded ? atob(encoded) : ""; } catch { supplied = ""; }
  if (supplied === `${expectedUser}:${expectedPassword}`) return NextResponse.next();
  return new NextResponse("Authentication required", {status: 401, headers: {"WWW-Authenticate": 'Basic realm="Golden Dream itinerary editor"'}});
}

export const config = {matcher: ["/admin/:path*", "/api/itineraries/:path*", "/api/reviews/:path*", "/api/review-categories/:path*", "/api/accommodations/:path*", "/api/site-settings/:path*"]};
