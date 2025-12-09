import { Card } from "./ui/Card";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  device?: string;
  customer?: string;
  priority: "high" | "medium" | "low";
  icon: typeof AlertCircle;
}

const priorityColors = {
  high: "border-red-500/30 bg-red-500/10",
  medium: "border-yellow-500/30 bg-yellow-500/10",
  low: "border-blue-500/30 bg-blue-500/10",
};

const tasks: Task[] = [
  {
    id: "1",
    title: "Device inspection pending",
    device: "iPhone 15 Pro",
    priority: "high",
    icon: AlertCircle,
  },
  {
    id: "2",
    title: "Parts order required",
    device: "Samsung Galaxy S24",
    priority: "medium",
    icon: Clock,
  },
  {
    id: "3",
    title: "Warranty check needed",
    customer: "Nguyễn Văn A",
    priority: "low",
    icon: CheckCircle,
  },
];

export function PendingTasks() {
  return (
    <Card className="bg-surface border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Pending Tasks
      </h3>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-text-secondary text-sm text-center py-4">
            No pending tasks
          </p>
        ) : (
          tasks.map((task) => {
            const Icon = task.icon;
            return (
              <div
                key={task.id}
                className={`p-3 rounded-lg border ${
                  priorityColors[task.priority]
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm flex-1">
                    <p className="font-medium text-text-primary">{task.title}</p>
                    <p className="text-xs text-text-tertiary mt-1">
                      {task.device || task.customer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}



