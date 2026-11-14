import { rupiah } from "@/lib/rooms";

const tgl = (s) => new Date(s + "T00:00:00+07:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

// Nomor 08xx / +628xx → 628xx (format wa.me)
const nomorWa = (hp) => String(hp || "").replace(/[^\d]/g, "").replace(/^0/, "62");

function pesanTagihan(t, link) {
  const sapaan = t.nama.split(" ")[0];
  return [
    `Halo Kak ${sapaan} 👋`,
    ``,
    `Ini pengingat dari *Rumah Delman* 🙏`,
    `Tagihan sewa *Kamar ${t.kamarId}* untuk *${t.label}*:`,
    ``,
    `💰 Jumlah: *${rupiah(t.jumlah)}*`,
    `📅 Jatuh tempo: *${tgl(t.jatuhTempo)}*${t.telat ? " (sudah lewat)" : ""}`,
    ``,
    `Bayar langsung lewat link ini (QRIS / Virtual Account / e-wallet):`,
    link,
    ``,
    `Kalau sudah bayar, abaikan pesan ini ya. Terima kasih! 🏠`,
  ].join("\n");
}

// Server component: daftar penghuni yang belum lunas bulan ini + tombol tagih via WhatsApp
export default function TagihanPanel({ tagihan, origin, linkBayar }) {
  const belum = tagihan.filter((t) => !t.lunas).sort((a, b) => Number(b.telat) - Number(a.telat));
  const label = tagihan[0]?.label || "bulan ini";

  if (belum.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white">✓</span>
        <p className="font-semibold">Semua penghuni sudah lunas untuk {label}. Mantap!</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 pb-3">
        <p className="flex items-center gap-2 font-semibold text-rose-800">
          <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-rose-600 text-xs font-bold text-rose-600">!</span>
          {belum.length} Penghuni Belum Bayar {label}
        </p>
        <p className="text-xs text-rose-700">Klik WhatsApp → pesan tagihan + link bayar sudah terisi, tinggal kirim</p>
      </div>

      <ul className="space-y-3">
        {belum.map((t) => {
          const link = origin + linkBayar(t.kamarId, t.periode);
          const wa = `https://wa.me/${nomorWa(t.hp)}?text=${encodeURIComponent(pesanTagihan(t, link))}`;
          return (
            <li key={t.kamarId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-100 bg-white p-4 shadow-sm">
              <div>
                <span className="rounded-md bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">Kamar {t.kamarId}</span>
                <p className="mt-1.5 font-semibold">{t.nama}</p>
                <p className="text-sm">
                  <span className="font-semibold text-rose-600">{rupiah(t.jumlah)}</span>
                  <span className="text-slate-500"> · jatuh tempo {tgl(t.jatuhTempo)}</span>
                  {t.telat && <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">Menunggak</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Link bayar
                </a>
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
