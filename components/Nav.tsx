import Link from "next/link";
import { terminarSessaoOperador } from "@/app/actions";
import type { OperadorSessao } from "@/lib/operador";

const LINKS = [
  { href: "/dashboard", label: "Painel" },
  { href: "/moldes", label: "Moldes" },
  { href: "/stock", label: "Stock" },
  { href: "/problemas", label: "Problemas" },
];

export default function Nav({ operador }: { operador: OperadorSessao }) {
  return (
    <header className="border-b" style={{ borderColor: "var(--color-line)" }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-display text-lg" style={{ color: "var(--color-orange)" }}>
            MoldeTrack
          </Link>
          <nav className="flex gap-4 text-sm font-display">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:opacity-80">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-xs px-3 py-1 rounded-full font-display"
            style={{ background: operador.cor, color: "#1a1a1a" }}
          >
            {operador.nome}
          </span>
          <form action={terminarSessaoOperador}>
            <button type="submit" className="text-xs underline" style={{ color: "var(--color-text-dim)" }}>
              trocar
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
