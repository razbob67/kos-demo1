import { NextResponse } from "next/server";
import crypto from "crypto";
import { serverKey } from "@/lib/midtrans";
import { tandaiLunas, tandaiGagal } from "@/lib/db";

// Webhook dari Midtrans (isi URL ini di Dashboard Midtrans →
// Settings → Payment → Notification URL: https://<domain>/api/midtrans/notify).
// Tanda tangan dicek supaya notifikasi palsu ditolak.
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
  const ts = n.transaction_status;
  if (ts === "settlement" || (ts === "capture" && n.fraud_status === "accept")) await tandaiLunas(n.order_id);
  else if (["expire", "cancel", "deny", "failure"].includes(ts)) await tandaiGagal(n.order_id, ts);
  return NextResponse.json({ ok: true });
}
