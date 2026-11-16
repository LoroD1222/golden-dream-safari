import "server-only";

import {createHash, timingSafeEqual} from "node:crypto";
import {NextResponse} from "next/server";

function safeEqual(left: string, right: string) {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

export function requireItineraryAdmin(request: Request) {
  const expectedUser = process.env.ITINERARY_ADMIN_USER;
  const expectedPassword = process.env.ITINERARY_ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return process.env.VERCEL
      ? new NextResponse("Not found", {status: 404})
      : null;
  }

  const authorization = request.headers.get("authorization") || "";
  const [scheme, encoded] = authorization.split(" ");
  let user = "";
  let password = "";

  try {
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf8");
      const separator = decoded.indexOf(":");
      user = separator >= 0 ? decoded.slice(0, separator) : decoded;
      password = separator >= 0 ? decoded.slice(separator + 1) : "";
    }
  } catch {
    user = "";
    password = "";
  }

  if (safeEqual(user, expectedUser) && safeEqual(password, expectedPassword)) return null;

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {"WWW-Authenticate": 'Basic realm="Golden Dream itinerary editor"'},
  });
}

export function requireWritableItineraryStorage() {
  if (process.env.VERCEL) {
    return NextResponse.json(
      {message: "Itinerary editing is disabled on Vercel because its local filesystem is ephemeral. Run the editor on a persistent Node filesystem."},
      {status: 503},
    );
  }
  return null;
}
