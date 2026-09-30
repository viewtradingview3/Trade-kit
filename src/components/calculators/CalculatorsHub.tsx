import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  Calculator,
  ArrowRight,
  ShieldAlert,
  Target,
  Percent,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Layers,
  Sparkles,
  BookOpen,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { MarketType, DirectionType } from '../../types';

export const CalculatorsHub: React.FC = () => {
  const { activeAccount, sendCalculatorToJournal } = useTrading();

  // Active sub-tool
  const [calcTab, setCalcTab] = useState<'allinone' | 'position' | 'rr' | 'stoploss' | 'pnl'>('allinone');

  // Common shared state
  const [accountBalance, setAccountBalance] = useState<number>(activeAccount?.startingBalance || 50000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [riskAmount, setRiskAmount] = useState<number>(500);
  const [riskMode, setRiskMode] = useState<'percent' | 'amount'>('percent');
  const [direction, setDirection] = useState<DirectionType>('Long');
  const [market, setMarket] = useState<MarketType>('Indices');
  const [symbol, setSymbol] = useState<string>('NQ (Nasdaq 100)');
  const [entryPrice, setEntryPrice] = useState<number>(20000);
  const [stopLossPrice, setStopLossPrice] = useState<number>(19950);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(20150);
  const [desiredRR, setDesiredRR] = useState<number>(3.0);
  const [leverage, setLeverage] = useState<number>(1);
  const [contractSize, setContractSize] = useState<number>(1); // e.g. 100000 for Forex standard lot, 1 for crypto/indices

  // Instrument quick selection
  const handleMarketPreset = (selectedMarket: MarketType) => {
    setMarket(selectedMarket);
    if (selectedMarket === 'Crypto') {
      setSymbol('BTCUSDT');
      setEntryPrice(64000);
      setStopLossPrice(63200);
      setTakeProfitPrice(66400);
      setContractSize(1);
      setLeverage(5);
    } else if (selectedMarket === 'Forex') {
      setSymbol('EURUSD');
      setEntryPrice(1.1150);
      setStopLossPrice(1.1125);
      setTakeProfitPrice(1.1225);
      setContractSize(100000);
      setLeverage(30);
    } else if (selectedMarket === 'Indices') {
      setSymbol('NQ / US100');
      setEntryPrice(20000);
      setStopLossPrice(19950);
      setTakeProfitPrice(20150);
      setContractSize(1);
      setLeverage(1);
    } else if (selectedMarket === 'Commodities') {
      setSymbol('XAUUSD (Gold)');
      setEntryPrice(2650);
      setStopLossPrice(2640);
      setTakeProfitPrice(2680);
      setContractSize(100);
      setLeverage(20);
    } else {
      setSymbol('AAPL');
      setEntryPrice(225);
      setStopLossPrice(221);
      setTakeProfitPrice(237);
      setContractSize(1);
      setLeverage(1);
    }
  };

  // Sync risk % and risk amount when balance changes
  useEffect(() => {
    if (activeAccount?.currentBalance) {
      setAccountBalance(activeAccount.currentBalance);
    }
  }, [activeAccount]);

  useEffect(() => {
    if (riskMode === 'percent') {
      const calcRisk = (accountBalance * riskPercent) / 100;
      setRiskAmount(Math.round(calcRisk * 100) / 100);
    } else {
      const calcPct = accountBalance > 0 ? (riskAmount / accountBalance) * 100 : 0;
      setRiskPercent(Math.round(calcPct * 100) / 100);
    }
  }, [accountBalance, riskPercent, riskAmount, riskMode]);

  // Stop loss distance
  const slDistance = Math.abs(entryPrice - stopLossPrice);
  const slPercent = entryPrice > 0 ? (slDistance / entryPrice) * 100 : 0;

  // Validation
  const isInvalidSL =
    direction === 'Long' ? stopLossPrice >= entryPrice : stopLossPrice <= entryPrice;

  // Position Size calculation
  const calculatedPositionSize = (() => {
    if (slDistance <= 0 || isInvalidSL) return 0;
    // For standard units
    const units = riskAmount / (slDistance * contractSize);
    return Math.max(0, units);
  })();

  const positionValue = calculatedPositionSize * entryPrice * contractSize;
  const marginRequired = leverage > 0 ? positionValue / leverage : positionValue;

  // R:R and TP calculations
  const tpDistance = Math.abs(takeProfitPrice - entryPrice);
  const calculatedRR = slDistance > 0 ? Math.round((tpDistance / slDistance) * 100) / 100 : 0;
  const potentialProfit = calculatedPositionSize * tpDistance * contractSize;
  const potentialLoss = riskAmount;

  // Recalculate TP when desiredRR changes
  const autoCalculateTP = (targetRR: number) => {
    setDesiredRR(targetRR);
    if (slDistance <= 0) return;
    const newDistance = slDistance * targetRR;
    if (direction === 'Long') {
      setTakeProfitPrice(Math.round((entryPrice + newDistance) * 10000) / 10000);
    } else {
      setTakeProfitPrice(Math.round((entryPrice - newDistance) * 10000) / 10000);
    }
  };

  // Switch Direction
  const toggleDirection = (dir: DirectionType) => {
    setDirection(dir);
    // Mirror SL/TP logically around entry
    const currentSlDiff = Math.abs(entryPrice - stopLossPrice);
    const currentTpDiff = Math.abs(takeProfitPrice - entryPrice);
    if (dir === 'Long') {
      setStopLossPrice(Math.round((entryPrice - currentSlDiff) * 10000) / 10000);
      setTakeProfitPrice(Math.round((entryPrice + currentTpDiff) * 10000) / 10000);
    } else {
      setStopLossPrice(Math.round((entryPrice + currentSlDiff) * 10000) / 10000);
      setTakeProfitPrice(Math.round((entryPrice - currentTpDiff) * 10000) / 10000);
    }
  };

  // ATR Stop Loss tool state
  const [atrValue, setAtrValue] = useState<number>(45);
  const [atrMultiplier, setAtrMultiplier] = useState<number>(1.5);
  const [fixedPctSL, setFixedPctSL] = useState<number>(1.5);

  // Apply ATR SL
  const applyAtrStop = () => {
    const distance = atrValue * atrMultiplier;
    if (direction === 'Long') {
      setStopLossPrice(Math.round((entryPrice - distance) * 10000) / 10000);
      setTakeProfitPrice(Math.round((entryPrice + distance * desiredRR) * 10000) / 10000);
    } else {
      setStopLossPrice(Math.round((entryPrice + distance) * 10000) / 10000);
      setTakeProfitPrice(Math.round((entryPrice - distance * desiredRR) * 10000) / 10000);
    }
  };

  // Apply Fixed % SL
  const applyFixedPctStop = () => {
    const distance = (entryPrice * fixedPctSL) / 100;
    if (direction === 'Long') {
      setStopLossPrice(Math.round((entryPrice - distance) * 10000) / 10000);
      setTakeProfitPrice(Math.round((entryPrice + distance * desiredRR) * 10000) / 10000);
    } else {
      setStopLossPrice(Math.round((entryPrice + distance) * 10000) / 10000);
      setTakeProfitPrice(Math.round((entryPrice - distance * desiredRR) * 10000) / 10000);
    }
  };

  // Standalone P&L Calculator state
  const [pnlEntry, setPnlEntry] = useState<number>(20000);
  const [pnlExit, setPnlExit] = useState<number>(20250);
  const [pnlSize, setPnlSize] = useState<number>(2);
  const [pnlDir, setPnlDir] = useState<DirectionType>('Long');
  const [pnlFeePct, setPnlFeePct] = useState<number>(0.05);

  const rawPnl =
    pnlDir === 'Long'
      ? (pnlExit - pnlEntry) * pnlSize
      : (pnlEntry - pnlExit) * pnlSize;
  const totalVolume = (pnlEntry + pnlExit) * pnlSize;
  const estimatedFees = (totalVolume * pnlFeePct) / 100;
  const netPnlResult = rawPnl - estimatedFees;
  const roiPct = pnlEntry * pnlSize > 0 ? (netPnlResult / (pnlEntry * pnlSize)) * 100 : 0;

  // Send to Journal action
  const handleLogTrade = () => {
    sendCalculatorToJournal({
      symbol,
      market,
      direction,
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
      positionSize: Math.round(calculatedPositionSize * 1000) / 1000,
      leverage,
      riskPercentage: riskPercent,
      riskAmount,
      rrRatio: calculatedRR,
      fees: 15,
      netPnl: 0,
      result: 'Open',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calculator className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Trading Calculator Workspace</h1>
          </div>
          <p className="text-dark-muted text-sm mt-1">
            Mathematically verified position sizing, risk-to-reward mapping, and stop-loss modeling.
          </p>
        </div>

        {/* Action Button: Send to Journal */}
        <button
          onClick={handleLogTrade}
          disabled={isInvalidSL || calculatedPositionSize <= 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg ${
            isInvalidSL || calculatedPositionSize <= 0
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Save & Log to Trading Journal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-dark-border pb-3">
        {[
          { id: 'allinone', label: 'All-in-One Terminal Calculator', icon: Sparkles },
          { id: 'position', label: 'Position Sizer & Lots', icon: Layers },
          { id: 'rr', label: 'Risk / Reward Visualizer', icon: Target },
          { id: 'stoploss', label: 'Stop-Loss & ATR Model', icon: ShieldAlert },
          { id: 'pnl', label: 'Profit, Loss & Fees', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = calcTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCalcTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-dark-muted hover:text-white hover:bg-dark-surface'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Market Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-dark-surface p-3 rounded-xl border border-dark-border">
        <span className="text-xs uppercase tracking-wider text-dark-muted font-semibold mr-2 flex items-center gap-1">
          <Sliders className="w-3.5 h-3.5" /> Market Presets:
        </span>
        {(['Crypto', 'Forex', 'Indices', 'Commodities', 'Stocks'] as MarketType[]).map((m) => (
          <button
            key={m}
            onClick={() => handleMarketPreset(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              market === m
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'bg-dark-card text-slate-300 hover:text-white hover:bg-dark-cardHover border border-dark-border'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Warning Alert if Stop Loss is on the wrong side */}
      {isInvalidSL && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>
            <strong>Invalid Stop Loss level:</strong> For a <strong>{direction}</strong> position, Stop Loss must be{' '}
            {direction === 'Long' ? 'below' : 'above'} the Entry Price (${entryPrice.toLocaleString()}).
          </span>
        </div>
      )}

      {/* MAIN CALCULATOR VIEW */}
      {(calcTab === 'allinone' || calcTab === 'position') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Parameters (7 cols) */}
          <div className="lg:col-span-7 bg-dark-card p-6 rounded-2xl border border-dark-border space-y-5 shadow-card-dark">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span>Trade Parameters</span>
                <span className="text-xs bg-dark-surface px-2.5 py-0.5 rounded-full text-dark-muted border border-dark-border">
                  Instant Auto-Calculation
                </span>
              </h2>

              {/* Long / Short Toggle */}
              <div className="flex bg-dark-surface p-1 rounded-xl border border-dark-border">
                <button
                  onClick={() => toggleDirection('Long')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    direction === 'Long'
                      ? 'bg-emerald-500 text-white shadow-glow-green'
                      : 'text-dark-muted hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Long
                </button>
                <button
                  onClick={() => toggleDirection('Short')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    direction === 'Short'
                      ? 'bg-red-500 text-white shadow-glow-red'
                      : 'text-dark-muted hover:text-white'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" /> Short
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Balance */}
              <div>
                <label className="text-xs text-dark-muted font-medium block mb-1.5">Account Balance ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 text-sm">$</span>
                  <input
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl pl-8 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Risk Settings */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-dark-muted font-medium">Risk Per Trade</label>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      onClick={() => setRiskMode('percent')}
                      className={`px-1.5 py-0.5 rounded ${riskMode === 'percent' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                    >
                      %
                    </button>
                    <button
                      onClick={() => setRiskMode('amount')}
                      className={`px-1.5 py-0.5 rounded ${riskMode === 'amount' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                    >
                      $
                    </button>
                  </div>
                </div>
                {riskMode === 'percent' ? (
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-mono">
                      = ${( (accountBalance * riskPercent) / 100 ).toFixed(0)}
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 text-sm">$</span>
                    <input
                      type="number"
                      value={riskAmount}
                      onChange={(e) => setRiskAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl pl-8 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Symbol & Instrument */}
              <div>
                <label className="text-xs text-dark-muted font-medium block mb-1.5">Instrument / Symbol</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Contract Size / Multiplier */}
              <div>
                <label className="text-xs text-dark-muted font-medium block mb-1.5">
                  Contract / Lot Multiplier {market === 'Forex' && '(100k standard lot)'}
                </label>
                <input
                  type="number"
                  value={contractSize}
                  onChange={(e) => setContractSize(Math.max(0.0001, parseFloat(e.target.value) || 1))}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Entry Price */}
              <div>
                <label className="text-xs text-dark-muted font-medium block mb-1.5">Entry Price</label>
                <input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Stop Loss Price */}
              <div>
                <label className="text-xs text-dark-muted font-medium block mb-1.5">Stop Loss Price</label>
                <input
                  type="number"
                  step="any"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                  className={`w-full bg-dark-surface border rounded-xl px-3 py-2 font-mono text-sm focus:outline-none ${
                    isInvalidSL ? 'border-red-500 text-red-400' : 'border-dark-border text-white focus:border-blue-500'
                  }`}
                />
              </div>

              {/* Take Profit Price */}
              <div>
                <label className="text-xs text-dark-muted font-medium block mb-1.5">Take Profit Price</label>
                <input
                  type="number"
                  step="any"
                  value={takeProfitPrice}
                  onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Leverage */}
              <div>
                <label className="text-xs text-dark-muted font-medium block mb-1.5">Account Leverage (1x - 100x)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={leverage}
                  onChange={(e) => setLeverage(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Quick R:R auto-set buttons */}
            <div className="pt-2 border-t border-dark-border">
              <span className="text-xs text-dark-muted font-medium block mb-2">
                Quick Target R:R Multipliers (Auto-calculate Take Profit):
              </span>
              <div className="flex flex-wrap gap-2">
                {[1.5, 2.0, 2.5, 3.0, 4.0, 5.0].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => autoCalculateTP(ratio)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      Math.abs(calculatedRR - ratio) < 0.1
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-dark-surface hover:bg-slate-800 text-slate-300 border border-dark-border'
                    }`}
                  >
                    1:{ratio} RR
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Real-time Calculated Output (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Position Size Card */}
            <div className="bg-gradient-to-br from-dark-card to-dark-surface p-6 rounded-2xl border border-dark-border shadow-card-dark relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
                <Target className="w-3.5 h-3.5" /> Calculated Optimal Position Size
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                  {calculatedPositionSize.toFixed(market === 'Forex' ? 2 : 4)}
                </span>
                <span className="text-dark-muted text-sm font-medium">
                  {market === 'Forex' ? 'Lots' : market === 'Crypto' ? 'Coins / Units' : 'Contracts / Shares'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-dark-border text-xs">
                <div>
                  <span className="text-dark-muted block">Risk Amount:</span>
                  <span className="text-red-400 font-mono font-bold text-sm">
                    -${potentialLoss.toFixed(2)} ({riskPercent}%)
                  </span>
                </div>
                <div>
                  <span className="text-dark-muted block">Potential Profit:</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">
                    +${potentialProfit.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-dark-muted block">Risk : Reward:</span>
                  <span className="text-blue-400 font-mono font-bold text-sm">
                    1 : {calculatedRR}
                  </span>
                </div>
                <div>
                  <span className="text-dark-muted block">SL Distance:</span>
                  <span className="text-slate-300 font-mono font-semibold">
                    {slDistance.toFixed(4)} ({slPercent.toFixed(2)}%)
                  </span>
                </div>
                <div>
                  <span className="text-dark-muted block">Total Position Value:</span>
                  <span className="text-slate-300 font-mono font-semibold">
                    ${positionValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-dark-muted block">Margin Required:</span>
                  <span className="text-amber-400 font-mono font-semibold">
                    ${marginRequired.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({leverage}x)
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Risk vs Reward Bar */}
            <div className="bg-dark-card p-5 rounded-2xl border border-dark-border space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-red-400 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> Risk: ${potentialLoss.toFixed(0)}
                </span>
                <span className="text-blue-400">Ratio 1:{calculatedRR}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Reward: ${potentialProfit.toFixed(0)}
                </span>
              </div>

              {/* Bar visualization */}
              <div className="h-3 w-full bg-dark-surface rounded-full overflow-hidden flex border border-dark-border">
                <div
                  className="bg-red-500 h-full transition-all duration-300"
                  style={{ width: `${(1 / (1 + Math.max(1, calculatedRR))) * 100}%` }}
                />
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${(Math.max(1, calculatedRR) / (1 + Math.max(1, calculatedRR))) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-dark-muted">
                <span>Stop: ${stopLossPrice.toLocaleString()}</span>
                <span className="text-slate-400 font-mono">Entry: ${entryPrice.toLocaleString()}</span>
                <span>Target: ${takeProfitPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RISK/REWARD & AUTOMATIC TAKE PROFIT VIEW */}
      {calcTab === 'rr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-dark-card p-6 rounded-2xl border border-dark-border space-y-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span>Multi-Target Scale-Out Planner</span>
            </h2>
            <p className="text-xs text-dark-muted">
              Plan partial take profits (TP1, TP2, TP3) to secure gains while letting runners ride.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-dark-muted block mb-1">Entry Price</label>
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Stop Loss Price</label>
                <input
                  type="number"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>

              {/* Multi-Target TPs */}
              <div className="space-y-3 pt-3 border-t border-dark-border">
                {[
                  { label: 'TP1 (Conservative)', rr: 1.5, pct: '50% of position' },
                  { label: 'TP2 (Standard)', rr: 2.5, pct: '30% of position' },
                  { label: 'TP3 (Runner Target)', rr: 4.0, pct: '20% of position' },
                ].map((tier, idx) => {
                  const dist = slDistance * tier.rr;
                  const price =
                    direction === 'Long'
                      ? entryPrice + dist
                      : entryPrice - dist;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-dark-surface rounded-xl border border-dark-border"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">{tier.label}</div>
                        <div className="text-[11px] text-dark-muted">
                          1:{tier.rr} RR • Close {tier.pct}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-emerald-400">
                          ${price.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </div>
                        <button
                          onClick={() => setTakeProfitPrice(price)}
                          className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                        >
                          Use this TP
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-dark-card p-6 rounded-2xl border border-dark-border flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Visual Price Ladder</h2>
              <p className="text-xs text-dark-muted mb-6">
                Interactive relative price distance to Stop Loss and Take Profit levels.
              </p>

              {/* Ladder Visual */}
              <div className="relative border-l-2 border-slate-700 ml-6 pl-6 py-4 space-y-8">
                {/* Take Profit Node */}
                <div className="relative flex items-center justify-between">
                  <div className="absolute -left-[31px] w-3 h-3 rounded-full bg-emerald-500 shadow-glow-green" />
                  <div>
                    <span className="text-xs uppercase font-bold text-emerald-400">Take Profit</span>
                    <div className="text-base font-mono font-bold text-white">
                      ${takeProfitPrice.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    +${potentialProfit.toFixed(2)} (+{calculatedRR}R)
                  </span>
                </div>

                {/* Entry Price Node */}
                <div className="relative flex items-center justify-between">
                  <div className="absolute -left-[31px] w-3 h-3 rounded-full bg-blue-500 shadow-glow-blue" />
                  <div>
                    <span className="text-xs uppercase font-bold text-blue-400">Entry Level</span>
                    <div className="text-base font-mono font-bold text-white">
                      ${entryPrice.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Position {direction}
                  </span>
                </div>

                {/* Stop Loss Node */}
                <div className="relative flex items-center justify-between">
                  <div className="absolute -left-[31px] w-3 h-3 rounded-full bg-red-500 shadow-glow-red" />
                  <div>
                    <span className="text-xs uppercase font-bold text-red-400">Stop Loss</span>
                    <div className="text-base font-mono font-bold text-white">
                      ${stopLossPrice.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                    -${potentialLoss.toFixed(2)} (-1.0R)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-surface border border-dark-border mt-6">
              <span className="text-xs text-dark-muted font-medium">Mathematical Formula:</span>
              <div className="text-xs font-mono text-slate-300 mt-1">
                Take Profit = Entry {direction === 'Long' ? '+' : '-'} ( |Entry - SL| × R:R )
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STOP LOSS & ATR MODEL VIEW */}
      {calcTab === 'stoploss' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Method 1: ATR Based */}
          <div className="bg-dark-card p-6 rounded-2xl border border-dark-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Method 1: Volatility (ATR) Stop</span>
              </h2>
              <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                Recommended
              </span>
            </div>
            <p className="text-xs text-dark-muted">
              Sets stop loss beyond natural market noise using Average True Range (14-period).
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-dark-muted block mb-1">ATR (14) Value</label>
                <input
                  type="number"
                  value={atrValue}
                  onChange={(e) => setAtrValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-dark-muted block mb-1">Multiplier</label>
                <select
                  value={atrMultiplier}
                  onChange={(e) => setAtrMultiplier(parseFloat(e.target.value))}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                >
                  <option value={1.0}>1.0x ATR (Tight)</option>
                  <option value={1.5}>1.5x ATR (Standard)</option>
                  <option value={2.0}>2.0x ATR (Swing / Wide)</option>
                  <option value={2.5}>2.5x ATR (Volatile)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-dark-surface rounded-xl border border-dark-border text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-dark-muted">Calculated SL Distance:</span>
                <span className="font-mono text-white">{(atrValue * atrMultiplier).toFixed(2)} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-muted">Proposed Stop Price:</span>
                <span className="font-mono text-red-400 font-bold">
                  $
                  {(direction === 'Long'
                    ? entryPrice - atrValue * atrMultiplier
                    : entryPrice + atrValue * atrMultiplier
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={applyAtrStop}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-all shadow-md shadow-amber-600/20"
            >
              Apply ATR Stop Loss to Workspace
            </button>
          </div>

          {/* Method 2: Fixed Percentage */}
          <div className="bg-dark-card p-6 rounded-2xl border border-dark-border space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-400" />
              <span>Method 2: Fixed Percentage Stop</span>
            </h2>
            <p className="text-xs text-dark-muted">
              Positions stop at an exact percentage distance from your entry price.
            </p>

            <div>
              <label className="text-xs text-dark-muted block mb-1">Stop Distance (%)</label>
              <input
                type="number"
                step="0.1"
                value={fixedPctSL}
                onChange={(e) => setFixedPctSL(parseFloat(e.target.value) || 0)}
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              {[0.5, 1.0, 1.5, 2.0, 3.0].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setFixedPctSL(pct)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono ${
                    fixedPctSL === pct ? 'bg-blue-600 text-white' : 'bg-dark-surface text-slate-400'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            <div className="p-4 bg-dark-surface rounded-xl border border-dark-border text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-dark-muted">Stop Distance:</span>
                <span className="font-mono text-white">
                  ${((entryPrice * fixedPctSL) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-muted">Proposed Stop Price:</span>
                <span className="font-mono text-red-400 font-bold">
                  $
                  {(direction === 'Long'
                    ? entryPrice - (entryPrice * fixedPctSL) / 100
                    : entryPrice + (entryPrice * fixedPctSL) / 100
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={applyFixedPctStop}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-md shadow-blue-600/20"
            >
              Apply Percentage Stop to Workspace
            </button>
          </div>
        </div>
      )}

      {/* PROFIT & LOSS CALCULATOR VIEW */}
      {calcTab === 'pnl' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-dark-card p-6 rounded-2xl border border-dark-border space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Closed Trade Profit & Loss Calculator</span>
            </h2>
            <p className="text-xs text-dark-muted">
              Determine gross and net P&L after factoring broker commissions, taker fees, and spread.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-dark-muted block mb-1">Direction</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPnlDir('Long')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl ${
                      pnlDir === 'Long' ? 'bg-emerald-600 text-white' : 'bg-dark-surface text-slate-400'
                    }`}
                  >
                    Long (Buy)
                  </button>
                  <button
                    onClick={() => setPnlDir('Short')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl ${
                      pnlDir === 'Short' ? 'bg-red-600 text-white' : 'bg-dark-surface text-slate-400'
                    }`}
                  >
                    Short (Sell)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-dark-muted block mb-1">Position Size (Contracts/Units)</label>
                <input
                  type="number"
                  value={pnlSize}
                  onChange={(e) => setPnlSize(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-dark-muted block mb-1">Entry Price ($)</label>
                <input
                  type="number"
                  value={pnlEntry}
                  onChange={(e) => setPnlEntry(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-dark-muted block mb-1">Exit Price ($)</label>
                <input
                  type="number"
                  value={pnlExit}
                  onChange={(e) => setPnlExit(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-dark-muted block mb-1">Exchange / Broker Fee Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pnlFeePct}
                  onChange={(e) => setPnlFeePct(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-dark-card to-dark-surface p-6 rounded-2xl border border-dark-border flex flex-col justify-between shadow-card-dark">
            <div>
              <span className="text-xs uppercase font-bold text-dark-muted tracking-wider">
                Calculated Return Breakdown
              </span>
              <div className="mt-4 space-y-4">
                <div>
                  <span className="text-xs text-dark-muted block">Gross P&L</span>
                  <div
                    className={`text-2xl font-extrabold font-mono ${
                      rawPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {rawPnl >= 0 ? '+' : ''}${rawPnl.toFixed(2)}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-dark-muted block">Estimated Fees & Slippage</span>
                  <div className="text-sm font-mono font-medium text-slate-400">
                    -${estimatedFees.toFixed(2)}
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-border">
                  <span className="text-xs text-dark-muted block">Net Profit / Loss</span>
                  <div
                    className={`text-3xl font-extrabold font-mono tracking-tight ${
                      netPnlResult >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {netPnlResult >= 0 ? '+' : ''}${netPnlResult.toFixed(2)}
                  </div>
                  <span className="text-xs font-mono text-slate-400 mt-1 block">
                    Return on Capital: {roiPct >= 0 ? '+' : ''}
                    {roiPct.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-dark-surface rounded-xl border border-dark-border text-[11px] text-dark-muted flex items-center gap-2 mt-6">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Fees computed automatically for both entry and exit volume.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
