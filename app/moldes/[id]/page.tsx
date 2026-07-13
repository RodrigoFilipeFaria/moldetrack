import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOperador } from "@/lib/operador";
import Nav from "@/components/Nav";
import PinConfirmForm from "@/components/PinConfirmForm";
import { criarPeca, apagarPeca, apagarMolde } from "../actions";
import { criarProblema } from "@/app/problemas/actions";
import { labelEstado, labelGravidade, lampClassEstado, corGravidade, formatarData } from "@/lib/format";
import Link from "next/link";

export default async function MoldeDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erroPin?: string }>;
}) {
  const { id } = await params;
  const { erroPin } = await searchParams;
  const operador = await requireOperador();

  const molde = await prisma.molde.findUnique({
    where: { id },
    include: {
      pecas: { orderBy: { codigo: "asc" } },
      problemas: {
        orderBy: { createdAt: "desc" },
        include: { operador: true, peca: true },
      },
    },
  });

  if (!molde) notFound();

  return (
    <main className="min-h-screen">
      <Nav operador={operador} />
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-10">
        <div>
          <Link href="/moldes" className="text-sm underline" style={{ color: "var(--color-text-dim)" }}>
            &larr; Moldes
          </Link>
          {erroPin === "1" && (
            <p className="mt-2 text-sm flex items-center gap-2" style={{ color: "var(--color-red)" }}>
              <span className="lamp lamp-red" />
              PIN incorreto. Nada foi apagado.
            </p>
          )}
          <div className="flex items-start justify-between mt-2 gap-4 flex-wrap">
            <div>
              <p className="font-mono text-sm" style={{ color: "var(--color-amber)" }}>
                {molde.codigo}
              </p>
              <h1 className="text-2xl">{molde.nome}</h1>
              {molde.descricao && (
                <p className="mt-1 text-sm" style={{ color: "var(--color-text-dim)" }}>
                  {molde.descricao}
                </p>
              )}
            </div>
            <PinConfirmForm
              action={apagarMolde}
              hidden={{ id: molde.id }}
              confirmMessage={`Apagar o molde ${molde.codigo}? Isto apaga também as suas peças e problemas.`}
            >
              <button type="submit" className="btn btn-danger text-sm">
                Apagar molde
              </button>
            </PinConfirmForm>
          </div>
        </div>

        {/* Peças */}
        <section>
          <h2 className="text-xl mb-4">Peças</h2>
          <div className="panel divide-y" style={{ borderColor: "var(--color-line)" }}>
            {molde.pecas.map((p) => {
              const baixo = p.quantidade <= p.stockMinimo;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 p-4"
                  style={{ borderColor: "var(--color-line)" }}
                >
                  <div>
                    <p className="font-mono text-sm" style={{ color: "var(--color-amber)" }}>
                      {p.codigo}
                    </p>
                    <p>{p.nome}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`lamp ${baixo ? "lamp-red" : "lamp-green"}`} />
                    <span className="font-mono text-lg">
                      {p.quantidade}
                      <span className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                        {" "}
                        / min {p.stockMinimo}
                      </span>
                    </span>
                    <PinConfirmForm
                      action={apagarPeca}
                      hidden={{ id: p.id, moldeId: molde.id }}
                      confirmMessage={`Apagar a peça ${p.codigo}?`}
                    >
                      <button type="submit" className="btn btn-danger text-xs">
                        Apagar
                      </button>
                    </PinConfirmForm>
                  </div>
                </div>
              );
            })}
            {molde.pecas.length === 0 && (
              <p className="p-4 text-sm" style={{ color: "var(--color-text-dim)" }}>
                Ainda não há peças registadas para este molde.
              </p>
            )}
          </div>

          <div className="panel p-5 max-w-lg mt-4">
            <h3 className="text-lg mb-3">Adicionar peça</h3>
            <form action={criarPeca} className="grid sm:grid-cols-2 gap-3">
              <input type="hidden" name="moldeId" value={molde.id} />
              <input name="codigo" required placeholder="Código" className="input font-mono" />
              <input name="nome" required placeholder="Nome" className="input" />
              <input
                name="quantidade"
                type="number"
                min={0}
                defaultValue={0}
                placeholder="Quantidade atual"
                className="input font-mono"
              />
              <input
                name="stockMinimo"
                type="number"
                min={0}
                defaultValue={0}
                placeholder="Stock mínimo"
                className="input font-mono"
              />
              <button type="submit" className="btn btn-primary sm:col-span-2">
                Adicionar peça
              </button>
            </form>
          </div>
        </section>

        {/* Problemas */}
        <section>
          <h2 className="text-xl mb-4">Problemas reportados</h2>
          <div className="flex flex-col gap-3">
            {molde.problemas.map((prob) => (
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
                {prob.peca && (
                  <p className="font-mono text-xs mt-2" style={{ color: "var(--color-amber)" }}>
                    Peça: {prob.peca.codigo}
                  </p>
                )}
                <p className="mt-2">{prob.descricao}</p>
              </div>
            ))}
            {molde.problemas.length === 0 && (
              <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                Sem problemas reportados para este molde.
              </p>
            )}
          </div>

          <div className="panel p-5 max-w-lg mt-4">
            <h3 className="text-lg mb-3">Reportar problema</h3>
            <form action={criarProblema} className="flex flex-col gap-3">
              <input type="hidden" name="moldeId" value={molde.id} />
              <input type="hidden" name="operadorId" value={operador.id} />
              <input type="hidden" name="voltarPara" value={`/moldes/${molde.id}`} />
              <select name="pecaId" className="input" defaultValue="">
                <option value="">Molde em geral (sem peça específica)</option>
                {molde.pecas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.codigo} — {p.nome}
                  </option>
                ))}
              </select>
              <select name="gravidade" className="input" defaultValue="media">
                <option value="baixa">Gravidade baixa</option>
                <option value="media">Gravidade média</option>
                <option value="alta">Gravidade alta</option>
              </select>
              <textarea
                name="descricao"
                required
                placeholder="Descreve o problema..."
                className="input"
                rows={3}
              />
              <button type="submit" className="btn btn-primary">
                Reportar problema
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
