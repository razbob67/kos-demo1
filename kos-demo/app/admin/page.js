import Link from "next/link";
import OwnerDashboard from "@/components/OwnerDashboard";
import { kamar, NAMA_KOS, rupiah } from "@/lib/rooms";
import { penghuni, riwayatPendapatan } from "@/lib/private";
import { headers } from "next/headers";
import { dbReady, daftarOrder, kamarTerisiDb } from "@/lib/db";
import { tagihanBulanIni, linkBayar } from "@/lib/tagihan";
import TagihanPanel from "@/components/TagihanPanel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Rumah Delman", robots: { index: false, follow: false } };

const LABEL = {
  pending: ["Menunggu bayar", "bg-amber-100 text-amber-700"],
  paid: ["Lunas", "bg-emerald-100 text-emerald-700"],
  failed: ["Gagal/Kedaluwarsa", "bg-slate-100 text-slate-500"],
  conflict: ["Lunas, kamar bentrok — refund", "bg-rose-100 text-rose-700"],
};

const waktu = (s) =>
  s ? new Date(s).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short" }) : "-";

export default async function AdminPage() {
  const adaDb = dbReady();
  let orders = [];
  let terisiDb = {};
  try {
    if (adaDb) [orders, terisiDb] = await Promise.all([daftarOrder(50), kamarTerisiDb()]);
  } catch (e) {
    console.error("DB error", e);
  }
  const byId = Object.fromEntries(orders.map((o) => [o.id, o]));

  let tagihan = [];
  try {
    tagihan = await tagihanBulanIni();
  } catch (e) {
    console.error("Tagihan error", e);
  }
  const tagihanKamar = Object.fromEntries(tagihan.map((t) => [t.kamarId, t]));
  const h = headers();
  const origin = `${h.get("x-forwarded-proto") || "https"}://${h.get("host")}`;

  // Gabungkan data penghuni lama (file) + penghuni baru (pesanan online lunas)
  const data = kamar.map((k) => {
    if (penghuni[k.id]) {
      const tg = tagihanKamar[k.id];
      const riwayat = penghuni[k.id].tagihan.map((x) => (tg?.lunas && x.bulan === tg.label ? { ...x, status: "Lunas" } : x));
      return { ...k, penghuni: { nama: penghuni[k.id].nama, tagihan: riwayat } };
    }
    const o = byId[terisiDb[k.id]];
    if (terisiDb[k.id]) {
      return {
        ...k,
        terisi: true,
        online: true,
        penghuni: {
          nama: o?.nama || "(pesanan online)",
          tagihan: [{ bulan: "Nov", jumlah: o?.total || k.harga, status: "Lunas" }],
        },
      };
    }
    return { ...k, penghuni: null };
  });

  const pendapatanOnline = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.total, 0);

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

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <TagihanPanel tagihan={tagihan} origin={origin} linkBayar={linkBayar} />

        <OwnerDashboard kamar={data} riwayatPendapatan={riwayatPendapatan} />

        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold">Pesanan Online</h2>
              <p className="text-sm text-slate-500">
                {adaDb ? `${orders.length} pesanan terakhir · total lunas ${rupiah(pendapatanOnline)}` : "Database belum tersambung — pesanan belum tersimpan."}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Kamar</th>
                  <th className="px-4 py-3">Pemesan</th>
                  <th className="px-4 py-3">Masuk / Durasi</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-400">Belum ada pesanan.</td>
                  </tr>
                )}
                {orders.map((o) => {
                  const [label, cls] = LABEL[o.status] || [o.status, "bg-slate-100"];
                  return (
                    <tr key={o.id}>
                      <td className="px-4 py-3 whitespace-nowrap">{waktu(o.createdAt)}</td>
                      <td className="px-4 py-3 font-semibold">{o.kamarId}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{o.nama}</p>
                        <a href={`https://wa.me/${o.hp.replace(/^0/, "62").replace(/^\+/, "")}`} className="text-xs text-indigo-600 hover:underline" target="_blank" rel="noreferrer">
                          {o.hp} (WhatsApp)
                        </a>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{o.tanggalMasuk} · {o.durasi} bln</td>
                      <td className="px-4 py-3 whitespace-nowrap">{rupiah(o.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>
                        {o.status === "paid" && o.pin && <p className="mt-1 text-xs text-slate-500">PIN: {o.pin}</p>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {adaDb && Object.keys(terisiDb).length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Kosongkan kamar</h2>
            <p className="mb-3 text-sm text-slate-500">Pakai saat penghuni dari pesanan online sudah keluar, supaya kamar bisa dipesan lagi.</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(terisiDb).map((id) => (
                <form key={id} method="POST" action="/admin/kosongkan">
                  <input type="hidden" name="kamarId" value={id} />
                  <button className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">
                    Kosongkan {id}
                  </button>
                </form>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
