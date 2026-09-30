import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  Settings,
  Shield,
  Moon,
  Sun,
  Bell,
  Globe,
  Sliders,
  Database,
  Activity,
  Users,
  CheckCircle2,
  Save,
  Server,
  Terminal,
} from 'lucide-react';

export const AdminAndSettingsHub: React.FC = () => {
  const { user, theme, toggleTheme, activeAccount } = useTrading();

  const [activeTab, setActiveTab] = useState<'settings' | 'admin'>('settings');

  // Settings State
  const [userName, setUserName] = useState<string>(user?.name || 'Alex Rivera');
  const [currency, setCurrency] = useState<string>(user?.settings.currency || 'USD');
  const [timezone, setTimezone] = useState<string>(user?.settings.timezone || 'America/New_York (EST)');
  const [defaultRisk, setDefaultRisk] = useState<number>(user?.settings.defaultRiskPercentage || 1.0);
  const [defaultRR, setDefaultRR] = useState<number>(user?.settings.defaultRR || 2.5);
  const [notifications, setNotifications] = useState<boolean>(user?.settings.notifications ?? true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Settings & Admin</h1>
          </div>
          <p className="text-dark-muted text-sm mt-1">
            Configure global risk defaults, platform appearance, and monitor system-wide administrative telemetry.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-dark-card p-1 rounded-xl border border-dark-border">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings' ? 'bg-blue-600 text-white shadow-sm' : 'text-dark-muted hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>User Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-dark-muted hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Control Panel</span>
          </button>
        </div>
      </div>

      {/* USER PREFERENCES */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="max-w-3xl space-y-6">
          {saveSuccess && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Settings and calculator default preferences saved successfully!</span>
            </div>
          )}

          <div className="bg-dark-card p-6 rounded-2xl border border-dark-border space-y-5 shadow-card-dark">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>Calculator Defaults & Risk Configuration</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-dark-muted block mb-1 font-medium">Default Risk Per Trade (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={defaultRisk}
                  onChange={(e) => setDefaultRisk(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-dark-muted block mb-1 font-medium">Default Target R:R Ratio</label>
                <input
                  type="number"
                  step="0.1"
                  value={defaultRR}
                  onChange={(e) => setDefaultRR(parseFloat(e.target.value) || 0)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-dark-muted block mb-1 font-medium">Base Display Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="USDT">USDT - Tether</option>
                </select>
              </div>

              <div>
                <label className="text-dark-muted block mb-1 font-medium">Default Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-3 py-2 text-white"
                >
                  <option value="America/New_York (EST)">America/New_York (EST/EDT)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT/BST)</option>
                  <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-dark-card p-6 rounded-2xl border border-dark-border space-y-5 shadow-card-dark">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <span>Appearance & Notifications</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-dark-surface rounded-xl border border-dark-border">
                <div>
                  <span className="font-semibold text-white block">Theme Mode</span>
                  <span className="text-[11px] text-dark-muted">
                    Switch between terminal dark theme and daytime mode.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-white font-medium hover:bg-slate-800 transition-colors"
                >
                  {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                  <span className="capitalize">{theme} Mode</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-dark-surface rounded-xl border border-dark-border">
                <div>
                  <span className="font-semibold text-white block">Daily Discipline Notifications</span>
                  <span className="text-[11px] text-dark-muted">
                    Show audio/visual alerts when daily loss limit reaches 80%.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </form>
      )}

      {/* ADMIN CONTROL PANEL */}
      {activeTab === 'admin' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-amber-400 text-xs">
            <Shield className="w-5 h-5 flex-shrink-0" />
            <span>
              <strong>Administrative Telemetry:</strong> High-level system metrics, active database connection pools, and usage telemetry. Sensitive trading details of private accounts remain strictly encrypted.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-dark-card p-5 rounded-2xl border border-dark-border">
              <span className="text-xs text-dark-muted block">Total Registered Traders</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">14,820</div>
              <span className="text-[10px] text-emerald-400">+142 this week</span>
            </div>

            <div className="bg-dark-card p-5 rounded-2xl border border-dark-border">
              <span className="text-xs text-dark-muted block">Total Trades Journaled</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">68,490</div>
              <span className="text-[10px] text-blue-400">99.98% sync integrity</span>
            </div>

            <div className="bg-dark-card p-5 rounded-2xl border border-dark-border">
              <span className="text-xs text-dark-muted block">Database Latency</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">16ms</div>
              <span className="text-[10px] text-dark-muted">Global replica nodes</span>
            </div>

            <div className="bg-dark-card p-5 rounded-2xl border border-dark-border">
              <span className="text-xs text-dark-muted block">Server Status</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Operational</span>
              </div>
              <span className="text-[10px] text-dark-muted">Uptime: 99.99%</span>
            </div>
          </div>

          {/* System Logs */}
          <div className="bg-dark-card p-6 rounded-2xl border border-dark-border space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-dark-muted text-[11px] pb-2 border-b border-dark-border">
              <span className="flex items-center gap-1.5 text-white">
                <Terminal className="w-3.5 h-3.5 text-blue-400" /> System Event Stream
              </span>
              <span>Real-time Log</span>
            </div>

            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div>[2026-09-30 08:30:01 UTC] <span className="text-emerald-400">INFO</span>: Economic event ingested: US Core PCE Price Index MoM.</div>
              <div>[2026-09-30 08:35:12 UTC] <span className="text-blue-400">SYNC</span>: Binance WebSocket stream ticker connected (BTCUSDT, ETHUSDT).</div>
              <div>[2026-09-30 09:12:44 UTC] <span className="text-emerald-400">INFO</span>: Auto-drawdown calculation verified for user session.</div>
              <div>[2026-09-30 10:00:00 UTC] <span className="text-emerald-400">INFO</span>: London/New York session overlap began.</div>
              <div>[2026-09-30 10:15:30 UTC] <span className="text-slate-400">DEBUG</span>: Local database backup completed without anomalies.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
