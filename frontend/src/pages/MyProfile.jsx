import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Briefcase, 
  Calendar, 
  Camera, 
  Lock, 
  LogOut, 
  Save, 
  Edit3,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Card, Button, Input, FormField, Spinner, ErrorState } from '../components/UI';
import profileService from '../services/profileService';
import authService from '../services/authService';
import { useToast } from '../hooks/useToast';

const MyProfile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Profile data states
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);

  // Form Hooks
  const { register: registerProfile, handleSubmit: handleSubmitProfile, reset: resetProfile, formState: { errors: profileErrors } } = useForm();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: passwordErrors } } = useForm();

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await profileService.getUserProfile();
      if (res.success && res.data) {
        setUserData(res.data);
        if (res.data.profile_image) {
          setAvatar(res.data.profile_image);
        }
        resetProfile({
          name: res.data.name,
          email: res.data.email,
          mobile_number: res.data.mobile_number || '',
          country: res.data.country || '',
          occupation: res.data.occupation || ''
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch user profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size must be smaller than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setAvatar(base64String);
        
        // Auto-save avatar to database
        try {
          const res = await profileService.updateUserProfile({ profile_image: base64String });
          if (res.success) {
            showToast('Profile image uploaded successfully!');
          }
        } catch (err) {
          showToast(err.message || 'Failed to save profile avatar.', 'error');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onProfileSave = async (data) => {
    setSaveLoading(true);
    try {
      const res = await profileService.updateUserProfile({
        name: data.name,
        email: data.email,
        mobile_number: data.mobile_number,
        country: data.country,
        occupation: data.occupation
      });
      if (res.success) {
        setUserData(res.data);
        setEditMode(false);
        showToast('Profile settings saved successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const onPasswordSave = async (data) => {
    if (data.new_password !== data.confirm_password) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    setSaveLoading(true);
    try {
      const res = await profileService.updateUserProfile({
        password: data.new_password
      });
      if (res.success) {
        showToast('Password updated successfully!');
        resetPassword({ new_password: '', confirm_password: '' });
      }
    } catch (err) {
      showToast(err.message || 'Failed to change password.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) return <Spinner size="lg" className="py-24" />;
  if (errorMsg) return <ErrorState message={errorMsg} onRetry={fetchUserProfile} />;

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* Cover Banner Header Card */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/[0.04] relative">
        <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 h-32 relative overflow-hidden">
          <div className="absolute top-4 right-6 flex items-center gap-2">
            {userData?.is_mobile_verified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mobile Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5" /> Mobile Unverified
              </span>
            )}
          </div>
        </div>

        {/* Profile overlapping block */}
        <div className="px-6 pb-6 pt-16 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="absolute left-6 -top-16 group w-32 h-32 rounded-full border-4 border-[#0B0F19] overflow-hidden bg-brand-card shadow-2xl">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#111827] flex items-center justify-center text-slate-500">
                <User className="w-12 h-12" />
              </div>
            )}
            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-center p-2">
              <Camera className="w-5 h-5 mb-1" />
              <span className="text-[8px] font-bold uppercase tracking-wider">Upload photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>

          <div className="md:ml-36 text-center md:text-left space-y-1.5 mt-8 md:mt-0">
            <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">{userData?.name}</h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-500" /> {userData?.occupation || 'Occupation N/A'}</span>
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-slate-500" /> {userData?.country || 'Country N/A'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/20 bg-red-950/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all duration-200 shrink-0"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Stats column */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Security & Contact Metadata">
            <div className="space-y-4 pt-2 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#0F172A]/40 border border-white/[0.04]">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> Email
                </span>
                <span className="font-bold text-slate-200 truncate max-w-[150px]">{userData?.email}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#0F172A]/40 border border-white/[0.04]">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> Mobile
                </span>
                <span className="font-bold text-slate-200">{userData?.mobile_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#0F172A]/40 border border-white/[0.04]">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date Joined
                </span>
                <span className="font-bold text-slate-200">{new Date(userData?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Forms column */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card 
            title="Account Profile Details" 
            headerAction={
              !editMode ? (
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  <Edit3 className="w-4 h-4 mr-1.5" /> Edit Profile
                </Button>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => setEditMode(false)}>
                  <X className="w-4 h-4 mr-1.5" /> Cancel
                </Button>
              )
            }
          >
            {editMode ? (
              <form onSubmit={handleSubmitProfile(onProfileSave)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name" error={profileErrors.name?.message}>
                    <Input {...registerProfile('name', { required: 'Name is required' })} />
                  </FormField>
                  <FormField label="Email Address" error={profileErrors.email?.message}>
                    <Input type="email" {...registerProfile('email', { required: 'Email is required' })} />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Mobile Number" error={profileErrors.mobile_number?.message}>
                    <Input placeholder="e.g. +91 9876543210" {...registerProfile('mobile_number')} />
                  </FormField>
                  <FormField label="Country" error={profileErrors.country?.message}>
                    <Input placeholder="e.g. India" {...registerProfile('country')} />
                  </FormField>
                  <FormField label="Occupation" error={profileErrors.occupation?.message}>
                    <Input placeholder="e.g. Accountant" {...registerProfile('occupation')} />
                  </FormField>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                  <Button type="submit" variant="primary" loading={saveLoading}>
                    <Save className="w-4 h-4 mr-2" /> Save Profile Details
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Full Name</span>
                  <p className="font-semibold text-slate-200">{userData?.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email Address</span>
                  <p className="font-semibold text-slate-200">{userData?.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Mobile Number</span>
                  <p className="font-semibold text-slate-200">{userData?.mobile_number || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Country Location</span>
                  <p className="font-semibold text-slate-200">{userData?.country || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Occupation Info</span>
                  <p className="font-semibold text-slate-200">{userData?.occupation || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Date Registered</span>
                  <p className="font-semibold text-slate-200">{userData && new Date(userData.created_at).toLocaleString()}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Change Password */}
          <Card title="Account Password Credentials">
            <form onSubmit={handleSubmitPassword(onPasswordSave)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="New Password" error={passwordErrors.new_password?.message}>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10" 
                      {...registerPassword('new_password', { 
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' }
                      })} 
                    />
                  </div>
                </FormField>

                <FormField label="Confirm New Password" error={passwordErrors.confirm_password?.message}>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10" 
                      {...registerPassword('confirm_password', { required: 'Please confirm password' })} 
                    />
                  </div>
                </FormField>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                <Button type="submit" variant="secondary" loading={saveLoading}>
                  <Save className="w-4 h-4 mr-2" /> Change Password Credentials
                </Button>
              </div>
            </form>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default MyProfile;
