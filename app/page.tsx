import { prisma } from "@/lib/prisma";
import { selecionarOperador, criarOperador } from "./actions";
import Link from "next/link";

export default async function SelecaoOperadorPage() {
  const operadores = await prisma.operador.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
  });

  return (
    <main className="min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mt-10 mb-10">
          <h1 className="text-4xl" style={{ color: "var(--color-orange)" }}>
            MoldeTrack
          </h1>
          <p className="mt-2" style={{ color: "var(--color-text-dim)" }}>
            Quem és tu?
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {operadores.map((op) => (
            <form key={op.id} action={selecionarOperador}>
              <input type="hidden" name="id" value={op.id} />
              <button
                type="submit"
                className="btn w-full h-24 text-lg flex-col"
                style={{ background: op.cor, color: "#1a1a1a" }}
              >
                {op.nome}
              </button>
            </form>
          ))}
        </div>

        {operadores.length === 0 && (
          <p className="text-center panel p-4" style={{ color: "var(--color-text-dim)" }}>
            Ainda não há operadores. Adiciona o primeiro abaixo.
          </p>
        )}

        <details className="panel mt-8 p-4">
          <summary className="cursor-pointer font-display text-sm">
            + Adicionar operador
          </summary>
          <form action={criarOperador} className="flex flex-col sm:flex-row gap-3 mt-4">
            <input name="nome" required placeholder="Nome" className="input" />
            <input name="cor" type="color" defaultValue="#F2B705" className="h-11 w-16 rounded" />
            <button type="submit" className="btn btn-secondary whitespace-nowrap">
              Adicionar
            </button>
          </form>
        </details>

        <div className="text-center mt-10">
          <Link href="/chefe" className="text-sm underline" style={{ color: "var(--color-text-dim)" }}>
            Acesso do chefe (vista remota)
          </Link>
        </div>
      </div>
    </main>
  );
}
