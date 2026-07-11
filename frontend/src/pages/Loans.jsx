import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { Card, Button, Input, Select, FormField, Spinner, EmptyState, ErrorState } from '../components/UI';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import loanService from '../services/loanService';
import { useToast } from '../hooks/useToast';

const Loans = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  // Selected Loan tracker
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      loan_type: 'Personal',
      lender_name: '',
      loan_amount: '',
      outstanding_amount: '',
      interest_rate: '',
      emi: '',
      overdue_months: 0,
      due_date: ''
    }
  });

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await loanService.getAllLoans();
      if (res.success) {
        setLoans(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to retrieve loans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const openAddModal = () => {
    setSelectedLoan(null);
    reset({
      loan_type: 'Personal',
      lender_name: '',
      loan_amount: '',
      outstanding_amount: '',
      interest_rate: '',
      emi: '',
      overdue_months: 0,
      due_date: ''
    });
    setFormModalOpen(true);
  };

  const openEditModal = (loan) => {
    setSelectedLoan(loan);
    reset({
      loan_type: loan.loan_type,
      lender_name: loan.lender_name,
      loan_amount: loan.loan_amount,
      outstanding_amount: loan.outstanding_amount,
      interest_rate: loan.interest_rate,
      emi: loan.emi,
      overdue_months: loan.overdue_months,
      due_date: loan.due_date || ''
    });
    setFormModalOpen(true);
  };

  const openDeleteDialog = (loan) => {
    setSelectedLoan(loan);
    setConfirmDeleteOpen(true);
  };

  const onFormSubmit = async (data) => {
    setActionLoading(true);
    try {
      const payload = {
        ...data,
        loan_amount: parseFloat(data.loan_amount),
        outstanding_amount: parseFloat(data.outstanding_amount),
        interest_rate: parseFloat(data.interest_rate),
        emi: parseFloat(data.emi),
        overdue_months: parseInt(data.overdue_months, 10),
        due_date: data.due_date ? data.due_date : null
      };

      let res;
      if (selectedLoan) {
        // Edit mode
        res = await loanService.updateLoan(selectedLoan.loan_id, payload);
        if (res.success) {
          showToast('Loan record updated successfully!');
        }
      } else {
        // Add mode
        res = await loanService.createLoan(payload);
        if (res.success) {
          showToast('Loan record created successfully!');
        }
      }
      setFormModalOpen(false);
      fetchLoans();
    } catch (err) {
      showToast(err.message || 'Failed to save loan details.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const onDeleteConfirm = async () => {
    if (!selectedLoan) return;
    setActionLoading(true);
    try {
      const res = await loanService.deleteLoan(selectedLoan.loan_id);
      if (res.success) {
        showToast('Loan record deleted successfully!');
        setConfirmDeleteOpen(false);
        fetchLoans();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete loan.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner size="lg" className="py-24" />;
  if (errorMsg) return <ErrorState message={errorMsg} onRetry={fetchLoans} />;

  return (
    <div className="space-y-6 select-none">
      
      {/* Table Card Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Add, edit, or delete active debt accounts and mortgages.</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" /> Add Active Loan
        </Button>
      </div>

      {loans.length === 0 ? (
        <EmptyState 
          title="No Active Loans Found" 
          description="Click the button above to register your outstanding debts and loans to trigger prioritization." 
        />
      ) : (
        <Card className="overflow-hidden p-0 border border-[#232D42]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#111827] border-b border-[#232D42] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4 pl-6">Lender & Type</th>
                  <th className="p-4">Loan Amount</th>
                  <th className="p-4">Outstanding</th>
                  <th className="p-4">Interest Rate</th>
                  <th className="p-4">EMI</th>
                  <th className="p-4">Delinquency</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232D42] bg-[#161C2C]/30 text-xs">
                {loans.map((loan) => (
                  <tr key={loan.loan_id} className="hover:bg-[#1F2937]/20 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-slate-200">{loan.lender_name}</div>
                      <span className="text-[10px] text-slate-500 font-medium">{loan.loan_type}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      ₹{loan.loan_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 font-bold text-slate-100">
                      ₹{loan.outstanding_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{loan.interest_rate}%</td>
                    <td className="p-4 text-slate-300 font-semibold">
                      ₹{loan.emi.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      {loan.overdue_months > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          {loan.overdue_months} Mo Overdue
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Current
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                        <span>{loan.due_date || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(loan)}
                        className="p-2 rounded-lg bg-[#1F2937] hover:bg-[#374151] text-blue-400 transition-colors inline-flex items-center"
                        title="Edit Loan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(loan)}
                        className="p-2 rounded-lg bg-[#1F2937] hover:bg-red-950/40 text-red-400 transition-colors inline-flex items-center"
                        title="Delete Loan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* CREATE & EDIT FORM MODAL */}
      <Modal 
        isOpen={formModalOpen} 
        onClose={() => setFormModalOpen(false)} 
        title={selectedLoan ? 'Edit Loan Record' : 'Register New Loan Account'}
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Lender Name" error={errors.lender_name?.message}>
              <Input
                placeholder="e.g. HDFC Bank"
                {...register('lender_name', { required: 'Lender name is required' })}
              />
            </FormField>

            <FormField label="Loan Type" error={errors.loan_type?.message}>
              <Select {...register('loan_type')}>
                <option value="Personal">Personal Loan</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Home Mortgage">Home Mortgage</option>
                <option value="Auto Loan">Auto Loan</option>
                <option value="Student Loan">Student Loan</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Other">Other</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Original Loan Amount (₹)" error={errors.loan_amount?.message}>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 15000.00"
                {...register('loan_amount', { 
                  required: 'Original loan amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than zero' }
                })}
              />
            </FormField>

            <FormField label="Outstanding Balance (₹)" error={errors.outstanding_amount?.message}>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 12500.00"
                {...register('outstanding_amount', { 
                  required: 'Outstanding balance is required',
                  min: { value: 0.00, message: 'Balance cannot be negative' }
                })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Interest Rate (%)" error={errors.interest_rate?.message}>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 14.5"
                {...register('interest_rate', { 
                  required: 'Interest rate is required',
                  min: { value: 0.00, message: 'Rate cannot be negative' }
                })}
              />
            </FormField>

            <FormField label="Monthly EMI (₹)" error={errors.emi?.message}>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 350.00"
                {...register('emi', { 
                  required: 'EMI is required',
                  min: { value: 0.00, message: 'EMI cannot be negative' }
                })}
              />
            </FormField>

            <FormField label="Overdue Months" error={errors.overdue_months?.message}>
              <Input
                type="number"
                placeholder="e.g. 2"
                {...register('overdue_months', { 
                  required: 'Overdue months is required',
                  min: { value: 0, message: 'Months cannot be negative' }
                })}
              />
            </FormField>
          </div>

          <FormField label="Due Date" error={errors.due_date?.message}>
            <Input
              type="date"
              {...register('due_date')}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#232D42] mt-6">
            <Button variant="secondary" onClick={() => setFormModalOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={actionLoading}>
              {selectedLoan ? 'Save Changes' : 'Register Loan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={onDeleteConfirm}
        title="Delete Loan Record?"
        message={`Are you sure you want to remove the loan with ${selectedLoan?.lender_name}? This action will also delete all associated settlement recommendations.`}
        confirmText="Delete"
        loading={actionLoading}
      />

    </div>
  );
};

export default Loans;
