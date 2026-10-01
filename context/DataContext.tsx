'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { statesApi, rulesApi } from '@/lib/api';

interface State {
  state: string;
  abbreviation: string;
  served: boolean;
  enrolled: boolean;
}

interface Rule {
  payer_plan_type: string;
  decision: string;
  condition: string;
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
  addState: (state: State) => Promise<void>;
  updateState: (index: number, state: Partial<State>) => Promise<void>;
  deleteState: (index: number) => Promise<void>;
  addRule: (rule: Rule) => Promise<void>;
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
      // Backend returns { type: "states", states: [...], updated_at: ... }
      setStates(result.data.states || []);
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
      // Backend returns { type: "rules", rules: [...], updated_at: ... }
      setRules(result.data.rules || []);
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

  const addState = async (state: State) => {
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
    const currentState = states[index];
    const updatedState = { ...currentState, ...updates } as State;
    const result = await statesApi.update(index, updatedState);
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

  const addRule = async (rule: Rule) => {
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
    const currentRule = rules[index];
    const updatedRule = { ...currentRule, ...updates } as Rule;
    const result = await rulesApi.update(index, updatedRule);
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
