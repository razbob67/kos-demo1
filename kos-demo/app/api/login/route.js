import { NextResponse } from "next/server";
import { penghuni } from "@/lib/private";
import { kamar } from "@/lib/rooms";
import { dbReady, penghuniDb } from "@/lib/db";
import { daftarPenghuni, statusTagihan, linkBayar } from "@/lib/tagihan";

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

  // Status tagihan bulan ini (termasuk yang dibayar lewat link tagihan)
  let bulanIni = null;
  try {
    const info = (await daftarPenghuni()).find((x) => x.kamarId === id);
    if (info) bulanIni = await statusTagihan(info);
  } catch (e) {
    console.error(e);
  }

  const tagihan = p.tagihan.map((t) =>
    bulanIni?.lunas && t.bulan === bulanIni.label ? { ...t, status: "Lunas", tanggalBayar: bulanIni.tanggalBayar || t.tanggalBayar } : t
  );
  if (bulanIni && !tagihan.some((t) => t.bulan === bulanIni.label)) {
    tagihan.unshift({ bulan: bulanIni.label, jumlah: bulanIni.jumlah, status: bulanIni.lunas ? "Lunas" : "Belum Bayar", jatuhTempo: bulanIni.jatuhTempo, tanggalBayar: bulanIni.tanggalBayar });
  }

  return NextResponse.json({
    kamar: { id: k.id, tipe: k.tipe },
    nama: p.nama,
    masuk: p.masuk,
    tagihan,
    tagihanBulanIni: bulanIni && {
      label: bulanIni.label,
      jumlah: bulanIni.jumlah,
      lunas: bulanIni.lunas,
      jatuhTempo: bulanIni.jatuhTempo,
      tanggalBayar: bulanIni.tanggalBayar,
      bayarUrl: bulanIni.lunas ? null : linkBayar(id, bulanIni.periode),
    },
  });
}
