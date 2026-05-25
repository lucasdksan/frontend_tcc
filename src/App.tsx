import { useState } from "react";
import "./index.css";

type Diagnostico = {
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

type Step = "diagnostico" | "riscos_identificados" | "sugestoes_kits";

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: "diagnostico", label: "Diagnóstico", icon: "📊" },
  { key: "riscos_identificados", label: "Riscos Identificados", icon: "⚠️" },
  { key: "sugestoes_kits", label: "Sugestões de Kits", icon: "📦" },
];

function App() {
  const [resultDiagnostic, setResultDiagnostic] = useState<null | Diagnostico>(null);
  const [currentStep, setCurrentStep] = useState<Step>("diagnostico");
  const [loading, setLoading] = useState(false);

  const handleStartAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://n8n.srv1650382.hstgr.cloud/webhook-test/0056db8d-08fc-422d-9cae-dadaa7e9dd54");
      const data = await response.text();
      const parsed = JSON.parse(data);
      setResultDiagnostic(parsed);
      setCurrentStep("diagnostico");
    } catch (error) {
      console.error("Error starting analytics:", error);
      alert("Erro ao carregar dados. Verifique a URL e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    const currentIndex = STEPS.findIndex(s => s.key === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].key);
    }
  };

  const handlePrevStep = () => {
    const currentIndex = STEPS.findIndex(s => s.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].key);
    }
  };

  const isFirstStep = currentStep === STEPS[0].key;
  const isLastStep = currentStep === STEPS[STEPS.length - 1].key;

  const getSeverityBadgeClass = (gravidade: "Alta" | "Média" | "Baixa") => {
    switch (gravidade) {
      case "Alta":
        return "badge-danger";
      case "Média":
        return "badge-warning";
      case "Baixa":
        return "badge-info";
      default:
        return "badge-info";
    }
  };

  const renderDiagnostico = () => {
    const diag = resultDiagnostic?.diagnostico;
    if (!diag) return null;

    return (
      <div className="step-content">
        <div className="diagnostic-grid">
          <div className="info-card">
            <div className="info-label">Resumo Executivo</div>
            <div className="info-value">{diag.resumo_executivo}</div>
          </div>

          <div className="info-card">
            <div className="info-label">Produto Campeão</div>
            <div className="info-value highlight">{diag.produto_campeao}</div>
          </div>

          <div className="info-card">
            <div className="info-label">Produto Gargalo</div>
            <div className="info-value highlight-warning">{diag.produto_gargalo}</div>
          </div>

          <div className="info-card">
            <div className="info-label">Dependência Excessiva</div>
            <div className={`info-value ${diag.dependencia_excessiva ? "highlight-danger" : "highlight-success"}`}>
              {diag.dependencia_excessiva ? "Sim ⚠️" : "Não ✓"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRiscosIdentificados = () => {
    const riscos = resultDiagnostic?.riscos_identificados || [];
    if (riscos.length === 0) return <p className="muted">Nenhum risco identificado.</p>;

    return (
      <div className="step-content">
        <div className="risks-list">
          {riscos.map((risco, index) => (
            <div key={index} className="risk-item">
              <div className="risk-header">
                <h4 className="risk-title">{risco.produto}</h4>
                <span className={`badge ${getSeverityBadgeClass(risco.gravidade)}`}>
                  {risco.gravidade}
                </span>
              </div>
              <p className="risk-type">{risco.tipo_risco}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSugestoesKits = () => {
    const kits = resultDiagnostic?.sugestoes_kits || [];
    if (kits.length === 0) return <p className="muted">Nenhuma sugestão de kit disponível.</p>;

    return (
      <div className="step-content">
        <div className="kits-grid">
          {kits.map((kit, index) => (
            <div key={index} className="kit-card">
              <h4 className="kit-title">{kit.nome_comercial}</h4>
              <div className="kit-section">
                <div className="kit-label">Objetivo Estratégico</div>
                <p className="kit-text">{kit.objetivo_estrategico}</p>
              </div>
              <div className="kit-section">
                <div className="kit-label">Racional de Venda</div>
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
          ))}
        </div>
      </div>
    );
  };

  const currentStepData = STEPS.find(s => s.key === currentStep);
  const currentStepIndex = STEPS.findIndex(s => s.key === currentStep);

  return (
    <div className="app-container">
      <div className="card">
        <div className="header-row">
          <div>
            <h1 className="title">📈 Vtex Order Analytics</h1>
            <p className="subtitle">Análise inteligente de dados do webhook de teste.</p>
          </div>
          <button
            className="btn"
            onClick={handleStartAnalytics}
            disabled={loading}
            aria-label="Iniciar análise"
          >
            {loading ? "Analizando..." : "Iniciar Análise"}
          </button>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Carregando dados do webhook...</p>
          </div>
        )}

        {!loading && resultDiagnostic ? (
          <>
            {/* Progress Steps */}
            <div className="steps-container">
              {STEPS.map((step, index) => (
                <div
                  key={step.key}
                  className={`step-indicator ${step.key === currentStep ? "active" : ""} ${
                    index < currentStepIndex ? "completed" : ""
                  }`}
                  onClick={() => index <= currentStepIndex && setCurrentStep(step.key)}
                  style={{ cursor: index <= currentStepIndex ? "pointer" : "default" }}
                >
                  <div className="step-circle">{step.icon}</div>
                  <div className="step-label">{step.label}</div>
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="step-wrapper">
              <h2 className="step-title">
                {currentStepData?.icon} {currentStepData?.label}
              </h2>

              {currentStep === "diagnostico" && renderDiagnostico()}
              {currentStep === "riscos_identificados" && renderRiscosIdentificados()}
              {currentStep === "sugestoes_kits" && renderSugestoesKits()}

              {/* Navigation Buttons */}
              <div className="navigation-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={handlePrevStep}
                  disabled={isFirstStep}
                  aria-label="Voltar para etapa anterior"
                >
                  ← Anterior
                </button>

                <div className="step-counter">
                  {currentStepIndex + 1} de {STEPS.length}
                </div>

                <button
                  className="btn"
                  onClick={handleNextStep}
                  disabled={isLastStep}
                  aria-label="Ir para próxima etapa"
                >
                  Próximo →
                </button>
              </div>
            </div>
          </>
        ) : (
          !loading && (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p className="empty-text">Clique em "Iniciar Análise" para carregar os dados do webhook.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;