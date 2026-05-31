import {
  BarChart3,
  Package,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import type { Step } from "../types";
import { STEPS } from "../types";

const STEP_ICONS: Record<Step, typeof BarChart3> = {
  diagnostico: BarChart3,
  riscos_identificados: TriangleAlert,
  sugestoes_kits: Package,
};

type SidebarProps = {
  currentStep: Step;
  hasFetched: boolean;
  onStepChange: (step: Step) => void;
};

export function Sidebar({ currentStep, hasFetched, onStepChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <TrendingUp size={22} strokeWidth={2.5} />
        </div>
        <div>
          <div className="sidebar-brand-title">VTEX Analytics</div>
          <div className="sidebar-brand-subtitle">Order Intelligence</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Navegação</div>
        {STEPS.map((step) => {
          const Icon = STEP_ICONS[step.key];
          const isActive = currentStep === step.key;
          const isDisabled = !hasFetched;

          return (
            <button
              key={step.key}
              type="button"
              className={`sidebar-nav-item ${isActive ? "active" : ""} ${isDisabled ? "disabled" : ""}`}
              onClick={() => !isDisabled && onStepChange(step.key)}
              disabled={isDisabled}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="sidebar-nav-icon">
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="sidebar-nav-text">
                <span className="sidebar-nav-title">{step.label}</span>
                <span className="sidebar-nav-desc">{step.description}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className={`status-dot ${hasFetched ? "online" : "offline"}`} />
          {hasFetched ? "Dados carregados" : "Aguardando análise"}
        </div>
      </div>
    </aside>
  );
}
