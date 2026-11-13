// Data PUBLIK kamar — aman tampil di browser siapa pun.
// Data penghuni, PIN, dan keuangan ada di lib/private.js (hanya di server).
// Foto ada di folder public/rooms/. Foto pertama dipakai sebagai sampul kartu.

export const NAMA_KOS = "Rumah Delman";

export const kamar = [
  {
    id: "A1",
    lantai: 1,
    tipe: "Kamar Mandi Dalam + AC",
    harga: 1500000,
    terisi: true,
    deskripsi: "Kamar paling luas dengan jendela besar dan gorden blackout. Kamar mandi dalam sudah dilengkapi water heater.",
    fasilitas: {
      ukuran: "3 × 4 m",
      kasur: "Spring bed Queen (160 × 200)",
      pendingin: "AC",
      wifi: "Wi-Fi 50 Mbps (unlimited)",
      kamarMandi: "Kamar mandi dalam: shower + water heater, kloset duduk, bidet",
      perabot: ["Meja kayu & kursi", "Lemari pakaian", "Gorden blackout + vitrase"],
      listrik: "Termasuk harga sewa",
    },
    foto: ["/rooms/A1-1.jpg", "/rooms/A1-2.jpg", "/rooms/A1-3.jpg", "/rooms/A1-4.jpg", "/rooms/A1-5.jpg", "/rooms/A1-6.jpg"],
  },
  {
    id: "A2",
    lantai: 1,
    tipe: "Kamar Mandi Dalam + AC",
    harga: 1500000,
    terisi: true,
    deskripsi: "Kamar dengan pintu langsung menghadap halaman berumput. Kasur double dan kamar mandi dalam.",
    fasilitas: {
      ukuran: "3 × 4 m",
      kasur: "Kasur double",
      pendingin: "AC",
      wifi: "Wi-Fi 50 Mbps (unlimited)",
      kamarMandi: "Kamar mandi dalam: shower, kloset duduk, bidet",
      perabot: ["Meja & kursi rotan", "Lemari dengan cermin", "Rak handuk"],
      listrik: "Termasuk harga sewa",
    },
    foto: ["/rooms/A2-1.jpg", "/rooms/A2-2.jpg", "/rooms/A2-3.jpg"],
  },
  {
    id: "B1",
    lantai: 2,
    tipe: "Kamar Mandi Dalam + AC",
    harga: 1000000,
    terisi: false,
    deskripsi: "Kamar single yang ringkas dan nyaman, kamar mandi dalam lengkap dengan wastafel.",
    fasilitas: {
      ukuran: "3 × 3 m",
      kasur: "Spring bed Single",
      pendingin: "AC",
      wifi: "Wi-Fi 50 Mbps (unlimited)",
      kamarMandi: "Kamar mandi dalam: shower, wastafel, kloset duduk",
      perabot: ["Meja & kursi rotan", "Keset"],
      listrik: "Termasuk harga sewa",
    },
    foto: ["/rooms/B1-1.jpg", "/rooms/B1-2.jpg"],
  },
  {
    id: "B2",
    lantai: 2,
    tipe: "Kamar Mandi Luar + AC",
    harga: 1000000,
    terisi: true,
    deskripsi: "Kamar single dengan meja belajar, cermin, dan lemari. Cocok untuk mahasiswa.",
    fasilitas: {
      ukuran: "3 × 3 m",
      kasur: "Kasur Single",
      pendingin: "AC",
      wifi: "Wi-Fi 50 Mbps (unlimited)",
      kamarMandi: "Kamar mandi luar bersama, shower",
      perabot: ["Meja belajar dengan rak", "Kursi", "Lemari 2 pintu + laci", "Cermin"],
      listrik: "Termasuk harga sewa",
    },
    foto: ["/rooms/B2-1.jpg", "/rooms/B2-2.jpg"],
  },
];

// Fasilitas yang dipakai bersama semua penghuni
export const fasilitasBersama = [
  { nama: "Dapur bersama", keterangan: "Meja dapur & bak cuci piring stainless", foto: "/rooms/dapur.jpg" },
];

export const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
