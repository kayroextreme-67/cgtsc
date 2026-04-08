import React, { useState, useEffect } from 'react';
import { getExams, createExam, updateExam, deleteExam, ExamResult } from '../../lib/db';
import { Plus, Edit, Trash2, Save, X, Search, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../ConfirmModal';

export default function AdminResults() {
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExam, setCurrentExam] = useState<Partial<ExamResult>>({});
  const [jsonInput, setJsonInput] = useState('');
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getExams();
    setExams(data);
    setLoading(false);
  };

  const validateJson = () => {
    try {
      if (!jsonInput.trim()) {
        throw new Error("JSON data cannot be empty.");
      }
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON data must be an array of student results.");
      }
      
      // Basic validation of the first item to ensure it has required fields
      if (parsed.length > 0) {
        const first = parsed[0];
        const info = first.student_info || first;
        if (!info.idNumber && !info.id_number && !info.student_id && !info.id) {
          throw new Error("Each result object must contain an ID field (id, idNumber, etc.).");
        }
      }

      setValidationStatus('valid');
      setValidationMessage(`Valid JSON array with ${parsed.length} student records.`);
      return true;
    } catch (error: any) {
      setValidationStatus('invalid');
      setValidationMessage(error.message || "Invalid JSON format.");
      return false;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        // Verify it's valid JSON before setting
        JSON.parse(content);
        setJsonInput(content);
        setValidationStatus('idle');
        // Auto-validate after a short delay
        setTimeout(() => {
          // We need to trigger validation, but state might not be updated yet
          // So we'll let the user click validate or it will validate on save
        }, 100);
      } catch (err) {
        toast.error("Failed to parse uploaded file as JSON.");
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!currentExam.title || !currentExam.year) {
      toast.error("Exam Title and Year are required.");
      return;
    }

    if (!validateJson()) {
      toast.error("Please provide valid JSON data before saving.");
      return;
    }

    const examData: any = {
      ...currentExam,
      resultsData: jsonInput
    };

    if (currentExam.id) {
      const success = await updateExam(currentExam.id, examData);
      if (success) {
        toast.success("Exam results updated successfully.");
      } else {
        toast.error("Failed to update exam results.");
        return;
      }
    } else {
      const success = await createExam(examData);
      if (success) {
        toast.success("Exam results added successfully.");
      } else {
        toast.error("Failed to add exam results.");
        return;
      }
    }
    
    await loadData();
    
    setIsEditing(false);
    setCurrentExam({});
    setJsonInput('');
    setValidationStatus('idle');
  };

  const handleDelete = async (id: string) => {
    const success = await deleteExam(id);
    if (success) {
      toast.success("Exam deleted successfully.");
      await loadData();
    } else {
      toast.error("Failed to delete exam.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Result System</h2>
        {!isEditing && (
          <button
            onClick={() => {
              setCurrentExam({ title: '', year: new Date().getFullYear().toString() });
              setJsonInput('[\n  {\n    "idNumber": "101",\n    "name": "John Doe",\n    "Bangla": 85,\n    "Math": 90,\n    "English": "A"\n  }\n]');
              setValidationStatus('idle');
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Upload New Results
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{currentExam.id ? 'Edit Exam Results' : 'Upload Exam Results'}</h3>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Exam Title</label>
              <input
                type="text"
                value={currentExam.title || ''}
                onChange={(e) => setCurrentExam({ ...currentExam, title: e.target.value })}
                placeholder="e.g., Half Yearly 2025"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year</label>
              <select
                value={currentExam.year || ''}
                onChange={(e) => setCurrentExam({ ...currentExam, year: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {[...Array(5)].map((_, i) => {
                  const year = (new Date().getFullYear() - i).toString();
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">JSON Data (Array of student records)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  Upload .json File
                  <input 
                    type="file" 
                    accept=".json,application/json" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                </label>
                <button 
                  onClick={validateJson}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Validate JSON
                </button>
              </div>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setValidationStatus('idle');
              }}
              rows={12}
              className="w-full px-4 py-3 font-mono text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 shadow-inner"
              placeholder="Paste your JSON array here or upload a file..."
            />
            
            {validationStatus === 'valid' && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                {validationMessage}
              </div>
            )}
            {validationStatus === 'invalid' && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                {validationMessage}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Results
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Exam Title</th>
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Year</th>
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Records</th>
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">No exams found.</td>
                </tr>
              ) : (
                exams.map(exam => {
                  let recordCount = 0;
                  try {
                    recordCount = JSON.parse(exam.resultsData).length;
                  } catch (e) {}

                  return (
                    <tr key={exam.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{exam.title}</td>
                      <td className="p-4 text-slate-700 dark:text-slate-300">{exam.year}</td>
                      <td className="p-4 text-slate-700 dark:text-slate-300">{recordCount} students</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => { 
                              setCurrentExam(exam); 
                              setJsonInput(exam.resultsData);
                              setValidationStatus('idle');
                              setIsEditing(true); 
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} 
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20" 
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(exam.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20" title="Delete">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Delete Exam Results"
        message="Are you sure you want to delete this exam and all its results? This action cannot be undone."
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
