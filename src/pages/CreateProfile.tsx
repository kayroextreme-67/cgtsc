import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateUser, validateStudentIdExists, verifyStudentForParent, Role } from '../lib/db';
import { motion, AnimatePresence } from 'motion/react';
import { User, BookOpen, Users, ArrowRight, Loader2, UserPlus, Phone, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const normalizePhone = (phone: string) => {
  let cleaned = phone.replace(/\s+/g, '');
  if (cleaned.startsWith('+880')) {
    cleaned = '0' + cleaned.substring(4);
  } else if (cleaned.startsWith('880')) {
    cleaned = '0' + cleaned.substring(3);
  }
  return cleaned;
};

const isValidBDPhone = (phone: string) => {
  const normalized = normalizePhone(phone);
  return /^01[3-9]\d{8}$/.test(normalized);
};

export default function CreateProfile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState(user?.name || '');
  const [formData, setFormData] = useState({
    studentId: '',
    classLevel: '',
    section: '',
    guardianPhone: '',
    linkedChildId: '',
    parentPhone: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Parent Verification State
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role && !(user.role === 'visitor' && user.status === 'pending')) {
      if (user.status === 'pending') navigate('/pending-approval');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || (user.role && !(user.role === 'visitor' && user.status === 'pending'))) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Reset section if class changes between 6-8 and 9-12
    if (name === 'classLevel') {
      const numClass = parseInt(value);
      if (numClass >= 9 && numClass <= 12) {
        setFormData(prev => ({ ...prev, classLevel: value, section: 'IoT' }));
      } else {
        setFormData(prev => ({ ...prev, classLevel: value, section: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Reset verification if parent changes child ID or phone
    if (name === 'linkedChildId' || name === 'parentPhone') {
      setVerificationStatus('idle');
      setVerificationMessage('');
    }
    
    setError('');
  };

  const handleVerifyParent = async () => {
    if (!formData.linkedChildId.trim()) {
      setError('Child\'s Student ID is required for verification');
      return;
    }
    if (!formData.parentPhone.trim()) {
      setError('Parent Phone Number is required for verification');
      return;
    }
    if (!isValidBDPhone(formData.parentPhone)) {
      setError('Please enter a valid Bangladesh phone number');
      return;
    }

    setVerificationStatus('loading');
    setError('');
    
    const normalizedPhone = normalizePhone(formData.parentPhone);
    const result = await verifyStudentForParent(formData.linkedChildId, normalizedPhone);
    
    if (result.success) {
      setVerificationStatus('success');
      setVerificationMessage(`Verified! Student: ${result.studentName}`);
      toast.success(`Verified! Student: ${result.studentName}`);
    } else {
      setVerificationStatus('error');
      setVerificationMessage(result.message || 'Verification failed');
      toast.error(result.message || 'Verification failed');
    }
  };

  const validateForm = () => {
    if (!name.trim()) return 'Full Name is required';
    if (!role) return 'Please select a role';

    if (role === 'student') {
      if (!formData.studentId.trim()) return 'Student ID is required';
      if (!formData.classLevel) return 'Class is required';
      if (!formData.guardianPhone.trim()) return 'Guardian Phone Number is required';
      if (!isValidBDPhone(formData.guardianPhone)) return 'Please enter a valid Bangladesh phone number';
      
      const numClass = parseInt(formData.classLevel);
      if (numClass >= 6 && numClass <= 8) {
        if (formData.section !== 'A' && formData.section !== 'B') {
          return 'For Class 6-8, Section must be A or B';
        }
      } else if (numClass >= 9 && numClass <= 12) {
        if (!['IoT', 'GEW', 'CCS', 'RAC'].includes(formData.section)) {
          return 'For Class 9-12, please select a valid Trade';
        }
      } else {
        return 'Invalid Class selected';
      }
    } else if (role === 'parent') {
      if (!formData.linkedChildId.trim()) return 'Child\'s Student ID is required';
      if (!formData.parentPhone.trim()) return 'Phone Number is required';
      if (verificationStatus !== 'success') return 'Please verify your child\'s details first';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    
    const status = role === 'visitor' ? 'approved' : 'pending';

    try {
      const updatedUser = await updateUser(user.id, {
        name,
        role,
        status,
        ...(role === 'student' && {
          studentId: formData.studentId,
          class: parseInt(formData.classLevel),
          section: formData.section as "A" | "B" | "IoT" | "GEW" | "CCS" | "RAC",
          phone: normalizePhone(formData.guardianPhone),
        }),
        ...(role === 'parent' && {
          linkedChildId: formData.linkedChildId,
          phone: normalizePhone(formData.parentPhone),
        })
      });

      if (!updatedUser) {
        setError('Failed to update profile. Please try again.');
        setIsSubmitting(false);
        return;
      }

      await refreshUser();
      toast.success('Profile created successfully!');
      
      if (status === 'pending') {
        navigate('/pending-approval');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
      toast.error(err.message || 'Failed to update profile.');
      setIsSubmitting(false);
    }
  };

  const isValid = !validateForm();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Complete Your Profile</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Complete your profile to continue accessing the portal.</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">I am a...</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => { setRole('student'); setError(''); }}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    role === 'student'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <BookOpen className="w-6 h-6" />
                  <span className="text-sm font-medium">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('parent'); setError(''); }}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    role === 'parent'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Users className="w-6 h-6" />
                  <span className="text-sm font-medium">Parent</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRole('visitor'); setError(''); }}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    role === 'visitor'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <User className="w-6 h-6" />
                  <span className="text-sm font-medium">Visitor</span>
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {role === 'student' && (
              <motion.div 
                key="student-fields"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student ID</label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none"
                    placeholder="e.g. STU-2026-001"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class</label>
                    <select
                      name="classLevel"
                      value={formData.classLevel}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none appearance-none"
                    >
                      <option value="">Select Class</option>
                      <option value="6">Class 6</option>
                      <option value="7">Class 7</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section / Trade</label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      disabled={!formData.classLevel}
                      className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Section</option>
                      {formData.classLevel && parseInt(formData.classLevel) >= 6 && parseInt(formData.classLevel) <= 8 && (
                        <>
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                        </>
                      )}
                      {formData.classLevel && parseInt(formData.classLevel) >= 9 && parseInt(formData.classLevel) <= 12 && (
                        <>
                          <option value="IoT">IT basics and IoT support (IoT)</option>
                          <option value="GEW">General Electrical Works (GEW)</option>
                          <option value="CCS">Civil Construction and Safety (CCS)</option>
                          <option value="RAC">Refrigeration and Air Conditioning (RAC)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Guardian Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      name="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none"
                      placeholder="e.g. 017XXXXXXXX"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    Enter parent's phone number for future verification
                  </p>
                </div>
              </motion.div>
            )}

            {role === 'parent' && (
              <motion.div 
                key="parent-fields"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Child's Student ID</label>
                  <input
                    type="text"
                    name="linkedChildId"
                    value={formData.linkedChildId}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none"
                    placeholder="Enter your child's Student ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Registered Phone Number</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none"
                        placeholder="e.g. 017XXXXXXXX"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyParent}
                      disabled={verificationStatus === 'loading' || !formData.linkedChildId || !formData.parentPhone}
                      className="px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {verificationStatus === 'loading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {verificationStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800/30"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      {verificationMessage}
                    </motion.div>
                  )}
                  {verificationStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800/30"
                    >
                      <XCircle className="w-5 h-5" />
                      {verificationMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm shadow-blue-500/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Saving Profile...
              </>
            ) : (
              <>
                Complete Profile <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
