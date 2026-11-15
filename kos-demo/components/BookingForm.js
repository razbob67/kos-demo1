"use client";

import { useState } from "react";
import { rupiah, BIAYA_MOBIL } from "@/lib/rooms";

const DURASI = [1, 3, 6, 12];
const hariIni = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

export default function BookingForm({ room, onBack }) {
  const [form, setForm] = useState({ nama: "", hp: "", email: "", tanggalMasuk: hariIni(), durasi: 1, mobil: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const perBulan = room.harga + (form.mobil ? BIAYA_MOBIL : 0);
  const total = perBulan * Number(form.durasi);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, durasi: Number(form.durasi), kamarId: room.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat pesanan.");
      window.location.href = data.redirectUrl; // ke halaman pembayaran Midtrans
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const input =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <form onSubmit={submit} className="space-y-5 p-5 sm:p-6">
      <div>
        <button type="button" onClick={onBack} className="mb-3 text-sm text-indigo-600 hover:underline">
          ← Kembali ke detail kamar
        </button>
        <h2 className="text-2xl font-bold">Pesan Kamar {room.id}</h2>
        <p className="text-sm text-slate-500">{room.tipe} · {rupiah(room.harga)}/bulan</p>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Nama lengkap</span>
        <input required value={form.nama} onChange={set("nama")} maxLength={50} className={input} placeholder="Nama sesuai KTP" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">No. HP / WhatsApp</span>
          <input required inputMode="tel" value={form.hp} onChange={set("hp")} className={input} placeholder="081234567890" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Email <span className="font-normal text-slate-400">(opsional)</span></span>
          <input type="email" value={form.email} onChange={set("email")} className={input} placeholder="nama@email.com" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Tanggal masuk</span>
          <input required type="date" min={hariIni()} value={form.tanggalMasuk} onChange={set("tanggalMasuk")} className={input} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Lama sewa</span>
          <select value={form.durasi} onChange={set("durasi")} className={input}>
            {DURASI.map((d) => (
              <option key={d} value={d}>{d} bulan</option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
        <input
          type="checkbox"
          checked={form.mobil}
          onChange={(e) => setForm((f) => ({ ...f, mobil: e.target.checked }))}
          className="h-4 w-4 accent-indigo-600"
        />
        <span>Saya membawa mobil <span className="text-slate-500">(+{rupiah(BIAYA_MOBIL)}/bulan)</span></span>
      </label>

      <div className="rounded-xl bg-slate-50 p-4">
        <div className="flex justify-between text-sm text-slate-600">
          <span>{rupiah(perBulan)} × {form.durasi} bulan{form.mobil ? " (termasuk mobil)" : ""}</span>
          <span>{rupiah(total)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-lg font-bold">
          <span>Total bayar</span>
          <span className="text-indigo-700">{rupiah(total)}</span>
        </div>
      </div>

      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? "Menyiapkan pembayaran…" : `Bayar ${rupiah(total)}`}
      </button>
      <p className="text-center text-xs text-slate-400">
        Pembayaran diproses aman oleh Midtrans · QRIS, Virtual Account, GoPay, ShopeePay, kartu kredit
      </p>
    </form>
  );
}
