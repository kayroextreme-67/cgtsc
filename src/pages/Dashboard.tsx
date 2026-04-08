import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Bell, FileText, Award, LogOut, BookOpen, Calendar, ChevronRight, Users, Edit2, Camera, X, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ScrollReveal from '../components/ScrollReveal';
import { updateUser, getExams, ExamResult, getNotices, Notice } from '../lib/db';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '../contexts/ToastContext';
import ResultCard from '../components/ResultCard';

export default function Dashboard() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', photoUrl: '' });
  const [file, setFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [latestResult, setLatestResult] = useState<any>(null);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);

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
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };
    fetchData();
  }, []);

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

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.role) {
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

  if (!user || user.status !== 'approved' || user.role === 'admin') return null;

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

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      let photoUrl = editForm.photoUrl || user.photoUrl;
      if (file) {
        const storageRef = ref(storage, `profiles/${user.id}_${Date.now()}`);
        
        const uploadPromise = uploadBytes(storageRef, file);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Upload timeout. Firebase Storage might not be enabled.")), 15000)
        );
        
        const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
        photoUrl = await getDownloadURL(snapshot.ref);
      }

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
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                      title="Upload Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handlePhotoUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2 mt-2 sm:mt-0">
                    <div className="flex items-center gap-2">
                      <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                      <span className="text-xs font-medium text-slate-400 uppercase">OR PASTE URL</span>
                      <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                    </div>
                    <input
                      type="url"
                      value={editForm.photoUrl}
                      onChange={(e) => {
                        setEditForm({ ...editForm, photoUrl: e.target.value });
                        setPhotoPreview(e.target.value);
                        setFile(null);
                      }}
                      placeholder="e.g., https://imgur.com/..."
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">Upload an image or paste a direct image link.</p>
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
