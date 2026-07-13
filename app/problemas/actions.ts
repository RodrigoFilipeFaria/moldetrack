"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function criarProblema(formData: FormData) {
  const moldeId = String(formData.get("moldeId") ?? "");
  const pecaId = String(formData.get("pecaId") ?? "");
  const operadorId = String(formData.get("operadorId") ?? "");
  const descricao = String(formData.get("descricao") ?? "").trim();
  const gravidade = String(formData.get("gravidade") ?? "media");
  const voltarPara = String(formData.get("voltarPara") ?? "/problemas");

  if (!moldeId || !operadorId || !descricao) redirect(voltarPara);

  await prisma.problema.create({
    data: {
      moldeId,
      pecaId: pecaId || null,
      operadorId,
      descricao,
      gravidade: gravidade as "baixa" | "media" | "alta",
    },
  });

  revalidatePath("/problemas");
  revalidatePath("/dashboard");
  revalidatePath(`/moldes/${moldeId}`);
  redirect(voltarPara);
}

export async function avancarEstado(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const novoEstado = String(formData.get("novoEstado") ?? "");
  if (!id || !novoEstado) redirect("/problemas");

  await prisma.problema.update({
    where: { id },
    data: {
      estado: novoEstado as "aberto" | "em_resolucao" | "fechado",
      resolvedAt: novoEstado === "fechado" ? new Date() : null,
    },
  });

  revalidatePath("/problemas");
  revalidatePath("/dashboard");
  redirect("/problemas");
}
