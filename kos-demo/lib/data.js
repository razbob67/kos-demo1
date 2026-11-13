// Data dummy untuk demo. Ganti dengan database (Supabase, Firebase, dll.) untuk produksi.

export const NAMA_KOS = "Rumah Delman";

export const kamar = [
  {
    id: "A1",
    lantai: 1,
    tipe: "Kamar Mandi Dalam + AC",
    harga: 1500000,
    terisi: true,
    penghuni: {
      nama: "Budi Santoso",
      pin: "1234",
      masuk: "2026-03-01",
      tagihan: [
        { bulan: "November 2026", jumlah: 1500000, status: "Lunas", tanggalBayar: "2026-11-02" },
        { bulan: "Oktober 2026", jumlah: 1500000, status: "Lunas", tanggalBayar: "2026-10-01" },
        { bulan: "September 2026", jumlah: 1500000, status: "Lunas", tanggalBayar: "2026-09-03" },
      ],
    },
  },
  {
    id: "A2",
    lantai: 1,
    tipe: "Kamar Mandi Dalam + AC",
    harga: 1500000,
    terisi: true,
    penghuni: {
      nama: "Siti Rahma",
      pin: "5678",
      masuk: "2026-06-15",
      tagihan: [
        { bulan: "November 2026", jumlah: 1500000, status: "Belum Bayar", jatuhTempo: "2026-11-15" },
        { bulan: "Oktober 2026", jumlah: 1500000, status: "Lunas", tanggalBayar: "2026-10-14" },
        { bulan: "September 2026", jumlah: 1500000, status: "Lunas", tanggalBayar: "2026-09-15" },
      ],
    },
  },
  {
    id: "B1",
    lantai: 2,
    tipe: "Kamar Mandi Luar + Kipas",
    harga: 1000000,
    terisi: false,
    penghuni: null,
  },
  {
    id: "B2",
    lantai: 2,
    tipe: "Kamar Mandi Luar + Kipas",
    harga: 1000000,
    terisi: true,
    penghuni: {
      nama: "Andi Wijaya",
      pin: "4321",
      masuk: "2026-01-10",
      tagihan: [
        { bulan: "November 2026", jumlah: 1000000, status: "Lunas", tanggalBayar: "2026-11-09" },
        { bulan: "Oktober 2026", jumlah: 1000000, status: "Lunas", tanggalBayar: "2026-10-10" },
        { bulan: "September 2026", jumlah: 1000000, status: "Lunas", tanggalBayar: "2026-09-10" },
      ],
    },
  },
];

// Riwayat pendapatan 6 bulan terakhir (dummy) untuk grafik dashboard
export const riwayatPendapatan = [
  { bulan: "Jun", total: 3000000 },
  { bulan: "Jul", total: 4000000 },
  { bulan: "Agu", total: 4000000 },
  { bulan: "Sep", total: 4000000 },
  { bulan: "Okt", total: 4000000 },
  { bulan: "Nov", total: 2500000 },
];

export const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
