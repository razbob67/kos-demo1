// Database sederhana pakai Upstash Redis (REST API) — HANYA dipakai di server.
// Env var otomatis terisi kalau database dibuat dari Vercel → Storage:
//   KV_REST_API_URL + KV_REST_API_TOKEN   (atau UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
// Kalau env var belum ada, aplikasi tetap jalan seperti mode demo (tanpa menyimpan pesanan).
import crypto from "crypto";

const DB_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const DB_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const dbReady = () => Boolean(DB_URL && DB_TOKEN);

async function cmd(...args) {
  if (!dbReady()) return null;
  const res = await fetch(DB_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${DB_TOKEN}` },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const j = await res.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

export async function getJSON(key) {
  const v = await cmd("GET", key);
  return v ? JSON.parse(v) : null;
}

export async function setJSON(key, val) {
  await cmd("SET", key, JSON.stringify(val));
}

// ---------- Pesanan ----------
export async function simpanOrder(o) {
  await cmd("SET", `order:${o.id}`, JSON.stringify(o));
  await cmd("LPUSH", "orders", o.id);
}

export async function ambilOrder(id) {
  const v = await cmd("GET", `order:${id}`);
  return v ? JSON.parse(v) : null;
}

async function updateOrder(o) {
  await cmd("SET", `order:${o.id}`, JSON.stringify(o));
}

export async function daftarOrder(n = 50) {
  const ids = (await cmd("LRANGE", "orders", 0, n - 1)) || [];
  if (!ids.length) return [];
  const vals = (await cmd("MGET", ...ids.map((i) => `order:${i}`))) || [];
  return vals.filter(Boolean).map((v) => JSON.parse(v));
}

// ---------- Kamar terisi ----------
// Hash "occupied": { A1: orderId, B1: orderId, ... }
export async function kamarTerisiDb() {
  const flat = (await cmd("HGETALL", "occupied")) || [];
  const map = {};
  for (let i = 0; i < flat.length; i += 2) map[flat[i]] = flat[i + 1];
  return map;
}

// Dipanggil saat Midtrans mengonfirmasi pembayaran lunas. Aman dipanggil berkali-kali.
export async function tandaiLunas(orderId) {
  const o = await ambilOrder(orderId);
  if (!o || o.status === "paid" || o.status === "conflict") return o;

  const berhasil = await cmd("HSETNX", "occupied", o.kamarId, o.id);
  if (berhasil === 1) {
    o.status = "paid";
    o.pin = String(crypto.randomInt(1000, 10000));
  } else {
    // Kamar sudah keburu dibayar pesanan lain → perlu refund manual oleh pemilik
    o.status = "conflict";
  }
  o.paidAt = new Date().toISOString();
  await updateOrder(o);
  return o;
}

export async function tandaiGagal(orderId, alasan) {
  const o = await ambilOrder(orderId);
  if (!o || o.status !== "pending") return o;
  o.status = "failed";
  o.alasan = alasan;
  await updateOrder(o);
  return o;
}

// Kosongkan kamar lagi (dipakai pemilik dari dashboard)
export async function kosongkanKamar(kamarId) {
  await cmd("HDEL", "occupied", kamarId);
}

// Penghuni baru (dari pesanan online) untuk login PIN
export async function penghuniDb(kamarId) {
  const map = await kamarTerisiDb();
  const id = map[kamarId];
  return id ? ambilOrder(id) : null;
}
