import { Package, Target, TrendingUp } from "lucide-react";
import type { Diagnostico } from "../types";

type KitsPageProps = {
  data: Diagnostico;
};

export function KitsPage({ data }: KitsPageProps) {
  const kits = data.sugestoes_kits;

  if (kits.length === 0) {
    return (
      <div className="page-content">
        <p className="muted">Nenhuma sugestão de kit disponível.</p>
      </div>
    );
  }

  return (
    <div className="page-content fade-in-up">
      <div className="kits-grid">
        {kits.map((kit, index) => (
          <article key={index} className="kit-card">
            <div className="kit-card-header">
              <div className="kit-card-icon">
                <Package size={20} />
              </div>
              <h3 className="kit-title">{kit.nome_comercial}</h3>
            </div>

            <div className="kit-body">
              <div className="kit-section">
                <div className="kit-label">
                  <Target size={14} />
                  Objetivo Estratégico
                </div>
                <p className="kit-text">{kit.objetivo_estrategico}</p>
              </div>

              <div className="kit-section">
                <div className="kit-label">
                  <TrendingUp size={14} />
                  Racional de Venda
                </div>
                <p className="kit-text">{kit.racional_venda}</p>
              </div>

              <div className="kit-section">
                <div className="kit-label">Itens Compostos</div>
                <div className="items-list">
                  {kit.itens_compostos.map((item, idx) => (
                    <span key={idx} className="item-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
