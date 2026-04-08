import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clock, LogOut } from 'lucide-react';

export default function PendingApproval() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.status === 'approved') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || user.status === 'approved') {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    // The useEffect will handle navigating to /login
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-[95%] md:max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Account Pending Approval</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Thank you for creating your profile, {user.name}. Your account is currently under review by an administrator. You will receive an email notification once your account has been approved.
        </p>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
