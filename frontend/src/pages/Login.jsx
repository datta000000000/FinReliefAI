import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import authService from '../services/authService';
import { Button, Input, FormField } from '../components/UI';
import { useToast } from '../hooks/useToast';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const isExpired = searchParams.get('expired') === 'true';

  const onSubmit = async (data) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await authService.login(data.email, data.password);
      if (res.success) {
        showToast('Login successful! Welcome back.');
        navigate('/dashboard');
      } else {
        setErrorMsg(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      
      {/* Visual Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 mb-2 hover:scale-105 transition-transform duration-200">
          <BrainCircuit className="w-8 h-8 text-brand-accent" />
        </Link>
        <h2 className="font-display font-extrabold text-3xl tracking-tight text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Sign In to FinRelief AI
        </h2>
        <p className="text-sm text-slate-400">
          Manage your debt recovery plan and AI-powered tactics.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md p-4">
        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-brand-border bg-gradient-to-br from-[#1A1D24]/90 to-[#0F1115]/90 space-y-6">
          
          {isExpired && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/50 flex gap-3 text-amber-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-xs font-semibold">Your session has expired. Please sign in again.</p>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/50 flex gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-xs font-semibold">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Email Address" error={errors.email?.message}>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 text-sm shadow-lg shadow-brand-accent/10 rounded-xl"
              loading={loading}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          <div className="text-center border-t border-white/[0.04] pt-5">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-brand-accent hover:opacity-90 transition-colors">
                Create account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
