import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 z-50 bg-surface/80 backdrop-blur-sm' 
    : 'w-full h-48';

  return (
    <div className={`${containerClass} flex flex-col items-center justify-center gap-3`}>
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-on-surface-variant font-medium">{message}</p>
    </div>
  );
};
