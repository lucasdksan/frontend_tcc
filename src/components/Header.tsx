import { Loader2, Play } from "lucide-react";
import type { Step } from "../types";
import { STEPS } from "../types";

type HeaderProps = {
  currentStep: Step;
  loading: boolean;
  onStartAnalytics: () => void;
};

export function Header({ currentStep, loading, onStartAnalytics }: HeaderProps) {
  const stepData = STEPS.find((s) => s.key === currentStep);

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div>
          <p className="header-breadcrumb">Dashboard / {stepData?.label}</p>
          <h1 className="header-title">{stepData?.label}</h1>
          <p className="header-subtitle">{stepData?.description}</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onStartAnalytics}
          disabled={loading}
          aria-label="Iniciar análise"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="btn-icon spin" />
              Analisando...
            </>
          ) : (
            <>
              <Play size={16} className="btn-icon" />
              Iniciar Análise
            </>
          )}
        </button>
      </div>
    </header>
  );
}
