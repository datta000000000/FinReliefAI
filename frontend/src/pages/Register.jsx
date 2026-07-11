import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, User, UserPlus, AlertCircle, Eye, EyeOff, Camera } from 'lucide-react';
import authService from '../services/authService';
import { Button, Input, FormField } from '../components/UI';
import { useToast } from '../hooks/useToast';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Password visible toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Avatar upload
  const [avatar, setAvatar] = useState(null);

  // Password strength calculation
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'None', color: 'bg-slate-700' });

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const checkPasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength({ score: 0, label: 'None', color: 'bg-slate-700' });
      return;
    }
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    let label = 'Weak';
    let color = 'bg-red-500';
    if (score >= 4) {
      label = 'Strong';
      color = 'bg-emerald-500';
    } else if (score >= 2) {
      label = 'Medium';
      color = 'bg-yellow-500';
    }
    setPasswordStrength({ score, label, color });
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size must be smaller than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    try {
      const res = await authService.register(
        data.name,
        data.email,
        data.password,
        null, // No mobile number passed
        avatar || null
      );

      if (res.success) {
        showToast('Registration successful! Please login.');
        navigate('/login');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Email already registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none animate-fade-in">
      
      {/* Background Accents */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl -z-10 animate-pulse-slow" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 mb-2 hover:scale-105 transition-transform duration-200">
          <BrainCircuit className="w-8 h-8 text-brand-accent" />
        </Link>
        <h2 className="font-display font-extrabold text-3xl text-white tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Create Your Account
        </h2>
        <p className="text-xs text-slate-400">
          Get started with AI-powered debt recovery and recovery.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md p-4">
        <div className="glass-card rounded-3xl p-8 shadow-2xl border border-brand-border bg-gradient-to-br from-[#1A1D24]/90 to-[#0F1115]/90 space-y-6">
          
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/50 flex gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-xs font-semibold">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Avatar Select widget */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative group w-20 h-20 rounded-full border-2 border-white/[0.06] overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#111827] flex items-center justify-center text-slate-500">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />
                </label>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">Avatar Photo (Optional)</span>
            </div>

            <FormField label="Full Name" error={errors.name?.message}>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Jane Doe"
                  className="pl-10"
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
            </FormField>

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
                    },
                    onChange: (e) => checkPasswordStrength(e.target.value)
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
              
              {/* Strength bar indicator */}
              {passwordStrength.score > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-[#1F2937] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`} 
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }} 
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block">Password Strength: {passwordStrength.label}</span>
                </div>
              )}
            </FormField>

            <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('confirmPassword', { required: 'Please confirm password' })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 text-sm shadow-lg shadow-brand-accent/10 rounded-xl"
              loading={loading}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register Account
            </Button>
          </form>

          <div className="text-center border-t border-white/[0.04] pt-5">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-accent hover:opacity-90 transition-colors">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
