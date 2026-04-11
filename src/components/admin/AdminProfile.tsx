import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUser } from '../../lib/db';
import { useToast } from '../../contexts/ToastContext';
import { User, Save, ShieldCheck } from 'lucide-react';
import CloudinaryWidget from '../CloudinaryWidget';

export default function AdminProfile() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name || '', phone: user.phone || '' });
      setPhotoPreview(user.photoUrl || null);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateUser(user.id, {
        name: editForm.name,
        phone: editForm.phone,
        photoUrl: photoPreview || user.photoUrl
      });
      
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 w-[95%] md:max-w-2xl lg:max-w-3xl">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Admin Profile
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your administrator account details.
          </p>
        </div>
        
        <div className="p-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-slate-400" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2">
                <CloudinaryWidget 
                  onUploadSuccess={(url) => setPhotoPreview(url)} 
                  buttonText=""
                  resourceType="image"
                  className="p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors w-10 h-10 flex items-center justify-center"
                />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 capitalize">{user.role} Account</p>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Active
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 017XXXXXXXX"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button 
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {savingProfile ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
