import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartPulse, 
  AlertCircle, 
  IndianRupee, 
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { Card, Button, Spinner, ErrorState } from '../components/UI';
import healthService from '../services/healthService';

const ScoreDial = ({ score }) => {
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full rotate-[-90deg]">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#1F2937"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          strokeLinecap="round"
          stroke={score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white tracking-tight">{score}</span>
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Score Index</span>
      </div>
    </div>
  );
};

const Health = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [healthData, setHealthData] = useState(null);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await healthService.getFinancialHealth();
      if (res.success) {
        setHealthData(res.data);
      }
    } catch (err) {
      if (err.message && err.message.includes('Financial profile not found')) {
        setErrorMsg('PROFILE_MISSING');
      } else {
        setErrorMsg(err.message || 'Failed to retrieve financial health data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  if (loading) return <Spinner size="lg" className="py-24" />;

  if (errorMsg === 'PROFILE_MISSING') {
    return (
      <div className="max-w-md mx-auto py-12 select-none animate-fade-in">
        <Card className="text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-white">Financial Profile Missing</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            We cannot compute your financial health indicators without a financial profile. Set up your monthly income and expenses.
          </p>
          <Button variant="primary" className="w-full" onClick={() => navigate('/profile')}>
            Set Up Profile <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  if (errorMsg) return <ErrorState message={errorMsg} onRetry={fetchHealthData} />;

  const {
    total_monthly_emi = 0,
    total_outstanding_debt = 0,
    monthly_surplus = 0,
    emi_ratio = 0,
    dti_ratio = 0,
    financial_health_score = 100,
    stress_level = 'Low'
  } = healthData || {};

  const getEmiRatioColor = (ratio) => {
    if (ratio <= 15) return { color: 'text-emerald-400', bar: 'bg-emerald-500', label: 'Healthy (<15%)' };
    if (ratio <= 40) return { color: 'text-yellow-400', bar: 'bg-yellow-500', label: 'Manageable (15%-40%)' };
    return { color: 'text-red-400', bar: 'bg-red-500', label: 'Critical (>40%)' };
  };

  const getDtiRatioColor = (ratio) => {
    if (ratio <= 20) return { color: 'text-emerald-400', bar: 'bg-emerald-500', label: 'Healthy (<20%)' };
    if (ratio <= 50) return { color: 'text-yellow-400', bar: 'bg-yellow-500', label: 'Moderate (20%-50%)' };
    return { color: 'text-red-400', bar: 'bg-red-500', label: 'High Debt Ratio (>50%)' };
  };

  const emiMeta = getEmiRatioColor(emi_ratio);
  const dtiMeta = getDtiRatioColor(dti_ratio);

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* 1. Score & Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Circular health score gauge */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#161C2C]/50 to-[#0B0F19]/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Financial Health Index</span>
          <ScoreDial score={financial_health_score} />
          <span className="text-sm font-semibold text-slate-200 mt-4 mb-1">Stress Level: {stress_level}</span>
          <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs">
            Calculated deterministically using your outstanding balance, EMIs, expenses, and monthly income parameters.
          </p>
        </Card>

        {/* Narrative & Details */}
        <Card title="Assessment Diagnosis" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Stress Index Insights</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  Your stress categorization is <strong className="text-slate-200">{stress_level}</strong>. This metric measures your susceptibility to debt default defaults based on cash constraints and debt ratios.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <IndianRupee className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Cash Flow Integrity</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  Monthly surplus is currently **₹{monthly_surplus.toLocaleString(undefined, { minimumFractionDigits: 2 })}**. A negative or low surplus reduces your leverage when negotiating lump-sum settlements since creditors know you cannot save easily.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Scale className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Leverage and Prioritization</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  With a total outstanding debt of **₹{total_outstanding_debt.toLocaleString()}**, prioritizing accounts is key. Use the Settlement Engine to determine which debts present high default risks and optimize repayment channels.
                </p>
              </div>
            </div>
          </div>
        </Card>

      </div>

      {/* 2. Ratios & Detailed Progress bars */}
      <Card title="Financial Risk Indicators">
        <div className="space-y-6">
          
          {/* EMI Ratio Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  EMI Ratio <span className="text-xs font-normal text-slate-400">({emiMeta.label})</span>
                </h4>
                <span className="text-xs text-slate-500">Percentage of monthly income spent on debt EMIs.</span>
              </div>
              <span className={`text-lg font-bold ${emiMeta.color}`}>{emi_ratio}%</span>
            </div>
            <div className="h-2.5 w-full bg-[#1F2937]/50 rounded-full overflow-hidden">
              <div className={`h-full ${emiMeta.bar} transition-all duration-1000 ease-out`} style={{ width: `${Math.min(100, emi_ratio)}%` }} />
            </div>
          </div>

          {/* DTI Ratio Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  Debt-to-Income (DTI) Ratio <span className="text-xs font-normal text-slate-400">({dtiMeta.label})</span>
                </h4>
                <span className="text-xs text-slate-500">Total outstanding debt relative to your annual income.</span>
              </div>
              <span className={`text-lg font-bold ${dtiMeta.color}`}>{dti_ratio}%</span>
            </div>
            <div className="h-2.5 w-full bg-[#1F2937]/50 rounded-full overflow-hidden">
              <div className={`h-full ${dtiMeta.bar} transition-all duration-1000 ease-out`} style={{ width: `${Math.min(100, dti_ratio)}%` }} />
            </div>
          </div>

          {/* Monthly Surplus bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Monthly Cash Buffer</h4>
                <span className="text-xs text-slate-500">Remaining cash reserve after all expenses and EMIs.</span>
              </div>
              <span className={`text-lg font-bold ${monthly_surplus < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                ₹{monthly_surplus.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-2.5 w-full bg-[#1F2937]/50 rounded-full overflow-hidden">
              <div 
                className={`h-full ${monthly_surplus < 0 ? 'bg-red-500' : 'bg-emerald-500'} transition-all duration-1000 ease-out`} 
                style={{ width: `${monthly_surplus <= 0 ? 10 : Math.min(100, (monthly_surplus / 5000) * 100)}%` }} 
              />
            </div>
          </div>

        </div>
      </Card>

    </div>
  );
};

export default Health;
