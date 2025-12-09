import { cn } from '../../utils/cn';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}



