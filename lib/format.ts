export function lampClassEstado(estado: string): string {
  switch (estado) {
    case "aberto":
      return "lamp-red";
    case "em_resolucao":
      return "lamp-amber";
    case "fechado":
      return "lamp-green";
    default:
      return "lamp-amber";
  }
}

export function labelEstado(estado: string): string {
  switch (estado) {
    case "aberto":
      return "Aberto";
    case "em_resolucao":
      return "Em resolução";
    case "fechado":
      return "Fechado";
    default:
      return estado;
  }
}

export function labelGravidade(gravidade: string): string {
  switch (gravidade) {
    case "baixa":
      return "Baixa";
    case "media":
      return "Média";
    case "alta":
      return "Alta";
    default:
      return gravidade;
  }
}

export function corGravidade(gravidade: string): string {
  switch (gravidade) {
    case "alta":
      return "var(--color-red)";
    case "media":
      return "var(--color-amber)";
    default:
      return "var(--color-green)";
  }
}

export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}
