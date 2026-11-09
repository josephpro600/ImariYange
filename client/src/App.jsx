import { useLanguage } from './i18n/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { api } from './lib/api';
import {
  Wallet, TrendingUp, TrendingDown, LogOut, Plus, Trash2,
  RefreshCw, ShieldCheck, LayoutDashboard, ArrowDownCircle,
  ArrowUpCircle, PiggyBank, BarChart3, Settings, Menu, X,
  Bot, Send, Sparkles
} from 'lucide-react';

import BudgetManager from './components/BudgetManager';
import SavingsManager from './components/SavingsManager';
import FinancialReports from './components/FinancialReports';
import LandingPage from './components/LandingPage';
import './landing.css';


const translations = {
  rw: {
    dashboard: 'Incamake',
    income: 'Amafaranga yinjiye',
    expenses: 'Amafaranga yakoreshejwe',
    budgets: "Ingengo y'imari",
    savings: 'Kuzigama',
    reports: 'Raporo z’imari',
    settings: 'Amagenamiterere',
    dashboardTitle: "Incamake y'imari",
    menu: 'MENU NKURU',
    refresh: 'Vugurura',
    logout: 'Sohoka',
    balance: 'AMAFARANGA ASIGAYE',
    incomeTotal: 'AYINJIYE',
    expensesTotal: 'AYAKORESHEJWE',
    balanceHint: 'Winjije ukuyemo ayo wakoresheje',
    incomeHint: "Igiteranyo cy'amafaranga winjije",
    expensesHint: "Igiteranyo cy'amafaranga wakoresheje",
    addIncome: 'Ongeramo amafaranga winjije',
    addExpense: 'Ongeramo amafaranga wakoresheje',
    addTransaction: 'Ongeramo amafaranga',
    addHint: 'Andika ayo winjije cyangwa wakoresheje.',
    incomeType: 'Amafaranga yinjiye',
    expenseType: 'Amafaranga yakoreshejwe',
    title: 'Izina / Icyo ukoresheje',
    amount: 'Umubare (RWF)',
    category: 'Icyiciro',
    date: 'Itariki',
    save: 'Bika amakuru',
    wait: 'Tegereza...',
    recent: 'Ibikorwa biheruka',
    stored: 'Amakuru abitswe muri Supabase.',
    noData: 'Nta makuru arajya abikwa. Ongeramo ayo winjije cyangwa wakoresheje.',
    incomeExample: 'Urugero: Umushahara',
    expenseExample: 'Urugero: Ibiribwa',
    accountInfo: 'Amakuru ya konti yawe',
    accountInfoHint: "Reba amakuru y'umukoresha.",
    protected: 'Konti yawe irinzwe na Supabase Authentication.',
    accountStatus: 'Imiterere ya konti',
    open: 'Ifunguye',
    email: 'Email',
    language: 'Ururimi',
    chooseLanguage: 'Hitamo ururimi ukoresha muri ImariWise.',
    languageSaved: 'Ururimi wahisemo ruzibukwa muri iyi browser.',
    user: 'Umukoresha',
    loading: 'ImariWise irimo gufunguka...',
    deleteConfirm: 'Urashaka gusiba iyi transaction?',
    deleted: 'Transaction yasibwe neza.',
    saved: 'Amakuru yabitswe neza.',
    login: 'Injira',
    register: 'Iyandikishe',
    backHome: '← Subira ku ntangiriro',
    loginWelcome: 'MURAKAZA NEZA',
    registerWelcome: 'TANGIRA NONAHA',
    loginTitle: 'Injira muri konti yawe',
    registerTitle: 'Fungura konti yawe',
    authHint: 'Koresha email yawe kugira ngo ukomeze.',
    fullName: 'Amazina yose',
    yourName: 'Amazina yawe',
    password: "Ijambo ry'ibanga",
    passwordHint: 'Nibura inyuguti 6',
    noAccount: 'Nta konti ufite?',
    haveAccount: 'Usanzwe ufite konti?',
    security: 'Amakuru yawe ararinzwe kandi agenewe konti yawe gusa.',
    heroEyebrow: "UBWENGE MU MICUNGIRE Y'AMAFARANGA",
    heroTitle: 'Menya aho amafaranga yawe ajya. Teganya ejo hawe.',
    heroText: "Kurikirana ibyo winjiza, ibyo ukoresha n'amafaranga usigarana.",
    sideEyebrow: 'IMARI YAWE, MU BIGANZA BYAWE',
    delete: 'Siba',
    assistant: 'Umufasha wa ImariWise',
    assistantIntro: 'Muraho! Ndi umufasha wa ImariWise. Nakwereka uko ukoresha iyi system.',
    assistantPlaceholder: 'Andika ikibazo...',
    send: 'Ohereza',
    assistantHelp: 'Nshobora kugufasha kuri dashboard, amafaranga winjiza, ayo ukoresha, ingengo y’imari, kuzigama na raporo.',
    aDashboard: 'Dashboard ikwereka amafaranga winjije, ayo wakoresheje n’asigaye. Injiza amakuru mashya ukoresheje ifishi iri kuri dashboard.',
    aIncome: 'Hitamo Amafaranga yinjiye, wandike izina, umubare, icyiciro n’itariki, hanyuma ukande Bika amakuru.',
    aExpenses: 'Hitamo Amafaranga yakoreshejwe, wandike icyo wishyuye, umubare, icyiciro n’itariki, hanyuma ubike.',
    aBudgets: 'Fungura Ingengo y’imari kugira ngo uteganye amafaranga uzakoreshwa mu byiciro bitandukanye.',
    aSavings: 'Fungura Kuzigama kugira ngo ushyireho intego yo kuzigama kandi ukurikirane aho ugeze.',
    aReports: 'Fungura Raporo z’imari kugira ngo urebe ishusho y’imikoreshereze y’amafaranga yawe.',
    aAdvice: 'Gerageza kugereranya amafaranga winjiza n’ayo ukoresha. Banza ushyire imbere ibyo ukeneye kandi uzigame buri gihe.',
    aNoIncome: 'Nta mafaranga winjije agaragara. Banza wandike amafaranga winjiza kugira ngo ubashe kubona isesengura.',
    aHigh: 'Icyitonderwa: amafaranga ukoresha arenga 80% y’ayo winjiza. Ongera urebe ibyiciro ushobora kugabanyaho amafaranga.',
    aGood: 'Ni byiza. Komeza ukurikirane amafaranga winjiza n’ayo ukoresha, kandi ukomeze kuzigama.',
    unknown: 'Sinabyumvise neza. Baza kuri dashboard, amafaranga winjiza, ayo ukoresha, ingengo y’imari, kuzigama cyangwa raporo.',
    footer: "Micungire myiza y'amafaranga."
  },

  en: {
    dashboard: 'Dashboard',
    income: 'Income',
    expenses: 'Expenses',
    budgets: 'Budgets',
    savings: 'Savings',
    reports: 'Reports',
    settings: 'Settings',
    dashboardTitle: 'Financial overview',
    menu: 'MAIN MENU',
    refresh: 'Refresh',
    logout: 'Log out',
    balance: 'AVAILABLE BALANCE',
    incomeTotal: 'TOTAL INCOME',
    expensesTotal: 'TOTAL EXPENSES',
    balanceHint: 'Income minus expenses',
    incomeHint: 'Total money received',
    expensesHint: 'Total money spent',
    addIncome: 'Add income',
    addExpense: 'Add expense',
    addTransaction: 'Add a transaction',
    addHint: 'Enter money received or spent.',
    incomeType: 'Income',
    expenseType: 'Expense',
    title: 'Name / Description',
    amount: 'Amount (RWF)',
    category: 'Category',
    date: 'Date',
    save: 'Save transaction',
    wait: 'Please wait...',
    recent: 'Recent transactions',
    stored: 'Data is stored in Supabase.',
    noData: 'No transactions yet. Add income or an expense to get started.',
    incomeExample: 'Example: Salary',
    expenseExample: 'Example: Food',
    accountInfo: 'Account information',
    accountInfoHint: 'View your user information.',
    protected: 'Your account is protected by Supabase Authentication.',
    accountStatus: 'Account status',
    open: 'Active',
    email: 'Email',
    language: 'Language',
    chooseLanguage: 'Choose the language you want to use in ImariWise.',
    languageSaved: 'Your language choice is saved in this browser.',
    user: 'User',
    loading: 'ImariWise is loading...',
    deleteConfirm: 'Do you want to delete this transaction?',
    deleted: 'Transaction deleted successfully.',
    saved: 'Transaction saved successfully.',
    login: 'Log in',
    register: 'Create account',
    backHome: '← Back to Home',
    loginWelcome: 'WELCOME BACK',
    registerWelcome: 'GET STARTED',
    loginTitle: 'Log in to your account',
    registerTitle: 'Create your account',
    authHint: 'Use your email address to continue.',
    fullName: 'Full name',
    yourName: 'Your name',
    password: 'Password',
    passwordHint: 'At least 6 characters',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    security: 'Your information is private and protected.',
    heroEyebrow: 'SMART PERSONAL FINANCE',
    heroTitle: 'Know where your money goes. Plan for tomorrow.',
    heroText: 'Track your income, spending and remaining balance, all in one place.',
    sideEyebrow: 'YOUR FINANCES, IN YOUR HANDS',
    delete: 'Delete',
    assistant: 'ImariWise assistant',
    assistantIntro: "Hello! I'm the ImariWise assistant. I can show you how to use the system.",
    assistantPlaceholder: 'Type your question...',
    send: 'Send',
    assistantHelp: 'I can help with the dashboard, income, expenses, budgets, savings and reports.',
    aDashboard: 'The dashboard shows your income, expenses and remaining balance. Add records using the dashboard form.',
    aIncome: 'Choose Income, enter a name, amount, category and date, then select Save transaction.',
    aExpenses: 'Choose Expense, enter what you paid for, the amount, category and date, then save it.',
    aBudgets: 'Open Budgets to plan how much you want to spend in different categories.',
    aSavings: 'Open Savings to set a savings target and track your progress.',
    aReports: 'Open Reports to review an overview of your money activity.',
    aAdvice: 'Compare your income with your spending. Prioritize needs and save regularly.',
    aNoIncome: 'No income is recorded yet. Add your income first to receive a spending overview.',
    aHigh: 'Your expenses are more than 80% of your income. Review categories where you may spend less.',
    aGood: 'Good progress. Keep tracking income and expenses, and continue saving.',
    unknown: 'I did not understand. Ask about the dashboard, income, expenses, budgets, savings or reports.',
    footer: 'Smarter money management.'
  },

  fr: {
    dashboard: 'Tableau de bord',
    income: 'Revenus',
    expenses: 'Dépenses',
    budgets: 'Budgets',
    savings: 'Épargne',
    reports: 'Rapports',
    settings: 'Paramètres',
    dashboardTitle: 'Aperçu financier',
    menu: 'MENU PRINCIPAL',
    refresh: 'Actualiser',
    logout: 'Déconnexion',
    balance: 'SOLDE DISPONIBLE',
    incomeTotal: 'REVENUS TOTAUX',
    expensesTotal: 'DÉPENSES TOTALES',
    balanceHint: 'Revenus moins dépenses',
    incomeHint: 'Total des sommes reçues',
    expensesHint: 'Total des sommes dépensées',
    addIncome: 'Ajouter un revenu',
    addExpense: 'Ajouter une dépense',
    addTransaction: 'Ajouter une opération',
    addHint: 'Saisissez les sommes reçues ou dépensées.',
    incomeType: 'Revenu',
    expenseType: 'Dépense',
    title: 'Nom / Description',
    amount: 'Montant (RWF)',
    category: 'Catégorie',
    date: 'Date',
    save: 'Enregistrer',
    wait: 'Veuillez patienter...',
    recent: 'Opérations récentes',
    stored: 'Les données sont enregistrées dans Supabase.',
    noData: 'Aucune opération. Ajoutez un revenu ou une dépense pour commencer.',
    incomeExample: 'Exemple : Salaire',
    expenseExample: 'Exemple : Nourriture',
    accountInfo: 'Informations du compte',
    accountInfoHint: 'Consultez vos informations utilisateur.',
    protected: 'Votre compte est protégé par Supabase Authentication.',
    accountStatus: 'État du compte',
    open: 'Actif',
    email: 'E-mail',
    language: 'Langue',
    chooseLanguage: 'Choisissez la langue à utiliser dans ImariWise.',
    languageSaved: 'Votre choix de langue est enregistré dans ce navigateur.',
    user: 'Utilisateur',
    loading: 'ImariWise se charge...',
    deleteConfirm: 'Voulez-vous supprimer cette opération ?',
    deleted: 'Opération supprimée.',
    saved: 'Opération enregistrée.',
    login: 'Connexion',
    register: 'Créer un compte',
    backHome: '← Retour à l’accueil',
    loginWelcome: 'BON RETOUR',
    registerWelcome: 'COMMENCEZ MAINTENANT',
    loginTitle: 'Connectez-vous à votre compte',
    registerTitle: 'Créez votre compte',
    authHint: 'Utilisez votre adresse e-mail pour continuer.',
    fullName: 'Nom complet',
    yourName: 'Votre nom',
    password: 'Mot de passe',
    passwordHint: 'Au moins 6 caractères',
    noAccount: 'Vous n’avez pas de compte ?',
    haveAccount: 'Vous avez déjà un compte ?',
    security: 'Vos informations sont privées et protégées.',
    heroEyebrow: 'GESTION INTELLIGENTE DES FINANCES',
    heroTitle: 'Sachez où va votre argent. Préparez demain.',
    heroText: 'Suivez vos revenus, vos dépenses et votre solde restant au même endroit.',
    sideEyebrow: 'VOS FINANCES, ENTRE VOS MAINS',
    delete: 'Supprimer',
    assistant: 'Assistant ImariWise',
    assistantIntro: 'Bonjour ! Je suis l’assistant ImariWise. Je peux vous montrer comment utiliser le système.',
    assistantPlaceholder: 'Écrivez votre question...',
    send: 'Envoyer',
    assistantHelp: 'Je peux vous aider avec le tableau de bord, les revenus, les dépenses, les budgets, l’épargne et les rapports.',
    aDashboard: 'Le tableau de bord affiche vos revenus, vos dépenses et votre solde. Ajoutez des opérations avec son formulaire.',
    aIncome: 'Choisissez Revenus, saisissez un nom, un montant, une catégorie et une date, puis cliquez sur Enregistrer.',
    aExpenses: 'Choisissez Dépenses, saisissez l’achat, le montant, la catégorie et la date, puis enregistrez.',
    aBudgets: 'Ouvrez Budgets pour planifier les montants à dépenser dans différentes catégories.',
    aSavings: 'Ouvrez Épargne pour définir un objectif et suivre votre progression.',
    aReports: 'Ouvrez Rapports pour consulter un aperçu de vos activités financières.',
    aAdvice: 'Comparez vos revenus et vos dépenses. Priorisez les besoins et épargnez régulièrement.',
    aNoIncome: 'Aucun revenu n’est enregistré. Ajoutez d’abord vos revenus pour obtenir une analyse.',
    aHigh: 'Attention : vos dépenses dépassent 80 % de vos revenus. Vérifiez où réduire les dépenses.',
    aGood: 'Bon travail. Continuez à suivre vos revenus et vos dépenses, et à épargner.',
    unknown: 'Je n’ai pas compris. Posez une question sur le tableau de bord, les revenus, les dépenses, les budgets, l’épargne ou les rapports.',
    footer: 'Une meilleure gestion de votre argent.'
  }
};

