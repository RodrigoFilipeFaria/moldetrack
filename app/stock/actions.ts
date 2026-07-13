"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function registarMovimento(formData: FormData) {
  const pecaId = String(formData.get("pecaId") ?? "");
  const tipo = String(formData.get("tipo") ?? "entrada");
  const quantidade = Number(formData.get("quantidade") ?? 0);
  const motivo = String(formData.get("motivo") ?? "").trim();
  const operadorId = String(formData.get("operadorId") ?? "");

  if (!pecaId || !operadorId || !Number.isFinite(quantidade) || quantidade <= 0) {
    redirect("/stock");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const peca = await tx.peca.findUniqueOrThrow({ where: { id: pecaId } });
      const delta = tipo === "saida" ? -quantidade : quantidade;
      const novaQuantidade = peca.quantidade + delta;
      if (novaQuantidade < 0) {
        throw new Error("estoque_insuficiente");
      }

      await tx.peca.update({ where: { id: pecaId }, data: { quantidade: novaQuantidade } });
      await tx.movimentoStock.create({
        data: {
          pecaId,
          tipo: tipo as "entrada" | "saida",
          quantidade,
          motivo: motivo || null,
          operadorId,
        },
      });
    });
  } catch {
    redirect("/stock?erro=stock_insuficiente");
  }

  revalidatePath("/stock");
  revalidatePath("/dashboard");
  redirect("/stock");
}
