import Link from "next/link";
import { rupiah } from "@/lib/rooms";
import { daftarPenghuni, statusTagihan, tokenValid } from "@/lib/tagihan";
import BayarTagihanButton from "@/components/BayarTagihanButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bayar Tagihan — Rumah Delman", robots: { index: false } };

const tgl = (s) => new Date(s + "T00:00:00+07:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default async function BayarPage({ params, searchParams }) {
  const kamarId = String(params.kamar).toUpperCase();
  const periode = String(params.periode);
  const t = String(searchParams?.t || "");

  let tg = null;
  if (/^\d{4}-\d{2}$/.test(periode) && tokenValid(kamarId, periode, t)) {
    const p = (await daftarPenghuni()).find((x) => x.kamarId === kamarId);
    if (p) tg = await statusTagihan(p, periode);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="bg-indigo-600 px-6 py-6 text-white">
          <p className="text-sm opacity-80">Rumah Delman</p>
          <h1 className="text-2xl font-bold">Tagihan Sewa Kamar</h1>
        </div>

        <div className="space-y-5 p-6">
          {!tg ? (
            <p className="text-slate-600">Link tagihan tidak valid atau sudah tidak berlaku. Silakan hubungi pemilik kos.</p>
          ) : (
            <>
              <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 text-sm">
                <div className="flex justify-between px-4 py-2.5"><dt className="text-slate-500">Penghuni</dt><dd className="font-medium">{tg.nama}</dd></div>
                <div className="flex justify-between px-4 py-2.5"><dt className="text-slate-500">Kamar</dt><dd className="font-semibold">{tg.kamarId}</dd></div>
                <div className="flex justify-between px-4 py-2.5"><dt className="text-slate-500">Periode</dt><dd>{tg.label}</dd></div>
                <div className="flex justify-between px-4 py-2.5"><dt className="text-slate-500">Jatuh tempo</dt><dd className={tg.telat && !tg.lunas ? "font-semibold text-rose-600" : ""}>{tgl(tg.jatuhTempo)}</dd></div>
                <div className="flex justify-between px-4 py-3 text-base"><dt className="font-semibold">Total</dt><dd className="font-bold text-indigo-700">{rupiah(tg.jumlah)}</dd></div>
              </dl>

              {tg.lunas ? (
                <div className="rounded-xl bg-emerald-50 p-4 text-center text-emerald-700">
                  <p className="text-2xl">✓</p>
                  <p className="font-semibold">Tagihan ini sudah lunas. Terima kasih!</p>
                </div>
              ) : (
                <BayarTagihanButton kamarId={tg.kamarId} periode={tg.periode} t={t} jumlah={rupiah(tg.jumlah)} />
              )}
            </>
          )}
          <Link href="/" className="block text-center text-sm text-indigo-600 hover:underline">Ke halaman Rumah Delman</Link>
        </div>
      </div>
    </main>
  );
}
