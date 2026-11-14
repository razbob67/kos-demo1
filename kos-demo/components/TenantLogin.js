"use client";

import { useState } from "react";
import { rupiah } from "@/lib/rooms";

const tanggal = (s) => new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function TenantLogin() {
  const [nomor, setNomor] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomor, pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal masuk.");
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setNomor("");
    setPin("");
  };

  if (user) {
    const b = user.tagihanBulanIni;
    const t0 = user.tagihan[0];
    const bulanIni = b
      ? { bulan: b.label, jumlah: b.jumlah, lunas: b.lunas, tanggalBayar: b.tanggalBayar, jatuhTempo: b.jatuhTempo, bayarUrl: b.bayarUrl }
      : { bulan: t0.bulan, jumlah: t0.jumlah, lunas: t0.status === "Lunas", tanggalBayar: t0.tanggalBayar, jatuhTempo: t0.jatuhTempo };
    const lunas = bulanIni.lunas;

    return (
      <section className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Selamat datang,</p>
            <h1 className="text-2xl font-bold">{user.nama}</h1>
            <p className="text-sm text-slate-500">Kamar {user.kamar.id} · Penghuni sejak {tanggal(user.masuk)}</p>
          </div>
          <button onClick={logout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
            Keluar
          </button>
        </div>

        <div className={`rounded-2xl p-6 text-white shadow ${lunas ? "bg-emerald-600" : "bg-amber-500"}`}>
          <p className="text-sm opacity-90">Tagihan {bulanIni.bulan}</p>
          <p className="mt-1 text-3xl font-bold">{rupiah(bulanIni.jumlah)}</p>
          <p className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            {lunas
              ? `✓ Lunas${bulanIni.tanggalBayar ? ` — dibayar ${tanggal(bulanIni.tanggalBayar)}` : ""}`
              : `Belum dibayar${bulanIni.jatuhTempo ? ` — jatuh tempo ${tanggal(bulanIni.jatuhTempo)}` : ""}`}
          </p>
          {!lunas && bulanIni.bayarUrl && (
            <a
              href={bulanIni.bayarUrl}
              className="mt-4 block rounded-xl bg-white py-3 text-center font-semibold text-amber-700 transition hover:bg-amber-50"
            >
              Bayar sekarang →
            </a>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-200 px-5 py-3 font-semibold">Riwayat Tagihan</h2>
          <ul className="divide-y divide-slate-100">
            {user.tagihan.map((t) => (
              <li key={t.bulan} className="flex items-center justify-between px-5 py-3 text-sm">
                <span>{t.bulan}</span>
                <span className="flex items-center gap-3">
                  {rupiah(t.jumlah)}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      t.status === "Lunas" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-sm">
      <form onSubmit={handleLogin} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold">Login Penghuni</h1>
          <p className="text-sm text-slate-500">Masukkan nomor kamar dan PIN 4 digit.</p>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Nomor Kamar</span>
          <input
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            placeholder="contoh: A1"
            maxLength={3}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 uppercase outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">PIN</span>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="••••"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 tracking-[0.5em] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={!nomor || pin.length !== 4 || loading}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Memeriksa…" : "Masuk"}
        </button>

        <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          <p className="font-semibold text-slate-600">Akun demo:</p>
          <p>A1 / 1234 · A2 / 5678 · B2 / 4321</p>
        </div>
      </form>
    </section>
  );
}
