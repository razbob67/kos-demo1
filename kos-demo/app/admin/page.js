import Link from "next/link";
import OwnerDashboard from "@/components/OwnerDashboard";
import { kamar, NAMA_KOS } from "@/lib/rooms";
import { penghuni, riwayatPendapatan } from "@/lib/private";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Rumah Delman", robots: { index: false, follow: false } };

export default function AdminPage() {
  // Gabungkan data publik + rahasia di server; hanya HTML hasil render yang dikirim.
  const data = kamar.map((k) => ({ ...k, penghuni: penghuni[k.id] ? { nama: penghuni[k.id].nama, tagihan: penghuni[k.id].tagihan } : null }));

  return (
    <>
      <header className="border-b border-slate-800 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500 font-bold">RD</div>
            <div>
              <p className="font-semibold leading-tight">{NAMA_KOS}</p>
              <p className="text-xs text-slate-400">Panel Pemilik</p>
            </div>
          </div>
          <Link href="/" className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">
            ← Lihat situs publik
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <OwnerDashboard kamar={data} riwayatPendapatan={riwayatPendapatan} />
      </main>
    </>
  );
}
