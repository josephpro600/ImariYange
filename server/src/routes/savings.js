
import { Router } from 'express';

const router = Router();

function validAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0;
}

// GET: Retrieve all savings goals and their contributions
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('savings_goals')
      .select(`
        *,
        savings_contributions (
          id,
          amount,
          note,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const goals = (data || []).map(goal => {
      const target = Number(goal.target_amount);
      const saved = Number(goal.saved_amount);

      return {
        ...goal,
        target_amount: target,
        saved_amount: saved,
        remaining: Math.max(target - saved, 0),
        percentage: target > 0
          ? Math.round((saved / target) * 100)
          : 0
      };
    });

    res.json({ goals });
  } catch (error) {
    next(error);
  }
});

// POST: Create a savings goal
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      description = '',
      target_amount,
      target_date = null
    } = req.body;

    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        message: 'A savings goal title is required.'
      });
    }

    if (!validAmount(target_amount)) {
      return res.status(400).json({
        message: 'Target amount must be greater than zero.'
      });
    }

    if (
      target_date !== null &&
      (typeof target_date !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(target_date) ||
        Number.isNaN(Date.parse(`${target_date}T00:00:00Z`)))
    ) {
      return res.status(400).json({
        message: 'Enter a valid target date.'
      });
    }

    const { data, error } = await req.supabase
      .from('savings_goals')
      .insert({
        user_id: req.user.id,
        title: title.trim(),
        description: String(description).trim(),
        target_amount: Number(target_amount),
        target_date
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ goal: data });
  } catch (error) {
    next(error);
  }
});

// PATCH: Edit a savings goal
router.patch('/:id', async (req, res, next) => {
  try {
    const { title, description, target_amount, target_date } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          message: 'Enter a valid goal title.'
        });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = String(description).trim();
    }

    if (target_amount !== undefined) {
      if (!validAmount(target_amount)) {
        return res.status(400).json({
          message: 'Target amount must be greater than zero.'
        });
      }
      updates.target_amount = Number(target_amount);
    }

    if (target_date !== undefined) {
      if (
        target_date !== null &&
        (typeof target_date !== 'string' ||
          !/^\d{4}-\d{2}-\d{2}$/.test(target_date) ||
          Number.isNaN(Date.parse(`${target_date}T00:00:00Z`)))
      ) {
        return res.status(400).json({
          message: 'Enter a valid target date.'
        });
      }
      updates.target_date = target_date;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'No changes were provided.'
      });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await req.supabase
      .from('savings_goals')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        message: 'Savings goal not found.'
      });
    }

    res.json({ goal: data });
  } catch (error) {
    next(error);
  }
});

// POST: Add a contribution to a savings goal
router.post('/:id/contributions', async (req, res, next) => {
  try {
    const { amount, note = '' } = req.body;

    if (!validAmount(amount)) {
      return res.status(400).json({
        message: 'Contribution must be greater than zero.'
      });
    }

    // Verify that the goal belongs to the authenticated user.
    const { data: goal, error: goalError } = await req.supabase
      .from('savings_goals')
      .select('id, target_amount, saved_amount')
      .eq('id', req.params.id)
      .maybeSingle();

    if (goalError) throw goalError;

    if (!goal) {
      return res.status(404).json({
        message: 'Savings goal not found.'
      });
    }

    // The database trigger updates saved_amount automatically.
    const { data: contribution, error } = await req.supabase
      .from('savings_contributions')
      .insert({
        goal_id: goal.id,
        user_id: req.user.id,
        amount: Number(amount),
        note: String(note).trim()
      })
      .select()
      .single();

    if (error) throw error;

    // Read the updated goal after the database trigger runs.
    const { data: updatedGoal, error: updatedError } = await req.supabase
      .from('savings_goals')
      .select('*')
      .eq('id', goal.id)
      .single();

    if (updatedError) throw updatedError;

    res.status(201).json({
      message: 'Savings contribution added successfully.',
      contribution,
      goal: {
        ...updatedGoal,
        target_amount: Number(updatedGoal.target_amount),
        saved_amount: Number(updatedGoal.saved_amount),
        remaining: Math.max(
          Number(updatedGoal.target_amount) -
          Number(updatedGoal.saved_amount),
          0
        ),
        percentage: Math.round(
          Number(updatedGoal.saved_amount) /
          Number(updatedGoal.target_amount) * 100
        )
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE: Delete a savings goal and its contribution history
router.delete('/:id', async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from('savings_goals')
      .delete()
      .eq('id', req.params.id)
      .select('id')
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        message: 'Savings goal not found.'
      });
    }

    res.json({
      success: true,
      message: 'Savings goal deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
