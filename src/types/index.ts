export type MarketType = 'Crypto' | 'Forex' | 'Stocks' | 'Indices' | 'Commodities';
export type DirectionType = 'Long' | 'Short';
export type TradeResult = 'Win' | 'Loss' | 'Breakeven' | 'Open';
export type SessionType = 'Asian' | 'London' | 'New York' | 'London/NY Overlap';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'elite';
  createdAt: string;
  settings: {
    currency: string;
    timezone: string;
    defaultRiskPercentage: number;
    defaultRR: number;
    theme: 'dark' | 'light';
    notifications: boolean;
    dateFormat: string;
  };
}

export interface TradingAccount {
  id: string;
  userId: string;
  name: string;
  broker: string;
  startingBalance: number;
  currentBalance: number;
  dailyLossLimit: number;
  maxDrawdown: number;
  currency: string;
  isDefault: boolean;
  createdAt: string;
}

export interface TradePsychology {
  beforeEmotion: string;
  duringEmotion: string;
  afterEmotion: string;
  confidence: number; // 1-10
  disciplineScore: number; // 1-10
  fomo: boolean;
  revengeTrading: boolean;
  overtrading: boolean;
  hesitation: boolean;
}

export interface TradeScreenshots {
  before?: string;
  entry?: string;
  exit?: string;
}

export interface Trade {
  id: string;
  accountId: string;
  userId: string;
  date: string;
  time: string;
  symbol: string;
  market: MarketType;
  direction: DirectionType;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  exitPrice?: number;
  positionSize: number;
  leverage: number;
  riskPercentage: number;
  riskAmount: number;
  rrRatio: number;
  result: TradeResult;
  grossProfit?: number;
  fees: number;
  netPnl: number;
  rMultiple: number;
  strategyId?: string;
  strategyName?: string;
  setup?: string;
  timeframe: string;
  session: SessionType;
  marketCondition?: string;
  entryReason?: string;
  exitReason?: string;
  psychology: TradePsychology;
  screenshots: TradeScreenshots;
  notes?: string;
  createdAt: string;
}

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  market: MarketType;
  timeframe: string;
  entryRules: string;
  confirmationRules: string;
  stopLossRules: string;
  takeProfitRules: string;
  riskRules: string;
  rrTarget: number;
  bestSession: SessionType;
  avoidConditions: string;
  createdAt: string;
}

export interface TradingPlan {
  id: string;
  userId: string;
  monthlyGoal: number;
  weeklyGoal: number;
  dailyGoal: number;
  maxDailyLoss: number;
  maxWeeklyLoss: number;
  riskPerTrade: number;
  maxTradesPerDay: number;
  maxLossesPerDay: number;
  maxRiskExposure: number;
  personalRules: { id: string; rule: string; active: boolean }[];
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface PsychologyLog {
  id: string;
  userId: string;
  date: string;
  fear: number;
  greed: number;
  fomo: number;
  revenge: number;
  overconfidence: number;
  hesitation: number;
  stress: number;
  patience: number;
  discipline: number;
  notes: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: 'Monthly Profit' | 'Weekly Profit' | 'Win Rate' | 'Trades Count' | 'Discipline';
  targetValue: number;
  currentValue: number;
  unit: '$' | '%' | 'trades';
  deadline?: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  updatedAt: string;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  market: MarketType;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  isLive: boolean;
}

export interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  currency: string;
  event: string;
  impact: 'High' | 'Medium' | 'Low';
  previous: string;
  forecast: string;
  actual?: string;
}
