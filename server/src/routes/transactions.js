import { Router } from 'express';
const router = Router();

function validPayload(body, partial = false) {
  const allowed = ['type', 'title', 'category', 'amount', 'transaction_date', 'notes'];
  const payload = {};
  for (const key of allowed) if (body[key] !== undefined) payload[key] = body[key];

  if (!partial || payload.type !== undefined) {
    if (!['income', 'expense'].includes(payload.type)) return 'Type must be income or expense.';
  }
  if (!partial || payload.title !== undefined) {
    if (typeof payload.title !== 'string' || !payload.title.trim() || payload.title.trim().length > 120) return 'Enter a title (maximum 120 characters).';
    payload.title = payload.title.trim();
  }
  if (!partial || payload.amount !== undefined) {
    const amount = Number(payload.amount);
    if (!Number.isFinite(amount) || amount <= 0) return 'Amount must be greater than zero.';
    payload.amount = amount;
  }
  if (payload.category !== undefined && typeof payload.category !== 'string') return 'Invalid category.';
  if (payload.notes !== undefined && typeof payload.notes !== 'string') return 'Invalid notes.';
  if (payload.transaction_date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(payload.transaction_date)) return 'Date must use YYYY-MM-DD.';
  return payload;
}

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase.from('transactions')
      .select('*').order('transaction_date', { ascending: false }).order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ transactions: data });
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = validPayload(req.body);
    if (typeof payload === 'string') return res.status(400).json({ message: payload });
    const { data, error } = await req.supabase.from('transactions')
      .insert({ ...payload, user_id: req.user.id }).select().single();
    if (error) throw error;
    res.status(201).json({ transaction: data });
  } catch (e) { next(e); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const payload = validPayload(req.body, true);
    if (typeof payload === 'string') return res.status(400).json({ message: payload });
    if (!Object.keys(payload).length) return res.status(400).json({ message: 'No changes supplied.' });
    const { data, error } = await req.supabase.from('transactions')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', req.params.id).select().maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Transaction not found.' });
    res.json({ transaction: data });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase.from('transactions')
      .delete().eq('id', req.params.id).select('id').maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Transaction not found.' });
    res.json({ success: true });
  } catch (e) { next(e); }
});

export default router;
