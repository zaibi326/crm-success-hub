
import React from 'react';
import { User } from 'lucide-react';

interface LeadEmptyStateProps {
  searchTerm: string;
}

export function LeadEmptyState({ searchTerm }: LeadEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
      <p className="text-gray-600">
        {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first seller lead.'}
      </p>
    </div>
  );
}
