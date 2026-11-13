"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import PublicRooms from "@/components/PublicRooms";
import TenantLogin from "@/components/TenantLogin";

export default function HomeClient({ terisiIds }) {
  const [tab, setTab] = useState("publik");

  return (
    <>
      <Navbar tab={tab} setTab={setTab} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {tab === "publik" && <PublicRooms terisiIds={terisiIds} />}
        {tab === "penghuni" && <TenantLogin />}
      </main>
      <footer className="pb-8 text-center text-xs text-slate-400">
        © Rumah Delman · Demo dengan data dummy
      </footer>
    </>
  );
}
