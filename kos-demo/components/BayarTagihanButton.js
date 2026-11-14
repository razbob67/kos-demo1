"use client";

import { useState } from "react";

export default function BayarTagihanButton({ kamarId, periode, t, jumlah }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bayar = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tagihan/bayar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kamarId, periode, t }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat pembayaran.");
      window.location.href = data.redirectUrl;
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}
      <button
        onClick={bayar}
        disabled={loading}
        className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Menyiapkan pembayaran…" : `Bayar ${jumlah}`}
      </button>
      <p className="text-center text-xs text-slate-400">QRIS · Virtual Account · GoPay · ShopeePay · Kartu kredit (via Midtrans)</p>
    </div>
  );
}
