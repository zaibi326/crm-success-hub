
import { useState, useEffect } from 'react';
import { FilterCondition } from '@/components/leads/filters/types';

interface SavedFilter {
  id: string;
  name: string;
  filters: FilterCondition[];
  createdAt: Date;
  updatedAt: Date;
}

export function useSavedFilters() {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const STORAGE_KEY = 'crm_saved_filters';

  // Load saved filters from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedFilters = JSON.parse(saved).map((filter: any) => ({
          ...filter,
          createdAt: new Date(filter.createdAt),
          updatedAt: new Date(filter.updatedAt)
        }));
        setSavedFilters(parsedFilters);
      }
    } catch (error) {
      console.error('Error loading saved filters:', error);
    }
  }, []);

  // Save filters to localStorage whenever savedFilters changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFilters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  }, [savedFilters]);

  const saveFilter = (name: string, filters: FilterCondition[]): SavedFilter => {
    const newFilter: SavedFilter = {
      id: `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      filters: [...filters],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSavedFilters(prev => [...prev, newFilter]);
    return newFilter;
  };

  const updateFilter = (id: string, name: string, filters: FilterCondition[]): SavedFilter | null => {
    const existing = savedFilters.find(f => f.id === id);
    if (!existing) return null;

    const updatedFilter: SavedFilter = {
      ...existing,
      name,
      filters: [...filters],
      updatedAt: new Date()
    };

    setSavedFilters(prev => prev.map(f => f.id === id ? updatedFilter : f));
    return updatedFilter;
  };

  const deleteFilter = (id: string): boolean => {
    const exists = savedFilters.some(f => f.id === id);
    if (exists) {
      setSavedFilters(prev => prev.filter(f => f.id !== id));
    }
    return exists;
  };

  const getFilter = (id: string): SavedFilter | null => {
    return savedFilters.find(f => f.id === id) || null;
  };

  const clearAllFilters = () => {
    setSavedFilters([]);
  };

  return {
    savedFilters,
    saveFilter,
    updateFilter,
    deleteFilter,
    getFilter,
    clearAllFilters
  };
}
