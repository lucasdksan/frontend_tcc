import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Diagnostico } from "../types";

type RiscosPageProps = {
  data: Diagnostico;
};

const SEVERITY_COLORS: Record<string, string> = {
  Alta: "#dc2626",
  Média: "#ea580c",
  Baixa: "#0f62fe",
};

function getSeverityBadgeClass(gravidade: "Alta" | "Média" | "Baixa") {
  switch (gravidade) {
    case "Alta":
      return "badge badge-danger";
    case "Média":
      return "badge badge-warning";
    case "Baixa":
      return "badge badge-info";
    default:
      return "badge badge-info";
  }
}

export function RiscosPage({ data }: RiscosPageProps) {
  const riscos = data.riscos_identificados;

  if (riscos.length === 0) {
    return (
      <div className="page-content">
        <p className="muted">Nenhum risco identificado.</p>
      </div>
    );
  }

  const chartData = ["Alta", "Média", "Baixa"].map((gravidade) => ({
    gravidade,
    quantidade: riscos.filter((r) => r.gravidade === gravidade).length,
  }));

  return (
    <div className="page-content fade-in-up">
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Distribuição por Gravidade</h2>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6eef8" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis
                type="category"
                dataKey="gravidade"
                tick={{ fontSize: 13, fill: "#374151", fontWeight: 600 }}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e6eef8",
                  boxShadow: "0 4px 12px rgba(16, 24, 40, 0.08)",
                }}
                formatter={(value) => [value, "Quantidade"]}
              />
              <Bar dataKey="quantidade" radius={[0, 6, 6, 0]} barSize={32}>
                {chartData.map((entry) => (
                  <Cell key={entry.gravidade} fill={SEVERITY_COLORS[entry.gravidade]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Lista de Riscos</h2>
          <span className="panel-badge">{riscos.length} itens</span>
        </div>
        <div className="risks-list">
          {riscos.map((risco, index) => (
            <div
              key={index}
              className={`risk-item risk-item--${risco.gravidade.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
            >
              <div className="risk-header">
                <h4 className="risk-title">{risco.produto}</h4>
                <span className={getSeverityBadgeClass(risco.gravidade)}>
                  {risco.gravidade}
                </span>
              </div>
              <p className="risk-type">{risco.tipo_risco}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
