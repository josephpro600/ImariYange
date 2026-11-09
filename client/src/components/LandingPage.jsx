
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Target,
  PieChart,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  Globe,
  BarChart3
} from 'lucide-react';

import { useState } from 'react';

export default function LandingPage({ onLogin, onRegister }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  const features = [
    {
      icon: TrendingUp,
      title: 'Income Management',
      description:
        'Record and manage all your income sources in one secure place.'
    },
    {
      icon: Wallet,
      title: 'Expense Tracking',
      description:
        'Know where your money goes and understand your spending habits.'
    },
    {
      icon: Target,
      title: 'Budget Planning',
      description:
        'Set spending limits and stay within your financial plans.'
    },
    {
      icon: PieChart,
      title: 'Savings Goals',
      description:
        'Set savings targets and track your progress towards them.'
    },
    {
      icon: BarChart3,
      title: 'Financial Reports',
      description:
        'Understand your finances through clear summaries and charts.'
    },
    {
      icon: Sparkles,
      title: 'AI Financial Advisor',
      description:
        'Get personalized insights to help improve your financial decisions.'
    }
  ];

  function scrollToSection(id) {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  return (
    <div className="landing-page">

      {/* NAVIGATION */}

      <header className="landing-header">
        <div className="landing-container nav-container">

          <a
            href="#home"
            className="landing-logo"
            onClick={event => {
              event.preventDefault();
              scrollToSection('home');
            }}
          >
            <span className="landing-logo-icon">
              <Wallet size={23} />
            </span>
            <span>Imari<span>Wise</span></span>
          </a>

          <nav className={`landing-nav ${mobileMenu ? 'nav-open' : ''}`}>
            <a href="#home" onClick={() => scrollToSection('home')}>
              Home
            </a>

            <a href="#features" onClick={() => scrollToSection('features')}>
              Features
            </a>

            <a href="#about" onClick={() => scrollToSection('about')}>
              About
            </a>

            <a href="#contact" onClick={() => scrollToSection('contact')}>
              Contact
            </a>

            <div className="mobile-auth-links">
              <button onClick={onLogin}>Login</button>
              <button className="mobile-register" onClick={onRegister}>
                Get Started
              </button>
            </div>
          </nav>

          <div className="landing-actions">
            <button
              className="landing-login"
              onClick={onLogin}
            >
              Login
            </button>

            <button
              className="landing-register"
              onClick={onRegister}
            >
              Get Started <ArrowRight size={16} />
            </button>
          </div>

          <button
            className="landing-menu-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle navigation"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>

        </div>
      </header>

      {/* HERO SECTION */}

      <section className="landing-hero" id="home">
        <div className="landing-container hero-grid">

          <div className="hero-content">

            <div className="hero-badge">
              <Sparkles size={15} />
              SMARTER PERSONAL FINANCE
            </div>

            <h1>
              Take control of your money.
              <span> Build a better financial future.</span>
            </h1>

            <p>
              Manage your income, track expenses, plan budgets and
              achieve your savings goals with ImariWise.
              Everything you need to understand and improve
              your financial life.
            </p>

            <div className="hero-buttons">

              <button
                className="hero-primary"
                onClick={onRegister}
              >
                Create Free Account
                <ArrowRight size={18} />
              </button>

              <button
                className="hero-secondary"
                onClick={() => scrollToSection('features')}
              >
                Explore Features
              </button>

            </div>

            <div className="hero-trust">
              <ShieldCheck size={17} />
              Secure account access · Your personal financial records
            </div>

          </div>

          {/* DASHBOARD PREVIEW */}

          <div className="hero-visual">

            <div className="preview-card">

              <div className="preview-top">
                <div>
                  <small>YOUR FINANCIAL OVERVIEW</small>
                  <h3>Financial Dashboard</h3>
                </div>

                <span className="preview-wallet">
                  <Wallet size={21} />
                </span>
              </div>

              <div className="preview-balance">
                <small>Total Balance</small>
                <h2>850,000 <span>RWF</span></h2>
                <span className="preview-positive">
                  <TrendingUp size={14} />
                  Your financial journey starts here
                </span>
              </div>

              <div className="preview-stats">

                <div>
                  <span className="preview-stat-icon income-icon">
                    <TrendingUp size={17} />
                  </span>
                  <small>Income</small>
                  <strong>1,200,000</strong>
                  <small>RWF</small>
                </div>

                <div>
                  <span className="preview-stat-icon expense-icon">
                    <TrendingUp size={17} />
                  </span>
                  <small>Expenses</small>
                  <strong>350,000</strong>
                  <small>RWF</small>
                </div>

              </div>

              <div className="preview-chart">

                <div className="preview-chart-header">
                  <strong>Financial Activity</strong>
                  <small>Monthly overview</small>
                </div>

                <div className="preview-bars">
                  {[40, 65, 45, 80, 55, 95, 70, 85, 60, 100, 75, 90].map(
                    (height, index) => (
                      <div className="preview-bar-column" key={index}>
                        <div
                          className="preview-bar"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="preview-months">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Dec</span>
                </div>

              </div>

              <div className="preview-advice">
                <Sparkles size={18} />
                <div>
                  <strong>Financial intelligence</strong>
                  <small>Make informed financial decisions.</small>
                </div>
              </div>

            </div>

            <div className="floating-card floating-security">
              <ShieldCheck size={20} />
              <div>
                <strong>Secure</strong>
                <small>Your data matters</small>
              </div>
            </div>

            <div className="floating-card floating-savings">
              <Target size={20} />
              <div>
                <strong>Save smarter</strong>
                <small>Achieve your goals</small>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BENEFITS STRIP */}

      <section className="landing-benefits">
        <div className="landing-container benefits-grid">

          <div>
            <CheckCircle2 />
            <span>Manage income</span>
          </div>

          <div>
            <CheckCircle2 />
            <span>Track expenses</span>
          </div>

          <div>
            <CheckCircle2 />
            <span>Plan your budgets</span>
          </div>

          <div>
            <CheckCircle2 />
            <span>Grow your savings</span>
          </div>

        </div>
      </section>

      {/* FEATURES */}

      <section className="landing-features" id="features">
        <div className="landing-container">

          <div className="section-heading">
            <span>OUR FEATURES</span>
            <h2>Everything you need to manage your money</h2>
            <p>
              Powerful tools designed to make personal financial
              management simple and understandable.
            </p>
          </div>

          <div className="features-grid">

            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article className="feature-card" key={index}>
                  <div className="feature-icon">
                    <Icon size={25} />
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <button onClick={onRegister}>
                    Get started <ArrowRight size={15} />
                  </button>
                </article>
              );
            })}

          </div>
        </div>
      </section>

      {/* ABOUT */}

      <section className="landing-about" id="about">
        <div className="landing-container about-grid">

          <div className="about-visual">
            <div className="about-main-card">
              <Wallet size={37} />
              <h3>Better money management starts here.</h3>
              <p>
                Understand your income. Control your expenses.
                Build your savings.
              </p>
            </div>
          </div>

          <div className="about-content">
            <span>ABOUT IMARIWISE</span>

            <h2>
              Your money deserves a smarter management system.
            </h2>

            <p>
              ImariWise is a personal finance management platform
              designed to help individuals organize their financial
              activities and make better financial decisions.
            </p>

            <p>
              From recording income to monitoring expenses and
              planning savings, ImariWise brings your financial
              information together in one convenient platform.
            </p>

            <button
              className="hero-primary"
              onClick={onRegister}
            >
              Start managing your money
              <ArrowRight size={17} />
            </button>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}

      <section className="landing-cta">
        <div className="landing-container cta-content">
          <div>
            <span>START YOUR FINANCIAL JOURNEY</span>
            <h2>Take the first step towards financial confidence.</h2>
            <p>
              Create your ImariWise account and start managing
              your money more effectively.
            </p>
          </div>

          <button onClick={onRegister}>
            Create Your Account <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="landing-footer" id="contact">
        <div className="landing-container footer-grid">

          <div className="footer-brand">
            <a href="#home" className="landing-logo">
              <span className="landing-logo-icon">
                <Wallet size={22} />
              </span>
              <span>Imari<span>Wise</span></span>
            </a>

            <p>
              Making personal financial management easier,
              smarter and more accessible.
            </p>

            <div className="footer-secure">
              <ShieldCheck size={16} />
              Secure personal finance management
            </div>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-links">
            <h3>Account</h3>
            <button onClick={onLogin}>Login</button>
            <button onClick={onRegister}>Register</button>
            <button onClick={onRegister}>Get Started</button>
          </div>

          <div className="footer-links">
            <h3>Our Platform</h3>
            <span>Income Management</span>
            <span>Expense Tracking</span>
            <span>Budget Planning</span>
            <span>Financial Reports</span>
          </div>

        </div>

        <div className="landing-container footer-bottom">
          <p>
            © {new Date().getFullYear()} ImariWise. All rights reserved.
          </p>

          <span>
            <Globe size={15} /> Personal Finance Management Platform
          </span>
        </div>
      </footer>

    </div>
  );
}
