import Link from "next/link";
import { API_BASE, authHeader } from "@/lib/midtrans";
import { rupiah } from "@/lib/rooms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Status Pembayaran — Rumah Delman", robots: { index: false } };

// Status selalu dicek ulang langsung ke Midtrans (bukan dari parameter URL),
// supaya tidak bisa dipalsukan dengan mengubah link.
async function cekStatus(orderId) {
  const auth = authHeader();
  if (!auth || !/^RD-[A-Z0-9]+-\d+$/.test(orderId)) return null;
  const res = await fetch(`${API_BASE}/v2/${encodeURIComponent(orderId)}/status`, {
    headers: { Accept: "application/json", Authorization: auth },
    cache: "no-store",
  });
  return res.json().catch(() => null);
}

function nomorBayar(s) {
  if (s.va_numbers?.[0]) return { label: `Virtual Account ${s.va_numbers[0].bank.toUpperCase()}`, nilai: s.va_numbers[0].va_number };
  if (s.permata_va_number) return { label: "Virtual Account PERMATA", nilai: s.permata_va_number };
  if (s.bill_key) return { label: `Mandiri Bill (kode ${s.biller_code})`, nilai: s.bill_key };
  if (s.payment_code) return { label: `Kode bayar ${s.store || ""}`.trim(), nilai: s.payment_code };
  return null;
}

export default async function SelesaiPage({ searchParams }) {
  const orderId = String(searchParams?.order_id || "");
  const s = orderId ? await cekStatus(orderId) : null;
  const kamarId = orderId.split("-")[1];

  let tampil;
  const ts = s?.transaction_status;
  if (!s || s.status_code === "404") {
    tampil = { warna: "bg-slate-500", ikon: "?", judul: "Pesanan tidak ditemukan", teks: "Kami tidak menemukan transaksi ini. Kalau kamu baru saja membayar, tunggu sebentar lalu muat ulang halaman." };
  } else if (ts === "settlement" || (ts === "capture" && s.fraud_status === "accept")) {
    tampil = { warna: "bg-emerald-600", ikon: "✓", judul: "Pembayaran berhasil!", teks: `Kamar ${kamarId} sudah kamu pesan. Pemilik kos akan menghubungi lewat WhatsApp untuk konfirmasi jadwal masuk dan PIN penghuni.` };
  } else if (ts === "pending") {
    tampil = { warna: "bg-amber-500", ikon: "⏳", judul: "Menunggu pembayaran", teks: "Selesaikan pembayaran sebelum batas waktu. Halaman ini akan menampilkan status terbaru setiap kali dimuat ulang." };
  } else {
    tampil = { warna: "bg-rose-600", ikon: "✕", judul: "Pembayaran tidak berhasil", teks: `Status: ${ts || "gagal"}. Kamar belum terpesan, silakan coba pesan lagi.` };
  }

  const bayar = ts === "pending" ? nomorBayar(s) : null;

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className={`${tampil.warna} px-6 py-8 text-center text-white`}>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/20 text-2xl">{tampil.ikon}</div>
          <h1 className="mt-3 text-2xl font-bold">{tampil.judul}</h1>
        </div>
        <div className="space-y-5 p-6">
          <p className="text-slate-600">{tampil.teks}</p>

          {s?.gross_amount && (
            <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 text-sm">
              <div className="flex justify-between px-4 py-2.5"><dt className="text-slate-500">No. pesanan</dt><dd className="font-mono">{orderId}</dd></div>
              <div className="flex justify-between px-4 py-2.5"><dt className="text-slate-500">Kamar</dt><dd className="font-semibold">{kamarId}</dd></div>
              <div className="flex justify-between px-4 py-2.5"><dt className="text-slate-500">Total</dt><dd className="font-semibold">{rupiah(Number(s.gross_amount))}</dd></div>
              {s.payment_type && (
                <div className="flex justify-between px-4 py-2.5"><dt className="text-slate-500">Metode</dt><dd className="capitalize">{s.payment_type.replace(/_/g, " ")}</dd></div>
              )}
            </dl>
          )}

          {bayar && (
            <div className="rounded-xl bg-amber-50 p-4 text-center">
              <p className="text-xs text-amber-700">{bayar.label}</p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-amber-900">{bayar.nilai}</p>
            </div>
          )}

          <Link href="/" className="block rounded-xl bg-indigo-600 py-3 text-center font-semibold text-white hover:bg-indigo-700">
            Kembali ke Rumah Delman
          </Link>
        </div>
      </div>
    </main>
  );
}
