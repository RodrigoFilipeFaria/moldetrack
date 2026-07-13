import { prisma } from "@/lib/prisma";
import { requireOperador } from "@/lib/operador";
import Nav from "@/components/Nav";
import { criarMolde } from "./actions";
import Link from "next/link";

export default async function MoldesPage({
  searchParams,
}: {
  searchParams: Promise<{ erroPin?: string; q?: string }>;
}) {
  const operador = await requireOperador();
  const { erroPin, q } = await searchParams;

  const moldes = await prisma.molde.findMany({
    where: q
      ? {
          OR: [
            { codigo: { contains: q, mode: "insensitive" } },
            { nome: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { codigo: "asc" },
    include: {
      _count: {
        select: {
          pecas: true,
          problemas: { where: { estado: { not: "fechado" } } },
        },
      },
    },
  });

  return (
    <main className="min-h-screen">
      <Nav operador={operador} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl mb-6">Moldes</h1>
        {erroPin === "1" && (
          <p className="mb-4 text-sm flex items-center gap-2" style={{ color: "var(--color-red)" }}>
            <span className="lamp lamp-red" />
            PIN incorreto. O molde não foi apagado.
          </p>
        )}

        <form method="GET" className="mb-6 flex gap-2 max-w-md">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Procurar por código ou nome..."
            className="input"
          />
          <button type="submit" className="btn btn-secondary whitespace-nowrap">
            Procurar
          </button>
        </form>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {moldes.map((m) => (
            <Link
              key={m.id}
              href={`/moldes/${m.id}`}
              className="panel p-4 flex flex-col gap-2 hover:opacity-90"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm" style={{ color: "var(--color-amber)" }}>
                  {m.codigo}
                </span>
                {m._count.problemas > 0 && (
                  <span className="lamp lamp-red" title="Problemas abertos" />
                )}
              </div>
              <h2 className="text-lg leading-tight">{m.nome}</h2>
              <div className="text-sm flex gap-4" style={{ color: "var(--color-text-dim)" }}>
                <span>{m._count.pecas} peça(s)</span>
                <span>{m._count.problemas} problema(s) por resolver</span>
              </div>
            </Link>
          ))}

          {moldes.length === 0 && (
            <p style={{ color: "var(--color-text-dim)" }}>
              {q ? `Sem moldes que correspondam a "${q}".` : "Ainda não há moldes registados."}
            </p>
          )}
        </div>

        <div className="panel p-5 max-w-md">
          <h2 className="text-lg mb-4">Registar novo molde</h2>
          <form action={criarMolde} className="flex flex-col gap-3">
            <input name="codigo" required placeholder="Código (ex: M-0123)" className="input font-mono" />
            <input name="nome" required placeholder="Nome do molde" className="input" />
            <textarea name="descricao" placeholder="Descrição (opcional)" className="input" rows={2} />
            <button type="submit" className="btn btn-primary">
              Registar molde
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
