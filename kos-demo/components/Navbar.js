import { NAMA_KOS } from "@/lib/rooms";

const tabs = [
  { id: "publik", label: "Cek Kamar" },
  { id: "penghuni", label: "Login Penghuni" },
];

export default function Navbar({ tab, setTab }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-lg font-bold text-white">RD</div>
          <div>
            <p className="font-semibold leading-tight">{NAMA_KOS}</p>
            <p className="text-xs text-slate-500">Kos nyaman & terjangkau</p>
          </div>
        </div>

        <nav className="flex gap-1 rounded-xl bg-slate-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition sm:flex-none ${
                tab === t.id ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
