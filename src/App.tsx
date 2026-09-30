import React, { useState } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { CalculatorsHub } from './components/calculators/CalculatorsHub';
import { TradeJournal } from './components/journal/TradeJournal';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { TradingPlanHub } from './components/plan/TradingPlanHub';
import { MarketToolsHub } from './components/tools/MarketToolsHub';
import { AccountsHub } from './components/accounts/AccountsHub';
import { AdminAndSettingsHub } from './components/admin/AdminAndSettingsHub';
import { AuthModal } from './components/auth/AuthModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeTab, setActiveTab } = useTrading();

  // View state: 'app' (command center) or 'landing' (marketing/landing page)
  const [viewMode, setViewMode] = useState<'app' | 'landing'>('app');

  // Auth modal
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // If user navigates to landing or is not authenticated and wants landing
  if (viewMode === 'landing' || (!isAuthenticated && viewMode !== 'app')) {
    return (
      <>
        <LandingPage
          onStartTrading={() => {
            setViewMode('app');
            setActiveTab('dashboard');
          }}
          onExploreTools={() => {
            setViewMode('app');
            setActiveTab('calculator');
          }}
          onOpenAuth={openAuth}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
        />
      </>
    );
  }

  // Authenticated Command Center Workspace
  return (
    <>
      <AppLayout onOpenLanding={() => setViewMode('landing')}>
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'calculator' && <CalculatorsHub />}
        {activeTab === 'journal' && <TradeJournal />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'plan' && <TradingPlanHub />}
        {activeTab === 'tools' && <MarketToolsHub />}
        {activeTab === 'accounts' && <AccountsHub />}
        {activeTab === 'settings' && <AdminAndSettingsHub />}
      </AppLayout>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <TradingProvider>
      <AppContent />
    </TradingProvider>
  );
};

export default App;
