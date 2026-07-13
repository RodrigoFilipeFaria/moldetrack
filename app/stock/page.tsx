import { prisma } from "@/lib/prisma";
import { requireOperador } from "@/lib/operador";
import Nav from "@/components/Nav";
import { registarMovimento } from "./actions";

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const operador = await requireOperador();
  const { erro } = await searchParams;

  const pecas = await prisma.peca.findMany({
    orderBy: [{ molde: { codigo: "asc" } }, { codigo: "asc" }],
    include: { molde: true },
  });

  return (
    <main className="min-h-screen">
      <Nav operador={operador} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl mb-6">Stock de peças</h1>
        {erro === "stock_insuficiente" && (
          <p className="mb-4 text-sm flex items-center gap-2" style={{ color: "var(--color-red)" }}>
            <span className="lamp lamp-red" />
            Não é possível registar essa saída: não há stock suficiente.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {pecas.map((p) => {
            const baixo = p.quantidade <= p.stockMinimo;
            return (
              <div key={p.id} className="panel p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                    {p.molde.codigo} &middot; {p.molde.nome}
                  </p>
                  <p className="font-mono text-sm" style={{ color: "var(--color-amber)" }}>
                    {p.codigo}
                  </p>
                  <p>{p.nome}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`lamp ${baixo ? "lamp-red" : "lamp-green"}`} />
                  <span className="font-mono text-xl">{p.quantidade}</span>
                  <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                    min {p.stockMinimo}
                  </span>
                </div>

                <form action={registarMovimento} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="pecaId" value={p.id} />
                  <input type="hidden" name="operadorId" value={operador.id} />
                  <select name="tipo" className="input w-auto" defaultValue="entrada">
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                  <input
                    name="quantidade"
                    type="number"
                    min={1}
                    required
                    placeholder="Qtd"
                    className="input w-20 font-mono"
                  />
                  <input name="motivo" placeholder="Motivo" className="input w-36" />
                  <button type="submit" className="btn btn-secondary text-sm">
                    Registar
                  </button>
                </form>
              </div>
            );
          })}

          {pecas.length === 0 && (
            <p style={{ color: "var(--color-text-dim)" }}>
              Ainda não há peças registadas. Adiciona peças dentro de cada molde.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
