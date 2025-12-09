import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Smartphone,
  LayoutDashboard,
  Users,
  Wrench,
  Receipt,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useAuthStore } from "../stores/auth.store";
import { Button } from "./ui/Button";
import { ROUTES } from "../constants";

const menuItems = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.DEVICES, label: "Devices", icon: Smartphone },
  { href: ROUTES.REPAIR_ITEMS, label: "Repair Items", icon: Wrench },
  { href: ROUTES.TRANSACTIONS, label: "Transactions", icon: Receipt },
  { href: ROUTES.WARRANTIES, label: "Warranties", icon: ShieldCheck },
  { href: ROUTES.BRANDS, label: "Brands", icon: Tag },
  { href: ROUTES.USERS, label: "Users", icon: Users },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-surface border border-border rounded-lg text-text-primary"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 w-64 bg-surface border-r border-border
          transform transition-transform duration-300 z-40
          md:translate-x-0 md:h-screen md:overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full p-6 pt-16 md:pt-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-primary p-2 rounded-lg">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">FixSync</span>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} to={href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 ${
                    isActive(href)
                      ? "bg-primary/20 text-primary hover:bg-primary/40 hover:text-white"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive(href) ? "" : ""}`} />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-danger hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
