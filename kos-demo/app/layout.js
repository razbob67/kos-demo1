import "./globals.css";

export const metadata = {
  title: "Rumah Delman — Manajemen Kos",
  description: "Demo aplikasi manajemen kos skala kecil",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased">{children}</body>
    </html>
  );
}
