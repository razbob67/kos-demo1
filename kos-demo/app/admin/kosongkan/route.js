import { NextResponse } from "next/server";
import { kosongkanKamar } from "@/lib/db";
import { kamar } from "@/lib/rooms";

// Dilindungi password lewat middleware.js (semua path /admin/*)
export async function POST(req) {
  const form = await req.formData();
  const id = String(form.get("kamarId") || "");
  if (kamar.some((k) => k.id === id)) await kosongkanKamar(id);
  return NextResponse.redirect(new URL("/admin", req.url), 303);
}
