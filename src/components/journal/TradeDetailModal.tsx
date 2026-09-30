import React, { useState } from 'react';
import { Trade } from '../../types';
import {
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Shield,
  Layers,
  Brain,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface TradeDetailModalProps {
  trade: Trade | null;
  onClose: () => void;
  onEdit: (trade: Trade) => void;
}

export const TradeDetailModal: React.FC<TradeDetailModalProps> = ({ trade, onClose, onEdit }) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState<'before' | 'entry' | 'exit'>('entry');

  if (!trade) return null;

  const hasScreenshots =
    trade.screenshots.before || trade.screenshots.entry || trade.screenshots.exit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-dark-card border border-dark-border w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border bg-dark-surface">
          <div className="flex items-center gap-3">
            <span
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                trade.direction === 'Long'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/15 text-red-400 border border-red-500/30'
              }`}
            >
              {trade.direction === 'Long' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {trade.direction.toUpperCase()}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white font-mono">{trade.symbol}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-dark-card text-dark-muted border border-dark-border">
                  {trade.market}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    trade.result === 'Win'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : trade.result === 'Loss'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {trade.result}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-dark-muted mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {trade.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {trade.time} ({trade.session})
                </span>
                <span>Timeframe: {trade.timeframe}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(trade)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold transition-all"
            >
              Edit Trade
            </button>
            <button
              onClick={onClose}
              className="p-2 text-dark-muted hover:text-white rounded-lg hover:bg-dark-surface"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-dark-surface p-4 rounded-xl border border-dark-border">
              <span className="text-xs text-dark-muted block">Net Profit / Loss</span>
              <span
                className={`text-xl font-bold font-mono ${
                  trade.netPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {trade.netPnl >= 0 ? '+' : ''}${trade.netPnl.toLocaleString()}
              </span>
            </div>
            <div className="bg-dark-surface p-4 rounded-xl border border-dark-border">
              <span className="text-xs text-dark-muted block">R-Multiple</span>
              <span className="text-xl font-bold font-mono text-white">
                {trade.rMultiple >= 0 ? '+' : ''}{trade.rMultiple}R
              </span>
            </div>
            <div className="bg-dark-surface p-4 rounded-xl border border-dark-border">
              <span className="text-xs text-dark-muted block">Planned R:R</span>
              <span className="text-xl font-bold font-mono text-blue-400">1 : {trade.rrRatio}</span>
            </div>
            <div className="bg-dark-surface p-4 rounded-xl border border-dark-border">
              <span className="text-xs text-dark-muted block">Risk Capital</span>
              <span className="text-xl font-bold font-mono text-slate-300">
                ${trade.riskAmount} ({trade.riskPercentage}%)
              </span>
            </div>
          </div>

          {/* Pricing Execution Row */}
          <div className="bg-dark-surface p-4 rounded-xl border border-dark-border">
            <span className="text-xs uppercase font-bold text-dark-muted tracking-wider block mb-3">
              Price Levels & Sizing
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div>
                <span className="text-dark-muted block">Entry Price:</span>
                <span className="font-mono text-white font-semibold">${trade.entryPrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-dark-muted block">Stop Loss:</span>
                <span className="font-mono text-red-400 font-semibold">${trade.stopLossPrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-dark-muted block">Take Profit:</span>
                <span className="font-mono text-emerald-400 font-semibold">${trade.takeProfitPrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-dark-muted block">Exit Price:</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {trade.exitPrice ? `$${trade.exitPrice.toLocaleString()}` : 'Still Open'}
                </span>
              </div>
              <div>
                <span className="text-dark-muted block">Position Size:</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {trade.positionSize} ({trade.leverage}x lev)
                </span>
              </div>
            </div>
          </div>

          {/* Strategy & Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dark-surface p-4 rounded-xl border border-dark-border space-y-2">
              <span className="text-xs uppercase font-bold text-dark-muted tracking-wider block">
                Strategy & Setup
              </span>
              <div className="text-sm font-semibold text-white">{trade.strategyName || 'Discretionary'}</div>
              <div className="text-xs text-slate-300 font-mono bg-dark-card p-2.5 rounded-lg border border-dark-border">
                {trade.setup || 'No specific setup recorded.'}
              </div>
              {trade.entryReason && (
                <div className="text-xs text-dark-muted pt-2">
                  <strong className="text-slate-200">Entry Reason:</strong> {trade.entryReason}
                </div>
              )}
              {trade.exitReason && (
                <div className="text-xs text-dark-muted">
                  <strong className="text-slate-200">Exit Reason:</strong> {trade.exitReason}
                </div>
              )}
            </div>

            {/* Psychology & Discipline Audit */}
            <div className="bg-dark-surface p-4 rounded-xl border border-dark-border space-y-3">
              <span className="text-xs uppercase font-bold text-dark-muted tracking-wider block">
                Psychological State & Discipline
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-dark-muted">Rule Discipline:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {trade.psychology.disciplineScore} / 10
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-dark-muted">Confidence Level:</span>
                <span className="font-mono font-bold text-blue-400">
                  {trade.psychology.confidence} / 10
                </span>
              </div>

              {/* Behavior Flags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {trade.psychology.fomo && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    FOMO Present
                  </span>
                )}
                {trade.psychology.revengeTrading && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    Revenge Trading
                  </span>
                )}
                {trade.psychology.overtrading && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    Overtrading
                  </span>
                )}
                {trade.psychology.hesitation && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Hesitation on Entry
                  </span>
                )}
                {!trade.psychology.fomo &&
                  !trade.psychology.revengeTrading &&
                  !trade.psychology.overtrading &&
                  !trade.psychology.hesitation && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Disciplined Execution
                    </span>
                  )}
              </div>

              <div className="text-xs text-dark-muted pt-1">
                <div>
                  <strong className="text-slate-300">Emotions:</strong> {trade.psychology.beforeEmotion} →{' '}
                  {trade.psychology.duringEmotion} → {trade.psychology.afterEmotion}
                </div>
              </div>
            </div>
          </div>

          {/* Screenshots Viewer */}
          {hasScreenshots && (
            <div className="bg-dark-surface p-4 rounded-xl border border-dark-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-dark-muted tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Attached Chart Screenshots
                </span>
                <div className="flex gap-2">
                  {(['before', 'entry', 'exit'] as const).map((stage) => {
                    if (!trade.screenshots[stage]) return null;
                    return (
                      <button
                        key={stage}
                        onClick={() => setSelectedScreenshot(stage)}
                        className={`text-xs px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                          selectedScreenshot === stage
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-dark-card text-dark-muted hover:text-white'
                        }`}
                      >
                        {stage} Chart
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-dark-border bg-black max-h-[380px] flex items-center justify-center">
                {trade.screenshots[selectedScreenshot] ? (
                  <img
                    src={trade.screenshots[selectedScreenshot]}
                    alt={`${selectedScreenshot} chart`}
                    className="w-full h-auto max-h-[380px] object-contain"
                  />
                ) : (
                  <div className="p-8 text-center text-dark-muted text-xs">
                    No screenshot uploaded for this stage.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes & Reflections */}
          {trade.notes && (
            <div className="p-4 bg-dark-surface rounded-xl border border-dark-border">
              <span className="text-xs uppercase font-bold text-dark-muted tracking-wider block mb-1">
                Post-Trade Notes & Key Lessons
              </span>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{trade.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
