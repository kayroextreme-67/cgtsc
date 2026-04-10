import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, Award, CheckCircle, XCircle, GraduationCap } from 'lucide-react';

interface SubjectResult {
  subject: string;
  marks: number | string;
  grade: string;
  total?: number;
}

interface ResultData {
  id_number: string;
  name: string;
  examTitle: string;
  year: string;
  results: SubjectResult[];
  total_gpa?: string;
  status: 'Passed' | 'Failed' | 'Failed (Absent)' | string;
  rank?: string;
}

interface ResultCardProps {
  data: ResultData;
}

const formatRank = (rank?: string) => {
  if (!rank) return null;
  const num = parseInt(rank);
  if (isNaN(num)) return rank;
  const j = num % 10, k = num % 100;
  if (j == 1 && k != 11) return num + "st";
  if (j == 2 && k != 12) return num + "nd";
  if (j == 3 && k != 13) return num + "rd";
  return num + "th";
};

const getGradeInfo = (marks: number | string, total: number) => {
  if (marks === 'Absent' || marks === 'A' || marks === 'a') return { grade: 'F', color: '#ef4444' };
  const num = Number(marks);
  if (isNaN(num)) return { grade: 'N/A', color: '#6b7280' };
  
  const percentage = (num / total) * 100;
  if (percentage >= 90) return { grade: 'Golden A+', color: '#ca8a04' };
  if (percentage >= 80) return { grade: 'A+', color: '#22c55e' };
  if (percentage >= 70) return { grade: 'A', color: '#34d399' };
  if (percentage >= 60) return { grade: 'A-', color: '#2dd4bf' };
  if (percentage >= 50) return { grade: 'B', color: '#60a5fa' };
  if (percentage >= 40) return { grade: 'C', color: '#818cf8' };
  if (percentage >= 33) return { grade: 'D', color: '#fb923c' };
  return { grade: 'F', color: '#ef4444' };
};

