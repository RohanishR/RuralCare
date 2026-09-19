import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There is currently no data to display here.',
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-on-surface-variant">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-medium text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-variant max-w-sm mb-6">{description}</p>
      {onAction && actionLabel && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
