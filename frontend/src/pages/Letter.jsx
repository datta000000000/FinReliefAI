import React, { useState, useEffect } from 'react';
import { FileSignature, Sparkles, AlertTriangle, Copy, Check, Printer } from 'lucide-react';
import { Card, Button, Select, FormField, Spinner } from '../components/UI';
import aiService from '../services/aiService';
import loanService from '../services/loanService';
import { useToast } from '../hooks/useToast';
import { renderMarkdown } from './Negotiation';

const Letter = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Data states
  const [loans, setLoans] = useState([]);
  const [selectedLender, setSelectedLender] = useState('');
  const [letterData, setLetterData] = useState(null);

  useEffect(() => {
    // Fetch active loans to populate lender dropdown selection
    loanService.getAllLoans()
      .then((res) => {
        if (res.success) {
          setLoans(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleGenerateLetter = async () => {
    setLoading(true);
    setLetterData(null);
    setCopied(false);
    try {
      const res = await aiService.generateSettlementLetter(selectedLender || null);
      if (res.success) {
        setLetterData(res.data);
        showToast('Settlement letter drafted successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to draft settlement letter.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!letterData?.settlement_letter) return;
    navigator.clipboard.writeText(letterData.settlement_letter);
    setCopied(true);
    showToast('Letter text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getSourceBadge = (source) => {
    if (source === 'gemini') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Google Gemini AI</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <span>Local Fallback Engine</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* 1. Generation Parameters Control Card */}
      <Card title="Hardship Offer Configuration">
        <div className="flex flex-col md:flex-row items-end gap-5">
          <FormField label="Target Lender" className="flex-1 w-full">
            <Select 
              value={selectedLender} 
              onChange={(e) => setSelectedLender(e.target.value)}
              disabled={loading}
            >
              <option value="">General Settlement (All Lenders)</option>
              {loans.map(loan => (
                <option key={loan.loan_id} value={loan.lender_name}>
                  {loan.lender_name} - ₹{loan.outstanding_amount.toLocaleString()}
                </option>
              ))}
            </Select>
          </FormField>

          <Button
            variant="primary"
            onClick={handleGenerateLetter}
            loading={loading}
            className="w-full md:w-auto px-8"
          >
            <FileSignature className="w-5 h-5 mr-2" /> Draft Settlement Offer
          </Button>
        </div>
      </Card>

      {/* 2. Loading state */}
      {loading && (
        <Card className="py-16 text-center space-y-3">
          <Spinner size="lg" />
          <p className="text-sm text-slate-400">Structuring professional correspondence parameters citing hardship statistics...</p>
        </Card>
      )}

      {/* 3. Output Viewer */}
      {!loading && letterData && (
        <div className="space-y-4 animate-scale-up">
          
          {/* Metadata bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#111827] px-6 py-4 rounded-2xl border border-white/[0.04]">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Metadata</span>
              {getSourceBadge(letterData.generation_source)}
            </div>
            
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopyText}>
                {copied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied' : 'Copy Text'}
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" /> Print Letter
              </Button>
            </div>
          </div>

          {/* ChatGPT style response card */}
          <div className="flex gap-4 p-6 rounded-3xl bg-[#111827]/40 border border-blue-500/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <FileSignature className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-4 pt-1 select-text">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drafted Hardship Settlement Notice:</p>
              
              {/* Actual Letter Document Card */}
              <Card className="bg-white text-slate-800 p-8 shadow-inner overflow-y-auto max-h-[500px] border border-slate-300 rounded-2xl select-text">
                <div className="font-sans leading-relaxed text-sm select-text whitespace-pre-wrap select-text">
                  {renderMarkdown(letterData.settlement_letter)}
                </div>
              </Card>
            </div>
          </div>

        </div>
      )}

      {/* 4. Empty state */}
      {!loading && !letterData && (
        <div className="text-center py-20 border border-dashed border-[#232D42] rounded-3xl bg-[#161C2C]/10 max-w-md mx-auto p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#1F2937] flex items-center justify-center text-blue-400 mx-auto">
            <FileSignature className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-200">No Draft Generated</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select a target creditor or keep General selected, and click "Draft Settlement Offer" to prepare your hardship notice.
          </p>
        </div>
      )}

    </div>
  );
};

export default Letter;
