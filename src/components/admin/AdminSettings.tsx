import React, { useState, useEffect } from 'react';
import { getSiteContent, updateSiteContent, SiteContent } from '../../lib/db';
import { Save, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../../contexts/SiteContentContext';

export default function AdminSettings() {
  const { refreshContent } = useSiteContent();
  const [settings, setSettings] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getSiteContent('settings');
      setSettings(data || { id: 'settings' });
      if (data?.logoUrl) setLogoPreview(data.logoUrl);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleChange = (key: keyof SiteContent, value: string) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        handleChange('logoUrl', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (settings) {
      setSaving(true);
      await updateSiteContent('settings', settings);
      await refreshContent();
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading || !settings) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6 w-[95%] md:max-w-2xl lg:max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Site Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          Save Settings
        </button>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Settings updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
        
        {/* General Settings */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Site Name</label>
              <input
                type="text"
                value={settings.siteName || ''}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admission Fee (BDT)</label>
              <input
                type="number"
                value={settings.admissionFee || '10'}
                onChange={(e) => handleChange('admissionFee', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Theme</label>
                <select
                  value={settings.theme || 'light'}
                  onChange={(e) => handleChange('theme', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default Language</label>
                <select
                  value={settings.language || 'en'}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="bn">Bengali</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Logo Upload */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">School Logo</h3>
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload New Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="block w-full text-sm text-slate-500 dark:text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  dark:file:bg-blue-900/30 dark:file:text-blue-400
                  hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50
                  cursor-pointer"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Recommended size: 200x200px. Max size: 2MB.</p>
            </div>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* SEO Settings */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Title</label>
              <input
                type="text"
                value={settings.seoTitle || ''}
                onChange={(e) => handleChange('seoTitle', e.target.value)}
                placeholder="Chatkhil Government Technical School and College"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
              <textarea
                value={settings.seoDescription || ''}
                onChange={(e) => handleChange('seoDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
