import { Router } from 'express';
const router = Router();

router.get('/summary', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase.from('transactions')
      .select('id,type,amount,title,category,transaction_date,created_at')
      .order('transaction_date', { ascending: false });
    if (error) throw error;

    const income = data.filter(x => x.type === 'income').reduce((s, x) => s + Number(x.amount), 0);
    const expenses = data.filter(x => x.type === 'expense').reduce((s, x) => s + Number(x.amount), 0);
    res.json({
      summary: {
        income, expenses, balance: income - expenses,
        transactionCount: data.length,
        recentTransactions: data.slice(0, 6)
      }
    });
  } catch (e) { next(e); }
});

export default router;
