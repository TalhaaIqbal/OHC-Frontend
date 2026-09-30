'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface State {
  id: string;
  name: string;
  code: string;
  served: boolean;
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
  addState: (state: Omit<State, 'id'>) => void;
  updateState: (id: string, state: Partial<State>) => void;
  deleteState: (id: string) => void;
  addItem: (item: Omit<EligibilityItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<EligibilityItem>) => void;
  deleteItem: (id: string) => void;
  getCategoryCount: (category: 'accepted' | 'notAccepted' | 'needsReview') => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultStates: State[] = [
  { id: '1', name: 'California', code: 'CA', served: true },
  { id: '2', name: 'Texas', code: 'TX', served: true },
  { id: '3', name: 'New York', code: 'NY', served: false },
  { id: '4', name: 'Florida', code: 'FL', served: true },
  { id: '5', name: 'Illinois', code: 'IL', served: false },
];

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

  useEffect(() => {
    const storedStates = localStorage.getItem('states');
    const storedItems = localStorage.getItem('items');
    if (storedStates) setStates(JSON.parse(storedStates));
    if (storedItems) setItems(JSON.parse(storedItems));
  }, []);

  useEffect(() => {
    localStorage.setItem('states', JSON.stringify(states));
  }, [states]);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const addState = (state: Omit<State, 'id'>) => {
    const newState = { ...state, id: Date.now().toString() };
    setStates([...states, newState]);
  };

  const updateState = (id: string, updates: Partial<State>) => {
    setStates(states.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteState = (id: string) => {
    setStates(states.filter(s => s.id !== id));
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
      addState,
      updateState,
      deleteState,
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
