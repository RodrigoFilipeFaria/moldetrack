import { prisma } from "@/lib/prisma";
import { labelEstado, labelGravidade, lampClassEstado, corGravidade, formatarData } from "@/lib/format";

export default async function ChefePage() {
  const [problemasAbertos, pecas, problemas] = await Promise.all([
    prisma.problema.count({ where: { estado: { not: "fechado" } } }),
    prisma.peca.findMany({ include: { molde: true }, orderBy: [{ molde: { codigo: "asc" } }, { codigo: "asc" }] }),
    prisma.problema.findMany({
      orderBy: { createdAt: "desc" },
      include: { molde: true, peca: true, operador: true },
    }),
  ]);

  const pecasBaixas = pecas.filter((p) => p.quantidade <= p.stockMinimo);

  return (
    <main className="min-h-screen">
      <header className="border-b" style={{ borderColor: "var(--color-line)" }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-lg" style={{ color: "var(--color-orange)" }}>
            MoldeTrack &middot; Vista do chefe
          </h1>
          <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            Só leitura
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-10">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="panel p-5">
            <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
              Problemas por resolver
            </p>
            <p className="text-4xl font-mono mt-2">{problemasAbertos}</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
              Peças com stock baixo
            </p>
            <p className="text-4xl font-mono mt-2">{pecasBaixas.length}</p>
          </div>
        </div>

        <section>
          <h2 className="text-lg mb-3">Todos os problemas</h2>
          <div className="flex flex-col gap-3">
            {problemas.map((prob) => (
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
                  {prob.molde.codigo} — {prob.molde.nome}
                  {prob.peca ? ` / ${prob.peca.codigo}` : ""}
                </p>
                <p className="text-sm mt-1">{prob.descricao}</p>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-dim)" }}>
                  {prob.operador.nome} &middot; {formatarData(prob.createdAt)}
                </p>
              </div>
            ))}
            {problemas.length === 0 && (
              <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                Sem problemas registados.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg mb-3">Stock completo</h2>
          <div className="flex flex-col gap-2">
            {pecas.map((p) => {
              const baixo = p.quantidade <= p.stockMinimo;
              return (
                <div key={p.id} className="panel p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                      {p.molde.codigo}
                    </p>
                    <p className="font-mono text-sm" style={{ color: "var(--color-amber)" }}>
                      {p.codigo}
                    </p>
                    <p className="text-sm">{p.nome}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`lamp ${baixo ? "lamp-red" : "lamp-green"}`} />
                    <span className="font-mono">
                      {p.quantidade} / {p.stockMinimo}
                    </span>
                  </div>
                </div>
              );
            })}
            {pecas.length === 0 && (
              <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                Sem peças registadas.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
