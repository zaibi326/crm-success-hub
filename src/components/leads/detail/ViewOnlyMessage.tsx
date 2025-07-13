
import React from 'react';

interface ViewOnlyMessageProps {
  canEdit: boolean;
}

export function ViewOnlyMessage({ canEdit }: ViewOnlyMessageProps) {
  if (canEdit) return null;

  return (
    <div className="text-center py-4">
      <p className="text-gray-600">You have view-only access to this lead.</p>
    </div>
  );
}
