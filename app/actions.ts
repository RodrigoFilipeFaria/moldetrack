"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OPERADOR_COOKIE } from "@/lib/operador";

export async function selecionarOperador(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const operador = await prisma.operador.findUnique({ where: { id } });
  if (!operador) redirect("/");

  const store = await cookies();
  store.set(
    OPERADOR_COOKIE,
    JSON.stringify({ id: operador.id, nome: operador.nome, cor: operador.cor }),
    { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" }
  );

  redirect("/dashboard");
}

export async function criarOperador(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const cor = String(formData.get("cor") ?? "#F2B705");
  if (nome) {
    await prisma.operador.create({ data: { nome, cor } });
  }
  redirect("/");
}

export async function terminarSessaoOperador() {
  const store = await cookies();
  store.delete(OPERADOR_COOKIE);
  redirect("/");
}
