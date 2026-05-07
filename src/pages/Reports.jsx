import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card } from '../components/ui/Components';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Reports() {
  const { transactions } = useFinance();

  // Calculate expenses by category
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  // Calculate incomes by category
  const incomeData = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  // Calculate transactions by family member
  const memberData = transactions
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.member);
      if (existing) {
        if (t.type === 'expense') existing.expense += t.amount;
        if (t.type === 'income') existing.income += t.amount;
      } else {
        acc.push({ 
          name: t.member, 
          expense: t.type === 'expense' ? t.amount : 0,
          income: t.type === 'income' ? t.amount : 0
        });
      }
      return acc;
    }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="h1" style={{ marginBottom: 'var(--spacing-6)' }}>Báo cáo Phân tích</h1>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h2 className="h2">Cơ cấu chi tiêu theo danh mục</h2>
          {expenseData.length > 0 ? (
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatMoney(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted" style={{ textAlign: 'center', marginTop: 'var(--spacing-8)' }}>Chưa có dữ liệu chi tiêu.</p>
          )}
        </Card>

        <Card>
          <h2 className="h2">Cơ cấu thu nhập theo danh mục</h2>
          {incomeData.length > 0 ? (
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatMoney(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted" style={{ textAlign: 'center', marginTop: 'var(--spacing-8)' }}>Chưa có dữ liệu thu nhập.</p>
          )}
        </Card>

        <Card className="col-span-2" style={{ gridColumn: '1 / -1' }}>
          <h2 className="h2">Thống kê theo Thành viên</h2>
          <div className="flex flex-col gap-4" style={{ marginTop: 'var(--spacing-6)' }}>
            {memberData.map((m, idx) => (
              <div key={idx} style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-2)' }}>
                  <h3 className="h3" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    {m.name}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted">Tổng chi</p>
                    <p style={{ fontWeight: '600', color: 'var(--danger)' }}>{formatMoney(m.expense)}</p>
                  </div>
                  <div>
                    <p className="text-muted">Tổng thu</p>
                    <p style={{ fontWeight: '600', color: 'var(--success)' }}>{formatMoney(m.income)}</p>
                  </div>
                </div>
              </div>
            ))}
            {memberData.length === 0 && (
              <p className="text-muted" style={{ textAlign: 'center' }}>Chưa có dữ liệu.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
