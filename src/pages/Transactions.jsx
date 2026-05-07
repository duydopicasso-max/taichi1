import React, { useState } from 'react';
import { useFinance, INCOME_CATEGORIES, EXPENSE_CATEGORIES, FAMILY_MEMBERS } from '../context/FinanceContext';
import { Card, Button, Badge, Modal } from '../components/ui/Components';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [member, setMember] = useState('Chung');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount)) return;
    
    addTransaction({
      type,
      amount: numericAmount,
      category,
      member,
      note,
      date: new Date(date).toISOString()
    });
    
    setIsModalOpen(false);
    setAmount('');
    setNote('');
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setAmount(rawValue);
  };

  const formattedAmount = amount ? new Intl.NumberFormat('vi-VN').format(amount) : '';

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-6)' }}>
        <h1 className="h1" style={{ margin: 0 }}>Giao dịch</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Thêm Giao dịch
        </Button>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: 'var(--spacing-3)' }}>Ngày</th>
                <th style={{ padding: 'var(--spacing-3)' }}>Loại</th>
                <th style={{ padding: 'var(--spacing-3)' }}>Danh mục</th>
                <th style={{ padding: 'var(--spacing-3)' }}>Thành viên</th>
                <th style={{ padding: 'var(--spacing-3)' }}>Ghi chú</th>
                <th style={{ padding: 'var(--spacing-3)', textAlign: 'right' }}>Số tiền</th>
                <th style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--bg-tertiary)', transition: 'background-color var(--transition-fast)' }}>
                  <td style={{ padding: 'var(--spacing-4) var(--spacing-3)', color: 'var(--text-primary)' }}>
                    {new Date(t.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ padding: 'var(--spacing-4) var(--spacing-3)' }}>
                    <Badge variant={t.type === 'income' ? 'success' : 'danger'}>
                      {t.type === 'income' ? 'Thu' : 'Chi'}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-4) var(--spacing-3)', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {t.category}
                  </td>
                  <td style={{ padding: 'var(--spacing-4) var(--spacing-3)', color: 'var(--text-primary)' }}>
                    <Badge variant="primary">{t.member}</Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-4) var(--spacing-3)', color: 'var(--text-secondary)' }}>
                    {t.note || '-'}
                  </td>
                  <td style={{ padding: 'var(--spacing-4) var(--spacing-3)', textAlign: 'right', fontWeight: '700', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                    {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                  </td>
                  <td style={{ padding: 'var(--spacing-4) var(--spacing-3)', textAlign: 'center' }}>
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', transition: 'color var(--transition-fast)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Chưa có giao dịch nào. Hãy thêm giao dịch mới!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm Giao dịch">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div 
              onClick={() => { setType('expense'); setCategory(EXPENSE_CATEGORIES[0]); }}
              style={{
                padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer',
                border: `2px solid ${type === 'expense' ? 'var(--danger)' : 'var(--bg-tertiary)'}`,
                backgroundColor: type === 'expense' ? 'var(--danger-bg)' : 'transparent',
                color: type === 'expense' ? 'var(--danger)' : 'var(--text-secondary)',
                fontWeight: '600', transition: 'all var(--transition-fast)'
              }}
            >
              Khoản Chi
            </div>
            <div 
              onClick={() => { setType('income'); setCategory(INCOME_CATEGORIES[0]); }}
              style={{
                padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer',
                border: `2px solid ${type === 'income' ? 'var(--success)' : 'var(--bg-tertiary)'}`,
                backgroundColor: type === 'income' ? 'var(--success-bg)' : 'transparent',
                color: type === 'income' ? 'var(--success)' : 'var(--text-secondary)',
                fontWeight: '600', transition: 'all var(--transition-fast)'
              }}
            >
              Khoản Thu
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Số tiền (VNĐ)</label>
            <input type="text" required className="input-field" value={formattedAmount} onChange={handleAmountChange} placeholder="0" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Danh mục</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
                {(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Thành viên</label>
              <select className="input-field" value={member} onChange={e => setMember(e.target.value)}>
                {FAMILY_MEMBERS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Ngày giao dịch</label>
              <input type="date" required className="input-field" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Ghi chú (Tùy chọn)</label>
            <input type="text" className="input-field" value={note} onChange={e => setNote(e.target.value)} placeholder="Mua đồ siêu thị..." />
          </div>

          <div className="flex justify-end gap-2" style={{ marginTop: 'var(--spacing-6)' }}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="submit" variant="primary">Lưu giao dịch</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