const money = value => new Intl.NumberFormat('en-RW', {
  style: 'currency',
  currency: 'RWF',
  maximumFractionDigits: 0
}).format(Number(value || 0));

const navigation = [
  { id: 'dashboard', key: 'dashboard', icon: LayoutDashboard },
  { id: 'income', key: 'income', icon: ArrowDownCircle },
  { id: 'expenses', key: 'expenses', icon: ArrowUpCircle },
  { id: 'budgets', key: 'budgets', icon: Wallet },
  { id: 'savings', key: 'savings', icon: PiggyBank },
  { id: 'reports', key: 'reports', icon: BarChart3 },
  { id: 'settings', key: 'settings', icon: Settings }
];

function SystemAssistant({ summary, language }) {
  const t = translations[language] || translations.rw;
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { from: 'assistant', text: t.assistantIntro }
  ]);

  function getAnswer(text) {
    const q = text.toLowerCase();

    if (/(dashboard|incamake|tableau)/.test(q)) return t.aDashboard;
    if (/(income|revenu|amafaranga yinjiye)/.test(q)) return t.aIncome;
    if (/(expense|dépense|yakoreshejwe)/.test(q)) return t.aExpenses;
    if (/(budget|ingengo)/.test(q)) return t.aBudgets;
    if (/(saving|épargne|kuzigama)/.test(q)) return t.aSavings;
    if (/(report|raporo)/.test(q)) return t.aReports;

    if (/(advice|inama|conseil|help|ubufasha)/.test(q)) {
      const income = Number(summary?.income || 0);
      const expenses = Number(summary?.expenses || 0);

      if (income <= 0) return t.aNoIncome;
      return expenses / income > 0.8
        ? t.aHigh
        : `${t.aAdvice} ${t.aGood}`;
    }

    return t.unknown;
  }

  function sendMessage(event) {
    event.preventDefault();
    const text = question.trim();
    if (!text) return;

    setMessages(previous => [
      ...previous,
      { from: 'user', text },
      { from: 'assistant', text: getAnswer(text) }
    ]);
    setQuestion('');
  }

  return (
    <>
      <style>{`
        .iw-ai{position:fixed;right:24px;bottom:24px;z-index:1000}
        .iw-ai-launch{width:58px;height:58px;border:0;border-radius:50%;display:grid;place-items:center;color:white;background:#14532d;box-shadow:0 8px 28px #0003;cursor:pointer}
        .iw-ai-window{position:absolute;right:0;bottom:72px;width:min(370px,calc(100vw - 32px));height:490px;max-height:calc(100vh - 120px);display:flex;flex-direction:column;overflow:hidden;background:#fff;border:1px solid #e5e7eb;border-radius:18px;box-shadow:0 18px 55px #0002}
        .iw-ai-head{display:flex;align-items:center;justify-content:space-between;padding:15px;color:#fff;background:#14532d}
        .iw-ai-head small{display:block;margin-top:3px;opacity:.85;font-size:11px}
        .iw-ai-close{border:0;background:transparent;color:white;cursor:pointer}
        .iw-ai-body{flex:1;overflow-y:auto;padding:14px;background:#f8fafc}
        .iw-ai-tip{display:flex;gap:7px;padding:10px;margin-bottom:13px;border-radius:10px;color:#166534;background:#dcfce7;font-size:12px;line-height:1.5}
        .iw-ai-msg{width:fit-content;max-width:88%;margin:9px 0;padding:10px 12px;border-radius:13px;font-size:13px;line-height:1.55}
        .iw-ai-msg.assistant{color:#1f2937;background:white;border:1px solid #e5e7eb;border-top-left-radius:4px}
        .iw-ai-msg.user{margin-left:auto;color:white;background:#166534;border-top-right-radius:4px}
        .iw-ai-form{display:flex;gap:8px;padding:12px;border-top:1px solid #e5e7eb}
        .iw-ai-form input{min-width:0;flex:1;padding:11px 12px;border:1px solid #d1d5db;border-radius:10px;font:inherit;font-size:13px}
        .iw-ai-form button{width:42px;border:0;border-radius:10px;display:grid;place-items:center;color:white;background:#166534;cursor:pointer}
        .iw-ai-note{margin:0;padding:0 12px 9px;color:#9ca3af;text-align:center;font-size:10px}
        .iw-language{margin:22px 0;padding:18px;border:1px solid #e5e7eb;border-radius:12px;background:#fff}
        .iw-language label{display:block;font-weight:600;margin-bottom:7px}
        .iw-language p{margin:0 0 10px;color:#64748b}
        .iw-language select{width:100%;max-width:360px;padding:11px;border:1px solid #d1d5db;border-radius:8px;background:white}
        .iw-language small{display:block;margin-top:8px;color:#64748b}
        @media(max-width:480px){.iw-ai{right:14px;bottom:14px}.iw-ai-window{right:-2px;bottom:68px;height:min(480px,calc(100vh - 100px))}}
      `}</style>

      <div className="iw-ai">
        {open && (
          <section className="iw-ai-window" aria-label={t.assistant}>
            <header className="iw-ai-head">
              <div>
                <strong>{t.assistant}</strong>
                <small>● ImariWise</small>
              </div>
              <button type="button" className="iw-ai-close" onClick={() => setOpen(false)} aria-label="Close">
                <X size={19} />
              </button>
            </header>

            <div className="iw-ai-body">
              <div className="iw-ai-tip">
                <Sparkles size={15} />
                {t.assistantHelp}
              </div>
              {messages.map((item, index) => (
                <div key={index} className={`iw-ai-msg ${item.from}`}>
                  {item.text}
                </div>
              ))}
            </div>

            <form className="iw-ai-form" onSubmit={sendMessage}>
              <input
                value={question}
                onChange={event => setQuestion(event.target.value)}
                placeholder={t.assistantPlaceholder}
              />
              <button type="submit" aria-label={t.send}>
                <Send size={17} />
              </button>
            </form>
            <p className="iw-ai-note">Automated help prototype · Not professional financial advice</p>
          </section>
        )}

        <button
          type="button"
          className="iw-ai-launch"
          onClick={() => setOpen(value => !value)}
          aria-label={t.assistant}
          title={t.assistant}
        >
          {open ? <X size={23} /> : <Bot size={24} />}
        </button>
      </div>
    </>
  );
}

