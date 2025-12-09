import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "../../utils/cn";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: "bg-green-500/20 border-green-500/30 text-green-300",
  error: "bg-red-500/20 border-red-500/30 text-red-300",
  info: "bg-blue-500/20 border-blue-500/30 text-blue-300",
  warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-300",
};

export function ToastItem({ toast, onClose }: ToastProps) {
  const Icon = icons[toast.type];
  const duration = toast.duration ?? 5000;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, toast.id, onClose]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg animate-in slide-in-from-top-5",
        styles[toast.type]
      )}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="text-current/70 hover:text-current transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
