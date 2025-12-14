import { Link, useNavigate } from "react-router-dom";
import { Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuthStore } from "../stores/auth.store";
import { ROUTES } from "../constants";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/DropdownMenu";

export function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

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
          <Link to={ROUTES.SETTINGS}>
            <Button
              size="icon"
              variant="ghost"
              className="text-text-secondary hover:text-text-primary"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-0">
              <div className="flex items-center gap-2 text-text-secondary hover:text-text-primary px-2 py-1 rounded-md transition-colors">
                <User className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">
                  {user?.fullName}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-surface border-border">
              <DropdownMenuLabel className="text-text-primary">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-text-secondary text-xs font-normal">
                {user?.role}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-danger hover:bg-red-500/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
