import { DashboardHeader } from "../components/DashboardHeader";
import { Card } from "../components/ui/Card";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-3 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
            <p className="text-text-secondary">
              Manage your application settings
            </p>
          </div>
        </div>

        <Card className="bg-surface border-border p-6">
          <p className="text-text-secondary">
            Settings page is under development. Coming soon...
          </p>
        </Card>
      </div>
    </>
  );
}

