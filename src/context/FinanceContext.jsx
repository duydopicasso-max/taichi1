import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, updateDoc } from 'firebase/firestore';

const FinanceContext = createContext();

// Default categories
export const INCOME_CATEGORIES = ['Lương', 'Thưởng', 'Đầu tư', 'Khác'];
export const EXPENSE_CATEGORIES = ['Ăn uống', 'Di chuyển', 'Nhà ở', 'Mua sắm', 'Giải trí', 'Y tế', 'Giáo dục', 'Khác'];
export const FAMILY_MEMBERS = ['Chung', 'Chồng', 'Vợ', 'Con'];

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Fetch data from Firebase
  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching data from Firebase:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Theme effect
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

  const addTransaction = async (transaction) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        date: transaction.date || new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, 'transactions', id), updatedData);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
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
    isLoading,
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
