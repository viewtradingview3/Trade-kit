import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  Calendar,
  Clock,
  Eye,
  FileText,
  Bookmark,
  Layers,
  Search,
  Plus,
  Trash2,
  Pin,
  ExternalLink,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Strategy, MarketType, SessionType } from '../../types';

export const MarketToolsHub: React.FC = () => {
  const {
    watchlist,
    economicEvents,
    notes,
    addNote,
    deleteNote,
    togglePinNote,
    strategies,
    addStrategy,
    deleteStrategy,
    setCalculatorPrefill,
    setActiveTab,
  } = useTrading();

  const [activeSubTab, setActiveSubTab] = useState<'sessions' | 'calendar' | 'watchlist' | 'notes' | 'strategies'>('sessions');

  // Market Sessions Real-time calculation
  const [currentUtcTime, setCurrentUtcTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUtcTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const utcHour = currentUtcTime.getUTCHours();
  const utcMinute = currentUtcTime.getUTCMinutes();
  const utcTimeDecimal = utcHour + utcMinute / 60;

  // Session hours (UTC)
  // Sydney: 22:00 - 07:00 UTC
  // Tokyo: 00:00 - 09:00 UTC
  // London: 08:00 - 17:00 UTC
  // New York: 13:00 - 22:00 UTC
  const isSydneyOpen = utcTimeDecimal >= 22 || utcTimeDecimal < 7;
  const isTokyoOpen = utcTimeDecimal >= 0 && utcTimeDecimal < 9;
  const isLondonOpen = utcTimeDecimal >= 8 && utcTimeDecimal < 17;
  const isNewYorkOpen = utcTimeDecimal >= 13 && utcTimeDecimal < 22;
  const isLondonNyOverlap = utcTimeDecimal >= 13 && utcTimeDecimal < 17;

  // Notes state
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteTag, setNoteTag] = useState<string>('Setup');
  const [noteSearch, setNoteSearch] = useState<string>('');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    addNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      tags: [noteTag],
      isPinned: false,
    });
    setNoteTitle('');
    setNoteContent('');
  };

  // Strategy Modal state
  const [isStratModalOpen, setIsStratModalOpen] = useState<boolean>(false);
  const [stratName, setStratName] = useState<string>('');
  const [stratMarket, setStratMarket] = useState<MarketType>('Indices');
  const [stratTimeframe, setStratTimeframe] = useState<string>('5m / 15m');
  const [stratEntry, setStratEntry] = useState<string>('');
  const [stratConf, setStratConf] = useState<string>('');
  const [stratSL, setStratSL] = useState<string>('');
  const [stratTP, setStratTP] = useState<string>('');
  const [stratRR, setStratRR] = useState<number>(2.5);
  const [stratSession, setStratSession] = useState<SessionType>('New York');

  const handleCreateStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stratName.trim()) return;
    addStrategy({
      name: stratName.trim(),
      market: stratMarket,
      timeframe: stratTimeframe,
      entryRules: stratEntry,
      confirmationRules: stratConf,
      stopLossRules: stratSL,
      takeProfitRules: stratTP,
      riskRules: '1% max risk',
      rrTarget: stratRR,
      bestSession: stratSession,
      avoidConditions: 'Avoid bank holidays and red-folder news',
    });
    setIsStratModalOpen(false);
    setStratName('');
    setStratEntry('');
    setStratConf('');
    setStratSL('');
    setStratTP('');
  };

  // Calendar filter state
  const [impactFilter, setImpactFilter] = useState<'All' | 'High' | 'Medium'>('All');
  const [currencyFilter, setCurrencyFilter] = useState<string>('All');

  const filteredEvents = economicEvents.filter((ev) => {
    const matchImpact = impactFilter === 'All' || ev.impact === impactFilter;
    const matchCurrency = currencyFilter === 'All' || ev.currency === currencyFilter;
    return matchImpact && matchCurrency;
  });

  // Watchlist action: Send to Calculator
  const handleTradeSymbolInCalculator = (item: any) => {
    setCalculatorPrefill({
      symbol: item.symbol,
      market: item.market,
      entryPrice: item.price,
      stopLossPrice: item.price * 0.99,
      takeProfitPrice: item.price * 1.025,
    });
    setActiveTab('calculator');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-600/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Market Intelligence & Tools</h1>
          </div>
          <p className="text-dark-muted text-sm mt-1">
            Global market clocks, live Binance feeds, economic event radar, trade notes, and playbook strategies.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 bg-dark-card p-1 rounded-xl border border-dark-border overflow-x-auto">
          {[
            { id: 'sessions', label: 'Market Sessions', icon: Clock },
            { id: 'calendar', label: 'Economic Calendar', icon: Calendar },
            { id: 'watchlist', label: 'Watchlist Tickers', icon: Eye },
            { id: 'notes', label: 'Trader Notes', icon: FileText },
            { id: 'strategies', label: 'Strategy Playbook', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive ? 'bg-cyan-600 text-white shadow-sm' : 'text-dark-muted hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: MARKET SESSIONS */}
      {activeSubTab === 'sessions' && (
        <div className="space-y-6">
          {/* Overlap Alert */}
          {isLondonNyOverlap && (
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 shadow-glow-green">
              <Sparkles className="w-5 h-5 flex-shrink-0" />
              <div>
                <strong className="text-white block font-bold text-sm">
                  PRIME VOLATILITY WINDOW: London & New York Overlap Active!
                </strong>
                <span className="text-xs text-emerald-300/90">
                  This 4-hour window (13:00 - 17:00 UTC) produces the highest liquidity, tightest spreads, and largest directional trends across Forex and US Indices.
                </span>
              </div>
            </div>
          )}

          {/* Time Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-dark-card rounded-2xl border border-dark-border text-xs">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-dark-surface rounded-xl text-blue-400 font-mono font-bold">
                UTC {currentUtcTime.toUTCString().slice(17, 25)}
              </span>
              <span className="text-dark-muted">
                Local Time: {currentUtcTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <div className="text-dark-muted mt-2 sm:mt-0 font-medium">
              Active Sessions: {[isSydneyOpen && 'Sydney', isTokyoOpen && 'Tokyo', isLondonOpen && 'London', isNewYorkOpen && 'New York'].filter(Boolean).join(', ') || 'Weekend / Off-Hours'}
            </div>
          </div>

          {/* Session Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'Sydney Session',
                city: 'Sydney, Australia',
                utcHours: '22:00 - 07:00 UTC',
                isOpen: isSydneyOpen,
                color: 'blue',
                desc: 'Asian-Pacific liquidity kick-off, AUD/NZD momentum.',
              },
              {
                name: 'Tokyo Session',
                city: 'Tokyo, Japan',
                utcHours: '00:00 - 09:00 UTC',
                isOpen: isTokyoOpen,
                color: 'purple',
                desc: 'Asian range formation, JPY and Asian indices active.',
              },
              {
                name: 'London Session',
                city: 'London, United Kingdom',
                utcHours: '08:00 - 17:00 UTC',
                isOpen: isLondonOpen,
                color: 'emerald',
                desc: 'Massive European liquidity surge, sweeps of Asian highs/lows.',
              },
              {
                name: 'New York Session',
                city: 'New York, USA',
                utcHours: '13:00 - 22:00 UTC',
                isOpen: isNewYorkOpen,
                color: 'cyan',
                desc: 'US Economic data, equities cash open, peak daily volume.',
              },
            ].map((sess, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  sess.isOpen
                    ? 'bg-dark-card border-dark-border shadow-card-dark ring-1 ring-emerald-500/20'
                    : 'bg-dark-card/50 border-dark-border/40 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-bold text-dark-muted tracking-wider">
                    {sess.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sess.isOpen
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {sess.isOpen ? 'ACTIVE NOW' : 'CLOSED'}
                  </span>
                </div>

                <div className="text-base font-bold text-white">{sess.city}</div>
                <div className="text-xs font-mono text-slate-400 mt-1">{sess.utcHours}</div>
                <p className="text-[11px] text-dark-muted mt-3 leading-relaxed">{sess.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ECONOMIC CALENDAR */}
      {activeSubTab === 'calendar' && (
        <div className="bg-dark-card rounded-2xl border border-dark-border p-6 space-y-4 shadow-card-dark">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Economic News Calendar</span>
              </h2>
              <p className="text-xs text-dark-muted">
                Track high-impact macroeconomic announcements to avoid unexpected slippage.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <select
                value={impactFilter}
                onChange={(e) => setImpactFilter(e.target.value as any)}
                className="bg-dark-surface border border-dark-border rounded-xl px-3 py-1.5 text-white text-xs"
              >
                <option value="All">All Impacts</option>
                <option value="High">High Impact (Red Folder)</option>
                <option value="Medium">Medium Impact</option>
              </select>

              <select
                value={currencyFilter}
                onChange={(e) => setCurrencyFilter(e.target.value)}
                className="bg-dark-surface border border-dark-border rounded-xl px-3 py-1.5 text-white text-xs"
              >
                <option value="All">All Currencies</option>
                <option value="USD">USD Only</option>
                <option value="EUR">EUR Only</option>
                <option value="GBP">GBP Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-surface text-dark-muted uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Currency</th>
                  <th className="py-3 px-4">Impact</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Previous</th>
                  <th className="py-3 px-4">Forecast</th>
                  <th className="py-3 px-4">Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-dark-surface/50">
                    <td className="py-3 px-4 font-mono text-dark-muted">
                      {ev.date} • {ev.time}
                    </td>
                    <td className="py-3 px-4 font-bold font-mono text-white">{ev.currency}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ev.impact === 'High'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {ev.impact}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">{ev.event}</td>
                    <td className="py-3 px-4 font-mono text-dark-muted">{ev.previous}</td>
                    <td className="py-3 px-4 font-mono text-dark-muted">{ev.forecast}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">{ev.actual || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: WATCHLIST */}
      {activeSubTab === 'watchlist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-dark-muted">
              Live Binance WebSocket prices for crypto pairs. Traditional assets show simulated demo values.
            </p>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-dark-card border border-dark-border text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Stream Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((item) => (
              <div
                key={item.id}
                className="bg-dark-card p-5 rounded-2xl border border-dark-border shadow-card-dark flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-extrabold text-white font-mono">{item.symbol}</span>
                      <div className="text-xs text-dark-muted">{item.name}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.isLive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.isLive ? 'LIVE FEED' : 'DEMO DATA'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="text-2xl font-bold font-mono text-white">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold flex items-center ${
                        item.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {item.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                      {item.change24h >= 0 ? '+' : ''}
                      {item.change24h}%
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-dark-border flex items-center justify-between text-xs">
                  <div className="text-[11px] text-dark-muted font-mono">
                    H: ${item.high24h.toLocaleString()} | L: ${item.low24h.toLocaleString()}
                  </div>
                  <button
                    onClick={() => handleTradeSymbolInCalculator(item)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    <span>Plan in Calculator</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: TRADER NOTES */}
      {activeSubTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Note Creator (4 cols) */}
          <div className="lg:col-span-4 bg-dark-card p-6 rounded-2xl border border-dark-border space-y-4 shadow-card-dark">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Create Note or Setup Idea</span>
            </h2>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="text-xs text-dark-muted block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. London Session Plan..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  required
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-dark-muted block mb-1">Tag</label>
                <select
                  value={noteTag}
                  onChange={(e) => setNoteTag(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white text-xs"
                >
                  <option value="Setup">Setup</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Mindset">Mindset</option>
                  <option value="Checklist">Checklist</option>
                  <option value="Lesson">Lesson</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-dark-muted block mb-1">Content</label>
                <textarea
                  rows={5}
                  placeholder="Write your trade idea, checklist notes or weekly learnings..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl p-3 text-white text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-md shadow-blue-600/25"
              >
                <Plus className="w-4 h-4" /> Save Note
              </button>
            </form>
          </div>

          {/* Notes Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search notes..."
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                className="w-full bg-dark-card border border-dark-border rounded-xl pl-9 pr-3 py-2 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {notes
                .filter(
                  (n) =>
                    n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
                    n.content.toLowerCase().includes(noteSearch.toLowerCase())
                )
                .map((note) => (
                  <div
                    key={note.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      note.isPinned
                        ? 'bg-dark-card border-blue-500/40 shadow-card-dark'
                        : 'bg-dark-card border-dark-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-white text-sm">{note.title}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePinNote(note.id)}
                          className={`p-1 rounded ${
                            note.isPinned ? 'text-blue-400' : 'text-dark-muted hover:text-white'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 text-dark-muted hover:text-red-400 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-3">
                      {note.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-dark-surface text-blue-400 border border-dark-border"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: STRATEGY PLAYBOOK */}
      {activeSubTab === 'strategies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-dark-muted">
              Document your mechanical edge: strict entry criteria, confirmation triggers, and invalidation rules.
            </p>
            <button
              onClick={() => setIsStratModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/25"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Strategy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strat) => (
              <div
                key={strat.id}
                className="bg-dark-card p-6 rounded-2xl border border-dark-border shadow-card-dark flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{strat.name}</h3>
                      <div className="text-xs text-blue-400 mt-0.5">
                        {strat.market} • {strat.timeframe} • {strat.bestSession}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteStrategy(strat.id)}
                      className="text-dark-muted hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 mt-4 text-xs">
                    <div className="bg-dark-surface p-3 rounded-xl border border-dark-border">
                      <strong className="text-emerald-400 block mb-1">Entry Criteria:</strong>
                      <span className="text-slate-300">{strat.entryRules}</span>
                    </div>

                    <div className="bg-dark-surface p-3 rounded-xl border border-dark-border">
                      <strong className="text-blue-400 block mb-1">Confirmation Trigger:</strong>
                      <span className="text-slate-300">{strat.confirmationRules}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-dark-surface p-2.5 rounded-xl border border-dark-border">
                        <strong className="text-red-400 block text-[11px]">Stop Loss:</strong>
                        <span className="text-slate-300 text-[11px]">{strat.stopLossRules}</span>
                      </div>
                      <div className="bg-dark-surface p-2.5 rounded-xl border border-dark-border">
                        <strong className="text-amber-400 block text-[11px]">Target R:R:</strong>
                        <span className="text-slate-300 text-[11px]">Minimum 1:{strat.rrTarget}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-dark-border flex items-center justify-between text-xs text-dark-muted">
                  <span>Created: {strat.createdAt.split('T')[0]}</span>
                  <span className="text-emerald-400 font-semibold">Active in Journal</span>
                </div>
              </div>
            ))}
          </div>

          {/* Strategy Creator Modal */}
          {isStratModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-dark-card border border-dark-border w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-4">
                <h3 className="text-lg font-bold text-white">Add Strategy to Playbook</h3>
                <form onSubmit={handleCreateStrategy} className="space-y-4 text-xs">
                  <div>
                    <label className="text-dark-muted block mb-1">Strategy Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Opening Range Breakout..."
                      value={stratName}
                      onChange={(e) => setStratName(e.target.value)}
                      className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-dark-muted block mb-1">Market</label>
                      <select
                        value={stratMarket}
                        onChange={(e) => setStratMarket(e.target.value as MarketType)}
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white"
                      >
                        <option value="Indices">Indices</option>
                        <option value="Crypto">Crypto</option>
                        <option value="Forex">Forex</option>
                        <option value="Commodities">Commodities</option>
                        <option value="Stocks">Stocks</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-dark-muted block mb-1">Timeframe</label>
                      <input
                        type="text"
                        value={stratTimeframe}
                        onChange={(e) => setStratTimeframe(e.target.value)}
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-dark-muted block mb-1">Entry Criteria</label>
                    <textarea
                      rows={2}
                      value={stratEntry}
                      onChange={(e) => setStratEntry(e.target.value)}
                      placeholder="What market structure or price action triggers an entry?"
                      className="w-full bg-dark-surface border border-dark-border rounded-xl p-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-dark-muted block mb-1">Confirmation Rules</label>
                    <textarea
                      rows={2}
                      value={stratConf}
                      onChange={(e) => setStratConf(e.target.value)}
                      placeholder="Volume, oscillator divergence, candle close..."
                      className="w-full bg-dark-surface border border-dark-border rounded-xl p-3 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-dark-muted block mb-1">Stop Loss Placement</label>
                      <input
                        type="text"
                        value={stratSL}
                        onChange={(e) => setStratSL(e.target.value)}
                        placeholder="e.g. Below swing pivot low"
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-dark-muted block mb-1">Target R:R</label>
                      <input
                        type="number"
                        step="0.1"
                        value={stratRR}
                        onChange={(e) => setStratRR(parseFloat(e.target.value) || 2)}
                        className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
                    <button
                      type="button"
                      onClick={() => setIsStratModalOpen(false)}
                      className="px-4 py-2 text-dark-muted hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold"
                    >
                      Save Strategy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
