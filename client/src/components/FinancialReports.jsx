
import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const money = value =>
  new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

const today = new Date();

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getDateRange(period) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (period === '7d') start.setDate(start.getDate() - 6);
  if (period === '30d') start.setDate(start.getDate() - 29);
  if (period === '90d') start.setDate(start.getDate() - 89);
  if (period === '12m') start.setMonth(start.getMonth() - 11, 1);

  return { start, end };
}

export default function FinancialReports() {
  const [transactions, setTransactions] = useState([]);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadReports() {
    try {
      setLoading(true);
      setError('');

      const result = await api('/transactions');
      setTransactions(result.transactions || []);
    } catch (err) {
      setError(err.message || 'Ntibyashobotse kubona raporo.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const filtered = useMemo(() => {
    if (period === 'all') return transactions;

    const { start, end } = getDateRange(period);

    return transactions.filter(item => {
      const date = new Date(`${item.transaction_date}T12:00:00`);
      return !Number.isNaN(date.getTime()) &&
        date >= start && date <= end;
    });
  }, [transactions, period]);

  const report = useMemo(() => {
    const income = filtered
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const expenses = filtered
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const balance = income - expenses;
    const savingsRate = income > 0
      ? Math.max(0, (balance / income) * 100)
      : 0;

    const categories = {};

    filtered
      .filter(item => item.type === 'expense')
      .forEach(item => {
        const name = item.category || 'Other';
        categories[name] = (categories[name] || 0) + Number(item.amount || 0);
      });

    const categoryList = Object.entries(categories)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    const months = {};

    filtered.forEach(item => {
      const date = new Date(`${item.transaction_date}T12:00:00`);
      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!months[key]) {
        months[key] = { key, income: 0, expenses: 0 };
      }

      if (item.type === 'income') {
        months[key].income += Number(item.amount || 0);
      } else if (item.type === 'expense') {
        months[key].expenses += Number(item.amount || 0);
      }
    });

    const monthly = Object.values(months).sort((a, b) =>
      a.key.localeCompare(b.key)
    );

    return {
      income,
      expenses,
      balance,
      savingsRate,
      categoryList,
      monthly,
      count: filtered.length
    };
  }, [filtered]);

  const maxCategory = Math.max(
    ...report.categoryList.map(item => item.amount),
    1
  );

  const maxMonthly = Math.max(
    ...report.monthly.flatMap(item => [item.income, item.expenses]),
    1
  );

  const formatMonth = key => {
    const [year, month] = key.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('rw-RW', {
      month: 'short',
      year: '2-digit'
    });
  };

  const periodLabel = {
    '7d': 'Iminsi 7 ishize',
    '30d': 'Iminsi 30 ishize',
    '90d': 'Iminsi 90 ishize',
    '12m': 'Amezi 12 ashize',
    all: 'Ibihe byose'
  };

  return (
    <section className="reports-section">
      <div className="reports-header">
        <div>
          <span className="reports-eyebrow">IMARIWISE / RAPORO</span>
          <h2>Raporo z'imari</h2>
          <p>Menya uko winjiza kandi ukoresha amafaranga yawe.</p>
        </div>

        <div className="reports-controls">
          <select
            value={period}
            onChange={event => setPeriod(event.target.value)}
            aria-label="Hitamo igihe cya raporo"
          >
            <option value="7d">Iminsi 7 ishize</option>
            <option value="30d">Iminsi 30 ishize</option>
            <option value="90d">Iminsi 90 ishize</option>
            <option value="12m">Amezi 12 ashize</option>
            <option value="all">Ibihe byose</option>
          </select>

          <button
            type="button"
            onClick={loadReports}
            disabled={loading}
          >
            ↻ Kuvugurura
          </button>
        </div>
      </div>

      {error && <div className="reports-error">{error}</div>}

      {loading ? (
        <div className="reports-empty">Turimo gutegura raporo...</div>
      ) : (
        <>
          <div className="reports-period">
            Raporo: <strong>{periodLabel[period]}</strong>
            <span>{report.count} transactions</span>
          </div>

          <div className="reports-summary">
            <article className="report-stat">
              <span>Amafaranga yinjiye</span>
              <strong className="report-green">{money(report.income)}</strong>
              <small>Igiteranyo cy'ibyinjijwe</small>
            </article>

            <article className="report-stat">
              <span>Amafaranga yakoreshejwe</span>
              <strong className="report-red">{money(report.expenses)}</strong>
              <small>Igiteranyo cy'ibyakoreshwe</small>
            </article>

            <article className="report-stat">
              <span>Asigaye</span>
              <strong className={report.balance >= 0 ? 'report-green' : 'report-red'}>
                {money(report.balance)}
              </strong>
              <small>Ayinjijwe ukuyemo ayakoreshejwe</small>
            </article>

            <article className="report-stat">
              <span>Igipimo cy'amafaranga asigaye</span>
              <strong className="report-green">
                {report.savingsRate.toFixed(1)}%
              </strong>
              <small>Ugereranyije n'ayo winjije</small>
            </article>
          </div>

          <div className="reports-grid">
            <article className="report-panel">
              <div className="report-panel-heading">
                <div>
                  <h3>Incamake y'ibyinjira n'ibisohoka</h3>
                  <p>Ugereranye amafaranga buri kwezi.</p>
                </div>
              </div>

              <div className="report-legend">
                <span><i className="legend-income" /> Ayinjiye</span>
                <span><i className="legend-expense" /> Ayakoreshejwe</span>
              </div>

              {report.monthly.length === 0 ? (
                <div className="reports-empty">Nta makuru ahari muri iki gihe.</div>
              ) : (
                <div className="monthly-chart">
                  {report.monthly.map(month => (
                    <div className="monthly-column" key={month.key}>
                      <div className="monthly-bars">
                        <div
                          className="monthly-bar income-bar"
                          style={{
                            height: `${Math.max(month.income / maxMonthly * 100, month.income ? 2 : 0)}%`
                          }}
                          title={`Ayinjiye: ${money(month.income)}`}
                        />
                        <div
                          className="monthly-bar expense-bar"
                          style={{
                            height: `${Math.max(month.expenses / maxMonthly * 100, month.expenses ? 2 : 0)}%`
                          }}
                          title={`Ayakoreshejwe: ${money(month.expenses)}`}
                        />
                      </div>
                      <span>{formatMonth(month.key)}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="report-panel">
              <div className="report-panel-heading">
                <div>
                  <h3>Imikoreshereze y'amafaranga</h3>
                  <p>Ukoresha angahe kuri buri cyiciro?</p>
                </div>
              </div>

              {report.categoryList.length === 0 ? (
                <div className="reports-empty">Nta mafaranga yakoreshejwe muri iki gihe.</div>
              ) : (
                <div className="category-chart">
                  {report.categoryList.map(item => (
                    <div className="category-item" key={item.name}>
                      <div className="category-info">
                        <strong>{item.name}</strong>
                        <span>{money(item.amount)}</span>
                      </div>
                      <div className="category-track">
                        <div
                          className="category-fill"
                          style={{
                            width: `${item.amount / maxCategory * 100}%`
                          }}
                        />
                      </div>
                      <small>
                        {report.expenses > 0
                          ? `${(item.amount / report.expenses * 100).toFixed(1)}%`
                          : '0%'}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>

          <article className="report-panel report-analysis">
            <h3>Isesengura ry'imari yawe</h3>

            {report.income === 0 && report.expenses === 0 ? (
              <p>Ongeramo amafaranga winjije cyangwa wakoresheje kugira ngo ubone isesengura.</p>
            ) : report.balance < 0 ? (
              <p className="analysis-warning">
                Icyitonderwa: Wakoresheje amafaranga arenze ayo winjije.
                Ongera usuzume ingengo y'imari yawe.
              </p>
            ) : report.savingsRate < 10 ? (
              <p className="analysis-warning">
                Amafaranga asigara ni make ugereranyije n'ayo winjije.
                Gerageza kugabanya amafaranga ukoresha.
              </p>
            ) : (
              <p className="analysis-positive">
                Ni byiza! Amafaranga asigaye arerekana ko uri kugenzura neza
                imikoreshereze y'imari yawe. Komeza uteganye kandi uzigame.
              </p>
            )}

            {report.categoryList[0] && (
              <p>
                Icyiciro cyakoreshejweho menshi ni{' '}
                <strong>{report.categoryList[0].name}</strong>, kingana na{' '}
                <strong>{money(report.categoryList[0].amount)}</strong>.
              </p>
            )}

            <small>
              Iri sesengura rishingiye ku transactions zabitswe muri Supabase
              muri {periodLabel[period].toLowerCase()}.
            </small>
          </article>
        </>
      )}
    </section>
  );
}
