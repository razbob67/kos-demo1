// Helper Midtrans — HANYA dipakai di server (app/api, app/order).
// Server Key diambil dari Environment Variable, JANGAN ditulis di kode.
//   MIDTRANS_SERVER_KEY      = SB-Mid-server-xxxx (sandbox) / Mid-server-xxxx (production)
//   MIDTRANS_IS_PRODUCTION   = "true" kalau sudah live (default: sandbox)

const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const SNAP_URL = isProd
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export const API_BASE = isProd ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com";

export function serverKey() {
  return process.env.MIDTRANS_SERVER_KEY || "";
}

export function authHeader() {
  const key = serverKey();
  if (!key) return null;
  return "Basic " + Buffer.from(key + ":").toString("base64");
}

export const DURASI = [1, 3, 6, 12]; // pilihan lama sewa (bulan)
