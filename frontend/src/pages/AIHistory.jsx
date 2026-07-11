import React, { useState, useEffect } from 'react';
import { Eye, Sparkles, AlertTriangle, FileText, BrainCircuit } from 'lucide-react';
import { Card, Button, Spinner, EmptyState, ErrorState } from '../components/UI';
import Modal from '../components/Modal';
import aiService from '../services/aiService';
import { renderMarkdown } from './Negotiation';

const AIHistory = () => {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [history, setHistory] = useState([]);
  
  // Selected history item modal
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await aiService.getAIHistory();
      if (res.success) {
        setHistory(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to retrieve AI interaction history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const openDetails = (record) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  if (loading) return <Spinner size="lg" className="py-24" />;
  if (errorMsg) return <ErrorState message={errorMsg} onRetry={fetchHistory} />;

  const getSourceBadge = (source) => {
    if (source === 'gemini') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span>Gemini AI</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertTriangle className="w-3 h-3 shrink-0" />
        <span>Fallback</span>
      </span>
    );
  };

  const getPromptTypeBadge = (type) => {
    if (type === 'strategy') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
          <span>Strategy</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
        <FileText className="w-3.5 h-3.5 shrink-0" />
        <span>Letter</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      <div>
        <p className="text-sm text-slate-400">View logged consultations, drafted letters, and fallback transactions history.</p>
      </div>

      {history.length === 0 ? (
        <EmptyState 
          title="No Interaction History" 
          description="Initiate an AI negotiation strategy or draft a settlement letter to log interactions." 
        />
      ) : (
        <Card className="overflow-hidden p-0 border border-[#232D42]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#111827] border-b border-[#232D42] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4 pl-6">History ID</th>
                  <th className="p-4">Prompt Type</th>
                  <th className="p-4">Generation Source</th>
                  <th className="p-4">Preview</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232D42] bg-[#161C2C]/30 text-xs">
                {history.map((record) => {
                  const contentPreview = record.prompt_type === 'strategy' 
                    ? record.negotiation_strategy 
                    : record.settlement_letter;
                  const cleanPreview = contentPreview 
                    ? contentPreview.replace(/[#*`\n]/g, ' ').substring(0, 50) + '...'
                    : 'No content previews available';

                  return (
                    <tr key={record.history_id} className="hover:bg-[#1F2937]/20 transition-colors">
                      <td className="p-4 pl-6 font-mono text-xs text-slate-400">
                        #{record.history_id}
                      </td>
                      <td className="p-4">
                        {getPromptTypeBadge(record.prompt_type)}
                      </td>
                      <td className="p-4">
                        {getSourceBadge(record.generation_source)}
                      </td>
                      <td className="p-4 text-xs text-slate-400 max-w-[200px] truncate font-medium">
                        {cleanPreview}
                      </td>
                      <td className="p-4 text-xs text-slate-500 font-semibold">
                        {new Date(record.generated_at).toLocaleString()}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => openDetails(record)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" /> View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* DETAILS DIALOG */}
      <Modal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={selectedRecord?.prompt_type === 'strategy' ? 'Negotiation Strategy Record' : 'Drafted Settlement Letter Record'}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="flex gap-3 justify-end pb-3 border-b border-[#232D42]">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Type:</span>
              {getPromptTypeBadge(selectedRecord?.prompt_type)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Source:</span>
              {getSourceBadge(selectedRecord?.generation_source)}
            </div>
            <div className="text-xs text-slate-500 flex items-center font-semibold pl-3 border-l border-[#232D42]">
              {selectedRecord && new Date(selectedRecord.generated_at).toLocaleString()}
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin select-text">
            {selectedRecord?.prompt_type === 'strategy' ? (
              <div className="prose prose-invert max-w-none select-text">
                {renderMarkdown(selectedRecord.negotiation_strategy)}
              </div>
            ) : (
              <div className="prose prose-invert max-w-none bg-white text-slate-800 p-6 rounded-xl select-text">
                <div className="select-text whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {renderMarkdown(selectedRecord?.settlement_letter)}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-3 border-t border-[#232D42] mt-4">
            <Button variant="secondary" onClick={() => setDetailsOpen(false)}>
              Close View
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AIHistory;
