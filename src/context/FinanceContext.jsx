import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

// Default categories
export const INCOME_CATEGORIES = ['Lương', 'Thưởng', 'Đầu tư', 'Khác'];
export const EXPENSE_CATEGORIES = ['Ăn uống', 'Di chuyển', 'Nhà ở', 'Mua sắm', 'Giải trí', 'Y tế', 'Giáo dục', 'Khác'];
export const FAMILY_MEMBERS = ['Chung', 'Chồng', 'Vợ', 'Con'];

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    if (saved) {
      return JSON.parse(saved);
    }
    // Mock data for initial empty state
    return [
      { id: '1', type: 'income', amount: 20000000, category: 'Lương', member: 'Chồng', date: new Date().toISOString(), note: 'Lương tháng này' },
      { id: '2', type: 'expense', amount: 500000, category: 'Ăn uống', member: 'Chung', date: new Date().toISOString(), note: 'Đi siêu thị' },
      { id: '3', type: 'expense', amount: 150000, category: 'Di chuyển', member: 'Vợ', date: new Date(Date.now() - 86400000).toISOString(), note: 'Đổ xăng' }
    ];
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addTransaction = (transaction) => {
    setTransactions(prev => [{
      ...transaction,
      id: Date.now().toString(),
      date: transaction.date || new Date().toISOString()
    }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  // Calculate summaries
  const getSummary = () => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  };

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getSummary,
    theme,
    toggleTheme
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
