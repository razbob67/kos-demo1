import { NextResponse } from "next/server";
import { penghuni } from "@/lib/private";
import { kamar } from "@/lib/rooms";
import { dbReady, penghuniDb } from "@/lib/db";

// PIN dicek di server, jadi PIN penghuni lain tidak pernah sampai ke browser.
export async function POST(req) {
  const { nomor, pin } = await req.json().catch(() => ({}));
  const id = String(nomor || "").trim().toUpperCase();
  let p = penghuni[id];

  // Penghuni baru dari pesanan online
  if (!p && dbReady()) {
    const o = await penghuniDb(id);
    if (o?.pin) {
      p = {
        nama: o.nama,
        pin: o.pin,
        masuk: o.tanggalMasuk,
        tagihan: [{ bulan: `Sewa ${o.durasi} bulan (mulai ${o.tanggalMasuk})`, jumlah: o.total, status: "Lunas", tanggalBayar: o.paidAt }],
      };
    }
  }

  if (!p || p.pin !== String(pin || "")) {
    return NextResponse.json({ error: "Nomor kamar atau PIN salah." }, { status: 401 });
  }

  const k = kamar.find((x) => x.id === id);
  return NextResponse.json({
    kamar: { id: k.id, tipe: k.tipe },
    nama: p.nama,
    masuk: p.masuk,
    tagihan: p.tagihan,
  });
}