export default function App() {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('imariwise-language') || 'rw';
    } catch {
      return 'rw';
    }
  });

  const t = translations[language] || translations.rw;

  function changeLanguage(value) {
    const next = translations[value] ? value : 'rw';
    setLanguage(next);
    try {
      localStorage.setItem('imariwise-language', next);
    } catch {
      // Language still works for the current session if storage is unavailable.
    }
  }

  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState('login');
  const [publicView, setPublicView] = useState('home');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    transactionCount: 0,
    recentTransactions: []
  });

  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('income');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Other');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  function openAuth(view) {
    setMode(view);
    setPublicView('auth');
    setMessage('');
  }

  function goHome() {
    setPublicView('home');
    setMessage('');
    setPassword('');
  }

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) setSession(data.session);
      } catch (error) {
        if (mounted) setMessage(error.message);
      } finally {
        if (mounted) setChecking(false);
      }
    }

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => setSession(nextSession)
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function loadData() {
    try {
      const [summaryResult, transactionResult] = await Promise.all([
        api('/dashboard/summary'),
        api('/transactions')
      ]);

      setSummary(summaryResult.summary || {
        income: 0,
        expenses: 0,
        balance: 0,
        transactionCount: 0,
        recentTransactions: []
      });

      setTransactions(transactionResult.transactions || []);
      setMessage('');
    } catch (error) {
      setMessage(error.message || 'Could not load financial data.');
    }
  }

  useEffect(() => {
    if (session) {
      loadData();
    } else {
      setTransactions([]);
      setSummary({
        income: 0,
        expenses: 0,
        balance: 0,
        transactionCount: 0,
        recentTransactions: []
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  function navigateTo(section) {
    setActiveSection(section);
    setMobileMenuOpen(false);
    setMessage('');

    if (section === 'income') setType('income');
    if (section === 'expenses') setType('expense');
  }

  async function authenticate(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin
          }
        });

        if (error) throw error;

        if (!data.session) {
          setMessage(
            language === 'en'
              ? 'Your account was created. Check your email to confirm it, then log in.'
              : language === 'fr'
                ? 'Votre compte a été créé. Vérifiez votre e-mail pour le confirmer, puis connectez-vous.'
                : 'Konti yawe yakozwe. Reba email yawe wemeze konti, hanyuma winjire.'
          );
        } else {
          setMessage(
            language === 'en'
              ? 'Account created successfully.'
              : language === 'fr'
                ? 'Compte créé avec succès.'
                : 'Konti yakozwe neza.'
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function addTransaction(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      await api('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          type,
          title,
          category,
          amount: Number(amount),
          transaction_date: date
        })
      });

      setTitle('');
      setAmount('');
      await loadData();
      setMessage(t.saved);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeTransaction(id) {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      await api(`/transactions/${id}`, { method: 'DELETE' });
      await loadData();
      setMessage(t.deleted);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
      return;
    }

    setTransactions([]);
    setActiveSection('dashboard');
    setPublicView('home');
    setMessage('');
  }

  const displayedTransactions = transactions.filter(item => {
    if (activeSection === 'income') return item.type === 'income';
    if (activeSection === 'expenses') return item.type === 'expense';
    return true;
  });

  if (checking) {
    return <div className="center-screen">{t.loading}</div>;
  }

  if (!session && publicView === 'home') {
    return (
      <LandingPage
        onLogin={() => openAuth('login')}
        onRegister={() => openAuth('register')}
      />
    );
  }

  if (!session) {
    return (
      <main className="auth-layout">
        <section className="auth-visual">
          <div className="brand">
            <span className="brand-icon"><Wallet /></span>
            ImariWise
          </div>

          <div className="hero-copy">
            <span className="eyebrow">{t.heroEyebrow}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
          </div>

          <div className="visual-foot">
            <ShieldCheck size={17} />
            {t.security}
          </div>
        </section>

        <section className="auth-panel">
          <form className="auth-form" onSubmit={authenticate}>
            <div className="mobile-brand"><Wallet /> ImariWise</div>

            <button type="button" className="link" onClick={goHome}>
              {t.backHome}
            </button>

            <span className="eyebrow">
              {mode === 'login' ? t.loginWelcome : t.registerWelcome}
            </span>

            <h2>{mode === 'login' ? t.loginTitle : t.registerTitle}</h2>
            <p className="muted">{t.authHint}</p>

            {mode === 'register' && (
              <label>
                {t.fullName}
                <input
                  value={fullName}
                  onChange={event => setFullName(event.target.value)}
                  placeholder={t.yourName}
                  required
                />
              </label>
            )}

            <label>
              {t.email}
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="name@example.com"
                required
              />
            </label>

            <label>
              {t.password}
              <input
                type="password"
                minLength="6"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder={t.passwordHint}
                required
              />
            </label>

            {message && <div className="notice">{message}</div>}

            <button className="primary full" disabled={busy}>
              {busy ? t.wait : mode === 'login' ? t.login : t.register}
            </button>

            <p className="switch">
              {mode === 'login' ? t.noAccount : t.haveAccount}{' '}
              <button
                type="button"
                className="link"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setMessage('');
                }}
              >
                {mode === 'login' ? t.register : t.login}
              </button>
            </p>
          </form>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      {mobileMenuOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <span className="brand-icon"><Wallet /></span>
          ImariWise
          <button
            className="sidebar-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="side-label">{t.menu}</div>

        <nav className="sidebar-nav">
          {navigation.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => navigateTo(item.id)}
              >
                <Icon size={19} />
                <span>{t[item.key]}</span>
              </button>
            );
          })}
        </nav>

        <div className="side-bottom">
          <div className="avatar">
            {(session.user.email || 'I').slice(0, 1).toUpperCase()}
          </div>

          <div className="user-mini">
            <b>{session.user.user_metadata?.full_name || t.user}</b>
            <small>{session.user.email}</small>
          </div>

          <button className="icon-btn light" onClick={signOut} title={t.logout}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="eyebrow">{t.sideEyebrow}</span>
              <h1>
                {activeSection === 'dashboard'
                  ? t.dashboardTitle
                  : t[activeSection]}
              </h1>
            </div>
          </div>

          <button className="outline" onClick={loadData}>
            <RefreshCw size={16} />
            {t.refresh}
          </button>
        </header>

        {message && <div className="notice page-notice">{message}</div>}

        {activeSection === 'dashboard' && (
          <section className="stats">
            <article className="stat-card balance-card">
              <div className="stat-top">
                <span>{t.balance}</span>
                <span className="stat-icon"><Wallet /></span>
              </div>
              <strong>{money(summary.balance)}</strong>
              <small>{t.balanceHint}</small>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>{t.incomeTotal}</span>
                <span className="stat-icon green"><TrendingUp /></span>
              </div>
              <strong>{money(summary.income)}</strong>
              <small>{t.incomeHint}</small>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>{t.expensesTotal}</span>
                <span className="stat-icon red"><TrendingDown /></span>
              </div>
              <strong>{money(summary.expenses)}</strong>
              <small>{t.expensesHint}</small>
            </article>
          </section>
        )}

        {(activeSection === 'dashboard' ||
          activeSection === 'income' ||
          activeSection === 'expenses') && (
          <section className="content-grid">
            <article className="panel">
              <div className="panel-heading">
                <div>
                  <h2>
                    {activeSection === 'income'
                      ? t.addIncome
                      : activeSection === 'expenses'
                        ? t.addExpense
                        : t.addTransaction}
                  </h2>
                  <p>{t.addHint}</p>
                </div>
              </div>

              <form className="transaction-form" onSubmit={addTransaction}>
                <div className="type-switch">
                  <button
                    type="button"
                    className={type === 'income' ? 'selected income' : ''}
                    onClick={() => setType('income')}
                  >
                    {t.incomeType}
                  </button>

                  <button
                    type="button"
                    className={type === 'expense' ? 'selected expense' : ''}
                    onClick={() => setType('expense')}
                  >
                    {t.expenseType}
                  </button>
                </div>

                <label>
                  {t.title}
                  <input
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder={type === 'income' ? t.incomeExample : t.expenseExample}
                    required
                    maxLength="120"
                  />
                </label>

                <div className="form-row">
                  <label>
                    {t.amount}
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={amount}
                      onChange={event => setAmount(event.target.value)}
                      placeholder="0"
                      required
                    />
                  </label>

                  <label>
                    {t.category}
                    <select
                      value={category}
                      onChange={event => setCategory(event.target.value)}
                    >
                      <option>Other</option>
                      <option>Salary</option>
                      <option>Business</option>
                      <option>Food</option>
                      <option>Transport</option>
                      <option>Housing</option>
                      <option>Education</option>
                      <option>Health</option>
                      <option>Shopping</option>
                    </select>
                  </label>
                </div>

                <label>
                  {t.date}
                  <input
                    type="date"
                    value={date}
                    onChange={event => setDate(event.target.value)}
                    required
                  />
                </label>

                <button className="primary" disabled={busy}>
                  <Plus size={17} />
                  {busy ? t.wait : t.save}
                </button>
              </form>
            </article>

            <article className="panel">
              <div className="panel-heading">
                <div>
                  <h2>
                    {activeSection === 'income'
                      ? t.incomeType
                      : activeSection === 'expenses'
                        ? t.expenseType
                        : t.recent}
                  </h2>
                  <p>{t.stored}</p>
                </div>
                <span className="count-pill">{displayedTransactions.length}</span>
              </div>

              {displayedTransactions.length === 0 ? (
                <div className="empty">{t.noData}</div>
              ) : (
                <div className="transactions">
                  {(activeSection === 'dashboard'
                    ? displayedTransactions.slice(0, 8)
                    : displayedTransactions
                  ).map(item => (
                    <div className="transaction-row" key={item.id}>
                      <div className={`transaction-symbol ${item.type}`}>
                        {item.type === 'income'
                          ? <TrendingUp size={17} />
                          : <TrendingDown size={17} />}
                      </div>

                      <div className="transaction-info">
                        <b>{item.title}</b>
                        <small>{item.category} · {item.transaction_date}</small>
                      </div>

                      <strong className={item.type === 'income' ? 'positive' : 'negative'}>
                        {item.type === 'income' ? '+' : '−'}{money(item.amount)}
                      </strong>

                      <button
                        className="icon-btn"
                        onClick={() => removeTransaction(item.id)}
                        title={t.delete}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        )}

        {activeSection === 'budgets' && <BudgetManager />}
        {activeSection === 'savings' && <SavingsManager />}
        {activeSection === 'reports' && <FinancialReports />}

        {activeSection === 'settings' && (
          <section className="panel settings-panel">
            <div className="panel-heading">
              <div>
                <h2>{t.accountInfo}</h2>
                <p>{t.accountInfoHint}</p>
              </div>
              <Settings size={22} />
            </div>

            <div className="settings-profile">
              <div className="avatar large-avatar">
                {(session.user.email || 'I').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h3>{session.user.user_metadata?.full_name || t.user}</h3>
                <p>{session.user.email}</p>
                <small>{t.protected}</small>
              </div>
            </div>

            <div className="settings-info">
              <p><strong>{t.email}:</strong> {session.user.email}</p>
              <p><strong>{t.accountStatus}:</strong> {t.open}</p>
            </div>

            <div className="iw-language">
              <label htmlFor="imariwise-language">{t.language}</label>
              <p>{t.chooseLanguage}</p>
              <select
                id="imariwise-language"
                value={language}
                onChange={event => changeLanguage(event.target.value)}
              >
                <option value="rw">🇷🇼 Kinyarwanda (Default)</option>
                <option value="en">🇬🇧 English</option>
                <option value="fr">🇫🇷 Français</option>
              </select>
              <small>{t.languageSaved}</small>
            </div>

            <button className="primary" onClick={signOut}>
              <LogOut size={17} />
              {t.logout}
            </button>
          </section>
        )}

        <SystemAssistant summary={summary} language={language} />

        <footer className="footer">
          © {new Date().getFullYear()} ImariWise · {t.footer}
        </footer>
      </main>
    </div>
  );
}
