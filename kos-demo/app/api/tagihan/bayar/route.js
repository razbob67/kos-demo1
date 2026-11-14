import { NextResponse } from "next/server";
import { SNAP_URL, authHeader } from "@/lib/midtrans";
import { dbReady } from "@/lib/db";
import { daftarPenghuni, statusTagihan, tokenValid, simpanOrderTagihan } from "@/lib/tagihan";

const gagal = (pesan, status = 400) => NextResponse.json({ error: pesan }, { status });

// Membuat transaksi Midtrans untuk membayar tagihan bulanan penghuni
export async function POST(req) {
  const auth = authHeader();
  if (!auth) return gagal("Pembayaran belum dikonfigurasi.", 500);
  if (!dbReady()) return gagal("Database belum tersambung.", 500);

  const { kamarId, periode, t } = await req.json().catch(() => ({}));
  if (!/^\d{4}-\d{2}$/.test(String(periode)) || !tokenValid(kamarId, periode, t)) return gagal("Link tagihan tidak valid.", 403);

  const p = (await daftarPenghuni()).find((x) => x.kamarId === kamarId);
  if (!p) return gagal("Penghuni tidak ditemukan.", 404);
  const tg = await statusTagihan(p, periode);
  if (!tg) return gagal("Tagihan tidak ditemukan.", 404);
  if (tg.lunas) return gagal("Tagihan ini sudah lunas. Terima kasih!");

  const orderId = `RT-${kamarId}-${periode.replace("-", "")}-${Date.now()}`;
  const origin = new URL(req.url).origin;

  const res = await fetch(SNAP_URL, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: auth },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: tg.jumlah },
      item_details: [{ id: `SEWA-${kamarId}-${periode}`, price: tg.jumlah, quantity: 1, name: `Sewa Kamar ${kamarId} ${tg.label}` }],
      customer_details: { first_name: p.nama, phone: p.hp },
      callbacks: { finish: `${origin}/order/selesai` },
    }),
  }).catch(() => null);

  const data = res ? await res.json().catch(() => ({})) : {};
  if (!res?.ok || !data.redirect_url) {
    console.error("Midtrans tagihan error", res?.status, data);
    return gagal("Gagal membuat pembayaran. Coba lagi.", 502);
  }

  await simpanOrderTagihan(orderId, { kamarId, periode, jumlah: tg.jumlah, nama: p.nama, createdAt: new Date().toISOString() });
  return NextResponse.json({ orderId, redirectUrl: data.redirect_url });
}
