import { Bell, Settings, User } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuthStore } from "../stores/auth.store";

export function DashboardHeader() {
  const { user } = useAuthStore();

  return (
    <header className="border-b border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            className="text-text-secondary hover:text-text-primary"
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-text-secondary hover:text-text-primary"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-text-secondary hover:text-text-primary"
            >
              <User className="w-5 h-5" />
            </Button>
            <span className="text-sm text-text-secondary hidden sm:inline">
              {user?.fullName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}



