import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, noPadding = false, className = '', ...props }, ref) => {
    const padding = noPadding ? '' : 'p-6';
    
    return (
      <div
        ref={ref}
        className={`bg-surface-container-lowest border border-outline-variant/60 rounded-xl shadow-sm ${padding} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
