import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

interface DropdownMenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={menuRef} className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ 
  children,
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuTrigger must be used within DropdownMenu");
  }

  return (
    <button
      type="button"
      onClick={() => context.setIsOpen(!context.isOpen)}
      className={cn(
        "p-1 rounded-md hover:bg-surface-secondary text-text-tertiary hover:text-text-primary transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuContent must be used within DropdownMenu");
  }

  if (!context.isOpen) return null;

  return (
    <div
      className={cn(
        "absolute right-0 mt-1 w-48 rounded-md border border-border bg-surface shadow-lg z-50",
        className
      )}
    >
      <div className="py-1">{children}</div>
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
  variant = "default",
  onSelect,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "danger";
  onSelect?: () => void;
  disabled?: boolean;
}) {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuItem must be used within DropdownMenu");
  }

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    onSelect?.();
    if (onClick || onSelect) {
      context.setIsOpen(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "w-full text-left px-4 py-2 text-sm transition-colors",
        variant === "danger"
          ? "text-danger hover:bg-red-500/10"
          : "text-text-primary hover:bg-surface-secondary",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="h-px bg-border my-1" />;
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-4 py-2 text-xs font-semibold text-text-tertiary uppercase", className)}>
      {children}
    </div>
  );
}

