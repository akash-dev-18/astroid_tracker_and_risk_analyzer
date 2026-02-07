import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";

interface RiskBadgeProps {
  isHazardous: boolean;
  riskScore?: string | null;
  showIcon?: boolean;
}

export function RiskBadge({ isHazardous, riskScore, showIcon = true }: RiskBadgeProps) {
  if (isHazardous) {
    return (
      <Badge variant="hazardous" className="gap-1">
        {showIcon && <AlertTriangle className="h-3 w-3" />}
        {riskScore ? `Risk: ${riskScore}` : "Hazardous"}
      </Badge>
    );
  }

  return (
    <Badge variant="safe" className="gap-1">
      {showIcon && <ShieldCheck className="h-3 w-3" />}
      Safe
    </Badge>
  );
}

export function RiskScoreBadge({ score }: { score: string | null | undefined }) {
  if (!score) return null;

  const numScore = parseFloat(score);
  const variant = numScore > 7 ? "hazardous" : numScore > 4 ? "warning" : "safe";
  const Icon = numScore > 7 ? ShieldAlert : numScore > 4 ? AlertTriangle : ShieldCheck;

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      Risk: {score}
    </Badge>
  );
}
