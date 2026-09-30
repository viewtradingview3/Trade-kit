import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  Wallet,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  DollarSign,
  Shield,
  Target,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { TradingAccount } from '../../types';

export const AccountsHub: React.FC = () => {
  const {
    accounts,
    activeAccount,
    setActiveAccount,
    createAccount,
    deleteAccount,
    goals,
    addGoal,
    deleteGoal,
  } = useTrading();

  // Create Account Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [accName, setAccName] = useState<string>('');
  const [accBroker, setAccBroker] = useState<string>('Topstep');
  const [accStartingBalance, setAccStartingBalance] = useState<number>(50000);
  const [accDailyLoss, setAccDailyLoss] = useState<number>(1000);
  const [accMaxDrawdown, setAccMaxDrawdown] = useState<number>(2000);

  // New Goal State
  const [goalTitle, setGoalTitle] = useState<string>('');
  const [goalTarget, setGoalTarget] = useState<number>(5000);
  const [goalUnit, setGoalUnit] = useState<'$' | '%' | 'trades'>('$');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName.trim()) return;
    createAccount({
      name: accName.trim(),
      broker: accBroker,
      startingBalance: accStartingBalance,
      currentBalance: accStartingBalance,
      dailyLossLimit: accDailyLoss,
      maxDrawdown: accMaxDrawdown,
      currency: 'USD',
      isDefault: false,
    });
    setIsModalOpen(false);
    setAccName('');
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal({
      title: goalTitle.trim(),
      category: 'Monthly Profit',
      targetValue: goalTarget,
      currentValue: 0,
      unit: goalUnit,
    });
    setGoalTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Wallet className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Trading Accounts & Goals</h1>
          </div>
          <p className="text-dark-muted text-sm mt-1">
            Isolate metrics across prop firm combines, funded accounts, and personal broker portfolios.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => {
          const isActive = activeAccount?.id === acc.id;
          return (
            <div
              key={acc.id}
              className={`p-6 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-dark-card to-dark-surface border-blue-500 shadow-glow-blue'
                  : 'bg-dark-card border-dark-border hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-lg">{acc.name}</h3>
                  <span className="text-xs text-blue-400 font-medium">{acc.broker}</span>
                </div>
                {isActive ? (
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                    ACTIVE NOW
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveAccount(acc.id)}
                    className="px-3 py-1 rounded-lg bg-dark-surface hover:bg-blue-600 hover:text-white border border-dark-border text-slate-300 text-xs font-semibold transition-all"
                  >
                    Select
                  </button>
                )}
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-dark-muted">Current Balance:</span>
                  <span className="text-2xl font-extrabold font-mono text-white">
                    ${acc.currentBalance.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-dark-border text-xs">
                  <div>
                    <span className="text-dark-muted block">Daily Loss Cap:</span>
                    <span className="font-mono text-red-400 font-bold">${acc.dailyLossLimit}</span>
                  </div>
                  <div>
                    <span className="text-dark-muted block">Max Drawdown:</span>
                    <span className="font-mono text-amber-400 font-bold">${acc.maxDrawdown}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-dark-border flex items-center justify-between text-xs text-dark-muted">
                <span>Created: {acc.createdAt.split('T')[0]}</span>
                {accounts.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete account ${acc.name}?`)) {
                        deleteAccount(acc.id);
                      }
                    }}
                    className="text-dark-muted hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Goals & Progress Section */}
      <div className="bg-dark-card rounded-2xl border border-dark-border p-6 shadow-card-dark space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span>Trader Milestones & Progression Goals</span>
            </h2>
            <p className="text-xs text-dark-muted">
              Stay accountable to measurable goals across profit targets, win rate stability, and execution volume.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
            return (
              <div key={g.id} className="p-4 bg-dark-surface rounded-xl border border-dark-border space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{g.title}</h4>
                    <span className="text-[11px] text-dark-muted">{g.category}</span>
                  </div>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="text-dark-muted hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex justify-between items-baseline text-xs font-mono">
                  <span className="text-slate-300">
                    Progress: {g.unit === '$' ? '$' : ''}
                    {g.currentValue.toLocaleString()} / {g.unit === '$' ? '$' : ''}
                    {g.targetValue.toLocaleString()}
                    {g.unit !== '$' ? g.unit : ''}
                  </span>
                  <span className="font-bold text-emerald-400">{pct}%</span>
                </div>

                <div className="w-full h-2 bg-dark-card rounded-full overflow-hidden border border-dark-border">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Goal Form */}
        <form onSubmit={handleCreateGoal} className="flex flex-wrap gap-3 pt-4 border-t border-dark-border">
          <input
            type="text"
            placeholder="Goal Title (e.g. Monthly Profit Target)..."
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            className="flex-1 bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs min-w-[200px]"
          />
          <input
            type="number"
            placeholder="Target Value"
            value={goalTarget}
            onChange={(e) => setGoalTarget(parseFloat(e.target.value) || 0)}
            className="w-32 bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs font-mono"
          />
          <select
            value={goalUnit}
            onChange={(e) => setGoalUnit(e.target.value as any)}
            className="bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs"
          >
            <option value="$">Dollars ($)</option>
            <option value="%">Percent (%)</option>
            <option value="trades">Trades Count</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Goal
          </button>
        </form>
      </div>

      {/* Create Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-dark-border w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Trading Account</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="text-dark-muted block mb-1">Account Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex 50k Combine..."
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-dark-muted block mb-1">Broker / Prop Firm</label>
                <input
                  type="text"
                  placeholder="e.g. Topstep, FTMO, Binance, MT5..."
                  value={accBroker}
                  onChange={(e) => setAccBroker(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-dark-muted block mb-1">Starting Balance ($)</label>
                <input
                  type="number"
                  value={accStartingBalance}
                  onChange={(e) => setAccStartingBalance(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-dark-muted block mb-1">Daily Loss Limit ($)</label>
                  <input
                    type="number"
                    value={accDailyLoss}
                    onChange={(e) => setAccDailyLoss(parseFloat(e.target.value) || 0)}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-dark-muted block mb-1">Max Drawdown ($)</label>
                  <input
                    type="number"
                    value={accMaxDrawdown}
                    onChange={(e) => setAccMaxDrawdown(parseFloat(e.target.value) || 0)}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-dark-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
