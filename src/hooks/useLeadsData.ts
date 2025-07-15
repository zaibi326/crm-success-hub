
import { useState, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';
import { initialMockLeads, LEADS_STORAGE_KEY } from '@/data/mockLeads';

export function useLeadsData() {
  const [mockLeads, setMockLeads] = useState<TaxLead[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load leads from localStorage on component mount
  useEffect(() => {
    const savedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
    if (savedLeads) {
      try {
        const parsedLeads = JSON.parse(savedLeads);
        setMockLeads(parsedLeads);
        console.log('Loaded leads from localStorage:', parsedLeads.length, 'leads');
      } catch (error) {
        console.error('Error parsing saved leads:', error);
        setMockLeads(initialMockLeads);
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(initialMockLeads));
      }
    } else {
      // Only use initial mock leads if no saved data exists
      console.log('No saved leads found, using initial mock data');
      setMockLeads(initialMockLeads);
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(initialMockLeads));
    }
    setIsLoaded(true);
  }, []);

  // Save leads to localStorage whenever mockLeads changes (but only after initial load)
  useEffect(() => {
    if (isLoaded && mockLeads.length >= 0) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(mockLeads));
      console.log('Saved leads to localStorage:', mockLeads.length, 'leads');
    }
  }, [mockLeads, isLoaded]);

  const handleAddLead = (newLead: TaxLead) => {
    setMockLeads(prev => {
      const updatedLeads = [...prev, newLead];
      console.log('Adding lead to state:', newLead);
      return updatedLeads;
    });
  };

  const handleLeadUpdate = (updatedLead: TaxLead) => {
    setMockLeads(prev => {
      const updatedLeads = prev.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      );
      console.log('Updating lead in state:', updatedLead);
      return updatedLeads;
    });
  };

  const handleDeleteLead = (leadId: number) => {
    setMockLeads(prev => {
      const updatedLeads = prev.filter(lead => lead.id !== leadId);
      console.log('Deleting lead from state:', leadId);
      return updatedLeads;
    });
  };

  const handleBulkDeleteLeads = (leadIds: number[]) => {
    setMockLeads(prev => {
      const updatedLeads = prev.filter(lead => !leadIds.includes(lead.id));
      console.log('Bulk deleting leads from state:', leadIds);
      return updatedLeads;
    });
  };

  return {
    mockLeads,
    setMockLeads,
    handleAddLead,
    handleLeadUpdate,
    handleDeleteLead,
    handleBulkDeleteLeads,
    isLoaded
  };
}
