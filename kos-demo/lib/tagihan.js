// Logika tagihan bulanan — HANYA dipakai di server.
// Sumber penghuni: lib/private.js (penghuni lama) + pesanan online yang lunas (database).
// Status tagihan per kamar per bulan disimpan di key "tagihan:{kamar}:{YYYY-MM}".
import crypto from "crypto";
import { kamar } from "@/lib/rooms";
import { penghuni } from "@/lib/private";
import { dbReady, kamarTerisiDb, ambilOrder, getJSON, setJSON } from "@/lib/db";

export const periodeSekarang = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }).slice(0, 7); // "2026-11"

export const namaPeriode = (periode) =>
  new Date(periode + "-01T00:00:00+07:00").toLocaleDateString("id-ID", { month: "long", year: "numeric", timeZone: "Asia/Jakarta" });

const tambahBulan = (periode, n) => {
  const [y, m] = periode.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 7);
};

// Link bayar ditandatangani supaya tidak bisa ditebak/diubah orang lain
const rahasia = () => process.env.TAGIHAN_SECRET || process.env.MIDTRANS_SERVER_KEY || "rumah-delman-dev";
export const tokenTagihan = (kamarId, periode) =>
  crypto.createHmac("sha256", rahasia()).update(`${kamarId}:${periode}`).digest("hex").slice(0, 20);
export const tokenValid = (kamarId, periode, t) => {
  const a = Buffer.from(tokenTagihan(kamarId, periode));
  const b = Buffer.from(String(t || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
export const linkBayar = (kamarId, periode) => `/bayar/${kamarId}/${periode}?t=${tokenTagihan(kamarId, periode)}`;

// Semua penghuni aktif saat ini
export async function daftarPenghuni() {
  const terisi = dbReady() ? await kamarTerisiDb().catch(() => ({})) : {};
  const hasil = [];
  for (const k of kamar) {
    const p = penghuni[k.id];
    if (p) {
      hasil.push({ kamarId: k.id, nama: p.nama, hp: p.hp, harga: k.harga, masuk: p.masuk, sumber: "file" });
    } else if (terisi[k.id]) {
      const o = await ambilOrder(terisi[k.id]);
      if (o) hasil.push({ kamarId: k.id, nama: o.nama, hp: o.hp, harga: k.harga, masuk: o.tanggalMasuk, sumber: "online", durasi: o.durasi });
    }
  }
  return hasil;
}

// Status tagihan satu penghuni untuk satu periode
export async function statusTagihan(p, periode = periodeSekarang()) {
  const hariMasuk = Math.min(Number(p.masuk.slice(8, 10)) || 1, 28);
  const jatuhTempo = `${periode}-${String(hariMasuk).padStart(2, "0")}`;
  const hariIni = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  const dasar = { kamarId: p.kamarId, nama: p.nama, hp: p.hp, periode, label: namaPeriode(periode), jumlah: p.harga, jatuhTempo };

  // 1. Catatan di database (dibayar lewat link tagihan) selalu menang
  const db = dbReady() ? await getJSON(`tagihan:${p.kamarId}:${periode}`).catch(() => null) : null;
  if (db?.status === "paid") return { ...dasar, lunas: true, tanggalBayar: db.paidAt, via: "online" };

  // 2. Penghuni online: bulan yang sudah dibayar saat booking dianggap lunas
  if (p.sumber === "online") {
    const mulai = p.masuk.slice(0, 7);
    const akhir = tambahBulan(mulai, (p.durasi || 1) - 1);
    if (periode < mulai) return null; // belum masuk
    if (periode <= akhir) return { ...dasar, lunas: true, via: "booking" };
  }

  // 3. Penghuni lama: lihat riwayat di lib/private.js
  if (p.sumber === "file") {
    const t = penghuni[p.kamarId].tagihan.find((x) => x.bulan === dasar.label);
    if (t?.status === "Lunas") return { ...dasar, lunas: true, tanggalBayar: t.tanggalBayar, via: "manual" };
    if (t?.jatuhTempo) dasar.jatuhTempo = t.jatuhTempo;
  }

  return { ...dasar, lunas: false, telat: hariIni > dasar.jatuhTempo };
}

export async function tagihanBulanIni() {
  const periode = periodeSekarang();
  const list = await Promise.all((await daftarPenghuni()).map((p) => statusTagihan(p, periode)));
  return list.filter(Boolean);
}

// ---------- Pembayaran tagihan lewat Midtrans ----------
// order_id format: RT-{kamar}-{YYYYMM}-{timestamp}
export async function simpanOrderTagihan(orderId, data) {
  await setJSON(`tagihanOrder:${orderId}`, data);
}

export async function tandaiTagihanLunas(orderId) {
  const o = await getJSON(`tagihanOrder:${orderId}`);
  if (!o) return null;
  const key = `tagihan:${o.kamarId}:${o.periode}`;
  const ada = await getJSON(key);
  if (ada?.status === "paid") return ada;
  const rec = { status: "paid", paidAt: new Date().toISOString(), orderId, jumlah: o.jumlah };
  await setJSON(key, rec);
  return rec;
}
