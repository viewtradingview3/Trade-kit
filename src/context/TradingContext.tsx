import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  TradingAccount,
  Trade,
  Strategy,
  TradingPlan,
  ChecklistItem,
  PsychologyLog,
  Goal,
  Note,
  WatchlistItem,
  EconomicEvent,
} from '../types';
import {
  DEMO_USER,
  INITIAL_ACCOUNTS,
  INITIAL_STRATEGIES,
  INITIAL_TRADES,
  INITIAL_PLAN,
  INITIAL_PRE_CHECKLIST,
  INITIAL_POST_CHECKLIST,
  INITIAL_PSYCHOLOGY_LOGS,
  INITIAL_GOALS,
  INITIAL_NOTES,
  INITIAL_WATCHLIST,
  INITIAL_ECONOMIC_EVENTS,
} from '../data/initialData';

interface TradingContextType {
  user: User | null;
  isAuthenticated: boolean;
  activeAccount: TradingAccount | null;
  accounts: TradingAccount[];
  trades: Trade[];
  allTrades: Trade[];
  strategies: Strategy[];
  tradingPlan: TradingPlan;
  preChecklist: ChecklistItem[];
  postChecklist: ChecklistItem[];
  psychologyLogs: PsychologyLog[];
  goals: Goal[];
  notes: Note[];
  watchlist: WatchlistItem[];
  economicEvents: EconomicEvent[];
  activeTab: string;
  theme: 'dark' | 'light';
  calculatorPrefill: Partial<Trade> | null;
  
  // Actions
  setActiveTab: (tab: string) => void;
  toggleTheme: () => void;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  loginAsDemo: () => void;
  setActiveAccount: (accountId: string) => void;
  createAccount: (data: Omit<TradingAccount, 'id' | 'userId' | 'createdAt'>) => void;
  updateAccount: (accountId: string, updates: Partial<TradingAccount>) => void;
  deleteAccount: (accountId: string) => void;
  
  addTrade: (data: Omit<Trade, 'id' | 'userId' | 'createdAt'>) => void;
  updateTrade: (tradeId: string, updates: Partial<Trade>) => void;
  deleteTrade: (tradeId: string) => void;
  duplicateTrade: (tradeId: string) => void;
  importTrades: (imported: Trade[]) => void;
  
  addStrategy: (data: Omit<Strategy, 'id' | 'userId' | 'createdAt'>) => void;
  updateStrategy: (id: string, updates: Partial<Strategy>) => void;
  deleteStrategy: (id: string) => void;
  
  updateTradingPlan: (plan: Partial<TradingPlan>) => void;
  
  toggleChecklist: (type: 'pre' | 'post', id: string) => void;
  addChecklistItem: (type: 'pre' | 'post', text: string) => void;
  deleteChecklistItem: (type: 'pre' | 'post', id: string) => void;
  resetChecklists: () => void;
  
  addPsychologyLog: (log: Omit<PsychologyLog, 'id' | 'userId'>) => void;
  
