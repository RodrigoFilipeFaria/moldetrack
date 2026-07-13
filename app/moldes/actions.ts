"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPin } from "@/lib/auth";

export async function criarMolde(formData: FormData) {
  const codigo = String(formData.get("codigo") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  if (!codigo || !nome) redirect("/moldes");

  await prisma.molde.create({
    data: { codigo, nome, descricao: descricao || null },
  });
  revalidatePath("/moldes");
  redirect("/moldes");
}

export async function apagarMolde(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const pin = String(formData.get("pin") ?? "");
  if (!verifyPin(pin)) redirect("/moldes?erroPin=1");

  await prisma.molde.delete({ where: { id } });
  revalidatePath("/moldes");
  redirect("/moldes");
}

export async function criarPeca(formData: FormData) {
  const moldeId = String(formData.get("moldeId") ?? "");
  const codigo = String(formData.get("codigo") ?? "").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const quantidade = Number(formData.get("quantidade") ?? 0);
  const stockMinimo = Number(formData.get("stockMinimo") ?? 0);
  if (!moldeId || !codigo || !nome) redirect(`/moldes/${moldeId}`);

  await prisma.peca.create({
    data: {
      moldeId,
      codigo,
      nome,
      quantidade: Number.isFinite(quantidade) ? Math.max(0, quantidade) : 0,
      stockMinimo: Number.isFinite(stockMinimo) ? Math.max(0, stockMinimo) : 0,
    },
  });
  revalidatePath(`/moldes/${moldeId}`);
  revalidatePath("/stock");
  redirect(`/moldes/${moldeId}`);
}

export async function apagarPeca(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const moldeId = String(formData.get("moldeId") ?? "");
  const pin = String(formData.get("pin") ?? "");
  if (!verifyPin(pin)) redirect(`/moldes/${moldeId}?erroPin=1`);

  await prisma.peca.delete({ where: { id } });
  revalidatePath(`/moldes/${moldeId}`);
  revalidatePath("/stock");
  redirect(`/moldes/${moldeId}`);
}
