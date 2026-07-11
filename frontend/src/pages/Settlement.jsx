import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  TrendingUp, 
  History, 
  AlertCircle, 
  ArrowRight
} from 'lucide-react';
import { Card, Button, Spinner, EmptyState, ErrorState } from '../components/UI';
import settlementService from '../services/settlementService';

const Settlement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' or 'history'
  const [errorMsg, setErrorMsg] = useState('');
  
  // Data states
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchSettlementData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      // Fetch analysis
      const analysisRes = await settlementService.getSettlementAnalysis();
      if (analysisRes.success) {
        setAnalysis(analysisRes.data);
      }

      // Fetch history
      const historyRes = await settlementService.getSettlementHistory();
      if (historyRes.success) {
        setHistory(historyRes.data);
      }
    } catch (err) {
      if (err.message && err.message.includes('Financial profile not found')) {
        setErrorMsg('PROFILE_MISSING');
      } else {
        setErrorMsg(err.message || 'Failed to retrieve debt settlement data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlementData();
  }, []);

  if (loading) return <Spinner size="lg" className="py-24" />;

  if (errorMsg === 'PROFILE_MISSING') {
    return (
      <div className="max-w-md mx-auto py-12">
        <Card className="text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-white">Financial Profile Missing</h3>
          <p className="text-sm text-slate-400">
            We require your financial profile coordinates to compute target settlements and loan priority scores.
          </p>
          <Button variant="primary" className="w-full" onClick={() => navigate('/profile')}>
            Set Up Profile <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  if (errorMsg) return <ErrorState message={errorMsg} onRetry={fetchSettlementData} />;

  const getPriorityBadgeColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* Navigation tabs */}
      <div className="flex border-b border-[#232D42]">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'analysis'
              ? 'border-blue-500 text-white bg-blue-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Prioritization Analysis</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'history'
              ? 'border-blue-500 text-white bg-blue-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Saved History Logs</span>
        </button>
      </div>

      {/* Tab: Prioritization Analysis */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#161C2C]/30 p-5 rounded-2xl border border-[#232D42]">
            <p className="text-sm text-slate-400 max-w-xl">
              Loans are evaluated using a deterministic priority algorithm. Addressing high-priority balances first minimizes delinquency fees and optimizes cash reserves.
            </p>
            <div className="flex gap-4 items-center shrink-0">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-500 uppercase">Health Score</span>
                <span className="text-lg font-bold text-white">{analysis?.financial_health_score}/100</span>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-500 uppercase">Stress Level</span>
                <span className="text-lg font-bold text-blue-400">{analysis?.stress_level}</span>
              </div>
            </div>
          </div>

          {analysis?.loans.length === 0 ? (
            <EmptyState 
              title="No Loans Registered" 
              description="Register loans in the Loan page to activate priority scoring." 
            />
          ) : (
            <div className="space-y-4">
              {analysis?.loans.map((loan, index) => (
                <Card 
                  key={loan.loan_id}
                  className="hover:border-blue-500/20 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Loan info */}
                    <div className="space-y-3 lg:max-w-md">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#1F2937] font-bold text-xs text-slate-300">
                          #{index + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-200 text-base">{loan.lender_name}</h4>
                          <span className="text-xs text-slate-500">{loan.loan_type}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium bg-[#111827]/40 p-3 rounded-xl border border-[#1F2937]">
                        {loan.reason}
                      </p>
                    </div>

                    {/* Calculations */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left lg:text-right">
                      
                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority Score</span>
                        <span className="text-xl font-extrabold text-white mt-0.5 block">{loan.priority_score}</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1.5 ${getPriorityBadgeColor(loan.priority_level)}`}>
                          {loan.priority_level} Priority
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outstanding</span>
                        <span className="text-xl font-extrabold text-slate-300 mt-0.5 block">
                          ₹{loan.outstanding_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Settlement Target</span>
                        <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block">{loan.recommended_settlement_pct}%</span>
                        <span className="text-xs text-slate-500 block mt-1.5">Proposed Ratio</span>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Payout</span>
                        <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block">
                          ₹{loan.recommended_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-slate-500 block mt-1.5 font-semibold text-emerald-500">
                          Save ₹{Math.round(loan.outstanding_amount - loan.recommended_amount).toLocaleString()}
                        </span>
                      </div>

                    </div>

                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved History Logs */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {history.length === 0 ? (
            <EmptyState 
              title="No Stored Recommendations" 
              description="Navigate to the Prioritization Analysis tab to calculate and log recommendations into the database." 
            />
          ) : (
            <Card className="overflow-hidden p-0 border border-[#232D42]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#111827] border-b border-[#232D42] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-4 pl-6">Settlement ID</th>
                      <th className="p-4">Creditor Lender</th>
                      <th className="p-4">Total Balance</th>
                      <th className="p-4">Settlement Target</th>
                      <th className="p-4">Recommended Payout</th>
                      <th className="p-4">Priority Level</th>
                      <th className="p-4 pr-6">Generated Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#232D42] bg-[#161C2C]/30 text-xs font-semibold">
                    {history.map((record) => (
                      <tr key={record.settlement_id} className="hover:bg-[#1F2937]/20 transition-colors">
                        <td className="p-4 pl-6 font-mono text-xs text-slate-400">
                          #{record.settlement_id}
                        </td>
                        <td className="p-4 font-semibold text-slate-200">
                          {record.lender_name}
                        </td>
                        <td className="p-4 text-slate-300">
                          ₹{record.outstanding_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-emerald-400">
                          {record.settlement_prediction}
                        </td>
                        <td className="p-4 text-emerald-400">
                          ₹{record.recommended_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadgeColor(record.priority_level)}`}>
                            {record.priority_level}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-slate-500 font-medium">
                          {new Date(record.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

    </div>
  );
};

export default Settlement;
