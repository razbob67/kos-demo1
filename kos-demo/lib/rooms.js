// Data PUBLIK kamar — aman tampil di browser siapa pun.
// Data penghuni, PIN, dan keuangan ada di lib/private.js (hanya di server).

export const NAMA_KOS = "Rumah Delman";
export const BIAYA_MOBIL = 100000; // tambahan per bulan kalau penghuni membawa mobil

const deret = (prefix, dari, sampai, harga) =>
  Array.from({ length: sampai - dari + 1 }, (_, i) => ({ id: `${prefix}${dari + i}`, harga }));

// Daftar kamar & harga sewa per bulan
const DAFTAR = [
  ...deret("A", 1, 9, 2000000),
  ...deret("B", 1, 10, 2100000),
  ...deret("B", 11, 17, 1600000),
  ...deret("C", 1, 9, 1800000),
  { id: "BX1", harga: 3000000 },
  { id: "BX2", harga: 3500000 },
  ...deret("BX", 3, 6, 2100000),
  ...deret("AX", 1, 2, 3000000),
];

// Kamar yang sedang kosong (data dummy)
const KOSONG = ["A7", "B9", "B14", "C3", "C6", "BX4"];

// Foto per kamar (file di public/rooms). Kamar tanpa foto menampilkan placeholder.
const FOTO = {
  B16: ["/rooms/B16-1.jpg", "/rooms/B16-2.jpg", "/rooms/B16-3.jpg"],
  C8: ["/rooms/C8-1.jpg"],
};

// Fasilitas CONTOH — sesuaikan dengan kondisi kamar yang sebenarnya
const FASILITAS = {
  ukuran: "Standar",
  kasur: "Kasur + sprei",
  pendingin: "AC",
  wifi: "Wi-Fi",
  kamarMandi: "Kamar mandi dalam",
  perabot: ["Lemari", "Meja", "Kursi"],
  listrik: "Termasuk harga sewa",
};

export const URUTAN_BLOK = ["A", "AX", "B", "BX", "C"];

export const kamar = DAFTAR.map(({ id, harga }) => {
  const blok = id.replace(/\d+$/, "");
  return {
    id,
    blok,
    tipe: "AC · Kamar mandi dalam",
    harga,
    terisi: !KOSONG.includes(id),
    deskripsi: `Kamar ${id} di Blok ${blok}. Bawa mobil dikenakan tambahan Rp100.000/bulan.`,
    fasilitas: FASILITAS,
    foto: FOTO[id] || [],
  };
});

// Fasilitas yang dipakai bersama semua penghuni
export const fasilitasBersama = [
  { nama: "Dapur bersama", keterangan: "Meja dapur & bak cuci piring stainless", foto: "/rooms/dapur.jpg" },
];

export const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
