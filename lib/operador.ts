import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const OPERADOR_COOKIE = "mt_operador";

export type OperadorSessao = { id: string; nome: string; cor: string };

export async function getOperador(): Promise<OperadorSessao | null> {
  const store = await cookies();
  const raw = store.get(OPERADOR_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OperadorSessao;
  } catch {
    return null;
  }
}

export async function requireOperador(): Promise<OperadorSessao> {
  const operador = await getOperador();
  if (!operador) redirect("/");
  return operador;
}
