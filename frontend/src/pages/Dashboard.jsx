import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  AlertOctagon, 
  ArrowRight, 
  Coins, 
  HeartPulse, 
  UserPlus, 
  BrainCircuit, 
  History, 
  IndianRupee,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Card, Button, Skeleton } from '../components/UI';
import profileService from '../services/profileService';
import loanService from '../services/loanService';
import healthService from '../services/healthService';
import aiService from '../services/aiService';

// Chart.js imports
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

// Gorgeous SVG Circular Progress Indicator
const CircularProgress = ({ value, max = 100, label, color = 'stroke-blue-500', subtitle }) => {
  const radius = 28;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value, max);
  const strokeDashoffset = circumference - (pct / max) * circumference;

  return (
    <div className="flex items-center gap-4 bg-[#0F172A]/40 p-4 rounded-2xl border border-[#232D42]">
      <div className="relative w-16 h-16 shrink-0">
        <svg className="w-full h-full rotate-[-90deg]">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#1F2937"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-100">
          {value}%
        </div>
      </div>
      <div>
        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</h5>
        <span className="text-xs font-semibold text-slate-300 block mt-0.5">{subtitle}</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileMissing, setProfileMissing] = useState(false);
  
  // Data states
  const [userName, setUserName] = useState('Client');
  const [loans, setLoans] = useState([]);
  const [financialData, setFinancialData] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [recentAudits, setRecentAudits] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch User profile details
        const userRes = await profileService.getUserProfile();
        if (userRes.success) {
          setUserName(userRes.data.name);
        }

        // Fetch Loans
        const loansRes = await loanService.getAllLoans();
        if (loansRes.success) {
          setLoans(loansRes.data);
        }

        // Fetch Financial Profile
        const profileRes = await profileService.getProfile();
        if (profileRes.success) {
          setFinancialData(profileRes.data);
          
          // Fetch Health Metrics since profile exists
          const healthRes = await healthService.getFinancialHealth();
          if (healthRes.success) {
            setHealthMetrics(healthRes.data);
          }
        }

        // Fetch AI histories for recent actions
        const aiRes = await aiService.getAIHistory();
        if (aiRes.success) {
          setRecentAudits(aiRes.data.slice(0, 3));
        }
      } catch (err) {
        if (err.message && err.message.includes('Financial profile not found')) {
          setProfileMissing(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40" count={3} />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  // Quick Action Buttons config
  const quickActions = [
    { name: 'Configure Loans', path: '/loans', icon: Coins },
    { name: 'Income Profile', path: '/profile', icon: UserPlus },
    { name: 'Settle Engine', path: '/settlement', icon: TrendingUp },
    { name: 'AI Tactical Plan', path: '/negotiation', icon: BrainCircuit }
  ];

  // If profile is missing, guide the user to create it
  if (profileMissing || !financialData) {
    return (
      <div className="space-y-8 select-none animate-fade-in">
        <div className="glass rounded-3xl p-8 border border-amber-900/40 bg-[#161C2C] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-3 max-w-lg text-center md:text-left">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white">Complete Your Financial Profile</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Welcome, <strong className="text-slate-200">{userName}</strong>! Before we can analyze your financial health score, prioritize loans, and generate AI negotiation strategies, we require details about your monthly income and expenses.
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={() => navigate('/profile')}>
            Set Up Financial Profile <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.slice(0, 2).map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(act.path)}
                className="glass p-6 rounded-2xl border border-[#232D42] text-left hover:border-blue-500/20 transition-all duration-300 flex items-center gap-4 group w-full"
              >
                <div className="p-3.5 rounded-xl bg-blue-600/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-200">{act.name}</h4>
                  <span className="text-xs text-slate-500">Configure parameters</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Destructure metrics
  const {
    total_monthly_emi = 0,
    total_outstanding_debt = 0,
    monthly_surplus = 0,
    emi_ratio = 0,
    dti_ratio = 0,
    financial_health_score = 100.0,
    stress_level = 'Low'
  } = healthMetrics || {};

  // Setup Stress Level Color
  const getStressBadgeColor = (level) => {
    switch (level) {
      case 'Low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Moderate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  // Chart 2: Cash Flow (Income vs Expenses vs EMI)
  const barData = {
    labels: ['Monthly Budget Breakdown'],
    datasets: [
      {
        label: 'Income',
        data: [financialData.monthly_income],
        backgroundColor: 'rgba(16, 185, 129, 0.85)', 
        borderRadius: 12
      },
      {
        label: 'Expenses',
        data: [financialData.monthly_expenses],
        backgroundColor: 'rgba(239, 68, 68, 0.85)', 
        borderRadius: 12
      },
      {
        label: 'Loan EMIs',
        data: [total_monthly_emi],
        backgroundColor: 'rgba(59, 130, 246, 0.85)', 
        borderRadius: 12
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94A3B8', font: { family: 'Inter', size: 10 } }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94A3B8', font: { size: 10 } } },
      y: { grid: { color: '#1F2937' }, ticks: { color: '#94A3B8', font: { size: 10 } } }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none animate-fade-in">
      
      {/* LEFT COLUMN (2/3 width) - Analytics & Ratios */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Welcome card */}
        <div className="glass rounded-3xl p-6 border border-[#232D42] bg-[#161C2C] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 max-w-lg text-center sm:text-left z-10">
            <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
              Welcome Back, {userName}!
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your financial health score indicates a <strong className="text-slate-200">{stress_level.toLowerCase()}</strong> debt default risk level. Explore priorities or launch AI strategies.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/negotiation')} className="shrink-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-md shadow-indigo-500/20">
            AI Strategy <Sparkles className="w-3.5 h-3.5 ml-1.5" />
          </Button>
          <div className="absolute right-0 top-0 w-60 h-60 bg-blue-600/5 rounded-full blur-2xl -z-0" />
        </div>

        {/* 4 Metrics cards in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Credit Health Index</span>
              <p className="text-2xl font-extrabold text-white">{financial_health_score}/100</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border mt-2 ${getStressBadgeColor(stress_level)}`}>
                {stress_level} Stress
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <HeartPulse className="w-4.5 h-4.5" />
            </div>
          </Card>

          <Card className="p-5 flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Monthly Surplus</span>
              <p className={`text-2xl font-extrabold ${monthly_surplus < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                ₹{monthly_surplus.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <span className="text-[9px] text-slate-500 block mt-2">Income: ₹{financialData.monthly_income.toLocaleString()}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <IndianRupee className="w-4.5 h-4.5" />
            </div>
          </Card>
        </div>

        {/* Circular Ratios indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CircularProgress 
            value={emi_ratio} 
            label="EMI Ratio" 
            subtitle="Percentage of earnings spent on EMIs" 
            color={emi_ratio > 40 ? 'stroke-red-500' : emi_ratio > 15 ? 'stroke-yellow-500' : 'stroke-emerald-500'} 
          />
          <CircularProgress 
            value={dti_ratio} 
            label="DTI Ratio" 
            subtitle="Outstanding balance relative to annual income" 
            color={dti_ratio > 50 ? 'stroke-red-500' : dti_ratio > 20 ? 'stroke-yellow-500' : 'stroke-emerald-500'} 
          />
        </div>

        {/* Cash Flow Chart */}
        <Card title="Income vs Expenses vs EMI">
          <div className="h-64 relative">
            <Bar data={barData} options={chartOptions} />
          </div>
        </Card>

      </div>

      {/* RIGHT COLUMN (1/3 width) - EMI, AI Advice, Quick Actions */}
      <div className="space-y-6">
        
        {/* Quick actions panel */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((act, idx) => {
              const Icon = act.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(act.path)}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#0F172A]/40 border border-[#232D42] hover:border-blue-500/20 transition-all duration-200 group text-center"
                >
                  <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-2 block group-hover:text-white transition-colors">{act.name}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* AI Recommendations card */}
        <Card className="bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border border-blue-900/30">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                AI Recommendation
                <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full font-bold border border-blue-500/20">Active</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate settlement letter drafts addressed to your highest priority lender.
              </p>
              <Button variant="outline" size="sm" onClick={() => navigate('/letter')} className="text-xs px-3 py-1.5 mt-1 border-blue-500/20 text-blue-400 hover:bg-blue-500/10">
                Draft Hardship Letter
              </Button>
            </div>
          </div>
        </Card>

        {/* Upcoming EMI Card */}
        <Card title="Upcoming EMIs">
          {loans.length === 0 ? (
            <p className="text-xs text-slate-500">No active loans found.</p>
          ) : (
            <div className="space-y-3">
              {loans.slice(0, 2).map((loan) => (
                <div key={loan.loan_id} className="flex justify-between items-center bg-[#0F172A]/40 p-3.5 rounded-xl border border-[#1F2937]/50 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-200 block">{loan.lender_name}</span>
                    <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider block">{loan.loan_type}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-bold text-slate-200 block">₹{loan.emi.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span className="text-[9px] text-slate-500 font-semibold block flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-600" />
                      Due Date: {loan.due_date || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Audits Logs */}
        <Card title="Recent Audited Logs">
          {recentAudits.length === 0 ? (
            <p className="text-xs text-slate-500">No logs stored yet.</p>
          ) : (
            <div className="space-y-3">
              {recentAudits.map((aud) => (
                <div key={aud.history_id} className="flex justify-between items-center text-xs border-b border-[#1F2937]/40 pb-2 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-300 block">{aud.prompt_type === 'strategy' ? 'Strategy Generated' : 'Hardship Notice Drafted'}</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase block">{aud.generation_source} source</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{new Date(aud.generated_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>

    </div>
  );
};

export default Dashboard;
