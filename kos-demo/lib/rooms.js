// Data PUBLIK kamar — aman tampil di browser siapa pun.
// Data penghuni, PIN, dan keuangan ada di lib/private.js (hanya di server).

export const NAMA_KOS = "Rumah Delman";

export const kamar = [
  {
    id: "A1",
    lantai: 1,
    tipe: "Kamar Mandi Dalam + AC",
    harga: 1500000,
    terisi: true,
    deskripsi: "Kamar depan dengan jendela besar menghadap taman, cahaya pagi masuk.",
    fasilitas: {
      ukuran: "3 × 4 m",
      kasur: "Spring bed Queen (160 × 200)",
      pendingin: "AC 1/2 PK",
      wifi: "Wi-Fi 50 Mbps (unlimited)",
      kamarMandi: "Kamar mandi dalam, shower + water heater, kloset duduk",
      perabot: ["Lemari 2 pintu", "Meja & kursi belajar", "Cermin", "Rak sepatu"],
      listrik: "Termasuk harga sewa",
    },
    // Isi dengan path foto di folder /public, misal "/rooms/A1-1.jpg"
    foto: [null, null, null, null],
  },
  {
    id: "A2",
    lantai: 1,
    tipe: "Kamar Mandi Dalam + AC",
    harga: 1500000,
    terisi: true,
    deskripsi: "Kamar sudut yang tenang, dekat dapur bersama.",
    fasilitas: {
      ukuran: "3 × 4 m",
      kasur: "Spring bed Queen (160 × 200)",
      pendingin: "AC 1/2 PK",
      wifi: "Wi-Fi 50 Mbps (unlimited)",
      kamarMandi: "Kamar mandi dalam, shower + water heater, kloset duduk",
      perabot: ["Lemari 2 pintu", "Meja & kursi belajar", "Cermin"],
      listrik: "Termasuk harga sewa",
    },
    foto: [null, null, null, null],
  },
  {
    id: "B1",
    lantai: 2,
    tipe: "Kamar Mandi Luar + Kipas",
    harga: 1000000,
    terisi: false,
    deskripsi: "Kamar lantai 2 dengan sirkulasi udara baik, akses ke balkon jemur.",
    fasilitas: {
      ukuran: "3 × 3 m",
      kasur: "Kasur busa Single (120 × 200)",
      pendingin: "Kipas angin dinding",
      wifi: "Wi-Fi 50 Mbps (unlimited)",
      kamarMandi: "Kamar mandi luar bersama (1 untuk 2 kamar), shower",
      perabot: ["Lemari 1 pintu", "Meja belajar", "Gantungan baju"],
      listrik: "Termasuk harga sewa",
    },
    foto: [null, null, null, null],
  },
  {
    id: "B2",
    lantai: 2,
    tipe: "Kamar Mandi Luar + Kipas",
    harga: 1000000,
    terisi: true,
    deskripsi: "Kamar lantai 2 dekat tangga, dekat area jemur.",
    fasilitas: {
      ukuran: "3 × 3 m",
      kasur: "Kasur busa Single (120 × 200)",
      pendingin: "Kipas angin dinding",
      wifi: "Wi-Fi 50 Mbps (unlimited)",
      kamarMandi: "Kamar mandi luar bersama (1 untuk 2 kamar), shower",
      perabot: ["Lemari 1 pintu", "Meja belajar", "Gantungan baju"],
      listrik: "Termasuk harga sewa",
    },
    foto: [null, null, null, null],
  },
];

export const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
