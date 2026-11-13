import { NextResponse } from "next/server";

// Melindungi semua halaman /admin dengan username + password (HTTP Basic Auth).
// Atur ADMIN_USER dan ADMIN_PASSWORD di Vercel → Settings → Environment Variables.
export function middleware(req) {
  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASSWORD || "delman123"; // ganti lewat env var!

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const i = decoded.indexOf(":");
    if (decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Akses khusus pemilik.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin Rumah Delman"' },
  });
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
