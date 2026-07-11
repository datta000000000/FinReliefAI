import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  HeartPulse, 
  Coins, 
  Scale, 
  FileSignature, 
  History, 
  ArrowRight, 
  Menu, 
  X, 
  CheckCircle,
  HelpCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Button } from '../components/UI';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const statistics = [
    { label: 'Calculated Settlements', value: '₹14.2M+' },
    { label: 'Active Borrowers Helped', value: '8,500+' },
    { label: 'AI Letters Generated', value: '25,000+' },
    { label: 'Platform Trust Rating', value: '99.4%' }
  ];

  const features = [
    { 
      title: 'Financial Health Analysis', 
      desc: 'Calculate DTI, EMI ratio, and monthly surplus metrics dynamically using pure Python.', 
      icon: HeartPulse, 
      color: 'text-brand-accent border-brand-accent/20 bg-brand-accent/5',
      glow: 'hover:shadow-glow-gold'
    },
    { 
      title: 'Loan Consolidated Management', 
      desc: 'Track mortgage, auto, card, and personal loan balances, interest rates, and due dates.', 
      icon: Coins, 
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      glow: 'hover:shadow-glow-success'
    },
    { 
      title: 'Settlement Recommendations', 
      desc: 'Evaluate custom target ratios and prioritization scores to clear delinquent accounts.', 
      icon: Scale, 
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      glow: 'hover:shadow-glow-gold'
    },
    { 
      title: 'AI Negotiation Strategy', 
      desc: 'Consult step-by-step hardship tacticians fueled by Google Gemini API.', 
      icon: BrainCircuit, 
      color: 'text-brand-accentLight border-brand-accentLight/20 bg-brand-accentLight/5',
      glow: 'hover:shadow-glow-gold'
    },
    { 
      title: 'AI Hardship Letter drafts', 
      desc: 'Automatically compose formatted settlement offers, printed notices, or hardship statements.', 
      icon: FileSignature, 
      color: 'text-pink-400 border-pink-500/20 bg-pink-500/5',
      glow: 'hover:shadow-glow-gold'
    },
    { 
      title: 'Interaction Audit logs', 
      desc: 'Review historical advice and letters generation records mapped to fallback metadata details.', 
      icon: History, 
      color: 'text-teal-400 border-teal-500/20 bg-teal-500/5',
      glow: 'hover:shadow-glow-success'
    }
  ];

  const steps = [
    { num: '1', title: 'Create Account', desc: 'Secure register credential parameters.' },
    { num: '2', title: 'Financial Profile', desc: 'Input monthly earnings and overhead.' },
    { num: '3', title: 'Register Loans', desc: 'Detail lender balances, rates, and EMIs.' },
    { num: '4', title: 'Assess Default Risks', desc: 'Examine stress indicators and indices.' },
    { num: '5', title: 'Settle Target Ratios', desc: 'Acquire prioritized payout figures.' },
    { num: '6', title: 'Draft Hardship letters', desc: 'Generate customized formal letters.' }
  ];

  const faqs = [
    { 
      q: 'How does the settlement recommendations engine work?', 
      a: 'We evaluate registered balances, interest rates, and overdue durations using a deterministic pure Python prioritization model. High default risk loans receive higher priority indices to safeguard your credit profile.' 
    },
    { 
      q: 'Is my financial credentials data secure?', 
      a: 'Absolutely. We run on a secure FastAPI architecture utilizing JWT authentication. All calculations are executed locally on server variables, and we never expose details to unverified third parties.' 
    },
    { 
      q: 'What happens if the Gemini AI service is offline?', 
      a: 'Our platform implements a local, robust fallback generator. If Gemini encounters API limits or network quota failures, the service serves customized letters and strategies locally, indicating fallback source logs.' 
    },
    { 
      q: 'Can I edit my personal profile and credentials?', 
      a: 'Yes! The My Profile page supports editing name, email, country, and occupation, including uploading a custom profile picture.' 
    }
  ];

  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'Software Engineer',
      text: 'FinRelief AI helped me prioritize HDFC card settlements and SBI personal loans during a transition. The custom letters made reaching out to banks simple.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120'
    },
    {
      name: 'Anjali Gupta',
      role: 'Business Consultant',
      text: 'The stress metrics and surplus evaluations gave me visual clarity. The fallback letter generator worked instantly even when the AI API key was missing!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden relative">
      
      {/* Background radial gradient glow (CRED style luxury gold) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-brand-accent/10 via-brand-accentLight/5 to-transparent rounded-full blur-3xl -z-10 animate-pulse-slow" />

      {/* 1. Header Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0F1115]/75 backdrop-blur-xl border-b border-brand-border h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
          
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollToSection('home')}>
            <BrainCircuit className="w-8 h-8 text-brand-accent animate-pulse" />
            <span className="font-display font-extrabold text-xl tracking-tight text-white bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">FinRelief AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <button onClick={() => scrollToSection('home')} className="hover:text-brand-accent transition-all duration-200">Home</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-brand-accent transition-all duration-200">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-brand-accent transition-all duration-200">How It Works</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-brand-accent transition-all duration-200">FAQs</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-brand-accent transition-all duration-200">About</button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="secondary" size="sm" className="border-brand-border hover:bg-white/[0.04]">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="hover:scale-[1.02] transition-transform">Register</Button>
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-[#1A1D24]/50 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-45 pt-16 bg-[#0F1115] md:hidden flex flex-col px-6 py-8 space-y-6">
          <button onClick={() => scrollToSection('home')} className="text-left font-bold text-lg text-slate-300 hover:text-white">Home</button>
          <button onClick={() => scrollToSection('features')} className="text-left font-bold text-lg text-slate-300 hover:text-white">Features</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-left font-bold text-lg text-slate-300 hover:text-white">How It Works</button>
          <button onClick={() => scrollToSection('faq')} className="text-left font-bold text-lg text-slate-300 hover:text-white">FAQs</button>
          <button onClick={() => scrollToSection('about')} className="text-left font-bold text-lg text-slate-300 hover:text-white">About</button>
          <div className="border-t border-brand-border pt-6 flex flex-col gap-4">
            <Link to="/login" className="w-full">
              <Button variant="secondary" className="w-full">Sign In</Button>
            </Link>
            <Link to="/register" className="w-full">
              <Button variant="primary" className="w-full">Register</Button>
            </Link>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section id="home" className="pt-36 pb-20 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center lg:text-left animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Hardship Coordinator</span>
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            AI Powered Debt Relief & Financial Recovery
          </h1>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Manage your loans, analyze your financial health, receive intelligent settlement recommendations, generate AI-powered negotiation strategies, and create professional settlement letters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 hover:scale-[1.02] transition-transform">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <button 
              onClick={() => scrollToSection('features')}
              className="w-full sm:w-auto px-7 py-3.5 font-semibold text-xs rounded-xl text-slate-300 hover:text-white bg-white/[0.04] border border-brand-border hover:bg-white/[0.08] transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Animated Fintech Visualization Scene (Linear/Apple inspired) */}
        <div className="relative flex justify-center w-full max-w-lg mx-auto">
          
          {/* Main Dashboard Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl p-6 shadow-2xl border border-brand-border w-full bg-gradient-to-br from-[#1A1D24]/90 to-[#0F1115]/95 space-y-6 relative overflow-hidden z-10"
          >
            {/* Header bar controls */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-[9px] font-bold text-slate-500 tracking-wider font-mono">FINRELIEF_DASHBOARD_LIVE</span>
            </div>

            {/* Top grid with SVG gauge and metrics */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Circular Gauge */}
              <div className="p-4 rounded-2xl bg-[#0F1115]/40 border border-brand-border flex flex-col items-center justify-center text-center relative overflow-hidden">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Health Index</span>
                
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Circle Background */}
                    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="transparent" />
                    {/* Circle Progress with Gold Accent */}
                    <motion.circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="url(#goldGradient)" 
                      strokeWidth="6" 
                      fill="transparent"
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * 82) / 100 }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#E6C97A" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Score Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-extrabold text-white">82</span>
                    <span className="text-[7px] font-bold text-slate-500">EXCELLENT</span>
                  </div>
                </div>
              </div>

              {/* KPI indicators */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#0F1115]/40 border border-brand-border space-y-1">
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest block">Total Interest Saved</span>
                  <p className="text-xl font-extrabold text-emerald-400">₹45.2K</p>
                  <span className="text-[7px] text-slate-500 block">Negotiated savings projection</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0F1115]/40 border border-brand-border space-y-1">
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest block">DTI Ratio</span>
                  <p className="text-xl font-extrabold text-brand-accent">24%</p>
                  <span className="text-[7px] text-slate-500 block">Healthy credit safety margin</span>
                </div>
              </div>
            </div>

            {/* Line and Bar Charts (Animated SVGs) */}
            <div className="p-4 rounded-2xl bg-[#0F1115]/40 border border-brand-border space-y-3">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Debt Reduction Projection</span>
              
              <div className="h-24 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="25" x2="200" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="75" x2="200" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  
                  {/* Drawing Area Path */}
                  <motion.path
                    d="M0,80 Q40,75 80,45 T160,20 T200,10"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
                  />
                  {/* Glow Dot */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="4"
                    fill="#E6C97A"
                    initial={{ offset: 0 }}
                    animate={{
                      cx: [0, 40, 80, 160, 200],
                      cy: [80, 75, 45, 20, 10]
                    }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
                  />
                </svg>
              </div>
            </div>

            {/* AI Recommendation Message Bubble */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="p-3.5 rounded-2xl bg-brand-accent/5 border border-brand-accent/20 flex gap-3 text-xs leading-normal"
            >
              <div className="w-7 h-7 rounded-xl bg-brand-accent/15 flex items-center justify-center text-brand-accent shrink-0 font-bold">
                AI
              </div>
              <p className="text-[10px] text-slate-300">
                <strong className="text-white block mb-0.5">Tactical Advisory:</strong>
                Prioritize ICICI Card settlement. It has an interest rate of 42% and constitutes 60% of DTI load.
              </p>
            </motion.div>
          </motion.div>

          {/* Floating Gold KPI Cards & Currency Icons */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 glass p-3 rounded-2xl border border-brand-accent/30 shadow-xl z-20 flex items-center gap-2"
          >
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">₹</span>
            <div>
              <span className="text-[7px] text-slate-500 font-bold block">SAVINGS RATE</span>
              <span className="text-xs font-extrabold text-white">45% Higher</span>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 glass p-3.5 rounded-2xl border border-brand-accent/20 shadow-xl z-20"
          >
            <span className="text-[7px] text-slate-500 font-bold block mb-1">SETTLEMENT LIMIT</span>
            <span className="text-xs font-mono font-bold text-brand-accent">₹32,500 Max Offer</span>
          </motion.div>

          {/* Glowing particle blobs behind dashboard */}
          <div className="absolute -inset-4 bg-brand-accent/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
        </div>
      </section>

      {/* 3. Statistics Panel */}
      <section className="border-y border-brand-border bg-[#1A1D24]/30 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statistics.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-white bg-gradient-to-r from-brand-accent to-brand-accentLight bg-clip-text text-transparent">{stat.value}</p>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-24 bg-[#1A1D24]/10">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">
              A Complete SaaS FinTech Suite
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Consolidate overdue accounts, run mathematical stress analysis, and map drafts seamlessly using local client components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx} 
                  className={`glass-card p-6 rounded-3xl border border-brand-border transition-all duration-300 flex flex-col justify-between ${feat.glow}`}
                >
                  <div className="space-y-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feat.color}`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-200">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section id="how-it-works" className="py-24 border-t border-brand-border bg-[#0F1115]">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">
              Simplified Restoration Blueprint
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Follow these clear chronological milestones to consolidate metrics and draft bank-ready documents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {steps.map((st, idx) => (
              <div 
                key={idx} 
                className="relative flex flex-col items-center text-center p-5 glass rounded-3xl border border-brand-border group hover:border-brand-accent/20 transition-all duration-200"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold mb-3 group-hover:bg-brand-accent group-hover:text-black transition-colors duration-300">
                  {st.num}
                </span>
                <h4 className="font-bold text-xs text-slate-200 mb-1">{st.title}</h4>
                <p className="text-[9px] text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials (Sample Demo) */}
      <section className="py-24 border-t border-brand-border bg-[#1A1D24]/15">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">
              Client Feedback
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Hear from actual users who successfully structured their debt repayments (*Sample Client Testimonials*).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass p-6 rounded-3xl border border-brand-border space-y-4 flex flex-col justify-between">
                <p className="text-xs md:text-sm text-slate-300 italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.04]">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#232D42]" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">{t.name}</h4>
                    <span className="text-[10px] text-slate-500">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section id="faq" className="py-24 border-t border-brand-border bg-[#0F1115]">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-display font-bold text-3xl text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs md:text-sm text-slate-400">Find answers to commonly asked questions about the platform functions.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFAQIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="glass rounded-2xl border border-brand-border overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left text-xs font-semibold text-slate-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-xs text-slate-400 leading-relaxed border-t border-[#232D42]/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. About Section */}
      <section id="about" className="py-24 border-t border-brand-border bg-[#1A1D24]/15">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display font-bold text-3xl text-white tracking-tight">Purpose & Concept</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              FinRelief AI resolves debt complexity by merging mathematical calculations with prompt generators. Most borrowers default simply because they cannot assess their total DTI ratio or compose professional formal correspondences.
            </p>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Our service organizes your debts, runs credit stress algorithms, and formats letter templates to banks. You negotiate directly with confidence using accurate values.
            </p>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300">FastAPI backend protection</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300">Secure localStorage JWT validation</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="glass p-8 rounded-3xl border border-brand-border w-full max-w-md bg-gradient-to-tr from-[#1A1D24] to-[#0F1115] text-center space-y-4">
              <BrainCircuit className="w-14 h-14 text-brand-accent mx-auto animate-pulse" />
              <h3 className="font-display font-bold text-base text-white">Consolidate Debts Today</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take control of card outstanding rates and auto EMIs using structured platform coordinates.
              </p>
              <Link to="/register" className="block w-full">
                <Button variant="primary" className="w-full">Create Free Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-[#090D16] border-t border-brand-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-brand-accent" />
            <span className="font-display font-bold text-sm text-white tracking-tight">FinRelief AI</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
            <Link to="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">GitHub</a>
            <Link to="#" className="hover:text-slate-300 transition-colors">Contact</Link>
          </div>

          <p className="text-xs text-slate-500">
            &copy; 2026 FinRelief AI. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
