
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const formatMoney = value =>
  new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

const initialForm = {
  title: '',
  description: '',
  target_amount: '',
  target_date: ''
};

export default function SavingsManager() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadGoals() {
    try {
      setLoading(true);
      setError('');

      const result = await api('/savings');
      setGoals(result.goals || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGoals();
  }, []);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm(previous => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const amount = Number(form.target_amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Amafaranga agomba kuba arenga zeru.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        target_amount: amount,
        target_date: form.target_date || null
      };

      if (editingId) {
        await api(`/savings/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        setMessage('Intego yo kuzigama yahinduwe neza.');
      } else {
        await api('/savings', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setMessage('Intego nshya yo kuzigama yabitswe neza.');
      }

      setForm(initialForm);
      setEditingId(null);
      await loadGoals();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEditing(goal) {
    setEditingId(goal.id);
    setForm({
      title: goal.title,
      description: goal.description || '',
      target_amount: String(goal.target_amount),
      target_date: goal.target_date || ''
    });

    setMessage('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(initialForm);
    setError('');
  }

  async function deleteGoal(goal) {
    const confirmed = window.confirm(
      `Urashaka gusiba intego ya "${goal.title}" n'amateka yayo yose yo kuzigama?`
    );

    if (!confirmed) return;

    try {
      setError('');
      setMessage('');

      await api(`/savings/${goal.id}`, {
        method: 'DELETE'
      });

      setMessage('Intego yasibwe neza.');
      await loadGoals();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addContribution(goal) {
    const enteredAmount = window.prompt(
      `Andika amafaranga ushaka kongera kuri "${goal.title}" (RWF):`
    );

    if (enteredAmount === null) return;

    const amount = Number(enteredAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Andika amafaranga arenga zeru.');
      return;
    }

    const note = window.prompt('Ibisobanuro (ntabwo ari ngombwa):') || '';

    try {
      setError('');
      setMessage('');

      await api(`/savings/${goal.id}/contributions`, {
        method: 'POST',
        body: JSON.stringify({
          amount,
          note
        })
      });

      setMessage('Amafaranga yo kuzigama yongeweho neza.');
      await loadGoals();
    } catch (err) {
      setError(err.message);
    }
  }

  const totalTarget = goals.reduce(
    (sum, goal) => sum + Number(goal.target_amount || 0), 0
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + Number(goal.saved_amount || 0), 0
  );

  const completedGoals = goals.filter(
    goal => goal.status === 'completed'
  ).length;

  const activeGoals = goals.length - completedGoals;

  return (
    <section className="savings-section">
      <div className="savings-header">
        <div>
          <span className="savings-eyebrow">IMARIWISE / KUZIGAMA</span>
          <h2>Intego zo Kuzigama</h2>
          <p>Shyiraho intego kandi ukurikirane iterambere ryawe.</p>
        </div>

        <button
          type="button"
          className="savings-refresh"
          onClick={loadGoals}
          disabled={loading}
        >
          ↻ Kuvugurura
        </button>
      </div>

      {message && (
        <div className="savings-message success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="savings-message error-message">
          {error}
        </div>
      )}

      <div className="savings-summary">
        <article className="savings-stat">
          <span>Intego zose</span>
          <strong>{goals.length}</strong>
          <small>Intego zo kuzigama</small>
        </article>

        <article className="savings-stat">
          <span>Amafaranga wazigamye</span>
          <strong>{formatMoney(totalSaved)}</strong>
          <small>Amafaranga yose amaze kuzigamwa</small>
        </article>

        <article className="savings-stat">
          <span>Intego zisigaye</span>
          <strong>{activeGoals}</strong>
          <small>Intego zikiri gukorwa</small>
        </article>

        <article className="savings-stat">
          <span>Intego zuzuye</span>
          <strong>{completedGoals}</strong>
          <small>Intego wagezeho</small>
        </article>
      </div>

      <div className="savings-layout">
        <article className="savings-panel">
          <div className="savings-panel-heading">
            <h3>
              {editingId ? 'Hindura intego' : 'Ongeramo intego nshya'}
            </h3>
            <p>Uzuza amakuru y'intego yawe.</p>
          </div>

          <form onSubmit={handleSubmit} className="savings-form">
            <label>
              Izina ry'intego
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={updateForm}
                placeholder="Urugero: Kugura mudasobwa"
                required
                maxLength={120}
              />
            </label>

            <label>
              Ibisobanuro
              <textarea
                name="description"
                value={form.description}
                onChange={updateForm}
                placeholder="Andika ibisobanuro by'intego..."
                rows={3}
              />
            </label>

            <label>
              Amafaranga uteganya kuzigama (RWF)
              <input
                type="number"
                name="target_amount"
                value={form.target_amount}
                onChange={updateForm}
                min="1"
                step="0.01"
                placeholder="500000"
                required
              />
            </label>

            <label>
              Itariki yo kugeraho
              <input
                type="date"
                name="target_date"
                value={form.target_date}
                onChange={updateForm}
              />
            </label>

            <button
              type="submit"
              className="savings-submit"
              disabled={saving}
            >
              {saving
                ? 'Birimo kubikwa...'
                : editingId
                  ? 'Bika impinduka'
                  : '+ Bika intego'}
            </button>

            {editingId && (
              <button
                type="button"
                className="savings-cancel"
                onClick={cancelEditing}
              >
                Reka guhindura
              </button>
            )}
          </form>
        </article>

        <article className="savings-panel savings-goals-panel">
          <div className="savings-panel-heading">
            <div>
              <h3>Intego zawe</h3>
              <p>Kurikirana amafaranga umaze kuzigama.</p>
            </div>
            <span className="savings-count">{goals.length}</span>
          </div>

          {loading && goals.length === 0 ? (
            <div className="savings-empty">Birimo gutegurwa...</div>
          ) : goals.length === 0 ? (
            <div className="savings-empty">
              <div className="savings-empty-icon">◎</div>
              <strong>Nta ntego urashyiraho</strong>
              <p>Ongeramo intego yawe ya mbere yo kuzigama.</p>
            </div>
          ) : (
            <div className="savings-goal-list">
              {goals.map(goal => {
                const percentage = Math.min(
                  Number(goal.percentage || 0),
                  100
                );

                const completed = goal.status === 'completed';

                return (
                  <div className="savings-goal-card" key={goal.id}>
                    <div className="savings-goal-top">
                      <div>
                        <h4>{goal.title}</h4>
                        <p>{goal.description || 'Intego yo kuzigama'}</p>
                      </div>

                      <span className={`savings-status ${completed ? 'completed' : ''}`}>
                        {completed ? 'Yarangiye' : 'Irakomeje'}
                      </span>
                    </div>

                    <div className="savings-progress-numbers">
                      <strong>{formatMoney(goal.saved_amount)}</strong>
                      <span>kuri {formatMoney(goal.target_amount)}</span>
                    </div>

                    <div className="savings-progress-track">
                      <div
                        className="savings-progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="savings-progress-bottom">
                      <span>{percentage}% byagezweho</span>
                      <strong>
                        Hasigaye {formatMoney(goal.remaining)}
                      </strong>
                    </div>

                    {goal.target_date && (
                      <p className="savings-target-date">
                        Itariki ntarengwa: {goal.target_date}
                      </p>
                    )}

                    <div className="savings-goal-actions">
                      {!completed && (
                        <button
                          type="button"
                          className="savings-add-money"
                          onClick={() => addContribution(goal)}
                        >
                          + Ongeraho amafaranga
                        </button>
                      )}

                      <button
                        type="button"
                        className="savings-edit"
                        onClick={() => startEditing(goal)}
                      >
                        Hindura
                      </button>

                      <button
                        type="button"
                        className="savings-delete"
                        onClick={() => deleteGoal(goal)}
                      >
                        Siba
                      </button>
                    </div>

                    {goal.savings_contributions?.length > 0 && (
                      <details className="savings-history">
                        <summary>
                          Amateka yo kuzigama (
                          {goal.savings_contributions.length})
                        </summary>

                        {goal.savings_contributions.map(item => (
                          <div
                            className="savings-history-item"
                            key={item.id}
                          >
                            <span>{item.note || 'Amafaranga yo kuzigama'}</span>
                            <strong>{formatMoney(item.amount)}</strong>
                          </div>
                        ))}
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>

      <div className="savings-total-footer">
        Amafaranga uteganya kuzigama yose: <strong>{formatMoney(totalTarget)}</strong>
      </div>
    </section>
  );
}
