// Autenticação simples baseada em password mestre partilhada (sem tabela de sessões).
// O cookie de sessão guarda um hash derivado da password mestre + de um "pepper" fixo,
// nunca a password em claro.

export const SESSION_COOKIE = "mt_session";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sessionTokenFor(password: string): Promise<string> {
  return sha256Hex(`moldetrack-session-v1:${password}`);
}

export function verifyMasterPassword(candidate: string): boolean {
  const expected = process.env.MASTER_PASSWORD ?? "";
  return expected.length > 0 && candidate === expected;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const expected = process.env.MASTER_PASSWORD ?? "";
  if (!token || !expected) return false;
  return token === (await sessionTokenFor(expected));
}

export function verifyPin(pin: string): boolean {
  const expected = process.env.PIN_CODE ?? "";
  return expected.length > 0 && pin === expected;
}
