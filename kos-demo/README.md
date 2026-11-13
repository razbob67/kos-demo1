# Rumah Delman — Demo Manajemen Kos

Next.js 14 (App Router) + Tailwind CSS. Data dummy ada di `lib/rooms.js` (publik) dan `lib/private.js` (rahasia).

## Struktur
```
kos-demo/
├── app/
│   ├── page.js              # Halaman publik: Cek Kamar + Login Penghuni
│   ├── admin/page.js        # Dashboard Pemilik (terkunci password)
│   ├── api/login/route.js   # Cek PIN penghuni di server
│   ├── layout.js, globals.css
├── components/
│   ├── Navbar.js
│   ├── PublicRooms.js       # Grid kamar (bisa diklik)
│   ├── RoomModal.js         # Popup detail kamar + galeri foto
│   ├── TenantLogin.js
│   └── OwnerDashboard.js
├── lib/
│   ├── rooms.js             # Data PUBLIK: kamar, fasilitas, foto
│   └── private.js           # Data RAHASIA: penghuni, PIN, keuangan (server-only)
├── middleware.js            # Password untuk /admin
└── package.json, dll.
```

## Halaman pemilik
Buka `/admin` (atau link kecil "Akses pemilik" di footer). Browser akan minta username & password.

Default demo: `admin` / `delman123`. **Ganti** dengan mengisi Environment Variables di Vercel:
- `ADMIN_USER`
- `ADMIN_PASSWORD`

lalu Redeploy.

## Menambah foto kamar
1. Taruh foto di `public/rooms/`, misal `public/rooms/B1-1.jpg`.
2. Di `lib/rooms.js`, ganti `null` di array `foto` kamar itu: `foto: ["/rooms/B1-1.jpg", "/rooms/B1-2.jpg", null, null]`.
Slot yang masih `null` tampil sebagai placeholder.

## Jalankan lokal
```bash
npm install
npm run dev
```

## Akun demo penghuni
A1 / 1234 · A2 / 5678 · B2 / 4321 (B1 kosong)

## Catatan
Data masih dummy di file. Untuk produksi, pindahkan `lib/private.js` ke database (Supabase, Firebase, dll.).
