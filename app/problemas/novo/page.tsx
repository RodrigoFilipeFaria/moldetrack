import { prisma } from "@/lib/prisma";
import { requireOperador } from "@/lib/operador";
import Nav from "@/components/Nav";
import FormNovoProblema from "@/components/FormNovoProblema";
import Link from "next/link";

export default async function NovoProblemaPage() {
  const operador = await requireOperador();
  const moldes = await prisma.molde.findMany({
    orderBy: { codigo: "asc" },
    include: { pecas: { orderBy: { codigo: "asc" } } },
  });

  return (
    <main className="min-h-screen">
      <Nav operador={operador} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/problemas" className="text-sm underline" style={{ color: "var(--color-text-dim)" }}>
          &larr; Problemas
        </Link>
        <h1 className="text-2xl mt-2 mb-6">Reportar problema</h1>
        <FormNovoProblema moldes={moldes} operadorId={operador.id} />
      </div>
    </main>
  );
}
