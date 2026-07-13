"use client";

import { useState } from "react";
import { criarProblema } from "@/app/problemas/actions";

type Molde = { id: string; codigo: string; nome: string; pecas: { id: string; codigo: string; nome: string }[] };

export default function FormNovoProblema({
  moldes,
  operadorId,
}: {
  moldes: Molde[];
  operadorId: string;
}) {
  const [moldeId, setMoldeId] = useState("");
  const pecas = moldes.find((m) => m.id === moldeId)?.pecas ?? [];

  return (
    <form action={criarProblema} className="panel p-5 max-w-lg flex flex-col gap-3">
      <input type="hidden" name="operadorId" value={operadorId} />
      <input type="hidden" name="voltarPara" value="/problemas" />

      <select
        name="moldeId"
        required
        className="input"
        value={moldeId}
        onChange={(e) => setMoldeId(e.target.value)}
      >
        <option value="">Escolhe o molde...</option>
        {moldes.map((m) => (
          <option key={m.id} value={m.id}>
            {m.codigo} — {m.nome}
          </option>
        ))}
      </select>

      <select name="pecaId" className="input" defaultValue="" disabled={!moldeId}>
        <option value="">Molde em geral (sem peça específica)</option>
        {pecas.map((p) => (
          <option key={p.id} value={p.id}>
            {p.codigo} — {p.nome}
          </option>
        ))}
      </select>

      <select name="gravidade" className="input" defaultValue="media">
        <option value="baixa">Gravidade baixa</option>
        <option value="media">Gravidade média</option>
        <option value="alta">Gravidade alta</option>
      </select>

      <textarea name="descricao" required placeholder="Descreve o problema..." className="input" rows={4} />

      <button type="submit" className="btn btn-primary">
        Reportar problema
      </button>
    </form>
  );
}
