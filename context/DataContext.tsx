'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { statesApi, rulesApi, eligibilityApi } from '@/lib/api';

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
  _id: string;
  contact_id: string;
  status: string;
  reason: string;
  insurance_type: string;
  state: string;
  checked_at: string;
  created_at: string;
  updated_at: string;
  patient?: {
    name?: string;
    dob?: string;
    gender?: string;
  };
  payer?: {
    name?: string;
    plan_type?: string;
  };
  provider?: {
    name?: string;
    npi?: string;
  };
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
  refreshEligibility: () => Promise<void>;
  addState: (state: State) => Promise<void>;
  updateState: (index: number, state: Partial<State>) => Promise<void>;
  deleteState: (index: number) => Promise<void>;
  addRule: (rule: Rule) => Promise<void>;
  updateRule: (index: number, rule: Partial<Rule>) => Promise<void>;
  deleteRule: (index: number) => Promise<void>;
  addItem: (item: Omit<EligibilityItem, '_id'>) => void;
  updateItem: (_id: string, item: Partial<EligibilityItem>) => void;
  deleteItem: (_id: string) => void;
  getCategoryCount: (category: 'accepted' | 'notAccepted' | 'needsReview') => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultStates: State[] = [];
const defaultItems: EligibilityItem[] = [];

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

  const refreshEligibility = async () => {
    setLoading(true);
    setError(null);
    const result = await eligibilityApi.getAll();
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.data) {
      // Map backend status to category
      const itemsWithCategory = result.data.map((item: any) => {
        let category: 'accepted' | 'notAccepted' | 'needsReview';
        const status = item.status?.toLowerCase() || '';

        if (status === 'eligible' || status === 'accepted') {
          category = 'accepted';
        } else if (status === 'not eligible' || status === 'not accepted') {
          category = 'notAccepted';
        } else {
          category = 'needsReview';
        }

        return {
          ...item,
          _id: item._id || item.id,
          category,
        };
      });
      setItems(itemsWithCategory);
    }
  };

  useEffect(() => {
    refreshStates();
    refreshRules();
    refreshEligibility();
  }, []);

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

  const addItem = (item: Omit<EligibilityItem, '_id'>) => {
    const newItem = { ...item, _id: Date.now().toString() };
    setItems([...items, newItem]);
  };

  const updateItem = (_id: string, updates: Partial<EligibilityItem>) => {
    setItems(items.map(i => i._id === _id ? { ...i, ...updates } : i));
  };

  const deleteItem = (_id: string) => {
    setItems(items.filter(i => i._id !== _id));
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
      refreshEligibility,
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
