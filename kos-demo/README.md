# Rumah Delman — Demo Manajemen Kos

Next.js 14 (App Router) + Tailwind CSS. Semua data dummy ada di `lib/data.js`.

## Struktur
```
kos-demo/
├── app/
│   ├── layout.js          # Layout & metadata
│   ├── page.js            # Halaman utama + navigasi tab
│   └── globals.css
├── components/
│   ├── Navbar.js
│   ├── PublicRooms.js     # Tab 1: Cek Kamar (Publik)
│   ├── TenantLogin.js     # Tab 2: Login Penghuni (PIN)
│   └── OwnerDashboard.js  # Tab 3: Dashboard Pemilik
├── lib/data.js            # Data kamar, penghuni, tagihan
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.mjs
└── jsconfig.json
```

## Jalankan lokal
```bash
npm install
npm run dev     # buka http://localhost:3000
```

## Deploy ke Vercel
1. Push folder ini ke repo GitHub.
2. Di vercel.com → **Add New Project** → pilih repo → **Deploy** (framework Next.js terdeteksi otomatis).

Atau lewat CLI: `npm i -g vercel && vercel`.

## Akun demo penghuni
| Kamar | PIN  | Status tagihan Nov |
|-------|------|--------------------|
| A1    | 1234 | Lunas              |
| A2    | 5678 | Belum Bayar        |
| B2    | 4321 | Lunas              |

B1 kosong.

## Catatan
Ini demo: PIN dicek di sisi browser dan Dashboard Pemilik tidak dikunci. Untuk produksi, pindahkan data ke database dan lakukan autentikasi di server (API Route / Server Action).
