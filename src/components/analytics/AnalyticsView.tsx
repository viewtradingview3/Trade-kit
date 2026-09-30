import React, { useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Layers,
  Award,
  AlertCircle,
  Clock,
  Target,
  Shield,
  Zap,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { trades, strategies, metrics, activeAccount } = useTrading();

  // Expectancy calculation
  const winRateDec = metrics.winRate / 100;
  const lossRateDec = metrics.lossRate / 100;
  const expectancy =
    metrics.totalTradesCount > 0
      ? winRateDec * metrics.averageWin - lossRateDec * metrics.averageLoss
      : 0;

  // Breakdown by Strategy
  const strategyStats = useMemo(() => {
    const stats: {
      [id: string]: {
        name: string;
        trades: number;
        wins: number;
        losses: number;
        pnl: number;
        totalWinAmount: number;
        totalLossAmount: number;
      };
    } = {};

    strategies.forEach((s) => {
      stats[s.id] = {
        name: s.name,
        trades: 0,
        wins: 0,
        losses: 0,
        pnl: 0,
        totalWinAmount: 0,
        totalLossAmount: 0,
      };
    });

    // Also include discretionary
    stats['discretionary'] = {
      name: 'Discretionary / Other',
      trades: 0,
      wins: 0,
      losses: 0,
      pnl: 0,
      totalWinAmount: 0,
      totalLossAmount: 0,
    };

    trades.forEach((t) => {
      const key = t.strategyId && stats[t.strategyId] ? t.strategyId : 'discretionary';
      stats[key].trades += 1;
      stats[key].pnl += t.netPnl;
      if (t.netPnl > 0) {
        stats[key].wins += 1;
        stats[key].totalWinAmount += t.netPnl;
      } else if (t.netPnl < 0) {
        stats[key].losses += 1;
        stats[key].totalLossAmount += Math.abs(t.netPnl);
      }
    });

    return Object.values(stats).filter((s) => s.trades > 0);
  }, [trades, strategies]);

  // Breakdown by Session
  const sessionStats = useMemo(() => {
    const sessions = ['New York', 'London', 'London/NY Overlap', 'Asian'];
    return sessions.map((sess) => {
      const sessionTrades = trades.filter((t) => t.session === sess);
      const wins = sessionTrades.filter((t) => t.netPnl > 0).length;
      const count = sessionTrades.length;
      const pnl = sessionTrades.reduce((acc, t) => acc + t.netPnl, 0);
      const winRate = count > 0 ? (wins / count) * 100 : 0;
      return { session: sess, count, wins, pnl, winRate: Math.round(winRate) };
    });
  }, [trades]);

  // Breakdown by Market
  const marketStats = useMemo(() => {
    const markets = ['Indices', 'Crypto', 'Forex', 'Commodities', 'Stocks'];
    return markets
      .map((m) => {
        const mTrades = trades.filter((t) => t.market === m);
        const wins = mTrades.filter((t) => t.netPnl > 0).length;
        const count = mTrades.length;
        const pnl = mTrades.reduce((acc, t) => acc + t.netPnl, 0);
        const winRate = count > 0 ? (wins / count) * 100 : 0;
        return { market: m, count, pnl, winRate: Math.round(winRate) };
      })
      .filter((m) => m.count > 0);
  }, [trades]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-dark-border pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-purple-600/10 text-purple-400 border border-purple-500/20">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">Performance Analytics Engine</h1>
        </div>
        <p className="text-dark-muted text-sm mt-1">
          Quantitative metrics, expectancy calculations, strategy comparisons, and session edge analysis.
        </p>
      </div>

      {/* Core Math Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-dark-card p-4 rounded-xl border border-dark-border">
          <span className="text-[11px] text-dark-muted block">Trade Expectancy</span>
          <div
            className={`text-xl font-bold font-mono mt-1 ${
              expectancy >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {expectancy >= 0 ? '+' : ''}${expectancy.toFixed(2)}
          </div>
          <span className="text-[10px] text-dark-muted">Per trade executed</span>
        </div>

        <div className="bg-dark-card p-4 rounded-xl border border-dark-border">
          <span className="text-[11px] text-dark-muted block">Profit Factor</span>
          <div className="text-xl font-bold font-mono text-blue-400 mt-1">{metrics.profitFactor}</div>
          <span className="text-[10px] text-dark-muted">Gross Profit / Loss</span>
        </div>

        <div className="bg-dark-card p-4 rounded-xl border border-dark-border">
          <span className="text-[11px] text-dark-muted block">Average Win</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            +${metrics.averageWin.toFixed(0)}
          </div>
          <span className="text-[10px] text-dark-muted">Winning trades</span>
        </div>

        <div className="bg-dark-card p-4 rounded-xl border border-dark-border">
          <span className="text-[11px] text-dark-muted block">Average Loss</span>
          <div className="text-xl font-bold font-mono text-red-400 mt-1">
            -${metrics.averageLoss.toFixed(0)}
          </div>
          <span className="text-[10px] text-dark-muted">Losing trades</span>
        </div>

        <div className="bg-dark-card p-4 rounded-xl border border-dark-border">
          <span className="text-[11px] text-dark-muted block">Largest Win</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            +${metrics.largestWin.toFixed(0)}
          </div>
          <span className="text-[10px] text-dark-muted">Single trade high</span>
        </div>

        <div className="bg-dark-card p-4 rounded-xl border border-dark-border">
          <span className="text-[11px] text-dark-muted block">Recovery Required</span>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {metrics.recoveryRequiredPercentage}%
          </div>
          <span className="text-[10px] text-dark-muted">To reach equity peak</span>
        </div>
      </div>

      {/* Strategy Comparison Table */}
      <div className="bg-dark-card p-6 rounded-2xl border border-dark-border shadow-card-dark space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Comparative Strategy Performance</span>
          </h2>
          <span className="text-xs text-dark-muted">Derived from your logged journal trades</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-surface text-dark-muted uppercase font-semibold text-[11px] border-b border-dark-border">
              <tr>
                <th className="py-3 px-4">Strategy</th>
                <th className="py-3 px-4">Trades</th>
                <th className="py-3 px-4">Wins / Losses</th>
                <th className="py-3 px-4">Win Rate</th>
                <th className="py-3 px-4">Profit Factor</th>
                <th className="py-3 px-4 text-right">Net P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {strategyStats.map((st, i) => {
                const wr = st.trades > 0 ? (st.wins / st.trades) * 100 : 0;
                const pf =
                  st.totalLossAmount > 0
                    ? st.totalWinAmount / st.totalLossAmount
                    : st.totalWinAmount > 0
                    ? 99
                    : 0;
                return (
                  <tr key={i} className="hover:bg-dark-surface/50">
                    <td className="py-3 px-4 font-semibold text-white">{st.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{st.trades}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {st.wins}W / {st.losses}L
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">{wr.toFixed(1)}%</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">{pf.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span className={st.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {st.pnl >= 0 ? '+' : ''}${st.pnl.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session & Market Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Edge */}
        <div className="bg-dark-card p-6 rounded-2xl border border-dark-border space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span>Performance by Market Session</span>
          </h2>

          <div className="space-y-3">
            {sessionStats.map((sess, idx) => (
              <div key={idx} className="p-3 bg-dark-surface rounded-xl border border-dark-border text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-white">{sess.session}</span>
                  <span className={sess.pnl >= 0 ? 'text-emerald-400 font-mono font-bold' : 'text-red-400 font-mono font-bold'}>
                    {sess.pnl >= 0 ? '+' : ''}${sess.pnl.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-dark-muted text-[11px] mb-2">
                  <span>{sess.count} Trades</span>
                  <span>Win Rate: {sess.winRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-dark-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${sess.winRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Edge */}
        <div className="bg-dark-card p-6 rounded-2xl border border-dark-border space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Performance by Asset Class</span>
          </h2>

          <div className="space-y-3">
            {marketStats.map((m, idx) => (
              <div key={idx} className="p-3 bg-dark-surface rounded-xl border border-dark-border text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-white">{m.market}</span>
                  <span className={m.pnl >= 0 ? 'text-emerald-400 font-mono font-bold' : 'text-red-400 font-mono font-bold'}>
                    {m.pnl >= 0 ? '+' : ''}${m.pnl.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-dark-muted text-[11px] mb-2">
                  <span>{m.count} Trades</span>
                  <span>Win Rate: {m.winRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-dark-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${m.winRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
