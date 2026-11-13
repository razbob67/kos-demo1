"use client";

import { useEffect, useState } from "react";
import { rupiah } from "@/lib/rooms";

function FotoSlot({ src, label, className = "" }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={label} className={`h-full w-full object-cover ${className}`} />;
  }
  return (
    <div className={`grid h-full w-full place-items-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 ${className}`}>
      <div className="text-center">
        <svg viewBox="0 0 24 24" className="mx-auto h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10" r="1.5" />
          <path d="m21 16-5-5-8 8" />
        </svg>
        <p className="mt-1 text-xs">{label}</p>
      </div>
    </div>
  );
}

export default function RoomModal({ room, onClose }) {
  const [aktif, setAktif] = useState(0);
  const f = room.fasilitas;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const daftar = [
    { ikon: "📐", label: "Ukuran kamar", isi: f.ukuran },
    { ikon: "🛏️", label: "Kasur", isi: f.kasur },
    { ikon: f.pendingin.includes("AC") ? "❄️" : "🌀", label: "Pendingin", isi: f.pendingin },
    { ikon: "📶", label: "Internet", isi: f.wifi },
    { ikon: "🚿", label: "Kamar mandi", isi: f.kamarMandi },
    { ikon: "⚡", label: "Listrik", isi: f.listrik },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail kamar ${room.id}`}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Galeri */}
        <div className="relative">
          <div className="aspect-[16/9] overflow-hidden">
            <FotoSlot src={room.foto[aktif]} label={`Foto ${aktif + 1} — belum diunggah`} />
          </div>
          <button
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg shadow hover:bg-white"
            aria-label="Tutup"
          >
            ✕
          </button>
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${
              room.terisi ? "bg-rose-500" : "bg-emerald-500"
            }`}
          >
            {room.terisi ? "Penuh" : "Kosong"}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 px-5 pt-3">
          {room.foto.map((src, i) => (
            <button
              key={i}
              onClick={() => setAktif(i)}
              className={`aspect-[4/3] overflow-hidden rounded-lg ring-2 transition ${
                aktif === i ? "ring-indigo-500" : "ring-transparent hover:ring-slate-300"
              }`}
              aria-label={`Lihat foto ${i + 1}`}
            >
              <FotoSlot src={src} label={`Foto ${i + 1}`} />
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-sm text-slate-500">Lantai {room.lantai} · {room.tipe}</p>
              <h2 className="text-3xl font-bold">Kamar {room.id}</h2>
            </div>
            <p className="text-2xl font-bold text-indigo-700">
              {rupiah(room.harga)}
              <span className="text-sm font-normal text-slate-500"> /bulan</span>
            </p>
          </div>

          <p className="text-slate-600">{room.deskripsi}</p>

          <div>
            <h3 className="mb-3 font-semibold">Fasilitas</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {daftar.map((d) => (
                <li key={d.label} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                  <span className="text-xl" aria-hidden>{d.ikon}</span>
                  <div>
                    <p className="text-xs text-slate-500">{d.label}</p>
                    <p className="text-sm font-medium">{d.isi}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Perabot</h3>
            <div className="flex flex-wrap gap-2">
              {f.perabot.map((p) => (
                <span key={p} className="rounded-full border border-slate-200 px-3 py-1 text-sm">{p}</span>
              ))}
            </div>
          </div>

          <div
            className={`rounded-xl p-4 text-sm ${
              room.terisi ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {room.terisi
              ? "Kamar ini sedang ditempati. Silakan cek kamar lain yang masih kosong."
              : "Kamar ini tersedia dan bisa langsung ditempati."}
          </div>
        </div>
      </div>
    </div>
  );
}
