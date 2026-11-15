"use client";

import { useState } from "react";
import { kamar as dataKamar, rupiah, URUTAN_BLOK } from "@/lib/rooms";
import RoomModal from "@/components/RoomModal";

export default function PublicRooms({ terisiIds = [] }) {
  const [dipilih, setDipilih] = useState(null);
  const kamar = dataKamar.map((k) => ({ ...k, terisi: k.terisi || terisiIds.includes(k.id) }));
  const kosong = kamar.filter((k) => !k.terisi).length;

  return (
    <section>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ketersediaan Kamar</h1>
          <p className="text-sm text-slate-500">
            {kosong > 0 ? `${kosong} kamar tersedia saat ini.` : "Semua kamar sedang penuh."} Klik kartu untuk melihat detail.
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" /> Kosong</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-500" /> Penuh</span>
        </div>
      </div>

      {URUTAN_BLOK.map((blok) => {
        const isi = kamar.filter((k) => k.blok === blok);
        if (!isi.length) return null;
        const sisa = isi.filter((k) => !k.terisi).length;
        return (
      <div key={blok} className="mb-8">
        <div className="mb-3 flex items-baseline gap-3">
          <h2 className="text-lg font-bold">Blok {blok}</h2>
          <span className="text-sm text-slate-500">{isi.length} kamar · {sisa > 0 ? `${sisa} kosong` : "penuh"}</span>
        </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {isi.map((k) => (
          <button
            key={k.id}
            onClick={() => setDipilih(k)}
            className={`group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              k.terisi ? "border-rose-200" : "border-emerald-200"
            }`}
          >
            <div className={`flex items-center justify-between px-4 py-3 ${k.terisi ? "bg-rose-500" : "bg-emerald-500"}`}>
              <span className="text-2xl font-bold text-white">{k.id}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                {k.terisi ? "Penuh" : "Kosong"}
              </span>
            </div>
            <div className="space-y-1 px-4 py-3 text-sm">
              <p className="text-xs text-slate-500">{k.tipe}</p>
              <p className="text-base font-semibold text-slate-900">
                {rupiah(k.harga)}
                <span className="text-xs font-normal text-slate-500"> /bulan</span>
              </p>
              <p className="pt-2 text-xs font-medium text-indigo-600 group-hover:underline">Lihat detail & foto →</p>
            </div>
          </button>
        ))}
      </div>
      </div>
        );
      })}

      {dipilih && <RoomModal room={dipilih} onClose={() => setDipilih(null)} />}
    </section>
  );
}
