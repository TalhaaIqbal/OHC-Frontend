'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { statesApi, rulesApi } from '@/lib/api';

interface State {
  index: number;
  name: string;
  code: string;
  served: boolean;
}

interface Rule {
  index: number;
  payer?: string;
  plan?: string;
  [key: string]: any;
}

interface EligibilityItem {
  id: string;
  name: string;
  ghlContactId: string;
  reason: string;
  appointmentStatus: string;
  category: 'accepted' | 'notAccepted' | 'needsReview';
}

interface DataContextType {
  states: State[];
  items: EligibilityItem[];
  rules: Rule[];
  loading: boolean;
  error: string | null;
  refreshStates: () => Promise<void>;
  refreshRules: () => Promise<void>;
  addState: (state: Omit<State, 'index'>) => Promise<void>;
  updateState: (index: number, state: Partial<State>) => Promise<void>;
  deleteState: (index: number) => Promise<void>;
  addRule: (rule: Omit<Rule, 'index'>) => Promise<void>;
  updateRule: (index: number, rule: Partial<Rule>) => Promise<void>;
  deleteRule: (index: number) => Promise<void>;
  addItem: (item: Omit<EligibilityItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<EligibilityItem>) => void;
  deleteItem: (id: string) => void;
  getCategoryCount: (category: 'accepted' | 'notAccepted' | 'needsReview') => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultStates: State[] = [];

const defaultItems: EligibilityItem[] = [
  { id: '1', name: 'John Doe', ghlContactId: 'GHL001', reason: 'Income verification', appointmentStatus: 'Scheduled', category: 'accepted' },
  { id: '2', name: 'Jane Smith', ghlContactId: 'GHL002', reason: 'Missing documents', appointmentStatus: 'Pending', category: 'notAccepted' },
  { id: '3', name: 'Bob Johnson', ghlContactId: 'GHL003', reason: 'Review required', appointmentStatus: 'Scheduled', category: 'needsReview' },
  { id: '4', name: 'Alice Brown', ghlContactId: 'GHL004', reason: 'Age verification', appointmentStatus: 'Completed', category: 'accepted' },
  { id: '5', name: 'Charlie Wilson', ghlContactId: 'GHL005', reason: 'Address verification', appointmentStatus: 'Pending', category: 'notAccepted' },
  { id: '6', name: 'Diana Lee', ghlContactId: 'GHL006', reason: 'Additional info needed', appointmentStatus: 'Scheduled', category: 'needsReview' },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [states, setStates] = useState<State[]>(defaultStates);
  const [items, setItems] = useState<EligibilityItem[]>(defaultItems);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStates = async () => {
    setLoading(true);
    setError(null);
    const result = await statesApi.getAll();
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.data) {
      setStates(result.data);
    }
  };

  const refreshRules = async () => {
    setLoading(true);
    setError(null);
    const result = await rulesApi.getAll();
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.data) {
      setRules(result.data);
    }
  };

  useEffect(() => {
    refreshStates();
    refreshRules();
  }, []);

  useEffect(() => {
    const storedItems = localStorage.getItem('items');
    if (storedItems) setItems(JSON.parse(storedItems));
  }, []);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const addState = async (state: Omit<State, 'index'>) => {
    setLoading(true);
    setError(null);
    const result = await statesApi.add(state);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    await refreshStates();
  };

  const updateState = async (index: number, updates: Partial<State>) => {
    setLoading(true);
    setError(null);
    const result = await statesApi.update(index, updates);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    await refreshStates();
  };

  const deleteState = async (index: number) => {
    setLoading(true);
    setError(null);
    const result = await statesApi.delete(index);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    await refreshStates();
  };

  const addRule = async (rule: Omit<Rule, 'index'>) => {
    setLoading(true);
    setError(null);
    const result = await rulesApi.add(rule);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    await refreshRules();
  };

  const updateRule = async (index: number, updates: Partial<Rule>) => {
    setLoading(true);
    setError(null);
    const result = await rulesApi.update(index, updates);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    await refreshRules();
  };

  const deleteRule = async (index: number) => {
    setLoading(true);
    setError(null);
    const result = await rulesApi.delete(index);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    await refreshRules();
  };

  const addItem = (item: Omit<EligibilityItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<EligibilityItem>) => {
    setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const getCategoryCount = (category: 'accepted' | 'notAccepted' | 'needsReview') => {
    return items.filter(i => i.category === category).length;
  };

  return (
    <DataContext.Provider value={{
      states,
      items,
      rules,
      loading,
      error,
      refreshStates,
      refreshRules,
      addState,
      updateState,
      deleteState,
      addRule,
      updateRule,
      deleteRule,
      addItem,
      updateItem,
      deleteItem,
      getCategoryCount
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
