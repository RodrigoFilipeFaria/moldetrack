import { prisma } from "@/lib/prisma";
import { requireOperador } from "@/lib/operador";
import Nav from "@/components/Nav";
import { avancarEstado } from "./actions";
import { labelEstado, labelGravidade, lampClassEstado, corGravidade, formatarData } from "@/lib/format";
import Link from "next/link";

const ESTADOS = ["aberto", "em_resolucao", "fechado"] as const;
const PROXIMO_ESTADO: Record<string, string | null> = {
  aberto: "em_resolucao",
  em_resolucao: "fechado",
  fechado: null,
};

export default async function ProblemasPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const operador = await requireOperador();
  const { estado } = await searchParams;
  const filtro = estado && ESTADOS.includes(estado as (typeof ESTADOS)[number]) ? estado : undefined;

  const problemas = await prisma.problema.findMany({
    where: filtro ? { estado: filtro as "aberto" | "em_resolucao" | "fechado" } : undefined,
    orderBy: { createdAt: "desc" },
    include: { molde: true, peca: true, operador: true },
  });

  return (
    <main className="min-h-screen">
      <Nav operador={operador} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <h1 className="text-2xl">Problemas</h1>
          <Link href="/problemas/novo" className="btn btn-primary text-sm">
            + Reportar problema
          </Link>
        </div>

        <div className="flex gap-2 mb-6 text-sm font-display">
          <Link href="/problemas" className={`btn btn-secondary ${!filtro ? "opacity-100" : "opacity-60"}`}>
            Todos
          </Link>
          {ESTADOS.map((e) => (
            <Link
              key={e}
              href={`/problemas?estado=${e}`}
              className={`btn btn-secondary ${filtro === e ? "opacity-100" : "opacity-60"}`}
            >
              {labelEstado(e)}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {problemas.map((prob) => {
            const proximo = PROXIMO_ESTADO[prob.estado];
            return (
              <div key={prob.id} className="panel p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`lamp ${lampClassEstado(prob.estado)}`} />
                    <span className="font-display text-sm">{labelEstado(prob.estado)}</span>
                    <span
                      className="text-xs font-display px-2 py-0.5 rounded"
                      style={{ color: corGravidade(prob.gravidade), border: "1px solid currentColor" }}
                    >
                      {labelGravidade(prob.gravidade)}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                    {prob.operador.nome} &middot; {formatarData(prob.createdAt)}
                  </span>
                </div>

                <p className="font-mono text-xs mt-2" style={{ color: "var(--color-amber)" }}>
                  {prob.molde.codigo} — {prob.molde.nome}
                  {prob.peca ? ` / ${prob.peca.codigo}` : ""}
                </p>
                <p className="mt-2">{prob.descricao}</p>

                {proximo && (
                  <form action={avancarEstado} className="mt-3">
                    <input type="hidden" name="id" value={prob.id} />
                    <input type="hidden" name="novoEstado" value={proximo} />
                    <button type="submit" className="btn btn-secondary text-xs">
                      Avançar para: {labelEstado(proximo)}
                    </button>
                  </form>
                )}
              </div>
            );
          })}

          {problemas.length === 0 && (
            <p style={{ color: "var(--color-text-dim)" }}>Sem problemas nesta vista.</p>
          )}
        </div>
      </div>
    </main>
  );
}