  addGoal: (goal: Omit<Goal, 'id' | 'userId'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  addNote: (note: Omit<Note, 'id' | 'userId' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  
  updateWatchlistPrice: (symbol: string, price: number, change: number) => void;
  addWatchlistSymbol: (symbol: string, name: string, market: any) => void;
  
  setCalculatorPrefill: (prefill: Partial<Trade> | null) => void;
  sendCalculatorToJournal: (tradeData: Partial<Trade>) => void;

  // Computed Metrics
  metrics: {
    startingBalance: number;
    currentBalance: number;
    todayPnL: number;
    weeklyPnL: number;
    monthlyPnL: number;
    totalProfit: number;
    totalLoss: number;
    netPnL: number;
    winRate: number;
    lossRate: number;
    profitFactor: number;
    averageRR: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    totalTradesCount: number;
    winningTradesCount: number;
    losingTradesCount: number;
    currentDrawdown: number;
    maxDrawdown: number;
    drawdownPercentage: number;
    recoveryRequiredPercentage: number;
    dailyRiskUsed: number;
    dailyRiskRemaining: number;
    dailyRiskPercentageUsed: number;
    isDailyLossLimitApproaching: boolean;
    isDailyLossLimitReached: boolean;
    equityCurve: { tradeNo: number; date: string; balance: number; pnl: number; symbol: string }[];
  };
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication & User
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tradekit_active_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('tradekit_theme') as 'dark' | 'light') || 'dark';
  });

  const [calculatorPrefill, setCalculatorPrefill] = useState<Partial<Trade> | null>(null);

  // Helper for user-isolated local storage keys
  const getStorageKey = (key: string) => {
    const uId = user ? user.id : 'guest';
    return `tradekit_${uId}_${key}`;
  };

  // State
  const [accounts, setAccounts] = useState<TradingAccount[]>(() => {
    const saved = localStorage.getItem(getStorageKey('accounts'));
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [activeAccountId, setActiveAccountId] = useState<string>(() => {
    const saved = localStorage.getItem(getStorageKey('active_account_id'));
    return saved || (INITIAL_ACCOUNTS[0]?.id ?? '');
  });

  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem(getStorageKey('trades'));
    return saved ? JSON.parse(saved) : INITIAL_TRADES;
  });

  const [strategies, setStrategies] = useState<Strategy[]>(() => {
    const saved = localStorage.getItem(getStorageKey('strategies'));
    return saved ? JSON.parse(saved) : INITIAL_STRATEGIES;
  });

  const [tradingPlan, setTradingPlan] = useState<TradingPlan>(() => {
    const saved = localStorage.getItem(getStorageKey('trading_plan'));
    return saved ? JSON.parse(saved) : INITIAL_PLAN;
  });

  const [preChecklist, setPreChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem(getStorageKey('pre_checklist'));
    return saved ? JSON.parse(saved) : INITIAL_PRE_CHECKLIST;
  });

  const [postChecklist, setPostChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem(getStorageKey('post_checklist'));
    return saved ? JSON.parse(saved) : INITIAL_POST_CHECKLIST;
  });

  const [psychologyLogs, setPsychologyLogs] = useState<PsychologyLog[]>(() => {
    const saved = localStorage.getItem(getStorageKey('psychology_logs'));
    return saved ? JSON.parse(saved) : INITIAL_PSYCHOLOGY_LOGS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(getStorageKey('goals'));
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(getStorageKey('notes'));
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('tradekit_watchlist');
    return saved ? JSON.parse(saved) : INITIAL_WATCHLIST;
  });

  const [economicEvents] = useState<EconomicEvent[]>(INITIAL_ECONOMIC_EVENTS);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('tradekit_theme', theme);
  }, [theme]);

  // Sync user
  useEffect(() => {
    if (user) {
      localStorage.setItem('tradekit_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tradekit_active_user');
    }
  }, [user]);

  // Sync data to localStorage when state changes
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey('accounts'), JSON.stringify(accounts));
  }, [accounts, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey('active_account_id'), activeAccountId);
  }, [activeAccountId, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey('trades'), JSON.stringify(trades));
  }, [trades, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey('strategies'), JSON.stringify(strategies));
  }, [strategies, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey('trading_plan'), JSON.stringify(tradingPlan));
  }, [tradingPlan, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey('pre_checklist'), JSON.stringify(preChecklist));
  }, [preChecklist, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey('post_checklist'), JSON.stringify(postChecklist));
  }, [postChecklist, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey('psychology_logs'), JSON.stringify(psychologyLogs));
  }, [psychologyLogs, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey('goals'), JSON.stringify(goals));
  }, [goals, user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(getStorageKey('notes'), JSON.stringify(notes));
  }, [notes, user]);

  useEffect(() => {
    localStorage.setItem('tradekit_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Live WebSocket for Crypto in Watchlist
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data)) {
            setWatchlist((prev) =>
              prev.map((item) => {
                if (!item.isLive) return item;
                const ticker = data.find((t: any) => t.s === item.symbol);
                if (ticker) {
                  const newPrice = parseFloat(ticker.c);
                  const openPrice = parseFloat(ticker.o);
                  const high = parseFloat(ticker.h);
                  const low = parseFloat(ticker.l);
                  const change = openPrice > 0 ? ((newPrice - openPrice) / openPrice) * 100 : item.change24h;
                  return {
                    ...item,
                    price: newPrice,
                    change24h: parseFloat(change.toFixed(2)),
                    high24h: high,
                    low24h: low,
                  };
                }
                return item;
              })
            );
          }
        } catch (e) {
          // ignore parsing error
        }
      };
    } catch (e) {
      console.warn('Live WebSocket unavailable, using simulated data.');
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Active Account
  const activeAccount = useMemo(() => {
    return accounts.find((a) => a.id === activeAccountId) || accounts[0] || null;
  }, [accounts, activeAccountId]);

  // Filtered trades for active account
  const accountTrades = useMemo(() => {
    if (!activeAccount) return [];
    return trades.filter((t) => t.accountId === activeAccount.id);
  }, [trades, activeAccount]);

  // Comprehensive Metrics Calculation
  const metrics = useMemo(() => {
    if (!activeAccount) {
      return {
        startingBalance: 10000,
        currentBalance: 10000,
        todayPnL: 0,
        weeklyPnL: 0,
        monthlyPnL: 0,
        totalProfit: 0,
        totalLoss: 0,
        netPnL: 0,
        winRate: 0,
        lossRate: 0,
        profitFactor: 0,
        averageRR: 0,
        averageWin: 0,
        averageLoss: 0,
        largestWin: 0,
        largestLoss: 0,
        totalTradesCount: 0,
        winningTradesCount: 0,
        losingTradesCount: 0,
        currentDrawdown: 0,
        maxDrawdown: 0,
        drawdownPercentage: 0,
        recoveryRequiredPercentage: 0,
        dailyRiskUsed: 0,
        dailyRiskRemaining: 0,
        dailyRiskPercentageUsed: 0,
        isDailyLossLimitApproaching: false,
        isDailyLossLimitReached: false,
        equityCurve: [],
      };
    }

    const closedTrades = accountTrades.filter((t) => t.result !== 'Open');
    const winningTrades = closedTrades.filter((t) => t.netPnl > 0);
    const losingTrades = closedTrades.filter((t) => t.netPnl < 0);

    const totalProfit = winningTrades.reduce((acc, t) => acc + t.netPnl, 0);
    const totalLoss = Math.abs(losingTrades.reduce((acc, t) => acc + t.netPnl, 0));
    const netPnL = totalProfit - totalLoss;

    const totalTradesCount = closedTrades.length;
    const winningTradesCount = winningTrades.length;
    const losingTradesCount = losingTrades.length;

    const winRate = totalTradesCount > 0 ? (winningTradesCount / totalTradesCount) * 100 : 0;
    const lossRate = totalTradesCount > 0 ? (losingTradesCount / totalTradesCount) * 100 : 0;

    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 99.9 : 0;

    const averageWin = winningTradesCount > 0 ? totalProfit / winningTradesCount : 0;
    const averageLoss = losingTradesCount > 0 ? totalLoss / losingTradesCount : 0;

    const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map((t) => t.netPnl)) : 0;
    const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map((t) => t.netPnl)) : 0;

    const averageRR =
      closedTrades.length > 0
        ? closedTrades.reduce((acc, t) => acc + (t.rrRatio || 0), 0) / closedTrades.length
        : 0;

    // Time-based calculations (Today, Weekly, Monthly)
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTrades = closedTrades.filter((t) => t.date === todayStr);
    const todayPnL = todayTrades.reduce((acc, t) => acc + t.netPnl, 0);

    // Past 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const weeklyTrades = closedTrades.filter((t) => t.date >= weekAgo);
    const weeklyPnL = weeklyTrades.reduce((acc, t) => acc + t.netPnl, 0);

    // Past 30 days
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthlyTrades = closedTrades.filter((t) => t.date >= monthAgo);
    const monthlyPnL = monthlyTrades.reduce((acc, t) => acc + t.netPnl, 0);

    // Equity Curve & Drawdown Tracking
    let runningBalance = activeAccount.startingBalance;
    let peakBalance = runningBalance;
    let maxDrawdownValue = 0;

    const sortedTrades = [...closedTrades].sort(
      (a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime()
    );

    const equityCurve = [
      {
        tradeNo: 0,
        date: activeAccount.createdAt.split('T')[0],
        balance: activeAccount.startingBalance,
        pnl: 0,
        symbol: 'Initial Deposit',
      },
    ];

    sortedTrades.forEach((trade, index) => {
      runningBalance += trade.netPnl;
      if (runningBalance > peakBalance) {
        peakBalance = runningBalance;
      }
      const dd = peakBalance - runningBalance;
      if (dd > maxDrawdownValue) {
        maxDrawdownValue = dd;
      }
      equityCurve.push({
        tradeNo: index + 1,
        date: trade.date,
        balance: Math.round(runningBalance * 100) / 100,
        pnl: trade.netPnl,
        symbol: trade.symbol,
      });
    });

    const currentBalance = activeAccount.startingBalance + netPnL;
    const currentDrawdown = Math.max(0, peakBalance - currentBalance);
    const drawdownPercentage = peakBalance > 0 ? (currentDrawdown / peakBalance) * 100 : 0;
    const recoveryRequiredPercentage =
      currentBalance > 0 && currentDrawdown > 0 ? (currentDrawdown / currentBalance) * 100 : 0;

    // Daily Loss Limit Protection
    const todayLosses = todayTrades.filter((t) => t.netPnl < 0);
    const dailyRiskUsed = Math.abs(todayLosses.reduce((acc, t) => acc + t.netPnl, 0));
    const dailyLossLimit = activeAccount.dailyLossLimit || 1000;
    const dailyRiskRemaining = Math.max(0, dailyLossLimit - dailyRiskUsed);
    const dailyRiskPercentageUsed = Math.min(100, (dailyRiskUsed / dailyLossLimit) * 100);
    const isDailyLossLimitApproaching = dailyRiskPercentageUsed >= 80 && dailyRiskPercentageUsed < 100;
    const isDailyLossLimitReached = dailyRiskPercentageUsed >= 100;

    return {
      startingBalance: activeAccount.startingBalance,
      currentBalance,
      todayPnL,
      weeklyPnL,
      monthlyPnL,
      totalProfit,
      totalLoss,
      netPnL,
      winRate: Math.round(winRate * 10) / 10,
      lossRate: Math.round(lossRate * 10) / 10,
      profitFactor: Math.round(profitFactor * 100) / 100,
      averageRR: Math.round(averageRR * 100) / 100,
      averageWin: Math.round(averageWin * 100) / 100,
      averageLoss: Math.round(averageLoss * 100) / 100,
      largestWin: Math.round(largestWin * 100) / 100,
      largestLoss: Math.round(largestLoss * 100) / 100,
      totalTradesCount,
      winningTradesCount,
      losingTradesCount,
      currentDrawdown: Math.round(currentDrawdown * 100) / 100,
      maxDrawdown: Math.round(maxDrawdownValue * 100) / 100,
      drawdownPercentage: Math.round(drawdownPercentage * 10) / 10,
      recoveryRequiredPercentage: Math.round(recoveryRequiredPercentage * 10) / 10,
      dailyRiskUsed: Math.round(dailyRiskUsed * 100) / 100,
      dailyRiskRemaining: Math.round(dailyRiskRemaining * 100) / 100,
      dailyRiskPercentageUsed: Math.round(dailyRiskPercentageUsed * 10) / 10,
      isDailyLossLimitApproaching,
      isDailyLossLimitReached,
      equityCurve,
    };
  }, [activeAccount, accountTrades]);

  // Actions
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = async (email: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0] || 'Trader',
      email,
      role: 'user',
      plan: 'pro',
      createdAt: new Date().toISOString(),
      settings: {
        currency: 'USD',
        timezone: 'America/New_York (EST)',
        defaultRiskPercentage: 1.0,
        defaultRR: 2.5,
        theme: 'dark',
        notifications: true,
        dateFormat: 'YYYY-MM-DD',
      },
    };
    setUser(newUser);
    return true;
  };

  const register = async (name: string, email: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'user',
      plan: 'pro',
      createdAt: new Date().toISOString(),
      settings: {
        currency: 'USD',
        timezone: 'America/New_York (EST)',
        defaultRiskPercentage: 1.0,
        defaultRR: 2.5,
        theme: 'dark',
        notifications: true,
        dateFormat: 'YYYY-MM-DD',
      },
    };
    setUser(newUser);
    return true;
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    setAccounts(INITIAL_ACCOUNTS);
    setActiveAccountId(INITIAL_ACCOUNTS[0].id);
    setTrades(INITIAL_TRADES);
    setStrategies(INITIAL_STRATEGIES);
    setTradingPlan(INITIAL_PLAN);
    setPreChecklist(INITIAL_PRE_CHECKLIST);
    setPostChecklist(INITIAL_POST_CHECKLIST);
    setPsychologyLogs(INITIAL_PSYCHOLOGY_LOGS);
    setGoals(INITIAL_GOALS);
    setNotes(INITIAL_NOTES);
    setActiveTab('dashboard');
  };

  const logout = () => {
    setUser(null);
  };

  const setActiveAccount = (accountId: string) => {
    setActiveAccountId(accountId);
  };

  const createAccount = (data: Omit<TradingAccount, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const newAccount: TradingAccount = {
      ...data,
      id: `acc_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    setAccounts((prev) => [newAccount, ...prev]);
    setActiveAccountId(newAccount.id);
  };

  const updateAccount = (accountId: string, updates: Partial<TradingAccount>) => {
    setAccounts((prev) => prev.map((a) => (a.id === accountId ? { ...a, ...updates } : a)));
  };

  const deleteAccount = (accountId: string) => {
    setAccounts((prev) => {
      const filtered = prev.filter((a) => a.id !== accountId);
      if (activeAccountId === accountId && filtered.length > 0) {
        setActiveAccountId(filtered[0].id);
      }
      return filtered;
    });
  };

  const addTrade = (data: Omit<Trade, 'id' | 'userId' | 'createdAt'>) => {
    if (!user || !activeAccount) return;
    const newTrade: Trade = {
      ...data,
      id: `tr_${Date.now()}`,
      userId: user.id,
      accountId: data.accountId || activeAccount.id,
      createdAt: new Date().toISOString(),
    };
    setTrades((prev) => [newTrade, ...prev]);
  };

  const updateTrade = (tradeId: string, updates: Partial<Trade>) => {
    setTrades((prev) => prev.map((t) => (t.id === tradeId ? { ...t, ...updates } : t)));
  };

  const deleteTrade = (tradeId: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== tradeId));
  };

  const duplicateTrade = (tradeId: string) => {
    const original = trades.find((t) => t.id === tradeId);
    if (!original || !user) return;
    const duplicated: Trade = {
      ...original,
      id: `tr_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    setTrades((prev) => [duplicated, ...prev]);
  };

  const importTrades = (imported: Trade[]) => {
    setTrades((prev) => [...imported, ...prev]);
  };

  const addStrategy = (data: Omit<Strategy, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const newStrat: Strategy = {
      ...data,
      id: `strat_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    setStrategies((prev) => [newStrat, ...prev]);
  };

  const updateStrategy = (id: string, updates: Partial<Strategy>) => {
    setStrategies((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStrategy = (id: string) => {
    setStrategies((prev) => prev.filter((s) => s.id !== id));
  };

  const updateTradingPlan = (planUpdates: Partial<TradingPlan>) => {
    setTradingPlan((prev) => ({
      ...prev,
      ...planUpdates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const toggleChecklist = (type: 'pre' | 'post', id: string) => {
    if (type === 'pre') {
      setPreChecklist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
      );
    } else {
      setPostChecklist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
      );
    }
  };

  const addChecklistItem = (type: 'pre' | 'post', text: string) => {
    const newItem: ChecklistItem = {
      id: `${type}_${Date.now()}`,
      text,
      checked: false,
    };
    if (type === 'pre') {
      setPreChecklist((prev) => [...prev, newItem]);
    } else {
      setPostChecklist((prev) => [...prev, newItem]);
    }
  };

  const deleteChecklistItem = (type: 'pre' | 'post', id: string) => {
    if (type === 'pre') {
      setPreChecklist((prev) => prev.filter((item) => item.id !== id));
    } else {
      setPostChecklist((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const resetChecklists = () => {
    setPreChecklist((prev) => prev.map((item) => ({ ...item, checked: false })));
    setPostChecklist((prev) => prev.map((item) => ({ ...item, checked: false })));
  };

  const addPsychologyLog = (data: Omit<PsychologyLog, 'id' | 'userId'>) => {
    if (!user) return;
    const newLog: PsychologyLog = {
      ...data,
      id: `psy_${Date.now()}`,
      userId: user.id,
    };
    setPsychologyLogs((prev) => [newLog, ...prev]);
  };

  const addGoal = (data: Omit<Goal, 'id' | 'userId'>) => {
    if (!user) return;
    const newGoal: Goal = {
      ...data,
      id: `goal_${Date.now()}`,
      userId: user.id,
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addNote = (data: Omit<Note, 'id' | 'userId' | 'updatedAt'>) => {
    if (!user) return;
    const newNote: Note = {
      ...data,
      id: `note_${Date.now()}`,
      userId: user.id,
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)));
  };

  const updateWatchlistPrice = (symbol: string, price: number, change: number) => {
    setWatchlist((prev) =>
      prev.map((item) => (item.symbol === symbol ? { ...item, price, change24h: change } : item))
    );
  };

  const addWatchlistSymbol = (symbol: string, name: string, market: any) => {
    const newItem: WatchlistItem = {
      id: `watch_${Date.now()}`,
      symbol: symbol.toUpperCase(),
      name,
      market,
      price: 100,
      change24h: 0,
      high24h: 105,
      low24h: 95,
      isLive: false,
    };
    setWatchlist((prev) => [newItem, ...prev]);
  };

  const sendCalculatorToJournal = (tradeData: Partial<Trade>) => {
    setCalculatorPrefill(tradeData);
    setActiveTab('journal');
  };

  return (
    <TradingContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        activeAccount,
        accounts,
        trades: accountTrades,
        allTrades: trades,
        strategies,
        tradingPlan,
        preChecklist,
        postChecklist,
        psychologyLogs,
        goals,
        notes,
        watchlist,
        economicEvents,
        activeTab,
        theme,
        calculatorPrefill,
        setActiveTab,
        toggleTheme,
        login,
        logout,
        register,
        loginAsDemo,
        setActiveAccount,
        createAccount,
        updateAccount,
        deleteAccount,
        addTrade,
        updateTrade,
        deleteTrade,
        duplicateTrade,
        importTrades,
        addStrategy,
        updateStrategy,
        deleteStrategy,
        updateTradingPlan,
        toggleChecklist,
        addChecklistItem,
        deleteChecklistItem,
        resetChecklists,
        addPsychologyLog,
        addGoal,
        updateGoal,
        deleteGoal,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        updateWatchlistPrice,
        addWatchlistSymbol,
        setCalculatorPrefill,
        sendCalculatorToJournal,
        metrics,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
