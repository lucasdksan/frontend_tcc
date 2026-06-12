import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import "./index.css";
import { DiagnosticoPage } from "./components/DiagnosticoPage";
import { Header } from "./components/Header";
import { KitsPage } from "./components/KitsPage";
import { RiscosPage } from "./components/RiscosPage";
import { Sidebar } from "./components/Sidebar";
import type { Diagnostico, Step } from "./types";

function App() {
  const [resultDiagnostic, setResultDiagnostic] = useState<Diagnostico | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("diagnostico");
  const [loading, setLoading] = useState(false);

  const hasFetched = resultDiagnostic !== null;

  const handleStartAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://n8n.srv1650382.hstgr.cloud/webhook/0056db8d-08fc-422d-9cae-dadaa7e9dd54",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.N8N_TOKEN}`,
          },
        },
      );
      const data = await response.text();
      const parsed = JSON.parse(data) as Diagnostico;
      setResultDiagnostic(parsed);
      setCurrentStep("diagnostico");
    } catch (error) {
      console.error("Error starting analytics:", error);
      alert("Erro ao carregar dados. Verifique a URL e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text">Carregando dados do webhook...</p>
        </div>
      );
    }

    if (!resultDiagnostic) {
      return (
        <div className="empty-state">
          <div className="empty-icon">
            <LayoutDashboard size={48} strokeWidth={1.5} />
          </div>
          <h2 className="empty-title">Bem-vindo ao VTEX Analytics</h2>
          <p className="empty-text">
            Clique em &quot;Iniciar Análise&quot; para carregar os dados do webhook e
            visualizar diagnósticos, riscos e sugestões de kits.
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case "diagnostico":
        return <DiagnosticoPage data={resultDiagnostic} />;
      case "riscos_identificados":
        return <RiscosPage data={resultDiagnostic} />;
      case "sugestoes_kits":
        return <KitsPage data={resultDiagnostic} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        currentStep={currentStep}
        hasFetched={hasFetched}
        onStepChange={setCurrentStep}
      />

      <div className="dashboard-main">
        <Header
          currentStep={currentStep}
          loading={loading}
          onStartAnalytics={handleStartAnalytics}
        />

        <main className="dashboard-content">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;
