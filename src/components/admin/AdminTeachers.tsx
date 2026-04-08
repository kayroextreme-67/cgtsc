import React, { useState, useEffect } from 'react';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher, Teacher } from '../../lib/db';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Phone, Mail } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../ConfirmModal';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Partial<Teacher>>({});
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getTeachers();
    setTeachers(data);
    setLoading(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = async () => {
    if (!currentTeacher.name || !currentTeacher.designation) {
      toast.error("Name and Designation are required.");
      return;
    }

    setUploading(true);
    let photoUrl = currentTeacher.photoUrl;

    if (file) {
      try {
        const storageRef = ref(storage, `teachers/${Date.now()}_${file.name}`);
        
        const uploadPromise = uploadBytes(storageRef, file);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Upload timeout. Please check if Firebase Storage is enabled in your Firebase Console.")), 15000)
        );
        
        const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
        photoUrl = await getDownloadURL(snapshot.ref);
      } catch (error: any) {
        console.error("Error uploading photo:", error);
        toast.error(error.message || "Failed to upload photo. Make sure Firebase Storage is enabled.");
        setUploading(false);
        return;
      }
    }

    const teacherData: any = {
      ...currentTeacher
    };
    
    if (photoUrl) {
      teacherData.photoUrl = photoUrl;
    }

    // Remove any undefined values to prevent Firestore errors
    Object.keys(teacherData).forEach(key => {
      if (teacherData[key] === undefined) {
        delete teacherData[key];
      }
    });

    if (currentTeacher.id) {
      const success = await updateTeacher(currentTeacher.id, teacherData);
      if (success) {
        toast.success("Teacher updated successfully.");
      } else {
        toast.error("Failed to update teacher.");
        setUploading(false);
        return;
      }
    } else {
      const success = await createTeacher(teacherData);
      if (success) {
        toast.success("Teacher added successfully.");
      } else {
        toast.error("Failed to add teacher.");
        setUploading(false);
        return;
      }
    }
    
    await loadData();
    
    setIsEditing(false);
    setCurrentTeacher({});
    setFile(null);
    setPhotoPreview(null);
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteTeacher(id);
    if (success) {
      toast.success("Teacher deleted successfully.");
      await loadData();
    } else {
      toast.error("Failed to delete teacher.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Teacher Profiles</h2>
        {!isEditing && (
          <button
            onClick={() => {
              setCurrentTeacher({ name: '', designation: '' });
              setPhotoPreview(null);
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Teacher
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{currentTeacher.id ? 'Edit Teacher' : 'New Teacher'}</h3>
            <button onClick={() => { setIsEditing(false); setFile(null); setPhotoPreview(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input
                type="text"
                value={currentTeacher.name || ''}
                onChange={(e) => setCurrentTeacher({ ...currentTeacher, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Designation</label>
              <input
                type="text"
                value={currentTeacher.designation || ''}
                onChange={(e) => setCurrentTeacher({ ...currentTeacher, designation: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Head of Department"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number (Optional)</label>
              <input
                type="text"
                value={currentTeacher.phone || ''}
                onChange={(e) => setCurrentTeacher({ ...currentTeacher, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 017XXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email (Optional)</label>
              <input
                type="email"
                value={currentTeacher.email || ''}
                onChange={(e) => setCurrentTeacher({ ...currentTeacher, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., teacher@school.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Profile Photo (Optional)</label>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0">
                {photoPreview || currentTeacher.photoUrl ? (
                  <img src={photoPreview || currentTeacher.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="flex-1 w-full space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="block w-full text-sm text-slate-500 dark:text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    dark:file:bg-blue-900/30 dark:file:text-blue-400
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50
                    cursor-pointer"
                />
                
                <div className="flex items-center gap-2">
                  <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                  <span className="text-xs font-medium text-slate-400 uppercase">OR PASTE URL</span>
                  <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                </div>
                
                <input
                  type="url"
                  value={currentTeacher.photoUrl || ''}
                  onChange={(e) => {
                    setCurrentTeacher({ ...currentTeacher, photoUrl: e.target.value });
                    setPhotoPreview(e.target.value);
                    setFile(null);
                  }}
                  placeholder="e.g., https://imgur.com/..."
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">Upload an image or paste a direct image link.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save className="w-5 h-5" />}
              {uploading ? 'Saving...' : 'Save Teacher'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-500 dark:text-slate-400">No teachers found.</div>
        ) : (
          teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setCurrentTeacher(teacher);
                    setPhotoPreview(null);
                    setIsEditing(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-1.5 bg-white dark:bg-slate-800 text-blue-600 hover:bg-blue-50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(teacher.id)}
                  className="p-1.5 bg-white dark:bg-slate-800 text-red-600 hover:bg-red-50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-slate-50 dark:border-slate-800 shadow-sm">
                {teacher.photoUrl ? (
                  <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">
                    {teacher.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{teacher.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{teacher.designation}</p>
              {(teacher.phone || teacher.email) && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full text-left space-y-2">
                  {teacher.phone && (
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Phone className="w-4 h-4 mr-2 text-slate-400" />
                      {teacher.phone}
                    </div>
                  )}
                  {teacher.email && (
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Mail className="w-4 h-4 mr-2 text-slate-400" />
                      {teacher.email}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher? This action cannot be undone."
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
