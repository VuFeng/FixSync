import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(
  undefined
);

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Select({ value, onValueChange, children, disabled }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>{children}</div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function SelectTrigger({
  children,
  className,
  ...props
}: SelectTriggerProps) {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error("SelectTrigger must be used within Select");
  }

  const { isOpen, setIsOpen } = context;

  return (
    <button
      type="button"
      className={cn(
        "select-trigger flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
        "bg-surface-secondary border-border text-text-primary",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectValue({ 
  placeholder, 
  children 
}: { 
  placeholder?: string;
  children?: React.ReactNode;
}) {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("SelectValue must be used within Select");
  }
  // If children provided, use it (for custom display like brand/model name)
  // Otherwise, show value or placeholder
  return <span>{children || context.value || placeholder}</span>;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({
  children,
  className,
}: SelectContentProps) {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error("SelectContent must be used within Select");
  }

  const { isOpen, setIsOpen } = context;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.select-content') && !target.closest('.select-trigger')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => setIsOpen(false)}
      />
      <div
        className={cn(
          "select-content absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-surface-secondary border-border shadow-md",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function SelectItem({
  value,
  children,
  className,
}: SelectItemProps) {
  const context = React.useContext(SelectContext);
  
  if (!context) {
    throw new Error("SelectItem must be used within Select");
  }

  const { onValueChange, setIsOpen } = context;

  const handleClick = () => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-text-primary",
        "hover:bg-surface focus:bg-surface",
        "outline-none",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
