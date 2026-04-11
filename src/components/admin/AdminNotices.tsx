import React, { useState, useEffect } from 'react';
import { getNotices, createNotice, updateNotice, deleteNotice, Notice } from '../../lib/db';
import { Plus, Edit, Trash2, Save, X, Upload, Link as LinkIcon, FileText } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../ConfirmModal';
import CloudinaryWidget from '../CloudinaryWidget';

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Partial<Notice>>({});
  const [uploading, setUploading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getNotices();
    setNotices(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!currentNotice.title || !currentNotice.date) {
      toast.error("Title and Date are required.");
      return;
    }

    setUploading(true);

    const noticeData: any = {
      ...currentNotice,
      type: currentNotice.type || 'general'
    };

    // Remove any undefined values to prevent Firestore errors
    Object.keys(noticeData).forEach(key => {
      if (noticeData[key] === undefined) {
        delete noticeData[key];
      }
    });

    if (currentNotice.id) {
      const success = await updateNotice(currentNotice.id, noticeData);
      if (success) {
        toast.success("Notice updated successfully.");
      } else {
        toast.error("Failed to update notice.");
        setUploading(false);
        return;
      }
    } else {
      const success = await createNotice(noticeData);
      if (success) {
        toast.success("Notice added successfully.");
      } else {
        toast.error("Failed to add notice.");
        setUploading(false);
        return;
      }
    }
    
    await loadData();
    
    setIsEditing(false);
    setCurrentNotice({});
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteNotice(id);
    if (success) {
      toast.success("Notice deleted successfully.");
      await loadData();
    } else {
      toast.error("Failed to delete notice.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notice Management</h2>
        {!isEditing && (
          <button
            onClick={() => {
              setCurrentNotice({ title: '', date: new Date().toISOString().split('T')[0], type: 'general' });
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Notice
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{currentNotice.id ? 'Edit Notice' : 'New Notice'}</h3>
            <button onClick={() => { setIsEditing(false); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              type="text"
              value={currentNotice.title || ''}
              onChange={(e) => setCurrentNotice({ ...currentNotice, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Admission 2026 Open"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={currentNotice.date || ''}
                onChange={(e) => setCurrentNotice({ ...currentNotice, date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select
                value={currentNotice.type || 'general'}
                onChange={(e) => setCurrentNotice({ ...currentNotice, type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="admission">Admission</option>
                <option value="vacation">Vacation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Upload PDF</label>
              <div className="flex items-center gap-2">
                <CloudinaryWidget 
                  onUploadSuccess={(url) => setCurrentNotice({ ...currentNotice, fileUrl: url })} 
                  buttonText="Upload PDF"
                  resourceType="auto"
                  className="w-full md:w-auto"
                />
              </div>
              {currentNotice.fileUrl && (
                <p className="text-xs text-blue-600 mt-1">Current file uploaded: <a href={currentNotice.fileUrl} target="_blank" rel="noreferrer" className="underline">View</a></p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save className="w-5 h-5" />}
              {uploading ? 'Saving...' : 'Save Notice'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {notices.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">No notices available.</p>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{notice.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                    {notice.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-2">
                  <span>{notice.date}</span>
                  {notice.fileUrl && (
                    <a href={notice.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                      <FileText className="w-4 h-4" /> PDF Attached
                    </a>
                  )}
                  {notice.linkUrl && (
                    <a href={notice.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                      <LinkIcon className="w-4 h-4" /> External Link
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0 items-start">
                <button
                  onClick={() => {
                    setCurrentNotice(notice);
                    setIsEditing(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl dark:hover:bg-blue-900/20 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(notice.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-xl dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This action cannot be undone."
        onConfirm={() => {
          if (deleteConfirmId) {
            handleDelete(deleteConfirmId);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
