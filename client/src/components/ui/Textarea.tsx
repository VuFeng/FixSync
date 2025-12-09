import * as React from "react";
import { cn } from "../../utils/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex w-full rounded-md border bg-surface-secondary border-border px-3 py-2 text-sm text-text-primary shadow-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";




