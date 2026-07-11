import React, { useState } from 'react';
import { BrainCircuit, Sparkles, AlertTriangle, ShieldCheck, HelpCircle, Copy, Check } from 'lucide-react';
import { Card, Button, Spinner } from '../components/UI';
import aiService from '../services/aiService';
import { useToast } from '../hooks/useToast';

// Reusable Markdown parser helper for premium layout
export const renderMarkdown = (text) => {
  if (!text) return null;
  
  const parseBold = (str) => {
    const parts = str.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-white">{part}</strong>;
      }
      return part;
    });
  };

  return text.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return <h2 key={idx} className="font-display font-extrabold text-2xl text-white mt-6 mb-4">{trimmed.replace('# ', '')}</h2>;
    }
    if (trimmed.startsWith('## ')) {
      return <h3 key={idx} className="font-display font-bold text-lg text-slate-100 mt-5 mb-3">{trimmed.replace('## ', '')}</h3>;
    }
    if (trimmed.startsWith('### ')) {
      return <h4 key={idx} className="font-display font-bold text-base text-slate-200 mt-4 mb-2">{trimmed.replace('### ', '')}</h4>;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.substring(2);
      return <li key={idx} className="text-sm text-slate-300 ml-5 list-disc mb-1.5 leading-relaxed">{parseBold(content)}</li>;
    }
    if (trimmed.match(/^\d+\.\s/)) {
      const content = trimmed.replace(/^\d+\.\s/, '');
      return <li key={idx} className="text-sm text-slate-300 ml-5 list-decimal mb-1.5 leading-relaxed">{parseBold(content)}</li>;
    }
    if (trimmed === '') {
      return <div key={idx} className="h-3" />;
    }
    return <p key={idx} className="text-sm text-slate-300 leading-relaxed mb-3">{parseBold(line)}</p>;
  });
};

const Negotiation = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('strategy'); // 'strategy' or 'advice'
  const [copied, setCopied] = useState(false);
  
  // Data State
  const [strategyData, setStrategyData] = useState(null);

  const handleGenerateStrategy = async () => {
    setLoading(true);
    setStrategyData(null);
    setCopied(false);
    try {
      const res = await aiService.generateNegotiationStrategy();
      if (res.success) {
        setStrategyData(res.data);
        showToast('Negotiation strategy generated successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to generate negotiation strategy.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!strategyData) return;
    const content = activeTab === 'strategy' ? strategyData.strategy : strategyData.financial_advice;
    navigator.clipboard.writeText(content);
    setCopied(true);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getSourceBadge = (source) => {
    if (source === 'gemini') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Google Gemini AI</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Local Fallback Engine</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* 1. Header Control Panel */}
      <Card className="bg-gradient-to-r from-[#161C2C] to-[#1E293B]/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg text-center md:text-left">
            <h3 className="font-display font-bold text-lg text-white">AI-Powered Negotiation Coordinator</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Generate custom conversation templates, argument points, and hardship briefs matching your prioritization profiles.
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={handleGenerateStrategy}
            loading={loading}
          >
            <BrainCircuit className="w-5 h-5 mr-2" /> 
            {strategyData ? 'Re-Generate Strategy' : 'Generate AI Strategy'}
          </Button>
        </div>
      </Card>

      {/* 2. Display Loader or Blank Page */}
      {loading && (
        <Card className="py-16 text-center space-y-3">
          <Spinner size="lg" />
          <p className="text-sm text-slate-400">Consulting pre-computed financial health values and modeling strategy...</p>
        </Card>
      )}

      {/* 3. Output Area */}
      {!loading && strategyData && (
        <div className="space-y-6 animate-scale-up">
          
          {/* Metadata details */}
          <div className="flex justify-between items-center bg-[#111827] px-6 py-3 rounded-2xl border border-white/[0.04]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Metadata</span>
            {getSourceBadge(strategyData.generation_source)}
          </div>

          {/* Navigation tab bar */}
          <div className="flex justify-between items-center border-b border-[#232D42]">
            <div className="flex">
              <button
                onClick={() => setActiveTab('strategy')}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'strategy'
                    ? 'border-blue-500 text-white bg-blue-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Negotiation Strategy
              </button>
              <button
                onClick={() => setActiveTab('advice')}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === 'advice'
                    ? 'border-blue-500 text-white bg-blue-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Financial Action Advice
              </button>
            </div>
            
            {/* Copy Button */}
            <Button variant="outline" size="sm" onClick={handleCopyToClipboard} className="mb-2 shrink-0">
              {copied ? <Check className="w-4 h-4 text-emerald-400 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          {/* ChatGPT Style Response Card */}
          <div className="flex gap-4 p-6 rounded-3xl bg-[#111827]/40 border border-blue-500/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-4 pt-1">
              <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed text-sm">
                {activeTab === 'strategy' ? renderMarkdown(strategyData.strategy) : renderMarkdown(strategyData.financial_advice)}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 4. Initial Blank State */}
      {!loading && !strategyData && (
        <div className="text-center py-20 border border-dashed border-[#232D42] rounded-3xl bg-[#161C2C]/10 max-w-md mx-auto p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#1F2937] flex items-center justify-center text-blue-400 mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-200">No Strategy Loaded</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click the "Generate AI Strategy" button above to initiate the consultation workflow.
          </p>
        </div>
      )}

    </div>
  );
};

export default Negotiation;
