import React from "react";
import { cn } from "../../utils/cn";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-text-primary", className)}
      {...props}
    />
  );
}




