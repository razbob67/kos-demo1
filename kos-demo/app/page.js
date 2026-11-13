"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import PublicRooms from "@/components/PublicRooms";
import TenantLogin from "@/components/TenantLogin";
import OwnerDashboard from "@/components/OwnerDashboard";

export default function Home() {
  const [tab, setTab] = useState("publik");

  return (
    <>
      <Navbar tab={tab} setTab={setTab} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {tab === "publik" && <PublicRooms />}
        {tab === "penghuni" && <TenantLogin />}
        {tab === "pemilik" && <OwnerDashboard />}
      </main>
      <footer className="pb-8 text-center text-xs text-slate-400">
        Demo — semua data adalah data dummy.
      </footer>
    </>
  );
}
