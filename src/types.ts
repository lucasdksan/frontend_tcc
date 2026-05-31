export type Diagnostico = {
  diagnostico: {
    resumo_executivo: string;
    dependencia_excessiva: boolean;
    produto_campeao: string;
    produto_gargalo: string;
  };
  riscos_identificados: Array<{
    produto: string;
    tipo_risco: string;
    gravidade: "Alta" | "Média" | "Baixa";
  }>;
  sugestoes_kits: Array<{
    nome_comercial: string;
    itens_compostos: string[];
    objetivo_estrategico: string;
    racional_venda: string;
  }>;
};

export type Step = "diagnostico" | "riscos_identificados" | "sugestoes_kits";

export const STEPS: { key: Step; label: string; description: string }[] = [
  {
    key: "diagnostico",
    label: "Diagnóstico",
    description: "Visão geral e métricas principais",
  },
  {
    key: "riscos_identificados",
    label: "Riscos Identificados",
    description: "Produtos com risco operacional ou financeiro",
  },
  {
    key: "sugestoes_kits",
    label: "Sugestões de Kits",
    description: "Oportunidades de bundles estratégicos",
  },
];
