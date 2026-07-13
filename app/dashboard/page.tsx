import { prisma } from "@/lib/prisma";
import { requireOperador } from "@/lib/operador";
import Nav from "@/components/Nav";
import { labelEstado, labelGravidade, lampClassEstado, corGravidade, formatarData } from "@/lib/format";
import Link from "next/link";

export default async function DashboardPage() {
  const operador = await requireOperador();

  const [problemasAbertos, totalMoldes, pecas, ultimosProblemas] = await Promise.all([
    prisma.problema.count({ where: { estado: { not: "fechado" } } }),
    prisma.molde.count(),
    prisma.peca.findMany({ include: { molde: true } }),
    prisma.problema.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { molde: true, peca: true, operador: true },
    }),
  ]);

  const pecasBaixas = pecas.filter((p) => p.quantidade <= p.stockMinimo);

  return (
    <main className="min-h-screen">
      <Nav operador={operador} />
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-10">
        <div>
          <h1 className="text-2xl mb-1">Olá, {operador.nome}</h1>
          <p style={{ color: "var(--color-text-dim)" }}>Estado geral da fábrica agora.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="panel p-5">
            <div className="flex items-center gap-2">
              <span className="lamp lamp-red" />
              <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                Problemas abertos
              </p>
            </div>
            <p className="text-4xl font-mono mt-2">{problemasAbertos}</p>
          </div>
          <div className="panel p-5">
            <div className="flex items-center gap-2">
              <span className="lamp lamp-amber" />
              <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                Peças com stock baixo
              </p>
            </div>
            <p className="text-4xl font-mono mt-2">{pecasBaixas.length}</p>
          </div>
          <div className="panel p-5">
            <div className="flex items-center gap-2">
              <span className="lamp lamp-green" />
              <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                Moldes registados
              </p>
            </div>
            <p className="text-4xl font-mono mt-2">{totalMoldes}</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link href="/problemas/novo" className="btn btn-primary">
            Reportar problema
          </Link>
          <Link href="/stock" className="btn btn-secondary">
            Ajustar stock
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-lg mb-3">Últimos problemas reportados</h2>
            <div className="flex flex-col gap-3">
              {ultimosProblemas.map((prob) => (
                <div key={prob.id} className="panel p-4">
                  <div className="flex items-center gap-2">
                    <span className={`lamp ${lampClassEstado(prob.estado)}`} />
                    <span className="text-sm font-display">{labelEstado(prob.estado)}</span>
                    <span
                      className="text-xs font-display px-2 py-0.5 rounded ml-auto"
                      style={{ color: corGravidade(prob.gravidade), border: "1px solid currentColor" }}
                    >
                      {labelGravidade(prob.gravidade)}
                    </span>
                  </div>
                  <p className="font-mono text-xs mt-2" style={{ color: "var(--color-amber)" }}>
                    {prob.molde.codigo}
                    {prob.peca ? ` / ${prob.peca.codigo}` : ""}
                  </p>
                  <p className="text-sm mt-1">{prob.descricao}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-dim)" }}>
                    {prob.operador.nome} &middot; {formatarData(prob.createdAt)}
                  </p>
                </div>
              ))}
              {ultimosProblemas.length === 0 && (
                <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                  Sem problemas reportados ainda.
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg mb-3">Peças a precisar de atenção</h2>
            <div className="flex flex-col gap-3">
              {pecasBaixas.map((p) => (
                <div key={p.id} className="panel p-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs" style={{ color: "var(--color-amber)" }}>
                      {p.molde.codigo} / {p.codigo}
                    </p>
                    <p className="text-sm">{p.nome}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="lamp lamp-red" />
                    <span className="font-mono">
                      {p.quantidade} / {p.stockMinimo}
                    </span>
                  </div>
                </div>
              ))}
              {pecasBaixas.length === 0 && (
                <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                  Todas as peças estão acima do stock mínimo.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
