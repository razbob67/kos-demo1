import HomeClient from "@/components/HomeClient";
import { dbReady, kamarTerisiDb } from "@/lib/db";

// Status kamar dibaca ulang setiap halaman dibuka (supaya kamar yang baru dibayar langsung "Penuh")
export const dynamic = "force-dynamic";

export default async function Home() {
  let terisiIds = [];
  try {
    if (dbReady()) terisiIds = Object.keys(await kamarTerisiDb());
  } catch (e) {
    console.error("DB error", e);
  }
  return <HomeClient terisiIds={terisiIds} />;
}
