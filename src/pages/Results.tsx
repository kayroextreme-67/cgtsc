import React, { useState, useEffect } from 'react';
import { Search, FileText, Award, ChevronDown } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'motion/react';
import { getExams, ExamResult } from '../lib/db';
import ResultCard from '../components/ResultCard';

export default function Results() {
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [foundResult, setFoundResult] = useState<any>(null);
  const [examMeta, setExamMeta] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getExams();
      setExams(data);
    };
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExamId && idNumber) {
      setIsLoading(true);
      setShowResult(false);
      
      setTimeout(() => {
        const exam = exams.find(e => e.id === selectedExamId);
        if (exam) {
          try {
            const resultsArray = JSON.parse(exam.resultsData);
            const studentResult = resultsArray.find((r: any) => String(r.idNumber) === String(idNumber));
            
            if (studentResult) {
              setFoundResult(studentResult);
              setExamMeta({ title: exam.title, year: exam.year });
            } else {
              setFoundResult(null);
            }
          } catch (error) {
            console.error("Error parsing exam data", error);
            setFoundResult(null);
          }
        } else {
          setFoundResult(null);
        }
        
        setIsLoading(false);
        setShowResult(true);
      }, 800);
    } else {
      alert('Please select an exam and enter your ID number.');
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      {/* Page Header */}
      <div className="relative bg-blue-600 dark:bg-blue-900 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Academic Results</h1>
            <p className="text-blue-100 w-[95%] md:max-w-2xl mx-auto text-lg leading-relaxed">
              Check your internal exam results online.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="w-[95%] mx-auto my-4 md:max-w-2xl lg:max-w-5xl px-0 sm:px-6 lg:px-8 py-4 md:py-16">
        
        {/* Search Form */}
        <ScrollReveal>
          <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 mb-8 md:mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-xl mr-4">
                <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Search Result
            </h2>
            
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Examination</label>
                  <div className="relative">
                    <select 
                      className="block w-full pl-4 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none min-h-[44px]"
                      value={selectedExamId}
                      onChange={(e) => setSelectedExamId(e.target.value)}
                    >
                      <option value="">-- Select Exam --</option>
                      {exams.map(exam => (
                        <option key={exam.id} value={exam.id}>{exam.title} ({exam.year})</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">ID Number</label>
                  <input 
                    type="text" 
                    className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-h-[44px]"
                    placeholder="Enter your ID number"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-auto pt-2 md:pt-0">
                  <button 
                    type="submit"
                    disabled={isLoading || exams.length === 0}
                    className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3.5 min-h-[44px] border border-transparent text-sm font-medium rounded-xl shadow-sm shadow-blue-500/20 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </span>
                    ) : (
                      'Get Result'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </ScrollReveal>

        {/* Result Display Demo */}
        <AnimatePresence>
          {showResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {foundResult ? (
                <ResultCard data={formatResultData(foundResult, examMeta)} />
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-blue-200 dark:border-blue-900/50 overflow-hidden p-12 text-center">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Result Not Found</h3>
                  <p className="text-slate-500 dark:text-slate-400">We couldn't find any result matching your search criteria. Please check your ID number and try again.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
