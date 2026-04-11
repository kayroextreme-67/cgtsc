import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Bell, FileText, Award, LogOut, BookOpen, Calendar, ChevronRight, Users, Edit2, Camera, X, Save, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ScrollReveal from '../components/ScrollReveal';
import { updateUser, getExams, ExamResult, getNotices, Notice, getUserApplication, AdmissionApplication } from '../lib/db';
import { useToast } from '../contexts/ToastContext';
import ResultCard from '../components/ResultCard';
import CloudinaryWidget from '../components/CloudinaryWidget';

export default function Dashboard() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', photoUrl: '' });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [latestResult, setLatestResult] = useState<any>(null);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [userApplication, setUserApplication] = useState<AdmissionApplication | null>(null);

  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name || '', phone: user.phone || user.guardianPhone || '', photoUrl: user.photoUrl || '' });
      setPhotoPreview(user.photoUrl || null);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notices = await getNotices();
        setRecentNotices(notices.slice(0, 3));
        
        if (user && user.role === 'visitor') {
          const app = await getUserApplication(user.id);
          if (app) {
            setUserApplication(app);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchLatestResult = async () => {
      if (!user || user.role === 'visitor' || user.role === 'admin') return;
      
      const targetId = user.role === 'student' ? user.studentId : (user.linkedChildId || user.childStudentId);
      if (!targetId) return;

      try {
        const exams = await getExams();
        // Assuming exams are sorted or we just take the first one that has the student's result
        // Better: sort by year descending, or just find the first exam with this student
        for (const exam of exams) {
          const resultsArray = JSON.parse(exam.resultsData);
          const studentResult = resultsArray.find((r: any) => String(r.idNumber) === String(targetId));
          if (studentResult) {
            setLatestResult({ result: studentResult, meta: { title: exam.title, year: exam.year } });
            break; // Found the latest (or first) result
          }
        }
      } catch (error) {
        console.error("Error fetching latest result:", error);
      }
    };

    if (user && user.status === 'approved') {
      fetchLatestResult();
    }
  }, [user]);

  const [upgradeForm, setUpgradeForm] = useState({ studentId: '', classLevel: '', section: '', roll: '' });
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.role || (user.role === 'visitor' && user.status === 'pending')) {
      navigate('/create-profile');
    } else if (user.status === 'pending') {
      navigate('/pending-approval');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else {
      // Simulate loading data
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  if (!user || (user.status && user.status !== 'approved') || user.role === 'admin') return null;

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isStudent = user.role === 'student';
  const isParent = user.role === 'parent';
  const isVisitor = user.role === 'visitor';

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      let photoUrl = editForm.photoUrl || user.photoUrl;

      await updateUser(user.id, {
        name: editForm.name,
        phone: editForm.phone,
        photoUrl
      });
      
      await refreshUser();
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpgradeAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpgrading(true);
    try {
      await updateUser(user.id, {
        role: 'student',
        status: 'pending',
        studentId: upgradeForm.studentId,
        class: parseInt(upgradeForm.classLevel),
        section: upgradeForm.section as any
      });
      await refreshUser();
      toast.success('Upgrade request submitted! Please wait for admin approval.');
      navigate('/pending-approval');
    } catch (error) {
      toast.error('Failed to submit upgrade request.');
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isVisitor) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Welcome, {user.name}!</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">You are currently logged in as a Visitor/Applicant.</p>
            
            {userApplication ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-left mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Your Application
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    userApplication.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    userApplication.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {userApplication.status}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Student Name</span>
                    <span className="font-medium text-slate-900 dark:text-white">{userApplication.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Class Applied For</span>
                    <span className="font-medium text-slate-900 dark:text-white">Class {userApplication.classToApply}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Payment Status</span>
                    <span className="font-medium text-slate-900 dark:text-white">{userApplication.paymentStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Transaction ID</span>
                    <span className="font-medium text-slate-900 dark:text-white">{userApplication.transactionId}</span>
                  </div>
                </div>
                {userApplication.status === 'pending' && (
                  <div className="mt-6 flex justify-end">
                    <Link to="/apply" className="px-4 py-2 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                      Update Application
                    </Link>
                  </div>
                )}
              </div>
            ) : null}

            <div className="grid md:grid-cols-2 gap-6">
              {!userApplication && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                  <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Apply for Admission</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Start your journey with us by filling out the online admission form.</p>
                  <Link to="/apply" className="inline-block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
                    Go to Admission Form
                  </Link>
                </div>
              )}

              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800/30">
                <User className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Already Admitted?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">If you have been admitted and received your Student ID, upgrade your account here.</p>
                <button onClick={() => setIsEditingProfile(true)} className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors">
                  Upgrade to Student Account
                </button>
              </div>
            </div>
          </div>

          {isEditingProfile && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upgrade Account</h3>
                  <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleUpgradeAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student ID</label>
                    <input required type="text" value={upgradeForm.studentId} onChange={e => setUpgradeForm({...upgradeForm, studentId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class</label>
                    <select required value={upgradeForm.classLevel} onChange={e => setUpgradeForm({...upgradeForm, classLevel: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                      <option value="">Select Class</option>
                      <option value="6">Class 6</option>
                      <option value="9">Class 9</option>
                      <option value="11">Class 11</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section/Trade</label>
                    <input required type="text" value={upgradeForm.section} onChange={e => setUpgradeForm({...upgradeForm, section: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                  </div>
                  <button type="submit" disabled={isUpgrading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50">
                    {isUpgrading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const calculateGrade = (marks: number | string) => {
    if (marks === 'A' || marks === 'a') return 'F';
    const num = Number(marks);
    if (isNaN(num)) return 'N/A';
    if (num >= 80) return 'A+';
    if (num >= 70) return 'A';
    if (num >= 60) return 'A-';
    if (num >= 50) return 'B';
    if (num >= 40) return 'C';
    if (num >= 33) return 'D';
    return 'F';
  };

  const calculateGPA = (marks: number | string) => {
    if (marks === 'A' || marks === 'a') return 0;
    const num = Number(marks);
    if (isNaN(num)) return 0;
    if (num >= 80) return 5.0;
    if (num >= 70) return 4.0;
    if (num >= 60) return 3.5;
    if (num >= 50) return 3.0;
    if (num >= 40) return 2.0;
    if (num >= 33) return 1.0;
    return 0;
  };

  const formatResultData = (result: any, meta: any) => {
    // Check if results are already in the expected array format
    if (result.results && Array.isArray(result.results)) {
      const info = result.student_info || result;
      return {
        id_number: info.idNumber || info.id_number || info.student_id || info.id,
        name: info.name || info.student_name || 'Unknown Student',
        examTitle: meta.title,
        year: meta.year,
        results: result.results,
        total_gpa: info.total_gpa || info.gpa,
        status: info.status || 'Passed',
        rank: info.rank
      };
    }

    // Find where the marks are stored
    let marksObj = result;
    const possibleKeys = ['marks', 'subjects', 'results', 'grades'];
    for (const key of possibleKeys) {
      if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
        marksObj = result[key];
        break;
      }
    }

    // Filter out known non-mark keys and ensure values are primitive
    const excludeKeys = ['idNumber', 'name', 'id_number', 'studentId', 'student_id', 'student_name', 'total_marks', 'status', 'percentage', 'rank', 'gpa'];
    const subjects = Object.keys(marksObj).filter(k => 
      !excludeKeys.includes(k) &&
      (typeof marksObj[k] === 'string' || typeof marksObj[k] === 'number')
    );

    let hasFailed = false;
    let hasAbsent = false;
    let totalPoints = 0;
    let subjectCount = 0;

    const formattedResults = subjects.map(sub => {
      const val = marksObj[sub];
      if (val === 'A' || val === 'a') hasAbsent = true;
      else if (Number(val) < 33 && !sub.includes('_15') && !sub.includes('_10') && !sub.includes('_20')) {
          hasFailed = true;
      }
      
      const grade = calculateGrade(val);
      totalPoints += calculateGPA(val);
      subjectCount++;

      // Extract total from subject string like "bengali_30"
      const match = sub.match(/_(\d+)$/);
      const total = match ? parseInt(match[1], 10) : 100;
      const cleanSubject = sub.replace(/_\d+$/, '');
      const formattedSubject = cleanSubject.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      return {
        subject: formattedSubject,
        marks: val === 'A' || val === 'a' ? 'Absent' : val,
        total: total,
        grade: result.gpa ? '' : grade
      };
    });

    let status: 'Passed' | 'Failed' | 'Failed (Absent)' = 'Passed';
    if (result.status) {
        status = result.status === 'Pass' ? 'Passed' : (result.status === 'Fail' ? 'Failed' : result.status);
    } else {
        if (hasAbsent) status = 'Failed (Absent)';
        else if (hasFailed) status = 'Failed';
    }

    const calculatedGpa = subjectCount > 0 && !hasFailed && !hasAbsent ? (totalPoints / subjectCount).toFixed(2) : '0.00';
    const gpa = result.gpa !== undefined ? result.gpa : (status === 'Passed' ? calculatedGpa : undefined);

    return {
      id_number: result.idNumber || result.id_number || result.student_id,
      name: result.name || result.student_name || 'Unknown Student',
      examTitle: meta.title,
      year: meta.year,
      results: formattedResults,
      total_gpa: gpa,
      status,
      rank: result.rank
    };
  };

  return (
    <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full w-[95%] md:max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Profile Photo</label>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-slate-400" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                      <CloudinaryWidget 
                        onUploadSuccess={(url) => {
                          setPhotoPreview(url);
                          setEditForm({ ...editForm, photoUrl: url });
                        }} 
                        buttonText=""
                        resourceType="image"
                        className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors w-8 h-8 flex items-center justify-center"
                      />
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-2 mt-2 sm:mt-0 flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <p>Upload a new profile photo using the camera icon.</p>
                  </div>
                </div>
              </div>
              
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {savingProfile ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <ScrollReveal>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isStudent ? 'Student Dashboard' : isParent ? 'Parent Dashboard' : 'Visitor Dashboard'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user.name}!</p>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </button>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile & Quick Stats */}
        <div className="space-y-8">
          <ScrollReveal delay={0.1}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center border-2 border-blue-500 overflow-hidden">
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" />
                    ) : isStudent ? (
                      <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                  title="Edit Profile"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Email</span>
                  <span className="font-medium text-slate-900 dark:text-white">{user.email}</span>
                </div>
                {isStudent && (
                  <>
                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">Student ID</span>
                      <span className="font-medium text-slate-900 dark:text-white">{user.studentId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">Class</span>
                      <span className="font-medium text-slate-900 dark:text-white">{user.class || user.classLevel}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">Section/Trade</span>
                      <span className="font-medium text-slate-900 dark:text-white">{user.section || user.sectionOrTrade}</span>
                    </div>
                  </>
                )}
                {isParent && (
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Child's Student ID</span>
                    <span className="font-medium text-slate-900 dark:text-white">{user.linkedChildId || user.childStudentId}</span>
                  </div>
                )}
                {isVisitor && (
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Account Type</span>
                    <span className="font-medium text-slate-900 dark:text-white">Guest / Prospective Student</span>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {isStudent && (
            <ScrollReveal delay={0.2}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center"><Award className="h-5 w-5 mr-2" /> Current GPA</h3>
                  <span className="text-2xl font-bold">
                    {latestResult ? formatResultData(latestResult.result, latestResult.meta).total_gpa : 'N/A'}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-1000" 
                    style={{ 
                      width: latestResult 
                        ? `${(Number(formatResultData(latestResult.result, latestResult.meta).total_gpa) / 5.0) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-blue-100">
                  {latestResult ? `Based on ${latestResult.meta.title} ${latestResult.meta.year}` : 'No results available yet'}
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* Right Column: Main Content */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Latest Result Card (if available) */}
          {latestResult && (
            <ScrollReveal delay={0.25}>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-500" />
                  Latest Academic Result
                </h2>
                <div className="-mx-4 sm:mx-0">
                  <ResultCard data={formatResultData(latestResult.result, latestResult.meta)} />
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Action Cards */}
          <ScrollReveal delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/results" className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl text-green-600 dark:text-green-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {isParent ? "Child's Academic Results" : "Academic Results"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isParent ? "View your child's latest exam marks and grades." : "View your latest exam marks and grades."}
                </p>
              </Link>

              <Link to="/academics" className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl text-purple-600 dark:text-purple-400">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {isVisitor ? "Explore Academics" : "Course Materials"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isVisitor ? "Learn about our curriculum and programs." : "Access syllabus and study resources."}
                </p>
              </Link>
            </div>
          </ScrollReveal>

          {/* Recent Notices */}
          <ScrollReveal delay={0.4}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-500" /> Recent Notices
                </h3>
                <Link to="/notices" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">View All</Link>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentNotices.length > 0 ? (
                  recentNotices.map((notice) => (
                    <div key={notice.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> {notice.date}
                        </span>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                          {notice.type}
                        </span>
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">{notice.title}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                    No recent notices available.
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
}
