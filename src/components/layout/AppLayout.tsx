import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  LayoutDashboard,
  Calculator,
  BookOpen,
  BarChart3,
  CheckSquare,
  Brain,
  Zap,
  Wallet,
  Settings,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Shield,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  onOpenLanding: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, onOpenLanding }) => {
  const {
    user,
    logout,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    accounts,
    activeAccount,
    setActiveAccount,
    metrics,
  } = useTrading();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculator', label: 'Trading Calculator', icon: Calculator },
    { id: 'journal', label: 'Trading Journal', icon: BookOpen },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'plan', label: 'Trading Plan & Rules', icon: CheckSquare },
    { id: 'tools', label: 'Market Intelligence', icon: Zap },
    { id: 'accounts', label: 'Accounts & Goals', icon: Wallet },
    { id: 'settings', label: 'Settings & Admin', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col md:flex-row">
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-card border-r border-dark-border select-none flex-shrink-0 min-h-screen sticky top-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-dark-border flex items-center justify-between">
          <div
            onClick={onOpenLanding}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <span className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 text-white shadow-glow-green group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white font-mono">
                Trade<span className="text-emerald-400">Kit</span>
              </span>
              <span className="block text-[10px] text-dark-muted font-medium">Trader Command Center</span>
            </div>
          </div>
        </div>

        {/* Account Selector Pill */}
        <div className="p-4 border-b border-dark-border">
          <div className="relative">
            <button
              onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
              className="w-full p-2.5 bg-dark-surface hover:bg-slate-800 rounded-xl border border-dark-border flex items-center justify-between text-left transition-all"
            >
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold text-dark-muted tracking-wider block">
                  Active Portfolio
                </span>
                <span className="text-xs font-bold text-white font-mono truncate block">
                  {activeAccount?.name || 'Main Account'}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  ${activeAccount?.currentBalance.toLocaleString()}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-dark-muted flex-shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {isAccountDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark-border rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-dark-muted px-2 py-1 block">
                  Switch Account
                </span>
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setActiveAccount(acc.id);
                      setIsAccountDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      activeAccount?.id === acc.id
                        ? 'bg-blue-600/20 text-blue-400 font-bold'
                        : 'text-slate-300 hover:bg-dark-surface'
                    }`}
                  >
                    <span className="truncate">{acc.name}</span>
                    <span className="font-mono text-[11px]">${acc.currentBalance.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-dark-muted hover:text-white hover:bg-dark-surface'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile */}
        <div className="p-3 border-t border-dark-border bg-dark-surface/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-dark-surface border border-dark-border">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase flex-shrink-0">
                {user?.name.slice(0, 2) || 'TK'}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{user?.name}</span>
                <span className="text-[10px] text-dark-muted font-mono">{user?.plan.toUpperCase()} Plan</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                title="Toggle Dark/Light Mode"
                className="p-1.5 text-dark-muted hover:text-white rounded-lg hover:bg-dark-card"
              >
                {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-dark-muted hover:text-red-400 rounded-lg hover:bg-dark-card"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR (DESKTOP & MOBILE) */}
        <header className="sticky top-0 z-30 bg-dark-card/90 backdrop-blur-md border-b border-dark-border px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-dark-muted hover:text-white rounded-lg hover:bg-dark-surface"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <span className="md:hidden font-mono font-bold text-white text-base">
              Trade<span className="text-emerald-400">Kit</span>
            </span>

            {/* Daily Risk pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-dark-surface border border-dark-border text-xs">
              <span className="text-dark-muted">Today's Risk:</span>
              <span
                className={`font-mono font-bold ${
                  metrics.isDailyLossLimitApproaching ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                ${metrics.dailyRiskUsed} / ${activeAccount?.dailyLossLimit}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Landing page link */}
            <button
              onClick={onOpenLanding}
              className="hidden lg:flex items-center gap-1.5 text-xs text-dark-muted hover:text-white"
            >
              <span>Landing Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Account Quick Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-dark-surface border border-dark-border text-xs font-mono">
              <span className="text-dark-muted hidden sm:inline">Balance:</span>
              <span className="text-white font-bold">${metrics.currentBalance.toLocaleString()}</span>
              <span
                className={`text-[11px] font-bold ${
                  metrics.todayPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                ({metrics.todayPnL >= 0 ? '+' : ''}${metrics.todayPnL.toFixed(0)})
              </span>
            </div>
          </div>
        </header>

        {/* MOBILE DRAWER */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-dark-card border-b border-dark-border p-4 space-y-2 z-40">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive ? 'bg-blue-600 text-white' : 'text-dark-muted hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-dark-border flex justify-between items-center text-xs">
              <button onClick={toggleTheme} className="text-dark-muted hover:text-white">
                Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </button>
              <button onClick={logout} className="text-red-400 font-semibold">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          {children}
        </main>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-card border-t border-dark-border flex items-center justify-around py-2 px-1">
          {[
            { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
            { id: 'calculator', label: 'Calc', icon: Calculator },
            { id: 'journal', label: 'Journal', icon: BookOpen },
            { id: 'analytics', label: 'Stats', icon: BarChart3 },
            { id: 'plan', label: 'Discipline', icon: CheckSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive ? 'text-blue-400 font-bold' : 'text-dark-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
