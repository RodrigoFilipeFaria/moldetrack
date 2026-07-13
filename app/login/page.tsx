import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; next?: string }>;
}) {
  const params = await searchParams;
  const erro = params.erro === "1";
  const next = params.next ?? "/";

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-orange-500" style={{ color: "var(--color-orange)" }}>
            MoldeTrack
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-dim)" }}>
            Acesso protegido &middot; password mestre da equipa
          </p>
        </div>

        <form action={login} className="panel p-6 flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="password" className="block text-sm mb-2 font-display">
              Password mestre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="input"
              placeholder="••••••••"
            />
          </div>

          {erro && (
            <p className="text-sm flex items-center gap-2" style={{ color: "var(--color-red)" }}>
              <span className="lamp lamp-red" />
              Password incorreta. Tenta outra vez.
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full">
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
