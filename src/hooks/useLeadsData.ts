
import { useState, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';
import { initialMockLeads, LEADS_STORAGE_KEY } from '@/data/mockLeads';

export function useLeadsData() {
  const [mockLeads, setMockLeads] = useState<TaxLead[]>([]);

  // Load leads from localStorage on component mount
  useEffect(() => {
    const savedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
    if (savedLeads) {
      try {
        const parsedLeads = JSON.parse(savedLeads);
        setMockLeads(parsedLeads);
      } catch (error) {
        console.error('Error parsing saved leads:', error);
        setMockLeads(initialMockLeads);
      }
    } else {
      setMockLeads(initialMockLeads);
    }
  }, []);

  // Save leads to localStorage whenever mockLeads changes
  useEffect(() => {
    if (mockLeads.length > 0) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(mockLeads));
    }
  }, [mockLeads]);

  const handleAddLead = (newLead: TaxLead) => {
    setMockLeads(prev => {
      const updatedLeads = [...prev, newLead];
      return updatedLeads;
    });
  };

  const handleLeadUpdate = (updatedLead: TaxLead) => {
    setMockLeads(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
  };

  return {
    mockLeads,
    handleAddLead,
    handleLeadUpdate
  };
}
