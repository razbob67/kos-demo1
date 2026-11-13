import { NextResponse } from "next/server";
import crypto from "crypto";
import { serverKey } from "@/lib/midtrans";

// Webhook dari Midtrans (isi URL ini di Dashboard Midtrans →
// Settings → Payment → Notification URL: https://<domain>/api/midtrans/notify).
// Tanda tangan dicek supaya notifikasi palsu ditolak.
// Catatan: belum ada database, jadi untuk sekarang status hanya dicatat di log Vercel.
export async function POST(req) {
  const n = await req.json().catch(() => ({}));
  const expected = crypto
    .createHash("sha512")
    .update(`${n.order_id}${n.status_code}${n.gross_amount}${serverKey()}`)
    .digest("hex");

  if (!serverKey() || n.signature_key !== expected) {
    return NextResponse.json({ error: "Signature tidak valid" }, { status: 403 });
  }

  console.log(`[Midtrans] ${n.order_id} → ${n.transaction_status} (${n.payment_type}, Rp${n.gross_amount})`);
  return NextResponse.json({ ok: true });
}
