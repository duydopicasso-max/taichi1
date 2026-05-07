import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Sidebar } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div className="main-layout">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="content-area">
        <div className="container" style={{ padding: 0 }}>
          {currentTab === 'dashboard' && <Dashboard />}
          {currentTab === 'transactions' && <Transactions />}
          {currentTab === 'reports' && <Reports />}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
