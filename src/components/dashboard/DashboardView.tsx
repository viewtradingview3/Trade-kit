import React from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShieldAlert,
  Target,
  BarChart3,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  Calculator,
  Clock,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { activeAccount, metrics, trades, setActiveTab, setCalculatorPrefill } = useTrading();

  const recentTrades = trades.slice(0, 5);

  // SVG Equity Curve Calculation
  const equityPoints = metrics.equityCurve;
  const minBal = Math.min(...equityPoints.map((p) => p.balance), activeAccount?.startingBalance || 10000);
  const maxBal = Math.max(...equityPoints.map((p) => p.balance), (activeAccount?.startingBalance || 10000) * 1.05);
  const range = maxBal - minBal || 1;

  const svgWidth = 800;
  const svgHeight = 220;
  const padding = 30;

  const pointsString = equityPoints
    .map((point, index) => {
      const x = padding + (index / Math.max(1, equityPoints.length - 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - ((point.balance - minBal) / range) * (svgHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  // Compute daily performance for past 7 days
  const dailyBreakdown = (() => {
    const days: { [date: string]: number } = {};
    trades.forEach((t) => {
      if (t.result !== 'Open') {
        days[t.date] = (days[t.date] || 0) + t.netPnl;
      }
    });
    return Object.entries(days)
      .slice(-7)
      .map(([date, pnl]) => ({ date, pnl }));
  })();

  return (
    <div className="space-y-6">
      {/* Top Banner / Risk Alert */}
      {metrics.isDailyLossLimitReached ? (
        <div className="p-4 bg-red-500/15 border-2 border-red-500/40 rounded-2xl flex items-center justify-between text-red-400 shadow-glow-red animate-pulse">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <Lock className="w-6 h-6" />
            </span>
            <div>
              <h3 className="font-bold text-base text-white">DAILY LOSS LIMIT REACHED</h3>
              <p className="text-xs text-red-300">
                You have reached your daily loss threshold of ${activeAccount?.dailyLossLimit.toLocaleString()}.
                Consider stopping trading immediately according to your trading discipline plan.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('plan')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
          >
            Review Trading Plan
          </button>
        </div>
      ) : metrics.isDailyLossLimitApproaching ? (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-amber-400">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-white">Daily Loss Limit Warning: 80%+ Used</h4>
              <p className="text-xs text-amber-300/90">
                You have consumed ${metrics.dailyRiskUsed} of your ${activeAccount?.dailyLossLimit} daily allowance. Protect your capital.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-amber-500/20">
            ${metrics.dailyRiskRemaining.toFixed(0)} Remaining
          </span>
        </div>
      ) : null}

      {/* Hero Welcome & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-dark-muted flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Active Trader Terminal • {activeAccount?.broker}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
            {activeAccount?.name || 'Trading Workspace'}
          </h1>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('calculator')}
            className="flex items-center gap-2 px-4 py-2 bg-dark-card hover:bg-dark-surface border border-dark-border rounded-xl text-xs font-semibold text-white transition-all shadow-sm"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Launch Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/25"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Journal</span>
          </button>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Account Balance */}
        <div className="bg-gradient-to-br from-dark-card to-dark-surface p-5 rounded-2xl border border-dark-border shadow-card-dark relative overflow-hidden">
          <div className="flex items-center justify-between text-dark-muted text-xs font-medium">
            <span>Account Balance</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-2 tracking-tight">
            ${metrics.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-dark-muted">Starting:</span>
            <span className="text-slate-300 font-mono font-medium">${metrics.startingBalance.toLocaleString()}</span>
            <span className={`ml-auto font-mono font-bold flex items-center ${metrics.netPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {metrics.netPnL >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {metrics.netPnL >= 0 ? '+' : ''}${metrics.netPnL.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Today's & Weekly P&L */}
        <div className="bg-dark-card p-5 rounded-2xl border border-dark-border shadow-card-dark">
          <div className="flex items-center justify-between text-dark-muted text-xs font-medium">
            <span>Today's Net P&L</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-surface border border-dark-border text-slate-300">
              Today
            </span>
          </div>
          <div
            className={`text-3xl font-extrabold font-mono mt-2 tracking-tight ${
              metrics.todayPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {metrics.todayPnL >= 0 ? '+' : ''}${metrics.todayPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-dark-muted pt-2 border-t border-dark-border">
            <span>Weekly P&L:</span>
            <span className={`font-mono font-bold ${metrics.weeklyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {metrics.weeklyPnL >= 0 ? '+' : ''}${metrics.weeklyPnL.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Win Rate & Profit Factor */}
        <div className="bg-dark-card p-5 rounded-2xl border border-dark-border shadow-card-dark">
          <div className="flex items-center justify-between text-dark-muted text-xs font-medium">
            <span>Win Rate</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-2 tracking-tight">
            {metrics.winRate}%
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-dark-muted pt-2 border-t border-dark-border">
            <span>Profit Factor:</span>
            <span className="font-mono font-bold text-blue-400">{metrics.profitFactor}</span>
            <span className="text-dark-muted">Avg R:R:</span>
            <span className="font-mono font-bold text-slate-200">1:{metrics.averageRR}</span>
          </div>
        </div>

        {/* Drawdown & Risk Guard */}
        <div className="bg-dark-card p-5 rounded-2xl border border-dark-border shadow-card-dark">
          <div className="flex items-center justify-between text-dark-muted text-xs font-medium">
            <span>Drawdown Guard</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-2 tracking-tight">
            {metrics.drawdownPercentage}%
          </div>
          <div className="mt-2.5">
            <div className="flex justify-between text-[11px] text-dark-muted mb-1">
              <span>Current DD: ${metrics.currentDrawdown.toLocaleString()}</span>
              <span>Max DD: ${metrics.maxDrawdown.toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 bg-dark-surface rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  metrics.drawdownPercentage > 10 ? 'bg-red-500' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, (metrics.currentDrawdown / (activeAccount?.maxDrawdown || 2000)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Equity Curve & Daily Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Equity Curve Chart (8 cols) */}
        <div className="lg:col-span-8 bg-dark-card p-6 rounded-2xl border border-dark-border shadow-card-dark space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Account Equity Curve</span>
              </h2>
              <p className="text-xs text-dark-muted">Cumulative portfolio trajectory updated dynamically after each closed trade.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Peak: ${maxBal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-56">
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#1F293D" strokeDasharray="4 4" />
              <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#1F293D" strokeDasharray="4 4" />
              <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#1F293D" />

              {/* Area under curve */}
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {equityPoints.length > 1 && (
                <polygon
                  points={`${padding},${svgHeight - padding} ${pointsString} ${svgWidth - padding},${svgHeight - padding}`}
                  fill="url(#equityGrad)"
                />
              )}

              {/* Curve Line */}
              {equityPoints.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />
              )}

              {/* Dots for each trade */}
              {equityPoints.map((pt, i) => {
                const cx = padding + (i / Math.max(1, equityPoints.length - 1)) * (svgWidth - padding * 2);
                const cy = svgHeight - padding - ((pt.balance - minBal) / range) * (svgHeight - padding * 2);
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#0A0D14"
                    stroke={pt.pnl >= 0 ? '#10B981' : '#EF4444'}
                    strokeWidth="2.5"
                  >
                    <title>{`${pt.date} • ${pt.symbol}: ${pt.pnl >= 0 ? '+' : ''}$${pt.pnl} | Bal: $${pt.balance}`}</title>
                  </circle>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center text-[11px] text-dark-muted font-mono pt-2 border-t border-dark-border">
            <span>Start: ${activeAccount?.startingBalance.toLocaleString()}</span>
            <span>Total Trades Plotted: {equityPoints.length - 1}</span>
            <span className="text-emerald-400 font-bold">Current: ${metrics.currentBalance.toLocaleString()}</span>
          </div>
        </div>

        {/* Daily P&L Bars & Risk Usage (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Daily Risk Gauge */}
          <div className="bg-dark-card p-5 rounded-2xl border border-dark-border shadow-card-dark">
            <span className="text-xs uppercase font-bold text-dark-muted tracking-wider block mb-2">
              Daily Loss Allowance Status
            </span>
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-bold font-mono text-white">
                ${metrics.dailyRiskUsed} / ${activeAccount?.dailyLossLimit}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {metrics.dailyRiskPercentageUsed}% Used
              </span>
            </div>

            <div className="w-full h-2 bg-dark-surface rounded-full overflow-hidden mt-3 border border-dark-border">
              <div
                className={`h-full transition-all duration-300 ${
                  metrics.dailyRiskPercentageUsed >= 80 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, metrics.dailyRiskPercentageUsed)}%` }}
              />
            </div>
            <p className="text-[11px] text-dark-muted mt-2">
              Remaining today: <strong className="text-slate-200">${metrics.dailyRiskRemaining}</strong> before discipline trigger.
            </p>
          </div>

          {/* Daily P&L breakdown */}
          <div className="bg-dark-card p-5 rounded-2xl border border-dark-border shadow-card-dark space-y-3">
            <span className="text-xs uppercase font-bold text-dark-muted tracking-wider block">
              Recent Trading Days P&L
            </span>

            <div className="space-y-2">
              {dailyBreakdown.length === 0 ? (
                <div className="text-xs text-dark-muted py-4 text-center">No trades logged yet.</div>
              ) : (
                dailyBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-dark-border/50">
                    <span className="text-slate-300 font-mono">{item.date}</span>
                    <span
                      className={`font-mono font-bold ${
                        item.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {item.pnl >= 0 ? '+' : ''}${item.pnl.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Executed Trades */}
      <div className="bg-dark-card rounded-2xl border border-dark-border p-6 shadow-card-dark">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Recent Trade History</span>
          </h2>
          <button
            onClick={() => setActiveTab('journal')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            View Full Ledger →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-surface text-dark-muted uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Symbol</th>
                <th className="py-2.5 px-4">Side</th>
                <th className="py-2.5 px-4">Entry</th>
                <th className="py-2.5 px-4">Exit</th>
                <th className="py-2.5 px-4">R:R</th>
                <th className="py-2.5 px-4">P&L</th>
                <th className="py-2.5 px-4">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {recentTrades.map((t) => (
                <tr key={t.id} className="hover:bg-dark-surface/50">
                  <td className="py-2.5 px-4 font-mono text-dark-muted">{t.date}</td>
                  <td className="py-2.5 px-4 font-bold text-white font-mono">{t.symbol}</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.direction === 'Long' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                      }`}
                    >
                      {t.direction}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-300">${t.entryPrice.toLocaleString()}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-300">{t.exitPrice ? `$${t.exitPrice.toLocaleString()}` : '--'}</td>
                  <td className="py-2.5 px-4 font-mono text-blue-400">1:{t.rrRatio}</td>
                  <td className="py-2.5 px-4 font-mono font-bold">
                    <span className={t.netPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {t.netPnl >= 0 ? '+' : ''}${t.netPnl.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.result === 'Win'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : t.result === 'Loss'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {t.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
