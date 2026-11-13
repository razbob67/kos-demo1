"use client";

import { useState } from "react";
import { kamar, rupiah } from "@/lib/rooms";
import RoomModal from "@/components/RoomModal";

export default function PublicRooms() {
  const [dipilih, setDipilih] = useState(null);
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kamar.map((k) => (
          <button
            key={k.id}
            onClick={() => setDipilih(k)}
            className={`group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              k.terisi ? "border-rose-200" : "border-emerald-200"
            }`}
          >
            <div className={`flex items-center justify-between px-5 py-4 ${k.terisi ? "bg-rose-500" : "bg-emerald-500"}`}>
              <span className="text-3xl font-bold text-white">{k.id}</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {k.terisi ? "Penuh" : "Kosong"}
              </span>
            </div>
            <div className="space-y-1 px-5 py-4 text-sm">
              <p className="text-slate-500">Lantai {k.lantai}</p>
              <p className="font-medium">{k.tipe}</p>
              <p className="pt-2 text-lg font-semibold text-slate-900">
                {rupiah(k.harga)}
                <span className="text-xs font-normal text-slate-500"> /bulan</span>
              </p>
              <p className="pt-2 text-xs font-medium text-indigo-600 group-hover:underline">Lihat detail & foto →</p>
            </div>
          </button>
        ))}
      </div>

      {dipilih && <RoomModal room={dipilih} onClose={() => setDipilih(null)} />}
    </section>
  );
}
