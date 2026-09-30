import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Trade, MarketType, DirectionType, TradeResult, SessionType } from '../../types';
import {
  X,
  Plus,
  Save,
  Image,
  Sparkles,
  Sliders,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Brain,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeToEdit?: Trade | null;
}

export const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, tradeToEdit }) => {
  const { addTrade, updateTrade, strategies, activeAccount, calculatorPrefill, setCalculatorPrefill } = useTrading();

  const [activeTab, setActiveTab] = useState<'basic' | 'setup' | 'psychology' | 'screenshots'>('basic');

  // Form State
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('09:30');
  const [symbol, setSymbol] = useState<string>('NQ (Nasdaq 100)');
  const [market, setMarket] = useState<MarketType>('Indices');
  const [direction, setDirection] = useState<DirectionType>('Long');
  const [entryPrice, setEntryPrice] = useState<number>(20000);
  const [stopLossPrice, setStopLossPrice] = useState<number>(19950);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(20150);
  const [exitPrice, setExitPrice] = useState<number>(20150);
  const [positionSize, setPositionSize] = useState<number>(1);
  const [leverage, setLeverage] = useState<number>(1);
  const [riskPercentage, setRiskPercentage] = useState<number>(1.0);
  const [riskAmount, setRiskAmount] = useState<number>(500);
  const [fees, setFees] = useState<number>(15);
  const [result, setResult] = useState<TradeResult>('Win');
  const [strategyId, setStrategyId] = useState<string>(strategies[0]?.id || '');
  const [setup, setSetup] = useState<string>('Liquidity Sweep + FVG');
  const [timeframe, setTimeframe] = useState<string>('5m');
  const [session, setSession] = useState<SessionType>('New York');
  const [marketCondition, setMarketCondition] = useState<string>('Trend Continuation');
  const [entryReason, setEntryReason] = useState<string>('');
  const [exitReason, setExitReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Psychology
  const [beforeEmotion, setBeforeEmotion] = useState<string>('Calm and focused');
  const [duringEmotion, setDuringEmotion] = useState<string>('Patient, not watching PnL');
  const [afterEmotion, setAfterEmotion] = useState<string>('Satisfied');
  const [confidence, setConfidence] = useState<number>(8);
  const [disciplineScore, setDisciplineScore] = useState<number>(10);
  const [fomo, setFomo] = useState<boolean>(false);
  const [revengeTrading, setRevengeTrading] = useState<boolean>(false);
  const [overtrading, setOvertrading] = useState<boolean>(false);
  const [hesitation, setHesitation] = useState<boolean>(false);

  // Screenshots
  const [screenshotBefore, setScreenshotBefore] = useState<string>('');
  const [screenshotEntry, setScreenshotEntry] = useState<string>('');
  const [screenshotExit, setScreenshotExit] = useState<string>('');

  // Populate from tradeToEdit or calculatorPrefill
  useEffect(() => {
    if (tradeToEdit) {
      setDate(tradeToEdit.date);
      setTime(tradeToEdit.time || '09:30');
      setSymbol(tradeToEdit.symbol);
      setMarket(tradeToEdit.market);
      setDirection(tradeToEdit.direction);
      setEntryPrice(tradeToEdit.entryPrice);
      setStopLossPrice(tradeToEdit.stopLossPrice);
      setTakeProfitPrice(tradeToEdit.takeProfitPrice);
      setExitPrice(tradeToEdit.exitPrice ?? tradeToEdit.takeProfitPrice);
      setPositionSize(tradeToEdit.positionSize);
      setLeverage(tradeToEdit.leverage);
      setRiskPercentage(tradeToEdit.riskPercentage);
      setRiskAmount(tradeToEdit.riskAmount);
      setFees(tradeToEdit.fees);
      setResult(tradeToEdit.result);
      setStrategyId(tradeToEdit.strategyId || '');
      setSetup(tradeToEdit.setup || '');
      setTimeframe(tradeToEdit.timeframe);
      setSession(tradeToEdit.session);
      setMarketCondition(tradeToEdit.marketCondition || '');
      setEntryReason(tradeToEdit.entryReason || '');
      setExitReason(tradeToEdit.exitReason || '');
      setNotes(tradeToEdit.notes || '');

      setBeforeEmotion(tradeToEdit.psychology.beforeEmotion);
      setDuringEmotion(tradeToEdit.psychology.duringEmotion);
      setAfterEmotion(tradeToEdit.psychology.afterEmotion);
      setConfidence(tradeToEdit.psychology.confidence);
      setDisciplineScore(tradeToEdit.psychology.disciplineScore);
      setFomo(tradeToEdit.psychology.fomo);
      setRevengeTrading(tradeToEdit.psychology.revengeTrading);
      setOvertrading(tradeToEdit.psychology.overtrading);
      setHesitation(tradeToEdit.psychology.hesitation);

      setScreenshotBefore(tradeToEdit.screenshots.before || '');
      setScreenshotEntry(tradeToEdit.screenshots.entry || '');
      setScreenshotExit(tradeToEdit.screenshots.exit || '');
    } else if (calculatorPrefill) {
      if (calculatorPrefill.symbol) setSymbol(calculatorPrefill.symbol);
      if (calculatorPrefill.market) setMarket(calculatorPrefill.market);
      if (calculatorPrefill.direction) setDirection(calculatorPrefill.direction);
      if (calculatorPrefill.entryPrice) setEntryPrice(calculatorPrefill.entryPrice);
      if (calculatorPrefill.stopLossPrice) setStopLossPrice(calculatorPrefill.stopLossPrice);
      if (calculatorPrefill.takeProfitPrice) {
        setTakeProfitPrice(calculatorPrefill.takeProfitPrice);
        setExitPrice(calculatorPrefill.takeProfitPrice);
      }
      if (calculatorPrefill.positionSize) setPositionSize(calculatorPrefill.positionSize);
      if (calculatorPrefill.leverage) setLeverage(calculatorPrefill.leverage);
      if (calculatorPrefill.riskPercentage) setRiskPercentage(calculatorPrefill.riskPercentage);
      if (calculatorPrefill.riskAmount) setRiskAmount(calculatorPrefill.riskAmount);
      // Clear prefill so it won't persist repeatedly
      setCalculatorPrefill(null);
    }
  }, [tradeToEdit, calculatorPrefill, setCalculatorPrefill]);

  if (!isOpen) return null;

  // Compute Net PnL and R-Multiple automatically
  const slDistance = Math.abs(entryPrice - stopLossPrice);
  const grossDiff =
    direction === 'Long'
      ? (exitPrice - entryPrice) * positionSize
      : (entryPrice - exitPrice) * positionSize;
  const computedNetPnl = result === 'Open' ? 0 : Math.round((grossDiff - fees) * 100) / 100;
  const computedRMultiple =
    riskAmount > 0 && result !== 'Open' ? Math.round((computedNetPnl / riskAmount) * 100) / 100 : 0;
  const calculatedRR =
    slDistance > 0 ? Math.round((Math.abs(takeProfitPrice - entryPrice) / slDistance) * 100) / 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const strat = strategies.find((s) => s.id === strategyId);

    const payload = {
      accountId: activeAccount?.id || 'acc_01',
      date,
      time,
      symbol,
      market,
      direction,
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
      exitPrice: result === 'Open' ? undefined : exitPrice,
      positionSize,
      leverage,
      riskPercentage,
      riskAmount,
      rrRatio: calculatedRR,
      result,
      grossProfit: grossDiff,
      fees,
      netPnl: computedNetPnl,
      rMultiple: computedRMultiple,
      strategyId,
      strategyName: strat?.name || 'Custom Setup',
      setup,
      timeframe,
      session,
      marketCondition,
      entryReason,
      exitReason,
      notes,
      psychology: {
        beforeEmotion,
        duringEmotion,
        afterEmotion,
        confidence,
        disciplineScore,
        fomo,
        revengeTrading,
        overtrading,
        hesitation,
      },
      screenshots: {
        before: screenshotBefore || undefined,
        entry: screenshotEntry || undefined,
        exit: screenshotExit || undefined,
      },
    };

    if (tradeToEdit) {
      updateTrade(tradeToEdit.id, payload);
    } else {
      addTrade(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-dark-card border border-dark-border w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border bg-dark-surface">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
              <Plus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">
                {tradeToEdit ? 'Edit Journal Entry' : 'Log New Executed Trade'}
              </h2>
              <p className="text-xs text-dark-muted">
                Record your technical setup, psychological state, and execution metrics.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dark-muted hover:text-white rounded-lg hover:bg-dark-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-dark-border px-6 bg-dark-surface/50">
          {[
            { id: 'basic', label: '1. Basic Info & Math', icon: DollarSign },
            { id: 'setup', label: '2. Setup & Strategy', icon: Sliders },
            { id: 'psychology', label: '3. Psychology & Discipline', icon: Brain },
            { id: 'screenshots', label: '4. Chart Screenshots', icon: Image },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                    : 'border-transparent text-dark-muted hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[68vh] overflow-y-auto space-y-6">
            {/* TAB 1: BASIC INFO */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Symbol / Asset</label>
                    <input
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      required
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Market Category</label>
                    <select
                      value={market}
                      onChange={(e) => setMarket(e.target.value as MarketType)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-sm"
                    >
                      <option value="Indices">Indices</option>
                      <option value="Crypto">Crypto</option>
                      <option value="Forex">Forex</option>
                      <option value="Commodities">Commodities</option>
                      <option value="Stocks">Stocks</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Direction</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDirection('Long')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 ${
                          direction === 'Long' ? 'bg-emerald-600 text-white' : 'bg-dark-surface text-slate-400'
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" /> Long
                      </button>
                      <button
                        type="button"
                        onClick={() => setDirection('Short')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 ${
                          direction === 'Short' ? 'bg-red-600 text-white' : 'bg-dark-surface text-slate-400'
                        }`}
                      >
                        <TrendingDown className="w-3.5 h-3.5" /> Short
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Result Status</label>
                    <select
                      value={result}
                      onChange={(e) => setResult(e.target.value as TradeResult)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-sm font-semibold"
                    >
                      <option value="Win">Win (Profit)</option>
                      <option value="Loss">Loss</option>
                      <option value="Breakeven">Breakeven</option>
                      <option value="Open">Open Position</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Entry Price</label>
                    <input
                      type="number"
                      step="any"
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Stop Loss Price</label>
                    <input
                      type="number"
                      step="any"
                      value={stopLossPrice}
                      onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Take Profit Target</label>
                    <input
                      type="number"
                      step="any"
                      value={takeProfitPrice}
                      onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Actual Exit Price</label>
                    <input
                      type="number"
                      step="any"
                      value={exitPrice}
                      onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                      disabled={result === 'Open'}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Position Size</label>
                    <input
                      type="number"
                      step="any"
                      value={positionSize}
                      onChange={(e) => setPositionSize(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Risk Amount ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={riskAmount}
                      onChange={(e) => setRiskAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Commission & Fees ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={fees}
                      onChange={(e) => setFees(parseFloat(e.target.value) || 0)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Leverage</label>
                    <input
                      type="number"
                      min="1"
                      value={leverage}
                      onChange={(e) => setLeverage(parseInt(e.target.value) || 1)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Live Calculated PnL Card */}
                <div className="p-4 bg-dark-surface rounded-xl border border-dark-border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-dark-muted block">Calculated Net P&L (after fees):</span>
                    <span
                      className={`text-xl font-bold font-mono ${
                        result === 'Open'
                          ? 'text-blue-400'
                          : computedNetPnl >= 0
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    >
                      {result === 'Open' ? 'Active / Open' : `${computedNetPnl >= 0 ? '+' : ''}$${computedNetPnl.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-dark-muted block">R-Multiple Outcome:</span>
                    <span className="text-base font-bold font-mono text-white">
                      {result === 'Open' ? '--' : `${computedRMultiple >= 0 ? '+' : ''}${computedRMultiple}R`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SETUP & STRATEGY */}
            {activeTab === 'setup' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Strategy</label>
                    <select
                      value={strategyId}
                      onChange={(e) => setStrategyId(e.target.value)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-sm"
                    >
                      {strategies.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                      <option value="">Other / Discretionary</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Setup / Pattern</label>
                    <input
                      type="text"
                      value={setup}
                      onChange={(e) => setSetup(e.target.value)}
                      placeholder="e.g. 5m FVG, Liquidity sweep, Breaker"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Timeframe</label>
                    <input
                      type="text"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      placeholder="e.g. 1m, 5m, 15m, 1h, 4h"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Trading Session</label>
                    <select
                      value={session}
                      onChange={(e) => setSession(e.target.value as SessionType)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-sm"
                    >
                      <option value="New York">New York Session</option>
                      <option value="London">London Session</option>
                      <option value="London/NY Overlap">London / NY Overlap</option>
                      <option value="Asian">Asian Session</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Market Condition</label>
                    <input
                      type="text"
                      value={marketCondition}
                      onChange={(e) => setMarketCondition(e.target.value)}
                      placeholder="e.g. Strong Trend, Range Bound, Volatile News"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-dark-muted font-medium block mb-1">Entry Reason & Confluences</label>
                  <textarea
                    rows={3}
                    value={entryReason}
                    onChange={(e) => setEntryReason(e.target.value)}
                    placeholder="Why did you take this trade? List the confluences (key level, RSI divergence, displacement, volume spike)..."
                    className="w-full bg-dark-surface border border-dark-border rounded-xl p-3 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-dark-muted font-medium block mb-1">Exit Reason / Trade Management</label>
                  <textarea
                    rows={2}
                    value={exitReason}
                    onChange={(e) => setExitReason(e.target.value)}
                    placeholder="Did price hit full TP? Trailed stop? Closed ahead of economic news release?"
                    className="w-full bg-dark-surface border border-dark-border rounded-xl p-3 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: PSYCHOLOGY & DISCIPLINE */}
            {activeTab === 'psychology' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-dark-muted font-medium">Pre-Trade Confidence</label>
                      <span className="text-xs font-mono font-bold text-blue-400">{confidence} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={confidence}
                      onChange={(e) => setConfidence(parseInt(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-dark-muted font-medium">Discipline & Rule-Following Score</label>
                      <span className="text-xs font-mono font-bold text-emerald-400">{disciplineScore} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={disciplineScore}
                      onChange={(e) => setDisciplineScore(parseInt(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Emotion Before Entry</label>
                    <input
                      type="text"
                      value={beforeEmotion}
                      onChange={(e) => setBeforeEmotion(e.target.value)}
                      placeholder="e.g. Patient, calm, rushed"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Emotion While Trade Active</label>
                    <input
                      type="text"
                      value={duringEmotion}
                      onChange={(e) => setDuringEmotion(e.target.value)}
                      placeholder="e.g. Detached, nervous, relaxed"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-muted font-medium block mb-1">Emotion After Exit</label>
                    <input
                      type="text"
                      value={afterEmotion}
                      onChange={(e) => setAfterEmotion(e.target.value)}
                      placeholder="e.g. Content, frustrated, grateful"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>

                {/* Behavioral Pitfalls Checklist */}
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-dark-muted block mb-3">
                    Discipline Audit Checkpoints (Did any occur?):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'FOMO (Fear of Missing Out)', state: fomo, set: setFomo },
                      { label: 'Revenge Trading', state: revengeTrading, set: setRevengeTrading },
                      { label: 'Overtrading', state: overtrading, set: setOvertrading },
                      { label: 'Hesitation on Entry', state: hesitation, set: setHesitation },
                    ].map((item, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                          item.state
                            ? 'bg-red-500/10 border-red-500/40 text-red-400'
                            : 'bg-dark-surface border-dark-border text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.state}
                          onChange={(e) => item.set(e.target.checked)}
                          className="rounded text-red-500 focus:ring-0"
                        />
                        <span className="text-xs font-medium">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-dark-muted font-medium block mb-1">
                    Post-Trade Reflection & Lessons
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What did you do right? What will you improve next time?"
                    className="w-full bg-dark-surface border border-dark-border rounded-xl p-3 text-white text-sm"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: SCREENSHOTS */}
            {activeTab === 'screenshots' && (
              <div className="space-y-4">
                <p className="text-xs text-dark-muted">
                  Attach chart URLs for multi-stage trade review (Before Entry, At Entry, and After Exit).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Before */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white block">1. Before Entry Chart</label>
                    <input
                      type="url"
                      placeholder="Paste image URL..."
                      value={screenshotBefore}
                      onChange={(e) => setScreenshotBefore(e.target.value)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs"
                    />
                    {screenshotBefore ? (
                      <img
                        src={screenshotBefore}
                        alt="Before trade"
                        className="w-full h-32 object-cover rounded-xl border border-dark-border"
                      />
                    ) : (
                      <div className="h-32 rounded-xl bg-dark-surface border border-dashed border-dark-border flex flex-col items-center justify-center text-dark-muted text-xs">
                        <Image className="w-6 h-6 mb-1 opacity-40" />
                        <span>No image provided</span>
                      </div>
                    )}
                  </div>

                  {/* Entry */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white block">2. Entry Execution Chart</label>
                    <input
                      type="url"
                      placeholder="Paste image URL..."
                      value={screenshotEntry}
                      onChange={(e) => setScreenshotEntry(e.target.value)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs"
                    />
                    {screenshotEntry ? (
                      <img
                        src={screenshotEntry}
                        alt="Entry execution"
                        className="w-full h-32 object-cover rounded-xl border border-dark-border"
                      />
                    ) : (
                      <div className="h-32 rounded-xl bg-dark-surface border border-dashed border-dark-border flex flex-col items-center justify-center text-dark-muted text-xs">
                        <Image className="w-6 h-6 mb-1 opacity-40" />
                        <span>No image provided</span>
                      </div>
                    )}
                  </div>

                  {/* Exit */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white block">3. After Exit Chart</label>
                    <input
                      type="url"
                      placeholder="Paste image URL..."
                      value={screenshotExit}
                      onChange={(e) => setScreenshotExit(e.target.value)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs"
                    />
                    {screenshotExit ? (
                      <img
                        src={screenshotExit}
                        alt="Exit outcome"
                        className="w-full h-32 object-cover rounded-xl border border-dark-border"
                      />
                    ) : (
                      <div className="h-32 rounded-xl bg-dark-surface border border-dashed border-dark-border flex flex-col items-center justify-center text-dark-muted text-xs">
                        <Image className="w-6 h-6 mb-1 opacity-40" />
                        <span>No image provided</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-dark-border bg-dark-surface">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-dark-muted hover:text-white hover:bg-dark-card transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30"
              >
                <Save className="w-4 h-4" />
                <span>{tradeToEdit ? 'Save Changes' : 'Save to Journal'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
