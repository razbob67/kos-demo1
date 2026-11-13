// Data RAHASIA: penghuni, PIN, tagihan, dan keuangan.
// JANGAN import file ini dari komponen "use client" — cukup dari app/admin dan app/api.

export const penghuni = {
  A1: {
    nama: "Budi Santoso",
    pin: "1234",
    masuk: "2026-03-01",
    tagihan: [
      { bulan: "November 2026", jumlah: 1500000, status: "Lunas", tanggalBayar: "2026-11-02" },
      { bulan: "Oktober 2026", jumlah: 1500000, status: "Lunas", tanggalBayar: "2026-10-01" },
      { bulan: "September 2026", jumlah: 1500000, status: "Lunas", tanggalBayar: "2026-09-03" },
    ],
  },
  A2: {
    nama: "Siti Rahma",
    pin: "5678",
    masuk: "2026-06-15",
    tagihan: [
      { bulan: "November 2026", jumlah: 1500000, status: "Belum Bayar", jatuhTempo: "2026-11-15" },
      { bulan: "Oktober 2026", jumlah: 1500000, status: "Lunas", tanggalBayar: "2026-10-14" },
      { bulan: "September 2026", jumlah: 1500000, status: "Lunas", tanggalBayar: "2026-09-15" },
    ],
  },
  B2: {
    nama: "Andi Wijaya",
    pin: "4321",
    masuk: "2026-01-10",
    tagihan: [
      { bulan: "November 2026", jumlah: 1000000, status: "Lunas", tanggalBayar: "2026-11-09" },
      { bulan: "Oktober 2026", jumlah: 1000000, status: "Lunas", tanggalBayar: "2026-10-10" },
      { bulan: "September 2026", jumlah: 1000000, status: "Lunas", tanggalBayar: "2026-09-10" },
    ],
  },
};

export const riwayatPendapatan = [
  { bulan: "Jun", total: 3000000 },
  { bulan: "Jul", total: 4000000 },
  { bulan: "Agu", total: 4000000 },
  { bulan: "Sep", total: 4000000 },
  { bulan: "Okt", total: 4000000 },
  { bulan: "Nov", total: 2500000 },
];
