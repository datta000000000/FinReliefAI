import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Activity, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { Card, Button, Input, FormField, Spinner, ErrorState } from '../components/UI';
import profileService from '../services/profileService';
import { useToast } from '../hooks/useToast';

const Profile = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // Profile data states for live calculation previews
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [existingDebts, setExistingDebts] = useState(0);

  // Form hooks
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const profileRes = await profileService.getProfile();
      if (profileRes.success && profileRes.data) {
        setProfileExists(true);
        setValue('monthly_income', profileRes.data.monthly_income);
        setValue('monthly_expenses', profileRes.data.monthly_expenses);
        setValue('existing_debts', profileRes.data.existing_debts);

        // Populate calculation previews
        setMonthlyIncome(profileRes.data.monthly_income);
        setMonthlyExpenses(profileRes.data.monthly_expenses);
        setExistingDebts(profileRes.data.existing_debts);
      }
    } catch (err) {
      if (err.message && err.message.includes('Financial profile not found')) {
        setProfileExists(false);
      } else {
        setErrorMsg(err.message || 'Failed to fetch financial profile details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onProfileSubmit = async (data) => {
    setSaveLoading(true);
    try {
      const payload = {
        monthly_income: parseFloat(data.monthly_income),
        monthly_expenses: parseFloat(data.monthly_expenses),
        existing_debts: parseFloat(data.existing_debts)
      };

      let res;
      if (profileExists) {
        res = await profileService.updateProfile(payload);
        if (res.success) {
          showToast('Financial profile updated successfully!');
        }
      } else {
        res = await profileService.createProfile(payload);
        if (res.success) {
          setProfileExists(true);
          showToast('Financial profile created successfully!');
        }
      }

      setMonthlyIncome(payload.monthly_income);
      setMonthlyExpenses(payload.monthly_expenses);
      setExistingDebts(payload.existing_debts);
    } catch (err) {
      showToast(err.message || 'Failed to save financial profile.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = (field, val) => {
    const parsed = parseFloat(val) || 0;
    if (field === 'income') setMonthlyIncome(parsed);
    if (field === 'expenses') setMonthlyExpenses(parsed);
    if (field === 'debts') setExistingDebts(parsed);
  };

  if (loading) return <Spinner size="lg" className="py-24" />;
  if (errorMsg) return <ErrorState message={errorMsg} onRetry={fetchProfile} />;

  const projectedSurplus = monthlyIncome - monthlyExpenses - existingDebts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none animate-fade-in">
      
      {/* Financial Profile Card */}
      <div className="lg:col-span-2">
        <Card title="Financial Profile Configuration">
          <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-5">
            <p className="text-xs text-slate-400 leading-relaxed">
              Provide details about your current cash flow. This information is processed locally by our deterministic engine to assess stress indexes and settle parameters.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Monthly Income (₹)" error={errors.monthly_income?.message}>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 50000.00"
                  {...register('monthly_income', { 
                    required: 'Monthly income is required',
                    min: { value: 0.01, message: 'Income must be greater than zero' },
                    onChange: (e) => handleInputChange('income', e.target.value)
                  })}
                />
              </FormField>

              <FormField label="Monthly Expenses (₹)" error={errors.monthly_expenses?.message}>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 30000.00"
                  {...register('monthly_expenses', { 
                    required: 'Monthly expenses is required',
                    min: { value: 0.00, message: 'Expenses cannot be negative' },
                    onChange: (e) => handleInputChange('expenses', e.target.value)
                  })}
                />
              </FormField>
            </div>

            <FormField label="Other Existing Debts (₹)" error={errors.existing_debts?.message}>
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 0.00"
                {...register('existing_debts', { 
                  required: 'Other existing debts is required',
                  min: { value: 0.00, message: 'Debts cannot be negative' },
                  onChange: (e) => handleInputChange('debts', e.target.value)
                })}
              />
            </FormField>

            <div className="flex justify-end pt-4 border-t border-white/[0.04]">
              <Button type="submit" variant="primary" loading={saveLoading}>
                <Save className="w-4 h-4 mr-2" /> {profileExists ? 'Update Profile' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Live Financial Previews & Summary Card */}
      <div className="lg:col-span-1">
        <Card title="Live Projection Summary">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Local Projections</h4>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">Updated in real-time</span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#0F172A]/40 border border-white/[0.04]">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Monthly Inflow
                </span>
                <span className="font-bold text-slate-200">₹{monthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-[#0F172A]/40 border border-white/[0.04]">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                  Monthly Outflow
                </span>
                <span className="font-bold text-slate-200">₹{(monthlyExpenses + existingDebts).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between items-center p-3.5 rounded-xl border border-white/[0.05] bg-gradient-to-r from-blue-950/20 to-indigo-950/20">
                <span className="text-slate-200 font-bold flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  Projected Surplus
                </span>
                <span className={`font-extrabold ${projectedSurplus < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  ₹{projectedSurplus.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center mt-4 leading-relaxed font-semibold">
              *Projections represent estimated ratios prior to calculating actual loan EMIs.*
            </p>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default Profile;
