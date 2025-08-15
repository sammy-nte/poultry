import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Flock {
  id: string;
  name: string;
  breed: string;
  age: number;
  totalBirds: number;
  mortality: number;
  eggProduction: number;
  avgWeight: number;
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  lastUpdated: string;
  notes: string;
}

export interface EggProduction {
  id: string;
  date: string;
  eggs: number;
  quality: {
    gradeA: number;
    gradeB: number;
    damaged: number;
  };
  coopBreakdown: Record<string, number>;
  notes: string;
}

export interface FeedItem {
  id: string;
  name: string;
  currentStock: number;
  dailyConsumption: number;
  totalCapacity: number;
  lastRefill: string;
  supplier: string;
  cost: number;
  alertLevel: 'low' | 'medium' | 'high';
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  type: string;
  flockId: string;
  date: string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  observations: string;
  actionsTaken: string;
  followUpRequired: boolean;
  veterinaryConsultation: boolean;
}

export interface Vaccination {
  id: string;
  vaccine: string;
  date: string;
  flockIds: string[];
  status: 'Scheduled' | 'Completed' | 'Overdue';
  notes: string;
}

interface AppState {
  flocks: Flock[];
  eggProduction: EggProduction[];
  feedInventory: FeedItem[];
  transactions: Transaction[];
  healthRecords: HealthRecord[];
  vaccinations: Vaccination[];
}

type AppAction =
  | { type: 'ADD_FLOCK'; payload: Flock }
  | { type: 'UPDATE_FLOCK'; payload: Flock }
  | { type: 'DELETE_FLOCK'; payload: string }
  | { type: 'ADD_EGG_PRODUCTION'; payload: EggProduction }
  | { type: 'ADD_FEED_USAGE'; payload: { feedId: string; amount: number; date: string } }
  | { type: 'ADD_FEED_RESTOCK'; payload: { feedId: string; amount: number; date: string } }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_HEALTH_RECORD'; payload: HealthRecord }
  | { type: 'ADD_VACCINATION'; payload: Vaccination }
  | { type: 'UPDATE_VACCINATION'; payload: Vaccination };

const initialState: AppState = {
  flocks: [
    {
      id: '1',
      name: 'Coop A - Layer House',
      breed: 'Rhode Island Red',
      age: 28,
      totalBirds: 500,
      mortality: 3,
      eggProduction: 87,
      avgWeight: 1800,
      health: 'Excellent',
      lastUpdated: '2 hours ago',
      notes: 'High egg production this week',
    },
    {
      id: '2',
      name: 'Coop B - Young Layers',
      breed: 'New Hampshire',
      age: 22,
      totalBirds: 450,
      mortality: 1,
      eggProduction: 75,
      avgWeight: 1650,
      health: 'Good',
      lastUpdated: '4 hours ago',
      notes: 'Starting to reach peak production',
    },
    {
      id: '3',
      name: 'Coop C - Broilers',
      breed: 'Cornish Cross',
      age: 6,
      totalBirds: 800,
      mortality: 12,
      eggProduction: 0,
      avgWeight: 900,
      health: 'Good',
      lastUpdated: '1 hour ago',
      notes: 'Ready for processing next week',
    },
  ],
  eggProduction: [
    {
      id: '1',
      date: 'Today',
      eggs: 1850,
      quality: { gradeA: 1600, gradeB: 200, damaged: 50 },
      coopBreakdown: { 'Coop A': 800, 'Coop B': 650, 'Coop C': 0, 'Coop D': 400 },
      notes: 'Excellent production day',
    },
    {
      id: '2',
      date: 'Yesterday',
      eggs: 1780,
      quality: { gradeA: 1520, gradeB: 210, damaged: 50 },
      coopBreakdown: { 'Coop A': 750, 'Coop B': 630, 'Coop C': 0, 'Coop D': 400 },
      notes: 'Good quality overall',
    },
  ],
  feedInventory: [
    {
      id: '1',
      name: 'Layer Mash',
      currentStock: 850,
      dailyConsumption: 125,
      totalCapacity: 2000,
      lastRefill: '3 days ago',
      supplier: 'Farm Feed Co.',
      cost: 2.45,
      alertLevel: 'medium',
    },
    {
      id: '2',
      name: 'Starter Feed',
      currentStock: 150,
      dailyConsumption: 45,
      totalCapacity: 500,
      lastRefill: '1 week ago',
      supplier: 'Premium Feeds Ltd',
      cost: 3.20,
      alertLevel: 'low',
    },
  ],
  transactions: [
    {
      id: '1',
      type: 'income',
      description: 'Egg Sales - Local Market',
      amount: 1250,
      date: 'Today',
      category: 'Egg Sales',
    },
    {
      id: '2',
      type: 'expense',
      description: 'Feed Purchase - Layer Mash',
      amount: 850,
      date: 'Yesterday',
      category: 'Feed & Supplies',
    },
  ],
  healthRecords: [],
  vaccinations: [
    {
      id: '1',
      vaccine: 'Newcastle Disease',
      date: 'Jan 25, 2025',
      flockIds: ['1', '2', '3'],
      status: 'Scheduled',
      notes: 'Annual booster vaccination',
    },
  ],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_FLOCK':
      return {
        ...state,
        flocks: [...state.flocks, action.payload],
      };
    
    case 'UPDATE_FLOCK':
      return {
        ...state,
        flocks: state.flocks.map(flock =>
          flock.id === action.payload.id ? action.payload : flock
        ),
      };
    
    case 'DELETE_FLOCK':
      return {
        ...state,
        flocks: state.flocks.filter(flock => flock.id !== action.payload),
      };
    
    case 'ADD_EGG_PRODUCTION':
      return {
        ...state,
        eggProduction: [action.payload, ...state.eggProduction],
      };
    
    case 'ADD_FEED_USAGE':
      return {
        ...state,
        feedInventory: state.feedInventory.map(feed =>
          feed.id === action.payload.feedId
            ? {
                ...feed,
                currentStock: Math.max(0, feed.currentStock - action.payload.amount),
                alertLevel: feed.currentStock - action.payload.amount < feed.totalCapacity * 0.2 
                  ? 'low' 
                  : feed.currentStock - action.payload.amount < feed.totalCapacity * 0.5 
                    ? 'medium' 
                    : 'high'
              }
            : feed
        ),
      };
    
    case 'ADD_FEED_RESTOCK':
      return {
        ...state,
        feedInventory: state.feedInventory.map(feed =>
          feed.id === action.payload.feedId
            ? {
                ...feed,
                currentStock: Math.min(feed.totalCapacity, feed.currentStock + action.payload.amount),
                lastRefill: action.payload.date,
                alertLevel: feed.currentStock + action.payload.amount > feed.totalCapacity * 0.5 
                  ? 'high' 
                  : feed.currentStock + action.payload.amount > feed.totalCapacity * 0.2 
                    ? 'medium' 
                    : 'low'
              }
            : feed
        ),
      };
    
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    
    case 'ADD_HEALTH_RECORD':
      return {
        ...state,
        healthRecords: [action.payload, ...state.healthRecords],
      };
    
    case 'ADD_VACCINATION':
      return {
        ...state,
        vaccinations: [action.payload, ...state.vaccinations],
      };
    
    case 'UPDATE_VACCINATION':
      return {
        ...state,
        vaccinations: state.vaccinations.map(vaccination =>
          vaccination.id === action.payload.id ? action.payload : vaccination
        ),
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}