import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Card, Badge } from '../components/ui/Components';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOTIVATIONAL_QUOTES = [
  "Hành trình vạn dặm bắt đầu từ một bước chân.",
  "Tiết kiệm không phải là cấm đoán, mà là lựa chọn sự tự do trong tương lai.",
  "Đừng tiết kiệm những gì còn lại sau khi chi tiêu, hãy chi tiêu những gì còn lại sau khi tiết kiệm. - Warren Buffett",
  "Sự giàu có thực sự là sống trọn vẹn từng khoảnh khắc.",
  "Kiểm soát dòng tiền, bạn sẽ kiểm soát được cuộc đời mình.",
  "Mỗi đồng tiền tiết kiệm được là một hạt giống cho sự thịnh vượng ngày mai.",
  "Đầu tư vào bản thân là khoản đầu tư sinh lời cao nhất.",
  "Thành công tài chính không đến từ may mắn, mà đến từ kỷ luật."
];

export default function Dashboard() {
  const [quote] = React.useState(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex];
  });
  const { getSummary, transactions } = useFinance();
  const { totalIncome, totalExpense, balance } = getSummary();

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const recentTransactions = transactions.slice(0, 5);

  const chartData = [
    { name: 'Thu nhập', amount: totalIncome, fill: 'var(--success)' },
    { name: 'Chi tiêu', amount: totalExpense, fill: 'var(--danger)' }
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="h1" style={{ marginBottom: 'var(--spacing-2)' }}>Tổng quan</h1>
      
      <div style={{ 
        padding: 'var(--spacing-3) var(--spacing-4)', 
        backgroundColor: 'var(--primary-light)', 
        borderRadius: 'var(--radius-md)', 
        marginBottom: 'var(--spacing-6)',
        color: 'var(--primary)',
        fontStyle: 'italic',
        fontWeight: '500',
        display: 'inline-block'
      }}>
        ✨ "{quote}"
      </div>
      
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: 'var(--spacing-8)' }}>
        <Card>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-2)' }}>
            <h3 className="h3 text-muted" style={{ margin: 0 }}>Tổng số dư</h3>
            <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{formatMoney(balance)}</p>
        </Card>

        <Card>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-2)' }}>
            <h3 className="h3 text-muted" style={{ margin: 0 }}>Tổng thu</h3>
            <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: 'var(--radius-md)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>{formatMoney(totalIncome)}</p>
        </Card>

        <Card>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-2)' }}>
            <h3 className="h3 text-muted" style={{ margin: 0 }}>Tổng chi</h3>
            <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)' }}>
              <TrendingDown size={20} />
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--danger)' }}>{formatMoney(totalExpense)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h2 className="h2">So sánh Thu/Chi</h2>
          <div style={{ height: '300px', marginTop: 'var(--spacing-4)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bg-tertiary)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => value.toLocaleString('vi-VN')} />
                <Tooltip cursor={{fill: 'var(--bg-tertiary)', opacity: 0.4}} formatter={(value) => formatMoney(value)} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-4)' }}>
            <h2 className="h2" style={{ margin: 0 }}>Giao dịch gần đây</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {recentTransactions.length > 0 ? recentTransactions.map(t => (
              <div key={t.id} className="flex justify-between items-center" style={{ paddingBottom: 'var(--spacing-4)', borderBottom: '1px solid var(--bg-tertiary)' }}>
                <div className="flex items-center gap-4">
                  <div style={{ 
                    padding: 'var(--spacing-3)', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: t.type === 'income' ? 'var(--success-bg)' : 'var(--danger-bg)',
                    color: t.type === 'income' ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{t.category}</p>
                    <p className="text-muted">{new Date(t.date).toLocaleDateString('vi-VN')} • {t.member}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '700', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                    {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-muted" style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>Chưa có giao dịch nào.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
