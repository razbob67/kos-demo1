import { NextResponse } from "next/server";
import { kamar } from "@/lib/rooms";
import { SNAP_URL, authHeader, DURASI } from "@/lib/midtrans";

const gagal = (pesan, status = 400) => NextResponse.json({ error: pesan }, { status });

// Membuat transaksi Midtrans Snap. Harga SELALU dihitung di server,
// jadi pengunjung tidak bisa mengubah jumlah yang harus dibayar.
export async function POST(req) {
  const auth = authHeader();
  if (!auth) return gagal("Pembayaran belum dikonfigurasi (MIDTRANS_SERVER_KEY kosong).", 500);

  const body = await req.json().catch(() => ({}));
  const k = kamar.find((x) => x.id === String(body.kamarId || "").toUpperCase());
  if (!k) return gagal("Kamar tidak ditemukan.");
  if (k.terisi) return gagal(`Kamar ${k.id} sudah terisi.`);

  const nama = String(body.nama || "").trim();
  const hp = String(body.hp || "").replace(/[\s-]/g, "");
  const email = String(body.email || "").trim();
  const tanggalMasuk = String(body.tanggalMasuk || "");
  const durasi = Number(body.durasi);

  if (nama.length < 2 || nama.length > 50) return gagal("Nama wajib diisi (2–50 karakter).");
  if (!/^(\+62|62|0)8\d{7,12}$/.test(hp)) return gagal("Nomor HP tidak valid. Contoh: 081234567890.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return gagal("Format email tidak valid.");
  if (!DURASI.includes(durasi)) return gagal("Lama sewa tidak valid.");

  const tgl = new Date(tanggalMasuk + "T00:00:00+07:00");
  const hariIni = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }) + "T00:00:00+07:00");
  if (isNaN(tgl) || tgl < hariIni) return gagal("Tanggal masuk tidak boleh sebelum hari ini.");

  const total = k.harga * durasi;
  const orderId = `RD-${k.id}-${Date.now()}`;
  const origin = new URL(req.url).origin;

  const payload = {
    transaction_details: { order_id: orderId, gross_amount: total },
    item_details: [
      { id: `KAMAR-${k.id}`, price: k.harga, quantity: durasi, name: `Sewa Kamar ${k.id} (per bulan)` },
    ],
    customer_details: {
      first_name: nama,
      phone: hp,
      ...(email ? { email } : {}),
    },
    custom_field1: `Masuk: ${tanggalMasuk}`,
    custom_field2: `Durasi: ${durasi} bulan`,
    callbacks: { finish: `${origin}/order/selesai` },
  };

  try {
    const res = await fetch(SNAP_URL, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.redirect_url) {
      console.error("Midtrans error", res.status, data);
      return gagal(data.error_messages?.join(", ") || "Gagal membuat transaksi pembayaran.", 502);
    }
    return NextResponse.json({ orderId, redirectUrl: data.redirect_url });
  } catch (e) {
    console.error(e);
    return gagal("Tidak bisa terhubung ke Midtrans. Coba lagi.", 502);
  }
}
