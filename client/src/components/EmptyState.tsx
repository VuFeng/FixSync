import type { LucideIcon } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <Card className={`bg-surface border-border p-12 ${className}`}>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="bg-surface-secondary p-4 rounded-full mb-4">
          <Icon className="w-8 h-8 text-text-tertiary" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        {description && (
          <p className="text-text-secondary text-sm mb-6 max-w-md">{description}</p>
        )}
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-primary hover:bg-primary-dark"
          >
            {action.label}
          </Button>
        )}
      </div>
    </Card>
  );
}

