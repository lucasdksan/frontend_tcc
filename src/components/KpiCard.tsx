import type { LucideIcon } from "lucide-react";

type KpiCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger" | "info";
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  variant = "default",
}: KpiCardProps) {
  return (
    <div className={`kpi-card kpi-card--${variant}`}>
      <div className="kpi-card-header">
        <span className="kpi-label">{label}</span>
        <span className={`kpi-icon kpi-icon--${variant}`}>
          <Icon size={18} strokeWidth={2} />
        </span>
      </div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}
