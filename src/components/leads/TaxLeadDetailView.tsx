
import React from 'react';
import { TaxLead } from '@/types/taxLead';

interface TaxLeadDetailViewProps {
  selectedLead: TaxLead;
  onBack: () => void;
}

export function TaxLeadDetailView({ selectedLead, onBack }: TaxLeadDetailViewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 text-crm-primary hover:text-crm-primary/80 flex items-center gap-2"
      >
        ← Back to Leads
      </button>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{selectedLead.ownerName}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Tax ID:</strong> {selectedLead.taxId}</p>
            <p><strong>Property:</strong> {selectedLead.propertyAddress}</p>
            <p><strong>Status:</strong> {selectedLead.status}</p>
          </div>
          <div>
            <p><strong>Current Arrears:</strong> ${selectedLead.currentArrears?.toLocaleString() || 'N/A'}</p>
            <p><strong>Phone:</strong> {selectedLead.phone || 'N/A'}</p>
            <p><strong>Email:</strong> {selectedLead.email || 'N/A'}</p>
          </div>
        </div>
        {selectedLead.notes && (
          <div className="mt-4">
            <p><strong>Notes:</strong> {selectedLead.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
