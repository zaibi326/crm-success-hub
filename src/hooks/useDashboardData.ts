
import { useState, useEffect } from 'react';
import { TaxLead } from '@/types/taxLead';
import { mockTaxLeads } from '@/data/mockTaxLeads';

export function useDashboardData() {
  const [recentLeads, setRecentLeads] = useState<TaxLead[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    passLeads: 0,
    keepLeads: 0,
    totalArrears: 0,
    avgArrears: 0
  });

  useEffect(() => {
    // Simulate loading recent leads
    const loadRecentLeads = () => {
      // Get the 5 most recent leads
      const recent = mockTaxLeads
        .sort((a, b) => new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime())
        .slice(0, 5);
      
      setRecentLeads(recent);
    };

    const calculateStats = () => {
      const total = mockTaxLeads.length;
      const hot = mockTaxLeads.filter(lead => lead.status === 'HOT').length;
      const warm = mockTaxLeads.filter(lead => lead.status === 'WARM').length;
      const cold = mockTaxLeads.filter(lead => lead.status === 'COLD').length;
      const pass = mockTaxLeads.filter(lead => lead.status === 'PASS').length;
      const keep = mockTaxLeads.filter(lead => lead.status === 'KEEP').length;
      
      const totalArrears = mockTaxLeads.reduce((sum, lead) => sum + (lead.currentArrears || 0), 0);
      const avgArrears = total > 0 ? totalArrears / total : 0;

      setStats({
        totalLeads: total,
        hotLeads: hot,
        warmLeads: warm,
        coldLeads: cold,
        passLeads: pass,
        keepLeads: keep,
        totalArrears,
        avgArrears
      });
    };

    loadRecentLeads();
    calculateStats();
  }, []);

  return {
    recentLeads,
    stats
  };
}
