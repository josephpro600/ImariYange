import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requireAuth } from './middleware/auth.js';
import transactionsRouter from './routes/transactions.js';
import dashboardRouter from './routes/dashboard.js';
import budgetsRouter from './routes/budgets.js';
import savingsRouter from './routes/savings.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'ImariWise API is running.' }));
app.use('/api/transactions', requireAuth, transactionsRouter);
app.use('/api/dashboard', requireAuth, dashboardRouter);
app.use('/api/budgets', requireAuth, budgetsRouter);
app.use('/api/savings', requireAuth, savingsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error. Check the backend terminal for details.' });
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`ImariWise API listening on http://localhost:${port}`));
