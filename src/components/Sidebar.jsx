import React from 'react';
import { LayoutDashboard, Receipt, PieChart, Moon, Sun } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export function Sidebar({ currentTab, setCurrentTab }) {
  const { theme, toggleTheme } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'transactions', label: 'Giao dịch', icon: Receipt },
    { id: 'reports', label: 'Báo cáo', icon: PieChart },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '0 var(--spacing-6) var(--spacing-6)' }}>
        <h1 className="h2" style={{ color: 'var(--primary)' }}>FinFamily</h1>
      </div>
      
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', padding: '0 var(--spacing-4)' }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)',
              padding: 'var(--spacing-3) var(--spacing-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: currentTab === item.id ? 'var(--primary-light)' : 'transparent',
              color: currentTab === item.id ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: currentTab === item.id ? '600' : '500',
              textAlign: 'left',
              transition: 'all var(--transition-fast)'
            }}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: 'var(--spacing-4) var(--spacing-6)' }}>
        <button 
          className="btn btn-outline w-full justify-center"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          {theme === 'light' ? 'Giao diện Tối' : 'Giao diện Sáng'}
        </button>
      </div>
    </aside>
  );
}
