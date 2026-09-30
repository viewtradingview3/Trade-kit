import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  FileText,
  CheckSquare,
  Brain,
  Shield,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
} from 'lucide-react';

export const TradingPlanHub: React.FC = () => {
  const {
    tradingPlan,
    updateTradingPlan,
    preChecklist,
    postChecklist,
    toggleChecklist,
    addChecklistItem,
    deleteChecklistItem,
    resetChecklists,
    psychologyLogs,
    addPsychologyLog,
  } = useTrading();

  const [activeTab, setActiveTab] = useState<'plan' | 'precheck' | 'postcheck' | 'psychology'>('plan');

  // Plan Edit State
  const [monthlyGoal, setMonthlyGoal] = useState<number>(tradingPlan.monthlyGoal);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(tradingPlan.weeklyGoal);
  const [dailyGoal, setDailyGoal] = useState<number>(tradingPlan.dailyGoal);
  const [maxDailyLoss, setMaxDailyLoss] = useState<number>(tradingPlan.maxDailyLoss);
  const [maxWeeklyLoss, setMaxWeeklyLoss] = useState<number>(tradingPlan.maxWeeklyLoss);
  const [riskPerTrade, setRiskPerTrade] = useState<number>(tradingPlan.riskPerTrade);
  const [maxTradesPerDay, setMaxTradesPerDay] = useState<number>(tradingPlan.maxTradesPerDay);
  const [maxLossesPerDay, setMaxLossesPerDay] = useState<number>(tradingPlan.maxLossesPerDay);
  const [newRuleText, setNewRuleText] = useState<string>('');

  // New Checklist items
  const [newPreText, setNewPreText] = useState<string>('');
  const [newPostText, setNewPostText] = useState<string>('');

  // New Psychology Log Form
  const [discipline, setDiscipline] = useState<number>(9);
  const [patience, setPatience] = useState<number>(8);
  const [fomo, setFomo] = useState<number>(2);
  const [fear, setFear] = useState<number>(2);
  const [greed, setGreed] = useState<number>(3);
  const [stress, setStress] = useState<number>(3);
  const [psyNotes, setPsyNotes] = useState<string>('');

  const handleSavePlan = () => {
    updateTradingPlan({
      monthlyGoal,
      weeklyGoal,
      dailyGoal,
      maxDailyLoss,
      maxWeeklyLoss,
      riskPerTrade,
      maxTradesPerDay,
      maxLossesPerDay,
    });
    alert('Trading Plan successfully updated!');
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;
    const updated = [
      ...tradingPlan.personalRules,
      { id: `rule_${Date.now()}`, rule: newRuleText.trim(), active: true },
    ];
    updateTradingPlan({ personalRules: updated });
    setNewRuleText('');
  };

  const handleDeleteRule = (id: string) => {
    const updated = tradingPlan.personalRules.filter((r) => r.id !== id);
    updateTradingPlan({ personalRules: updated });
  };

  const handleToggleRule = (id: string) => {
    const updated = tradingPlan.personalRules.map((r) =>
      r.id === id ? { ...r, active: !r.active } : r
    );
    updateTradingPlan({ personalRules: updated });
  };

  const handleAddPre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPreText.trim()) return;
    addChecklistItem('pre', newPreText.trim());
    setNewPreText('');
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    addChecklistItem('post', newPostText.trim());
    setNewPostText('');
  };

  const handleAddPsyLog = (e: React.FormEvent) => {
    e.preventDefault();
    addPsychologyLog({
      date: new Date().toISOString().split('T')[0],
      fear,
      greed,
      fomo,
      revenge: 1,
      overconfidence: 3,
      hesitation: 2,
      stress,
      patience,
      discipline,
      notes: psyNotes,
    });
    setPsyNotes('');
    alert('Psychology log saved!');
  };

  const preCheckedCount = preChecklist.filter((i) => i.checked).length;
  const postCheckedCount = postChecklist.filter((i) => i.checked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Trading Discipline Command</h1>
          </div>
          <p className="text-dark-muted text-sm mt-1">
            Build bulletproof trader psychology, enforce risk rules, and audit execution with pre/post flight checklists.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 bg-dark-card p-1 rounded-xl border border-dark-border">
          {[
            { id: 'plan', label: 'Trading Plan & Rules', icon: FileText },
            { id: 'precheck', label: `Pre-Trade (${preCheckedCount}/${preChecklist.length})`, icon: CheckSquare },
            { id: 'postcheck', label: `Post-Review (${postCheckedCount}/${postChecklist.length})`, icon: CheckSquare },
            { id: 'psychology', label: 'Psychology Tracker', icon: Brain },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-dark-muted hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: TRADING PLAN */}
      {activeTab === 'plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Goals & Risk Limits (6 cols) */}
          <div className="lg:col-span-6 bg-dark-card p-6 rounded-2xl border border-dark-border space-y-6 shadow-card-dark">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Discipline Targets & Risk Parameters</span>
              </h2>
              <p className="text-xs text-dark-muted">
                Define strict daily loss caps and profit targets to prevent blowups.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-dark-muted block mb-1">Monthly Profit Goal ($)</label>
                <input
                  type="number"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Weekly Profit Goal ($)</label>
                <input
                  type="number"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Daily Profit Goal ($)</label>
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dark-border">
              <div>
                <label className="text-xs text-red-400 font-semibold block mb-1">Max Daily Loss Limit ($)</label>
                <input
                  type="number"
                  value={maxDailyLoss}
                  onChange={(e) => setMaxDailyLoss(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-red-500/40 rounded-xl px-3 py-2 text-red-400 font-mono text-sm"
                />
                <span className="text-[10px] text-dark-muted mt-1 block">Account stops trading if hit</span>
              </div>
              <div>
                <label className="text-xs text-red-400 font-semibold block mb-1">Max Weekly Loss Limit ($)</label>
                <input
                  type="number"
                  value={maxWeeklyLoss}
                  onChange={(e) => setMaxWeeklyLoss(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-red-500/40 rounded-xl px-3 py-2 text-red-400 font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-dark-border">
              <div>
                <label className="text-xs text-dark-muted block mb-1">Risk Per Trade (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPerTrade}
                  onChange={(e) => setRiskPerTrade(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Max Trades Per Day</label>
                <input
                  type="number"
                  value={maxTradesPerDay}
                  onChange={(e) => setMaxTradesPerDay(parseInt(e.target.value) || 1)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Max Losses Per Day</label>
                <input
                  type="number"
                  value={maxLossesPerDay}
                  onChange={(e) => setMaxLossesPerDay(parseInt(e.target.value) || 1)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleSavePlan}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/25"
            >
              <Save className="w-4 h-4" />
              <span>Save & Enforce Trading Plan</span>
            </button>
          </div>

          {/* Personal Golden Rules (6 cols) */}
          <div className="lg:col-span-6 bg-dark-card p-6 rounded-2xl border border-dark-border space-y-4 shadow-card-dark flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Personal Golden Rules</span>
                </h2>
                <span className="text-xs text-dark-muted">
                  {tradingPlan.personalRules.filter((r) => r.active).length} Active Rules
                </span>
              </div>
              <p className="text-xs text-dark-muted mb-4">
                Non-negotiable trading commandments. Review these every morning before market open.
              </p>

              {/* Rules List */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {tradingPlan.personalRules.map((r, idx) => (
                  <div
                    key={r.id}
                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border text-xs transition-all ${
                      r.active
                        ? 'bg-dark-surface border-dark-border text-slate-200'
                        : 'bg-dark-surface/30 border-dark-border/40 text-slate-500 line-through'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={r.active}
                        onChange={() => handleToggleRule(r.id)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-0"
                      />
                      <span>
                        <strong className="text-blue-400 mr-1.5 font-mono">#{idx + 1}</strong>
                        {r.rule}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteRule(r.id)}
                      className="text-dark-muted hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Rule Form */}
            <form onSubmit={handleAddRule} className="flex gap-2 pt-4 border-t border-dark-border">
              <input
                type="text"
                placeholder="Add a new golden rule (e.g. No trading during CPI news)..."
                value={newRuleText}
                onChange={(e) => setNewRuleText(e.target.value)}
                className="flex-1 bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 2: PRE-TRADE CHECKLIST */}
      {activeTab === 'precheck' && (
        <div className="bg-dark-card p-6 rounded-2xl border border-dark-border max-w-3xl mx-auto space-y-6 shadow-card-dark">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-400" />
                <span>Pre-Flight Trading Checklist</span>
              </h2>
              <p className="text-xs text-dark-muted">
                Run through every item before pressing Buy or Sell. Ensure you are executing with clarity.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                  preCheckedCount === preChecklist.length
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {preCheckedCount} of {preChecklist.length} Verified
              </span>
              <button
                onClick={resetChecklists}
                title="Reset All"
                className="p-1.5 rounded-lg text-dark-muted hover:text-white hover:bg-dark-surface"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5">
            {preChecklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  item.checked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-dark-surface border-dark-border text-slate-300 hover:bg-dark-surface/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklist('pre', item.id)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-0"
                  />
                  <span className={`text-xs font-medium ${item.checked ? 'line-through text-slate-400' : ''}`}>
                    {item.text}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChecklistItem('pre', item.id);
                  }}
                  className="text-dark-muted hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </label>
            ))}
          </div>

          {/* Add custom checklist item */}
          <form onSubmit={handleAddPre} className="flex gap-2 pt-4 border-t border-dark-border">
            <input
              type="text"
              placeholder="Add custom pre-trade verification question..."
              value={newPreText}
              onChange={(e) => setNewPreText(e.target.value)}
              className="flex-1 bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </form>
        </div>
      )}

      {/* VIEW 3: POST-TRADE CHECKLIST */}
      {activeTab === 'postcheck' && (
        <div className="bg-dark-card p-6 rounded-2xl border border-dark-border max-w-3xl mx-auto space-y-6 shadow-card-dark">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                <span>Post-Trade Execution Review</span>
              </h2>
              <p className="text-xs text-dark-muted">
                Conduct an honest debrief after every closed position regardless of profit or loss.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40">
                {postCheckedCount} of {postChecklist.length} Checked
              </span>
              <button
                onClick={resetChecklists}
                title="Reset All"
                className="p-1.5 rounded-lg text-dark-muted hover:text-white hover:bg-dark-surface"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {postChecklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  item.checked
                    ? 'bg-blue-500/10 border-blue-500/30 text-white'
                    : 'bg-dark-surface border-dark-border text-slate-300 hover:bg-dark-surface/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklist('post', item.id)}
                    className="w-4 h-4 rounded text-blue-500 focus:ring-0"
                  />
                  <span className="text-xs font-medium">{item.text}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChecklistItem('post', item.id);
                  }}
                  className="text-dark-muted hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </label>
            ))}
          </div>

          <form onSubmit={handleAddPost} className="flex gap-2 pt-4 border-t border-dark-border">
            <input
              type="text"
              placeholder="Add post-trade debrief question..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="flex-1 bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>
        </div>
      )}

      {/* VIEW 4: PSYCHOLOGY TRACKER */}
      {activeTab === 'psychology' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Daily Emotion Log Form (5 cols) */}
          <div className="lg:col-span-5 bg-dark-card p-6 rounded-2xl border border-dark-border space-y-4 shadow-card-dark">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>Log Today's Mental State</span>
            </h2>
            <p className="text-xs text-dark-muted">
              Rate your emotional control on a 1-10 scale to correlate mental discipline with profitability.
            </p>

            <form onSubmit={handleAddPsyLog} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-dark-muted font-medium">Rule Discipline (1=None, 10=Flawless)</span>
                  <span className="text-emerald-400 font-mono font-bold">{discipline}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={discipline}
                  onChange={(e) => setDiscipline(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-dark-muted font-medium">Patience & Waiting for Setups</span>
                  <span className="text-blue-400 font-mono font-bold">{patience}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={patience}
                  onChange={(e) => setPatience(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-dark-muted font-medium">FOMO (Urge to Chase)</span>
                  <span className="text-red-400 font-mono font-bold">{fomo}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={fomo}
                  onChange={(e) => setFomo(parseInt(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-dark-muted font-medium">Stress & Anxiety Level</span>
                  <span className="text-amber-400 font-mono font-bold">{stress}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stress}
                  onChange={(e) => setStress(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-dark-muted block mb-1">Daily Psychological Reflection</label>
                <textarea
                  rows={3}
                  value={psyNotes}
                  onChange={(e) => setPsyNotes(e.target.value)}
                  placeholder="How did you handle market stress today? Were you calm during drawdowns?"
                  className="w-full bg-dark-surface border border-dark-border rounded-xl p-3 text-white text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-purple-600/25"
              >
                Save Daily Psychological Audit
              </button>
            </form>
          </div>

          {/* Psychology History Timeline (7 cols) */}
          <div className="lg:col-span-7 bg-dark-card p-6 rounded-2xl border border-dark-border space-y-4 shadow-card-dark">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Historical Psychology Logs</span>
            </h2>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {psychologyLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-dark-surface rounded-xl border border-dark-border space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-300 font-semibold">{log.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 font-mono font-bold">
                        Discipline: {log.discipline}/10
                      </span>
                      <span className="text-blue-400 font-mono">Patience: {log.patience}/10</span>
                      <span className="text-red-400 font-mono">FOMO: {log.fomo}/10</span>
                    </div>
                  </div>
                  {log.notes && (
                    <p className="text-slate-300 italic pt-1 border-t border-dark-border/40">
                      "{log.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
