import { rupiah } from "@/lib/rooms";

function Stat({ label, value, sub, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ?? "text-slate-900"}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

// Server component: menerima data dari app/admin/page.js (tidak pernah dikirim ke halaman publik)
export default function OwnerDashboard({ kamar, riwayatPendapatan }) {
  const terisi = kamar.filter((k) => k.terisi);
  const okupansi = Math.round((terisi.length / kamar.length) * 100);

  const tagihanBulanIni = terisi.map((k) => ({ kamar: k, t: k.penghuni.tagihan[0] }));
  const diterima = tagihanBulanIni.filter((x) => x.t.status === "Lunas").reduce((s, x) => s + x.t.jumlah, 0);
  const tunggakan = tagihanBulanIni.filter((x) => x.t.status !== "Lunas").reduce((s, x) => s + x.t.jumlah, 0);
  const potensi = kamar.reduce((s, k) => s + k.harga, 0);

  const maxBar = Math.max(...riwayatPendapatan.map((r) => r.total));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Pemilik</h1>
        <p className="text-sm text-slate-500">Ringkasan bulan November 2026</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Pendapatan Diterima" value={rupiah(diterima)} sub="Bulan ini" accent="text-emerald-600" />
        <Stat label="Belum Dibayar" value={rupiah(tunggakan)} sub={`${tagihanBulanIni.filter((x) => x.t.status !== "Lunas").length} penghuni`} accent="text-amber-600" />
        <Stat label="Kamar Terisi" value={`${terisi.length} / ${kamar.length}`} sub={`${kamar.length - terisi.length} kamar kosong`} />
        <Stat label="Potensi Maksimal" value={rupiah(potensi)} sub="Jika semua kamar terisi" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Grafik pendapatan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="font-semibold">Pendapatan 6 Bulan Terakhir</h2>
          <div className="mt-6 flex h-48 items-end gap-3">
            {riwayatPendapatan.map((r, i) => {
              const last = i === riwayatPendapatan.length - 1;
              return (
                <div key={r.bulan} className="group flex flex-1 flex-col items-center gap-2">
                  <span className="text-[11px] text-slate-500 opacity-0 transition group-hover:opacity-100">
                    {(r.total / 1e6).toFixed(1)} jt
                  </span>
                  <div
                    className={`w-full rounded-t-md transition ${last ? "bg-indigo-600" : "bg-indigo-200 group-hover:bg-indigo-300"}`}
                    style={{ height: `${(r.total / maxBar) * 140}px` }}
                  />
                  <span className="text-xs text-slate-500">{r.bulan}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Okupansi */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="self-start font-semibold">Tingkat Hunian</h2>
          <div
            className="relative mt-4 grid h-36 w-36 place-items-center rounded-full"
            style={{ background: `conic-gradient(#4f46e5 ${okupansi * 3.6}deg, #e2e8f0 0deg)` }}
          >
            <div className="grid h-28 w-28 place-items-center rounded-full bg-white">
              <span className="text-3xl font-bold">{okupansi}%</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            {terisi.length} dari {kamar.length} kamar
          </p>
        </div>
      </div>

      {/* Tabel status kamar */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Kamar</th>
              <th className="px-5 py-3">Penghuni</th>
              <th className="px-5 py-3">Harga</th>
              <th className="px-5 py-3">Tagihan Nov</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kamar.map((k) => {
              const t = k.penghuni?.tagihan[0];
              return (
                <tr key={k.id}>
                  <td className="px-5 py-3 font-semibold">
                    <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${k.terisi ? "bg-rose-500" : "bg-emerald-500"}`} />
                    {k.id}
                  </td>
                  <td className="px-5 py-3">
                    {k.penghuni ? (
                      <>
                        <p>{k.penghuni.nama}{k.penghuni.mobil && <span title="Bawa mobil"> 🚗</span>}</p>
                        {k.penghuni.hp && <p className="text-xs text-slate-400">{k.penghuni.hp}</p>}
                      </>
                    ) : (
                      <span className="text-slate-400">— Kosong —</span>
                    )}
                  </td>
                  <td className="px-5 py-3">{rupiah(k.harga)}</td>
                  <td className="px-5 py-3">
                    {t ? (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          t.status === "Lunas" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
