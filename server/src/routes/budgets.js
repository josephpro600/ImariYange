
import { Router } from 'express';

const router = Router();

const validPeriods = ['weekly', 'monthly', 'yearly'];

function getPeriodRange(period, startDate) {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(start);

  if (period === 'weekly') {
    end.setUTCDate(end.getUTCDate() + 6);
  } else if (period === 'monthly') {
    end.setUTCMonth(end.getUTCMonth() + 1);
    end.setUTCDate(0);
  } else {
    end.setUTCFullYear(end.getUTCFullYear() + 1);
    end.setUTCDate(0);
  }

  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10)
  };
}

async function getBudgetWithSpending(supabase, budget) {
  const { from, to } = getPeriodRange(budget.period, budget.start_date);

  const { data, error } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'expense')
    .eq('category', budget.category)
    .gte('transaction_date', from)
    .lte('transaction_date', to);

  if (error) throw error;

  const spent = (data || []).reduce(
    (total, transaction) => total + Number(transaction.amount),
    0
  );

  const amount = Number(budget.amount);
  const remaining = amount - spent;

  return {
    ...budget,
    amount,
    spent,
    remaining,
    percentage: amount > 0
      ? Math.round((spent / amount) * 100)
      : 0,
    overBudget: spent > amount
  };
}

// GET: list budgets and calculate spending
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const budgets = await Promise.all(
      (data || []).map(budget =>
        getBudgetWithSpending(req.supabase, budget)
      )
    );

    res.json({ budgets });
  } catch (error) {
    next(error);
  }
});

// POST: create a budget
router.post('/', async (req, res, next) => {
  try {
    const { category, amount, period = 'monthly', start_date } = req.body;

    if (typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ message: 'Enter a budget category.' });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Budget amount must be greater than zero.' });
    }

    if (!validPeriods.includes(period)) {
      return res.status(400).json({ message: 'Invalid budget period.' });
    }

    const date = start_date || new Date().toISOString().slice(0, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Start date must use YYYY-MM-DD.' });
    }

    const { data, error } = await req.supabase
      .from('budgets')
      .insert({
        user_id: req.user.id,
        category: category.trim(),
        amount: numericAmount,
        period,
        start_date: date
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          message: 'A budget with this category, period and start date already exists.'
        });
      }
      throw error;
    }

    res.status(201).json({
      budget: await getBudgetWithSpending(req.supabase, data)
    });
  } catch (error) {
    next(error);
  }
});

// PATCH: update a budget
router.patch('/:id', async (req, res, next) => {
  try {
    const updates = {};
    const { category, amount, period, start_date } = req.body;

    if (category !== undefined) {
      if (typeof category !== 'string' || !category.trim()) {
        return res.status(400).json({ message: 'Enter a valid category.' });
      }
      updates.category = category.trim();
    }

    if (amount !== undefined) {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than zero.' });
      }
      updates.amount = numericAmount;
    }

    if (period !== undefined) {
      if (!validPeriods.includes(period)) {
        return res.status(400).json({ message: 'Invalid budget period.' });
      }
      updates.period = period;
    }

    if (start_date !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
        return res.status(400).json({ message: 'Invalid start date.' });
      }
      updates.start_date = start_date;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No changes supplied.' });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await req.supabase
      .from('budgets')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Budget not found.' });
    }

    res.json({
      budget: await getBudgetWithSpending(req.supabase, data)
    });
  } catch (error) {
    next(error);
  }
});

// DELETE: remove a budget
router.delete('/:id', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('budgets')
      .delete()
      .eq('id', req.params.id)
      .select('id')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Budget not found.' });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
