import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Trade, MarketType, DirectionType, TradeResult } from '../../types';
import { TradeModal } from './TradeModal';
import { TradeDetailModal } from './TradeDetailModal';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  Trash2,
  Edit2,
  Eye,
  TrendingUp,
  TrendingDown,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

export const TradeJournal: React.FC = () => {
  const { trades, deleteTrade, duplicateTrade, importTrades, strategies, activeAccount, metrics } = useTrading();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [viewingTrade, setViewingTrade] = useState<Trade | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMarket, setSelectedMarket] = useState<string>('All');
  const [selectedDirection, setSelectedDirection] = useState<string>('All');
  const [selectedResult, setSelectedResult] = useState<string>('All');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('All');
  const [selectedSession, setSelectedSession] = useState<string>('All');

  // Sorting
  const [sortField, setSortField] = useState<'date' | 'netPnl' | 'rMultiple' | 'symbol'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredTrades = useMemo(() => {
    return trades
      .filter((trade) => {
        const matchesSearch =
          trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (trade.strategyName && trade.strategyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (trade.setup && trade.setup.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (trade.notes && trade.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesMarket = selectedMarket === 'All' || trade.market === selectedMarket;
        const matchesDirection = selectedDirection === 'All' || trade.direction === selectedDirection;
        const matchesResult = selectedResult === 'All' || trade.result === selectedResult;
        const matchesStrategy = selectedStrategy === 'All' || trade.strategyId === selectedStrategy;
        const matchesSession = selectedSession === 'All' || trade.session === selectedSession;

        return matchesSearch && matchesMarket && matchesDirection && matchesResult && matchesStrategy && matchesSession;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'date') {
          comp = new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime();
        } else if (sortField === 'netPnl') {
          comp = a.netPnl - b.netPnl;
        } else if (sortField === 'rMultiple') {
          comp = a.rMultiple - b.rMultiple;
        } else if (sortField === 'symbol') {
          comp = a.symbol.localeCompare(b.symbol);
        }
        return sortOrder === 'desc' ? -comp : comp;
      });
  }, [trades, searchQuery, selectedMarket, selectedDirection, selectedResult, selectedStrategy, selectedSession, sortField, sortOrder]);

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingTrade(null);
    setIsModalOpen(true);
  };

  const toggleSort = (field: 'date' | 'netPnl' | 'rMultiple' | 'symbol') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Time',
      'Symbol',
      'Market',
      'Direction',
      'Entry',
      'StopLoss',
      'TakeProfit',
      'Exit',
      'Size',
      'RiskAmount',
      'RR',
      'Result',
      'NetPnL',
      'RMultiple',
      'Strategy',
      'Session',
    ];
    const rows = trades.map((t) => [
      t.date,
      t.time,
      `"${t.symbol}"`,
      t.market,
      t.direction,
      t.entryPrice,
      t.stopLossPrice,
      t.takeProfitPrice,
      t.exitPrice || '',
      t.positionSize,
      t.riskAmount,
      t.rrRatio,
      t.result,
      t.netPnl,
      t.rMultiple,
      `"${t.strategyName || ''}"`,
      t.session,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tradekit_journal_${activeAccount?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import CSV Trigger
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeAccount) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length <= 1) return;

        const imported: Trade[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
          if (cols.length >= 7) {
            imported.push({
              id: `imp_${Date.now()}_${i}`,
              accountId: activeAccount.id,
              userId: activeAccount.userId,
              date: cols[0] || new Date().toISOString().split('T')[0],
              time: cols[1] || '10:00',
              symbol: cols[2] || 'Imported Asset',
              market: (cols[3] as MarketType) || 'Indices',
              direction: (cols[4] as DirectionType) || 'Long',
              entryPrice: parseFloat(cols[5]) || 0,
              stopLossPrice: parseFloat(cols[6]) || 0,
              takeProfitPrice: parseFloat(cols[7]) || 0,
              exitPrice: parseFloat(cols[8]) || undefined,
              positionSize: parseFloat(cols[9]) || 1,
              leverage: 1,
              riskPercentage: 1,
              riskAmount: parseFloat(cols[10]) || 100,
              rrRatio: parseFloat(cols[11]) || 2,
              result: (cols[12] as TradeResult) || 'Win',
              fees: 10,
              netPnl: parseFloat(cols[13]) || 0,
              rMultiple: parseFloat(cols[14]) || 1,
              strategyName: cols[15] || 'Imported Strategy',
              timeframe: '5m',
              session: (cols[16] as any) || 'New York',
              psychology: {
                beforeEmotion: 'Imported',
                duringEmotion: 'Imported',
                afterEmotion: 'Imported',
                confidence: 7,
                disciplineScore: 8,
                fomo: false,
                revengeTrading: false,
                overtrading: false,
                hesitation: false,
              },
              screenshots: {},
              createdAt: new Date().toISOString(),
            });
          }
        }
        if (imported.length > 0) {
          importTrades(imported);
          alert(`Successfully imported ${imported.length} trades!`);
        }
      } catch (err) {
        alert('Failed to parse CSV file. Please check formatting.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Trading Journal & Ledger</h1>
          </div>
          <p className="text-dark-muted text-sm mt-1">
            Track every trade execution, review psychological discipline, and audit historical performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Import CSV */}
          <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-card border border-dark-border hover:bg-dark-surface text-slate-300 hover:text-white text-xs font-medium cursor-pointer transition-all">
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-card border border-dark-border hover:bg-dark-surface text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {/* Log Trade Button */}
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Trade</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-dark-card p-4 rounded-xl border border-dark-border">
          <span className="text-xs text-dark-muted font-medium block">Total Trades Recorded</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{metrics.totalTradesCount}</div>
          <span className="text-[11px] text-dark-muted">
            {metrics.winningTradesCount}W • {metrics.losingTradesCount}L
          </span>
        </div>

        <div className="bg-dark-card p-4 rounded-xl border border-dark-border">
          <span className="text-xs text-dark-muted font-medium block">Account Net P&L</span>
          <div
            className={`text-2xl font-bold font-mono mt-1 ${
              metrics.netPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {metrics.netPnL >= 0 ? '+' : ''}${metrics.netPnL.toLocaleString()}
          </div>
          <span className="text-[11px] text-dark-muted">
            Gross: ${metrics.totalProfit.toLocaleString()}
          </span>
        </div>

        <div className="bg-dark-card p-4 rounded-xl border border-dark-border">
          <span className="text-xs text-dark-muted font-medium block">Win Rate</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{metrics.winRate}%</div>
          <span className="text-[11px] text-dark-muted">Profit Factor: {metrics.profitFactor}</span>
        </div>

        <div className="bg-dark-card p-4 rounded-xl border border-dark-border">
          <span className="text-xs text-dark-muted font-medium block">Average Risk : Reward</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">1 : {metrics.averageRR}</div>
          <span className="text-[11px] text-dark-muted">Avg Win: +${metrics.averageWin.toFixed(0)}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-dark-card p-4 rounded-2xl border border-dark-border space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by symbol, setup, strategy, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-surface border border-dark-border rounded-xl pl-9 pr-3 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Market */}
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
            >
              <option value="All">All Markets</option>
              <option value="Indices">Indices</option>
              <option value="Crypto">Crypto</option>
              <option value="Forex">Forex</option>
              <option value="Commodities">Commodities</option>
              <option value="Stocks">Stocks</option>
            </select>

            {/* Direction */}
            <select
              value={selectedDirection}
              onChange={(e) => setSelectedDirection(e.target.value)}
              className="bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
            >
              <option value="All">All Directions</option>
              <option value="Long">Long Only</option>
              <option value="Short">Short Only</option>
            </select>

            {/* Result */}
            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
            >
              <option value="All">All Results</option>
              <option value="Win">Wins Only</option>
              <option value="Loss">Losses Only</option>
              <option value="Breakeven">Breakeven</option>
              <option value="Open">Open Positions</option>
            </select>

            {/* Strategy */}
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className="bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs focus:outline-none max-w-[150px]"
            >
              <option value="All">All Strategies</option>
              {strategies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Session */}
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
            >
              <option value="All">All Sessions</option>
              <option value="New York">New York</option>
              <option value="London">London</option>
              <option value="London/NY Overlap">London/NY Overlap</option>
              <option value="Asian">Asian</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Journal Table */}
      <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden shadow-card-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-surface text-dark-muted uppercase font-semibold border-b border-dark-border text-[11px] tracking-wider">
              <tr>
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Date & Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('symbol')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Symbol</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Side</th>
                <th className="py-3.5 px-4">Entry / SL / TP</th>
                <th className="py-3.5 px-4">Exit</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">R:R</th>
                <th
                  onClick={() => toggleSort('netPnl')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Net P&L</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('rMultiple')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Return (R)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Result</th>
                <th className="py-3.5 px-4">Strategy</th>
                <th className="py-3.5 px-4">Psychology</th>
                <th className="py-3.5 px-4 text-center">Chart</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-dark-muted">
                    No trades match your search filters. Click "Record New Trade" to log an entry.
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade) => {
                  const hasImgs =
                    trade.screenshots.before || trade.screenshots.entry || trade.screenshots.exit;
                  return (
                    <tr
                      key={trade.id}
                      className="hover:bg-dark-surface/60 transition-colors group cursor-pointer"
                      onClick={() => setViewingTrade(trade)}
                    >
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <div className="text-white font-medium">{trade.date}</div>
                        <div className="text-[10px] text-dark-muted">{trade.time} • {trade.session}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-white font-mono">{trade.symbol}</div>
                        <div className="text-[10px] text-dark-muted">{trade.market}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                            trade.direction === 'Long'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}
                        >
                          {trade.direction === 'Long' ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {trade.direction}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        <div className="text-white">${trade.entryPrice.toLocaleString()}</div>
                        <div className="text-[10px] text-dark-muted">
                          SL: <span className="text-red-400">${trade.stopLossPrice.toLocaleString()}</span> | TP:{' '}
                          <span className="text-emerald-400">${trade.takeProfitPrice.toLocaleString()}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        {trade.exitPrice ? (
                          <span className="text-white font-medium">${trade.exitPrice.toLocaleString()}</span>
                        ) : (
                          <span className="text-blue-400">Open</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-300">
                        {trade.positionSize}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-blue-400 font-semibold">
                        1:{trade.rrRatio}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono font-bold">
                        <span className={trade.netPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                          {trade.result === 'Open'
                            ? '--'
                            : `${trade.netPnl >= 0 ? '+' : ''}$${trade.netPnl.toLocaleString()}`}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        <span
                          className={`font-semibold ${
                            trade.rMultiple > 0
                              ? 'text-emerald-400'
                              : trade.rMultiple < 0
                              ? 'text-red-400'
                              : 'text-dark-muted'
                          }`}
                        >
                          {trade.result === 'Open'
                            ? '--'
                            : `${trade.rMultiple >= 0 ? '+' : ''}${trade.rMultiple}R`}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            trade.result === 'Win'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : trade.result === 'Loss'
                              ? 'bg-red-500/20 text-red-400'
                              : trade.result === 'Breakeven'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {trade.result}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                        <span className="truncate block max-w-[120px]">{trade.strategyName || 'Discretionary'}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-surface border border-dark-border text-emerald-400">
                            {trade.psychology.disciplineScore}/10
                          </span>
                          {trade.psychology.fomo && (
                            <span className="text-[10px] px-1 rounded bg-red-500/20 text-red-400 font-bold">FOMO</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {hasImgs ? (
                          <span className="inline-flex p-1 rounded bg-blue-600/20 text-blue-400">
                            <ImageIcon className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-slate-600">--</span>
                        )}
                      </td>

                      <td
                        className="py-3 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="View Details"
                            onClick={() => setViewingTrade(trade)}
                            className="p-1.5 text-dark-muted hover:text-white rounded-lg hover:bg-dark-surface"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Edit"
                            onClick={() => handleEdit(trade)}
                            className="p-1.5 text-dark-muted hover:text-white rounded-lg hover:bg-dark-surface"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Duplicate"
                            onClick={() => duplicateTrade(trade.id)}
                            className="p-1.5 text-dark-muted hover:text-white rounded-lg hover:bg-dark-surface"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => {
                              if (confirm('Delete this trade from journal?')) {
                                deleteTrade(trade.id);
                              }
                            }}
                            className="p-1.5 text-dark-muted hover:text-red-400 rounded-lg hover:bg-dark-surface"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Edit/Create Modal */}
      <TradeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTrade(null);
        }}
        tradeToEdit={editingTrade}
      />

      {/* Trade Detail Modal */}
      <TradeDetailModal
        trade={viewingTrade}
        onClose={() => setViewingTrade(null)}
        onEdit={(tr) => {
          setViewingTrade(null);
          handleEdit(tr);
        }}
      />
    </div>
  );
};