export default function ResultCard({ data }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    const element = cardRef.current;
    element.classList.add('print-mode');
    
    const styleEl = document.createElement('style');
    styleEl.id = 'pdf-print-overrides';
    styleEl.innerHTML = `
      body { background-color: #ffffff !important; color: #000000 !important; }
      .print-mode { 
        width: 794px !important; 
        height: 1123px !important; 
        max-width: none !important; 
        margin: 0 !important; 
        padding: 60px 48px !important; 
        box-sizing: border-box !important;
        background: #ffffff !important; 
        border: none !important;
        border-radius: 0 !important;
        display: flex !important;
        flex-direction: column !important;
      }
      .print-mode .subjects-wrapper {
        flex: 1 1 auto !important;
        margin-bottom: 20px !important;
      }
      .print-mode * { 
        border-color: #e5e7eb !important; 
        outline-color: transparent !important; 
        text-decoration-color: transparent !important; 
        caret-color: transparent !important; 
        column-rule-color: transparent !important;
        box-shadow: none !important;
        text-shadow: none !important;
        filter: none !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        line-height: 1.5 !important;
      }
      .print-mode .subject-row { 
        padding-top: 12px !important; 
        padding-bottom: 12px !important; 
        page-break-inside: avoid !important;
      }
    `;
    document.head.appendChild(styleEl);
    
    const opt = {
      margin:       0,
      filename:     `${data.name.replace(/\s+/g, '_')}_Result_${data.year}.pdf`,
      image:        { type: 'jpeg' as const, quality: 1 },
      html2canvas:  { scale: 3, useCORS: true, logging: false, windowWidth: 794, windowHeight: 1123 },
      jsPDF:        { unit: 'px', format: [794, 1123] as [number, number], orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove('print-mode');
      const injectedStyle = document.getElementById('pdf-print-overrides');
      if (injectedStyle) injectedStyle.remove();
      setIsDownloading(false);
    }).catch((err: any) => {
      console.error("PDF generation error:", err);
      element.classList.remove('print-mode');
      const injectedStyle = document.getElementById('pdf-print-overrides');
      if (injectedStyle) injectedStyle.remove();
      setIsDownloading(false);
    });
  };

  const isPass = data.status === 'Passed' || data.status === 'Pass';

  let totalObtained = 0;
  let totalMaximum = 0;
  
  data.results.forEach(res => {
    const marks = Number(res.marks);
    const total = res.total || 100;
    if (!isNaN(marks)) {
      totalObtained += marks;
      totalMaximum += total;
    }
  });

  return (
    <div className="relative w-full w-[95%] md:max-w-2xl lg:max-w-4xl mx-auto my-4 md:my-8 font-sans">
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-[2rem] border p-4 sm:p-6 md:p-8 transition-all duration-300 flex flex-col"
        style={{
          backgroundColor: isDownloading ? '#ffffff' : 'rgba(15, 23, 42, 0.6)',
          borderColor: isDownloading ? '#e5e7eb' : 'rgba(255, 255, 255, 0.2)',
          color: isDownloading ? '#000000' : '#ffffff',
          boxShadow: isDownloading ? 'none' : '0 8px 32px 0 rgba(31,38,135,0.37)',
          backdropFilter: isDownloading ? 'none' : 'blur(12px)',
        }}
      >
        {/* Decorative Elements */}
        {!isDownloading && (
          <>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}></div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none" style={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.05), transparent)' }}></div>
          </>
        )}

        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 md:pb-5 mb-4 md:mb-6" style={{ borderColor: isDownloading ? '#e5e7eb' : 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <div className="p-2 md:p-3 rounded-2xl border shrink-0" style={{ backgroundColor: isDownloading ? '#eff6ff' : 'rgba(59, 130, 246, 0.2)', borderColor: isDownloading ? 'transparent' : 'rgba(255, 255, 255, 0.1)' }}>
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8" style={{ color: isDownloading ? '#2563eb' : '#60a5fa' }} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-0.5 md:mb-1">
                Academic Result
              </h2>
              <p className="text-xs md:text-sm font-medium" style={{ color: isDownloading ? '#4b5563' : '#cbd5e1' }}>
                {data.examTitle} <span className="mx-1 md:mx-2 opacity-50">•</span> {data.year}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right w-full md:w-auto bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none" style={{ color: isDownloading ? '#000000' : 'inherit' }}>
            <p className="text-[10px] md:text-xs uppercase tracking-widest opacity-70 mb-1 font-semibold">Student Profile</p>
            <p className="text-lg md:text-xl font-bold">{data.name}</p>
            <p className="text-xs md:text-sm opacity-80 mt-1 font-mono inline-block px-2 py-0.5 rounded" style={{ backgroundColor: isDownloading ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }}>ID: {data.id_number}</p>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="relative z-10 mb-6 subjects-wrapper flex-1">
          <div className="flex flex-col p-2 sm:p-4 rounded-2xl border h-full" style={{ backgroundColor: isDownloading ? '#f9fafb' : 'rgba(0,0,0,0.3)', borderColor: isDownloading ? '#e5e7eb' : 'rgba(255,255,255,0.1)' }}>
            {/* Column Headers */}
            <div className="flex justify-between items-center px-2 sm:px-3 pb-2 border-b mb-1" style={{ borderColor: isDownloading ? '#e5e7eb' : 'rgba(255,255,255,0.1)' }}>
              <div className="flex-1 text-[10px] sm:text-xs uppercase tracking-widest opacity-60 font-semibold" style={{ color: isDownloading ? '#000000' : 'inherit' }}>Subject</div>
              <div className="w-12 sm:w-20 text-center text-[10px] sm:text-xs uppercase tracking-widest opacity-60 font-semibold" style={{ color: isDownloading ? '#000000' : 'inherit' }}>Marks</div>
              <div className="w-12 sm:w-20 text-center text-[10px] sm:text-xs uppercase tracking-widest opacity-60 font-semibold" style={{ color: isDownloading ? '#000000' : 'inherit' }}>Total</div>
              <div className="w-14 sm:w-24 text-right text-[10px] sm:text-xs uppercase tracking-widest opacity-60 font-semibold" style={{ color: isDownloading ? '#000000' : 'inherit' }}>Grade</div>
            </div>

            {data.results.map((res, idx) => {
              const total = res.total || 100;
              const { grade, color } = getGradeInfo(res.marks, total);
              
              return (
                <div key={idx} className="subject-row flex justify-between items-center px-2 sm:px-3 py-2 rounded-lg transition-colors border-b last:border-0" style={{ borderColor: isDownloading ? '#f3f4f6' : 'rgba(255,255,255,0.05)' }}>
                  <div className="flex-1 text-xs sm:text-sm font-semibold pr-2 break-words" style={{ color: isDownloading ? '#000000' : 'inherit' }} title={res.subject}>
                    {res.subject}
                  </div>
                  <div className="w-12 sm:w-20 text-center font-mono text-xs sm:text-sm font-medium" style={{ color: isDownloading ? '#000000' : 'inherit' }}>
                    {res.marks}
                  </div>
                  <div className="w-12 sm:w-20 text-center font-mono text-xs sm:text-sm opacity-80" style={{ color: isDownloading ? '#000000' : 'inherit' }}>
                    {total}
                  </div>
                  <div className="w-14 sm:w-24 text-right text-xs sm:text-sm font-bold" style={{ color }}>
                    {grade}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer / Summary */}
        <div className="relative z-20 shrink-0 flex flex-col sm:flex-row justify-between items-center p-4 sm:p-5 rounded-2xl border sticky bottom-0 md:static mt-auto shadow-xl md:shadow-none backdrop-blur-xl md:backdrop-blur-none" style={{ backgroundColor: isDownloading ? '#f3f4f6' : 'rgba(15, 23, 42, 0.85)', borderColor: isDownloading ? '#e5e7eb' : 'rgba(255,255,255,0.2)' }}>
          
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-0 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 rounded-full border" style={{ 
                backgroundColor: isPass ? (isDownloading ? '#dcfce7' : 'rgba(34,197,94,0.2)') : (isDownloading ? '#fee2e2' : 'rgba(239,68,68,0.2)'),
                borderColor: isPass ? (isDownloading ? 'transparent' : 'rgba(34,197,94,0.3)') : (isDownloading ? 'transparent' : 'rgba(239,68,68,0.3)'),
                color: isPass ? (isDownloading ? '#16a34a' : '#4ade80') : (isDownloading ? '#dc2626' : '#f87171')
              }}>
                {isPass ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-70 font-semibold mb-0.5" style={{ color: isDownloading ? '#000000' : 'inherit' }}>Final Status</p>
                <p className="text-lg sm:text-xl font-black tracking-tight" style={{ color: isPass ? (isDownloading ? '#16a34a' : '#4ade80') : (isDownloading ? '#dc2626' : '#f87171') }}>
                  {data.status}
                </p>
              </div>
            </div>
            
            {/* Mobile-only Total Score (shows next to status on small screens) */}
            <div className="sm:hidden text-right">
              <p className="text-[10px] uppercase tracking-widest opacity-70 font-semibold mb-0.5" style={{ color: isDownloading ? '#000000' : 'inherit' }}>Total Score</p>
              <p className="text-lg font-bold" style={{ color: isDownloading ? '#000000' : 'inherit' }}>{totalObtained} <span className="text-xs opacity-60">/ {totalMaximum}</span></p>
            </div>
          </div>
          
          <div className="flex gap-4 md:gap-8 items-center w-full sm:w-auto justify-between sm:justify-end">
            <div className="hidden sm:block text-center">
              <p className="text-[10px] uppercase tracking-widest opacity-70 font-semibold mb-0.5" style={{ color: isDownloading ? '#000000' : 'inherit' }}>Total Score</p>
              <p className="text-xl md:text-2xl font-bold" style={{ color: isDownloading ? '#000000' : 'inherit' }}>{totalObtained} <span className="text-sm opacity-60">/ {totalMaximum}</span></p>
            </div>

            {data.rank && data.rank !== 'Fail' && (
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest opacity-70 font-semibold mb-0.5" style={{ color: isDownloading ? '#000000' : 'inherit' }}>Class Rank</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: isDownloading ? '#000000' : 'inherit' }}>{formatRank(data.rank)}</p>
              </div>
            )}

            {data.total_gpa && (
              <div className="text-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl border" style={{ backgroundColor: isDownloading ? '#ffffff' : 'rgba(255,255,255,0.1)', borderColor: isDownloading ? '#e5e7eb' : 'rgba(255,255,255,0.2)' }}>
                <p className="text-[10px] uppercase tracking-widest opacity-70 font-semibold mb-0.5" style={{ color: isDownloading ? '#000000' : 'inherit' }}>Total GPA</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter" style={{ color: isDownloading ? '#2563eb' : '#60a5fa' }}>
                  {data.total_gpa}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6 md:mt-8 flex justify-center px-4 md:px-0">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-center gap-3 w-full md:w-auto px-8 py-3.5 min-h-[44px] text-white rounded-2xl font-semibold transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
          style={{
            background: 'linear-gradient(to right, #2563eb, #4f46e5)',
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.25)'
          }}
        >
          {isDownloading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isDownloading ? 'Generating High-Res PDF...' : 'Download Official Result'}
        </button>
      </div>
    </div>
  );
}
