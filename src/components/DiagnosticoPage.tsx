import { AlertCircle, Crown, PackageX, ShieldAlert, TriangleAlert } from "lucide-react";
import type { Diagnostico } from "../types";
import { KpiCard } from "./KpiCard";

type DiagnosticoPageProps = {
  data: Diagnostico;
};

export function DiagnosticoPage({ data }: DiagnosticoPageProps) {
  const diag = data.diagnostico;
  const totalRiscos = data.riscos_identificados.length;

  return (
    <div className="page-content fade-in-up">
      <div className="kpi-grid">
        <KpiCard
          label="Produto Campeão"
          value={diag.produto_campeao}
          icon={Crown}
          variant="success"
        />
        <KpiCard
          label="Produto Gargalo"
          value={diag.produto_gargalo}
          icon={PackageX}
          variant="warning"
        />
        <KpiCard
          label="Total de Riscos"
          value={String(totalRiscos)}
          icon={TriangleAlert}
          variant="danger"
        />
        <KpiCard
          label="Dependência Excessiva"
          value={diag.dependencia_excessiva ? "Sim" : "Não"}
          icon={ShieldAlert}
          variant={diag.dependencia_excessiva ? "danger" : "success"}
        />
      </div>

      <div className="panel">
        <div className="panel-header">
          <AlertCircle size={20} className="panel-icon" />
          <h2 className="panel-title">Resumo Executivo</h2>
        </div>
        <p className="panel-text">{diag.resumo_executivo}</p>
      </div>
    </div>
  );
}
