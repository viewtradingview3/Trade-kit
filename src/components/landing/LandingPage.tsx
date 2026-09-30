import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  TrendingUp,
  Shield,
  Target,
  Calculator,
  BookOpen,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Layers,
  Clock,
  ChevronRight,
  DollarSign,
  HelpCircle,
} from 'lucide-react';

interface LandingPageProps {
  onStartTrading: () => void;
  onExploreTools: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartTrading,
  onExploreTools,
  onOpenAuth,
}) => {
  const { loginAsDemo } = useTrading();

  // Mini live demo calculator on the landing page
  const [demoBal, setDemoBal] = useState<number>(50000);
  const [demoRiskPct, setDemoRiskPct] = useState<number>(1.0);
  const [demoEntry, setDemoEntry] = useState<number>(20000);
  const [demoSL, setDemoSL] = useState<number>(19950);
  const [demoRR, setDemoRR] = useState<number>(3);

  const demoRiskAmt = (demoBal * demoRiskPct) / 100;
  const demoSlDist = Math.abs(demoEntry - demoSL) || 1;
  const demoSize = demoRiskAmt / demoSlDist;
  const demoTP = demoEntry + demoSlDist * demoRR;
  const demoReward = demoRiskAmt * demoRR;

  // Modals for legal / SEO info
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'disclaimer' | 'about' | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0A0D14]/80 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 text-white shadow-glow-green">
              <Zap className="w-5 h-5" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white font-mono">
              Trade<span className="text-emerald-400">Kit</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              V2.5 TERMINAL
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loginAsDemo();
                onStartTrading();
              }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dark-card hover:bg-dark-surface border border-dark-border text-xs font-semibold text-slate-200 hover:text-white transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Instant Demo Mode</span>
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all hover:-translate-y-0.5"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-24 py-12">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Command Center Built Specifically for Disciplined Traders</span>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Everything You Need to <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Trade Smarter</span>
            </h1>
            <p className="text-lg sm:text-xl text-dark-muted max-w-2xl mx-auto leading-relaxed">
              Plan your trades, calculate risk, track performance and build better trading discipline — all in one modern workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
            >
              <span>Start Trading Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                loginAsDemo();
                onStartTrading();
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-dark-card hover:bg-dark-surface border border-dark-border text-white font-semibold text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Launch Live Interactive Demo</span>
            </button>
            <button
              onClick={onExploreTools}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-dark-muted hover:text-white font-medium text-sm transition-all"
            >
              <span>Explore Features</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Live Mini-Calculator Hero Mockup */}
          <div className="max-w-5xl mx-auto mt-12 bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 shadow-2xl text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-dark-border gap-2">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" /> Interactive Calculator Preview
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Try It Live Right Now</h3>
              </div>
              <span className="text-xs text-dark-muted font-mono">
                Updates dynamically as you tweak inputs
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              {/* Inputs */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-dark-muted block mb-1">Account Balance ($)</label>
                  <input
                    type="number"
                    value={demoBal}
                    onChange={(e) => setDemoBal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-dark-muted block mb-1">Risk Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={demoRiskPct}
                    onChange={(e) => setDemoRiskPct(parseFloat(e.target.value) || 0)}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-dark-muted block mb-1">Entry Price ($)</label>
                  <input
                    type="number"
                    value={demoEntry}
                    onChange={(e) => setDemoEntry(parseFloat(e.target.value) || 0)}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-dark-muted block mb-1">Stop Loss Price ($)</label>
                  <input
                    type="number"
                    value={demoSL}
                    onChange={(e) => setDemoSL(parseFloat(e.target.value) || 0)}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-dark-muted block mb-1">Target Risk : Reward Ratio</label>
                  <div className="flex gap-2">
                    {[1.5, 2.0, 2.5, 3.0, 4.0].map((r) => (
                      <button
                        key={r}
                        onClick={() => setDemoRR(r)}
                        className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-semibold ${
                          demoRR === r ? 'bg-blue-600 text-white' : 'bg-dark-surface text-slate-400'
                        }`}
                      >
                        1:{r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calculated Result Panel */}
              <div className="lg:col-span-5 bg-gradient-to-br from-dark-surface to-dark-card p-6 rounded-2xl border border-dark-border flex flex-col justify-between shadow-card-dark">
                <div>
                  <span className="text-xs uppercase font-bold text-dark-muted">Mathematical Output</span>
                  <div className="mt-3 space-y-3">
                    <div>
                      <span className="text-xs text-dark-muted block">Position Size (Contracts/Units):</span>
                      <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                        {demoSize.toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-dark-border">
                      <div>
                        <span className="text-dark-muted block">Risk Amount:</span>
                        <span className="text-red-400 font-mono font-bold">-${demoRiskAmt.toFixed(0)}</span>
                      </div>
                      <div>
                        <span className="text-dark-muted block">Potential Profit:</span>
                        <span className="text-emerald-400 font-mono font-bold">+${demoReward.toFixed(0)}</span>
                      </div>
                      <div>
                        <span className="text-dark-muted block">Calculated TP:</span>
                        <span className="text-slate-200 font-mono font-bold">${demoTP.toFixed(1)}</span>
                      </div>
                      <div>
                        <span className="text-dark-muted block">R:R Ratio:</span>
                        <span className="text-blue-400 font-mono font-bold">1:{demoRR}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    loginAsDemo();
                    onStartTrading();
                  }}
                  className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
                >
                  <span>Open Full Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Engineered for Every Stage of Your Trading Day
            </h2>
            <p className="text-dark-muted text-sm max-w-xl mx-auto">
              From morning market preparation to trade execution, journal logging, and psychological review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calculator,
                title: 'Position Size & Risk Calculator',
                desc: 'Instantly calculate contract lots, margin required, stop-loss distance, and target prices for Crypto, Forex, Indices, and Stocks without spreadsheet errors.',
                color: 'emerald',
              },
              {
                icon: BookOpen,
                title: 'Comprehensive Trading Journal',
                desc: 'Record setups, entry/exit reasons, session tags, multi-stage chart screenshots (Before, Entry, Exit), and psychological audit notes.',
                color: 'blue',
              },
              {
                icon: BarChart3,
                title: 'Performance Analytics & Equity Curve',
                desc: 'Track equity growth curve, daily P&L calendar heatmap, trade expectancy, win rate, and compare your custom trading strategies.',
                color: 'purple',
              },
              {
                icon: Shield,
                title: 'Daily Loss & Drawdown Guard',
                desc: 'Set hard daily loss limits and maximum drawdown parameters. Real-time warnings alert you at 80% capacity to prevent catastrophic emotional revenge trading.',
                color: 'red',
              },
              {
                icon: Target,
                title: 'Pre & Post-Trade Checklists',
                desc: 'Enforce strict rule discipline before entering any position. Conduct structured post-flight debriefs to continuously hone your psychological edge.',
                color: 'cyan',
              },
              {
                icon: Clock,
                title: 'Global Market Clocks & News Radar',
                desc: 'Real-time countdowns for London, New York, Tokyo, and Sydney sessions, with live economic events calendar and crypto tickers.',
                color: 'amber',
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-dark-card p-6 rounded-2xl border border-dark-border hover:border-slate-700 transition-all shadow-card-dark flex flex-col justify-between space-y-4"
                >
                  <div>
                    <span className="p-3 rounded-xl bg-dark-surface inline-block text-white border border-dark-border mb-4">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </span>
                    <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                    <p className="text-xs text-dark-muted mt-2 leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="flex items-center text-xs text-blue-400 font-medium">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRICING & SUBSCRIPTION ARCHITECTURE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Transparent Membership Tiers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Invest in Your Trading Discipline
            </h2>
            <p className="text-dark-muted text-sm max-w-lg mx-auto">
              Start with our free starter workspace, or upgrade for unlimited journals and advanced prop firm analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-dark-card p-8 rounded-3xl border border-dark-border space-y-6 flex flex-col justify-between shadow-card-dark">
              <div>
                <h3 className="text-lg font-bold text-white">Free Starter</h3>
                <p className="text-xs text-dark-muted mt-1">Essential tools for retail traders starting out.</p>
                <div className="mt-4 text-3xl font-extrabold text-white font-mono">$0</div>
                <span className="text-[11px] text-dark-muted">Free forever</span>

                <ul className="space-y-3 text-xs text-slate-300 mt-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>All Trading Calculators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Up to 25 Journal Entries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>1 Trading Account</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Pre & Post-Trade Checklists</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-2.5 bg-dark-surface hover:bg-slate-800 text-white rounded-xl text-xs font-semibold border border-dark-border transition-colors"
              >
                Sign Up Free
              </button>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-dark-card to-dark-surface p-8 rounded-3xl border-2 border-blue-500 shadow-glow-blue space-y-6 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-md">
                MOST POPULAR
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Pro Trader</h3>
                <p className="text-xs text-dark-muted mt-1">For serious prop firm & full-time traders.</p>
                <div className="mt-4 text-3xl font-extrabold text-white font-mono">
                  $29 <span className="text-xs text-dark-muted font-normal">/ month</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Billed annually or monthly</span>

                <ul className="space-y-3 text-xs text-slate-200 mt-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Unlimited</strong> Trading Journal Entries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Multiple</strong> Trading Accounts (Topstep, FTMO)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Interactive Equity Curve & Heatmaps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Chart Screenshot Storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Daily Loss Guard & Warning System</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>CSV & Report Data Exporting</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
              >
                Start 14-Day Pro Trial
              </button>
            </div>

            {/* Elite */}
            <div className="bg-dark-card p-8 rounded-3xl border border-dark-border space-y-6 flex flex-col justify-between shadow-card-dark">
              <div>
                <h3 className="text-lg font-bold text-white">Elite Prop Desk</h3>
                <p className="text-xs text-dark-muted mt-1">Multi-account capital management & team review.</p>
                <div className="mt-4 text-3xl font-extrabold text-white font-mono">
                  $59 <span className="text-xs text-dark-muted font-normal">/ month</span>
                </div>
                <span className="text-[11px] text-dark-muted">For capital allocators</span>

                <ul className="space-y-3 text-xs text-slate-300 mt-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Everything in Pro Plan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Unlimited Trading Accounts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Comparative Strategy Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>AI Journal Assistant Insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Priority Support & API Access</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-2.5 bg-dark-surface hover:bg-slate-800 text-white rounded-xl text-xs font-semibold border border-dark-border transition-colors"
              >
                Contact Desk
              </button>
            </div>
          </div>
        </section>

        {/* FINANCIAL DISCLAIMER CALLOUT */}
        <section className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border text-xs text-dark-muted space-y-2">
            <div className="flex items-center justify-center gap-2 text-slate-300 font-semibold text-xs">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Mandatory Risk & Financial Disclaimer</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              This platform provides trading calculations, record-keeping and educational tools. It does not provide guaranteed investment returns or personalized financial advice. Trading financial markets involves significant risk, and users are responsible for their own trading decisions.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-dark-border bg-dark-surface py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs">
                  TK
                </span>
                <span className="text-base font-extrabold text-white font-mono">TradeKit</span>
              </div>
              <p className="text-xs text-dark-muted">
                Professional tools for disciplined traders worldwide.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-dark-muted">
              <button onClick={() => setLegalModal('about')} className="hover:text-white transition-colors">
                About TradeKit
              </button>
              <button onClick={() => onExploreTools()} className="hover:text-white transition-colors">
                Tools & Calculators
              </button>
              <button onClick={() => setLegalModal('disclaimer')} className="hover:text-white transition-colors">
                Financial Disclaimer
              </button>
              <button onClick={() => setLegalModal('terms')} className="hover:text-white transition-colors">
                Terms of Service
              </button>
              <button onClick={() => setLegalModal('privacy')} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-dark-border flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-dark-muted gap-2">
            <span>© {new Date().getFullYear()} TradeKit Inc. All rights reserved.</span>
            <span>Engineered with mathematical precision for high-frequency discipline.</span>
          </div>
        </div>
      </footer>

      {/* Legal & Info Modals */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-dark-border w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <h3 className="font-bold text-white text-base capitalize">
                {legalModal === 'disclaimer'
                  ? 'Financial Disclaimer'
                  : legalModal === 'terms'
                  ? 'Terms & Conditions'
                  : legalModal === 'privacy'
                  ? 'Privacy Policy'
                  : 'About TradeKit'}
              </h3>
              <button onClick={() => setLegalModal(null)} className="text-dark-muted hover:text-white text-xs">
                Close
              </button>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed max-h-72 overflow-y-auto space-y-2">
              {legalModal === 'disclaimer' && (
                <p>
                  TradeKit provides mathematical calculators, journal tracking, and self-evaluation utilities. Trading Forex, Futures, Cryptocurrencies, and Equities carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite.
                </p>
              )}
              {legalModal === 'privacy' && (
                <p>
                  At TradeKit, privacy is paramount. User records, trades, account balances, and journals are strictly client-isolated. One user's trading data will never be visible to any other user. We do not sell or monetize personal trading records.
                </p>
              )}
              {legalModal === 'terms' && (
                <p>
                  By using TradeKit, you acknowledge that you are responsible for your own execution and risk management. Trade calculations are verified mathematically but should be verified by the trader prior to order execution on broker terminals.
                </p>
              )}
              {legalModal === 'about' && (
                <p>
                  TradeKit was designed to elevate traders from emotional gamblers to disciplined systematic operators. By combining pre-trade checklists, mathematical position sizing, post-trade debriefs, and automated performance analytics into one intuitive command center, TradeKit helps you build lasting profitability.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
