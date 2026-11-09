
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Plus, Trash2, Pencil, RefreshCw, Wallet } from 'lucide-react';

const money = value =>
  new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

const categories = [
  'Food',
  'Transport',
  'Housing',
  'Education',
  'Health',
  'Shopping',
  'Other'
];

export default function BudgetManager() {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadBudgets() {
    try {
      setLoading(true);
      const result = await api('/budgets');
      setBudgets(result.budgets || []);
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  async function createBudget(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage('');

      await api('/budgets', {
        method: 'POST',
        body: JSON.stringify({
          category,
          amount: Number(amount),
          period,
          start_date: startDate
        })
      });

      setAmount('');
      await loadBudgets();
      setMessage('Budget yabitswe neza.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function editBudget(budget) {
    const newAmount = window.prompt(
      'Andika amafaranga mashya y’ingengo y’imari (RWF):',
      String(budget.amount)
    );

    if (newAmount === null) return;

    const numericAmount = Number(newAmount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage('Andika umubare urenze zeru.');
      return;
    }

    try {
      setLoading(true);

      await api(`/budgets/${budget.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ amount: numericAmount })
      });

      await loadBudgets();
      setMessage('Budget yahinduwe neza.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteBudget(id) {
    if (!window.confirm('Urashaka gusiba iyi budget?')) return;

    try {
      setLoading(true);

      await api(`/budgets/${id}`, {
        method: 'DELETE'
      });

      await loadBudgets();
      setMessage('Budget yasibwe neza.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="budget-section">
      <div className="budget-header">
        <div>
          <span className="eyebrow">TEGURA AMAFARANGA YAWE</span>
          <h2>Ingengo y'imari (Budgets)</h2>
          <p>Shyiraho amafaranga ntarengwa uteganya gukoresha.</p>
        </div>

        <button
          className="outline"
          type="button"
          onClick={loadBudgets}
          disabled={loading}
        >
          <RefreshCw size={15} /> Kuvugurura
        </button>
      </div>

      {message && <div className="notice">{message}</div>}

      <div className="budget-layout">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Ongeramo budget</h2>
              <p>Hitamo icyiciro n'amafaranga uteganya.</p>
            </div>
          </div>

          <form className="transaction-form" onSubmit={createBudget}>
            <label>
              Icyiciro
              <select
                value={category}
                onChange={event => setCategory(event.target.value)}
              >
                {categories.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              Amafaranga (RWF)
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={event => setAmount(event.target.value)}
                placeholder="Urugero: 100000"
                required
              />
            </label>

            <label>
              Igihe
              <select
                value={period}
                onChange={event => setPeriod(event.target.value)}
              >
                <option value="weekly">Buri cyumweru</option>
                <option value="monthly">Buri kwezi</option>
                <option value="yearly">Buri mwaka</option>
              </select>
            </label>

            <label>
              Itariki yo gutangiriraho
              <input
                type="date"
                value={startDate}
                onChange={event => setStartDate(event.target.value)}
                required
              />
            </label>

            <button className="primary" type="submit" disabled={loading}>
              <Plus size={17} /> Bika budget
            </button>
          </form>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Budgets zawe</h2>
              <p>Reba ayo wakoresheje n'ayasigaye.</p>
            </div>
            <span className="count-pill">{budgets.length}</span>
          </div>

          {budgets.length === 0 ? (
            <div className="empty">
              <Wallet size={30} />
              <p>Nta budget urashyiraho. Koresha ifishi iri ibumoso.</p>
            </div>
          ) : (
            <div className="budget-list">
              {budgets.map(budget => {
                const progress = Math.min(budget.percentage, 100);

                return (
                  <div className="budget-card" key={budget.id}>
                    <div className="budget-card-top">
                      <div>
                        <strong>{budget.category}</strong>
                        <small>
                          {budget.period === 'weekly'
                            ? 'Buri cyumweru'
                            : budget.period === 'monthly'
                              ? 'Buri kwezi'
                              : 'Buri mwaka'}
                          {' · '}
                          {budget.start_date}
                        </small>
                      </div>

                      <div className="budget-actions">
                        <button
                          className="icon-btn"
                          type="button"
                          title="Hindura"
                          onClick={() => editBudget(budget)}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          className="icon-btn"
                          type="button"
                          title="Siba"
                          onClick={() => deleteBudget(budget.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="budget-numbers">
                      <span>
                        Byakoreshejwe: <b>{money(budget.spent)}</b>
                      </span>
                      <span>
                        Budget: <b>{money(budget.amount)}</b>
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className={`progress-fill ${
                          budget.overBudget ? 'over-budget' : ''
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="budget-footer">
                      <span>{budget.percentage}% byakoreshejwe</span>
                      <strong className={budget.overBudget ? 'negative' : 'positive'}>
                        {budget.overBudget
                          ? `Warengejeho ${money(Math.abs(budget.remaining))}`
                          : `Hasigaye ${money(budget.remaining)}`}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
