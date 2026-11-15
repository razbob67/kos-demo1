// Data RAHASIA: penghuni, PIN, tagihan, dan keuangan — SEMUA DUMMY.
// JANGAN import file ini dari komponen "use client" — cukup dari app/admin dan app/api.
import { kamar, BIAYA_MOBIL } from "@/lib/rooms";

// Nama dummy, diisi berurutan ke kamar yang terisi
const NAMA = [
  "Budi Santoso", "Siti Rahma", "Rizky Pratama", "Dewi Lestari", "Fajar Nugroho", "Putri Anggraini",
  "Agus Setiawan", "Maya Sari", "Dimas Saputra", "Andi Wijaya", "Nabila Zahra", "Yoga Permana",
  "Intan Maharani", "Bayu Kurniawan", "Citra Kirana", "Hendra Gunawan", "Laras Wulandari", "Ilham Ramadhan",
  "Tiara Puspita", "Reza Mahendra", "Anisa Fitriani", "Galih Prakoso", "Winda Oktaviani", "Arif Hidayat",
  "Salsa Amelia", "Teguh Wibowo", "Rina Marlina", "Kevin Hartono", "Dinda Safitri", "Wahyu Firmansyah",
  "Melati Ayuningtyas", "Bagas Aditya", "Vina Rosalina", "Eko Prasetyo", "Nadia Kusuma", "Farhan Maulana",
  "Aulia Rahmawati",
];

const PIN_DEMO = { A1: "1234", A2: "5678", B2: "4321" }; // akun demo di halaman login
const MOBIL = ["A3", "B1", "C5", "BX1", "BX2", "AX1"]; // penghuni yang membawa mobil
// Belum bayar November 2026 → tanggal jatuh tempo
const BELUM = { A2: "2026-11-15", A5: "2026-11-05", B4: "2026-11-10", B12: "2026-11-20", C2: "2026-11-08", C9: "2026-11-12", BX3: "2026-11-25" };

const dua = (n) => String(n).padStart(2, "0");

export const penghuni = {};
kamar.filter((k) => k.terisi).forEach((k, i) => {
  const mobil = MOBIL.includes(k.id);
  const jumlah = k.harga + (mobil ? BIAYA_MOBIL : 0);
  const hari = (i * 5) % 27 + 1;
  penghuni[k.id] = {
    nama: NAMA[i % NAMA.length],
    hp: `08120000${1001 + i}`, // nomor dummy — ganti dengan nomor WA asli
    pin: PIN_DEMO[k.id] || String(1000 + ((i + 3) * 7919) % 9000),
    masuk: `202${4 + (i % 3)}-${dua((i * 7) % 12 + 1)}-${dua(hari)}`,
    mobil,
    tagihan: [
      BELUM[k.id]
        ? { bulan: "November 2026", jumlah, status: "Belum Bayar", jatuhTempo: BELUM[k.id] }
        : { bulan: "November 2026", jumlah, status: "Lunas", tanggalBayar: `2026-11-${dua((i % 12) + 1)}` },
      { bulan: "Oktober 2026", jumlah, status: "Lunas", tanggalBayar: `2026-10-${dua((i % 12) + 1)}` },
      { bulan: "September 2026", jumlah, status: "Lunas", tanggalBayar: `2026-09-${dua((i % 12) + 1)}` },
    ],
  };
});

const lunasNov = Object.values(penghuni).reduce((s, p) => s + (p.tagihan[0].status === "Lunas" ? p.tagihan[0].jumlah : 0), 0);

// Riwayat pendapatan 6 bulan terakhir (dummy) untuk grafik dashboard
export const riwayatPendapatan = [
  { bulan: "Jun", total: 68200000 },
  { bulan: "Jul", total: 71500000 },
  { bulan: "Agu", total: 73900000 },
  { bulan: "Sep", total: 75600000 },
  { bulan: "Okt", total: 77100000 },
  { bulan: "Nov", total: lunasNov },
];
