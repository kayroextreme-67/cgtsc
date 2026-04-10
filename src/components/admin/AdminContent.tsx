import React, { useState, useEffect } from 'react';
import { getSiteContent, updateSiteContent, SiteContent, CustomFormField } from '../../lib/db';
import { Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../../contexts/SiteContentContext';

export default function AdminContent() {
  const { refreshContent } = useSiteContent();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await getSiteContent('main');
      setContent(data || { id: 'main' });
      setLoading(false);
    };
    loadData();
  }, []);

  const handleChange = (key: keyof SiteContent, value: any) => {
    if (content) {
      setContent({ ...content, [key]: value });
    }
  };

  const handleAddFormField = () => {
    const newField: CustomFormField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false
    };
    handleChange('admissionFormFields', [...(content?.admissionFormFields || []), newField]);
  };

  const handleUpdateFormField = (id: string, key: keyof CustomFormField, value: any) => {
    const updatedFields = (content?.admissionFormFields || []).map(field => 
      field.id === id ? { ...field, [key]: value } : field
    );
    handleChange('admissionFormFields', updatedFields);
  };

  const handleRemoveFormField = (id: string) => {
    const updatedFields = (content?.admissionFormFields || []).filter(field => field.id !== id);
    handleChange('admissionFormFields', updatedFields);
  };

  const handleSave = async () => {
    if (content) {
      setSaving(true);
      await updateSiteContent('main', content);
      await refreshContent();
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading || !content) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6 w-[95%] md:max-w-2xl lg:max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Website Content</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
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
            Content updated successfully! Changes are now live.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {/* Home Page Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Home Page</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero Title</label>
            <input
              type="text"
              value={content.homeHeroTitle || ''}
              onChange={(e) => handleChange('homeHeroTitle', e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero Subtitle</label>
            <textarea
              value={content.homeSubtitle || ''}
              onChange={(e) => handleChange('homeSubtitle', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Important Notice Text (Scrolling Banner)</label>
            <input
              type="text"
              value={content.homeNoticeText || ''}
              onChange={(e) => handleChange('homeNoticeText', e.target.value)}
              className="w-full px-4 py-2 border border-amber-200 dark:border-amber-700/50 rounded-xl bg-amber-50 dark:bg-amber-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* About Page Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">About Page</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">School Description</label>
            <textarea
              value={content.aboutDescription || ''}
              onChange={(e) => handleChange('aboutDescription', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Admission Page Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Admission Page</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page Title</label>
              <input
                type="text"
                value={content.admissionTitle || ''}
                onChange={(e) => handleChange('admissionTitle', e.target.value)}
                placeholder="Admission Information"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notice Title</label>
              <input
                type="text"
                value={content.admissionNoticeTitle || ''}
                onChange={(e) => handleChange('admissionNoticeTitle', e.target.value)}
                placeholder="ভর্তি বিজ্ঞপ্তি ২০২৬"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notice Description</label>
              <textarea
                value={content.admissionNoticeDesc || ''}
                onChange={(e) => handleChange('admissionNoticeDesc', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Application Deadline</label>
              <input
                type="text"
                value={content.admissionDeadline || ''}
                onChange={(e) => handleChange('admissionDeadline', e.target.value)}
                placeholder="31 December 2025"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={content.admissionPhone || ''}
                onChange={(e) => handleChange('admissionPhone', e.target.value)}
                placeholder="01700-000000"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admission Fee (৳)</label>
              <input
                type="number"
                value={content.admissionFee || ''}
                onChange={(e) => handleChange('admissionFee', e.target.value)}
                placeholder="500"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Class 6 Requirements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={content.admissionClass6Req1 || ''}
                onChange={(e) => handleChange('admissionClass6Req1', e.target.value)}
                placeholder="Requirement 1"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={content.admissionClass6Req2 || ''}
                onChange={(e) => handleChange('admissionClass6Req2', e.target.value)}
                placeholder="Requirement 2"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Class 9 Requirements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={content.admissionClass9Req1 || ''}
                onChange={(e) => handleChange('admissionClass9Req1', e.target.value)}
                placeholder="Requirement 1"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={content.admissionClass9Req2 || ''}
                onChange={(e) => handleChange('admissionClass9Req2', e.target.value)}
                placeholder="Requirement 2"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Class 11 Requirements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={content.admissionClass11Req1 || ''}
                onChange={(e) => handleChange('admissionClass11Req1', e.target.value)}
                placeholder="Requirement 1"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={content.admissionClass11Req2 || ''}
                onChange={(e) => handleChange('admissionClass11Req2', e.target.value)}
                placeholder="Requirement 2"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Admission Form Custom Fields</h4>
              <button
                onClick={handleAddFormField}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Field
              </button>
            </div>
            
            <div className="space-y-4">
              {(content.admissionFormFields || []).map((field: CustomFormField, index: number) => (
                <div key={field.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 relative group">
                  <button
                    onClick={() => handleRemoveFormField(field.id)}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Field Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => handleUpdateFormField(field.id, 'label', e.target.value)}
                        placeholder="e.g., Blood Group"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Field Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => handleUpdateFormField(field.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="text">Text Input</option>
                        <option value="email">Email Input</option>
                        <option value="number">Number Input</option>
                        <option value="date">Date Picker</option>
                        <option value="select">Dropdown Select</option>
                        <option value="textarea">Textarea (Long text)</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>
                    
                    {field.type === 'select' && (
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Dropdown Options (comma separated)</label>
                        <input
                          type="text"
                          value={field.options || ''}
                          onChange={(e) => handleUpdateFormField(field.id, 'options', e.target.value)}
                          placeholder="A+, A-, B+, B-, O+, O-, AB+, AB-"
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    
                    <div className="md:col-span-2 flex items-center mt-1">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => handleUpdateFormField(field.id, 'required', e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                        />
                        <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">Required Field</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!content.admissionFormFields || content.admissionFormFields.length === 0) && (
                <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">No custom fields added yet. The default form will be used.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
              <input
                type="text"
                value={content.contactAddress || ''}
                onChange={(e) => handleChange('contactAddress', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                value={content.contactPhone || ''}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={content.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
