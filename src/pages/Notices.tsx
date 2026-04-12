import { useState, useEffect } from 'react';
import { Calendar, Search, FileText, Link as LinkIcon, Download } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { getNotices, Notice } from '../lib/db';

export default function Notices() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const siteNotices = await getNotices();
      setNotices(siteNotices);
    };
    loadData();
  }, []);

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.type === selectedCategory || notice.type === 'all';
    return matchesSearch && matchesCategory;
  });

  const getAbsoluteUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const getDownloadUrl = (url: string) => {
    if (!url) return '#';
    const absoluteUrl = getAbsoluteUrl(url);
    if (absoluteUrl.includes('cloudinary.com') && !absoluteUrl.includes('fl_attachment')) {
      return absoluteUrl.replace('/upload/', '/upload/fl_attachment/');
    }
    return absoluteUrl;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      {/* Page Header */}
      <div className="relative bg-blue-600 dark:bg-blue-900 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{t('notices.title')}</h1>
            <p className="text-blue-100 w-[95%] md:max-w-2xl mx-auto text-lg leading-relaxed">
              {t('notices.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Search and Filter */}
        <ScrollReveal>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 mb-10 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={t('notices.searchPlaceholder')}
              />
            </div>
            <div className="sm:w-56">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
              >
                <option value="all">{t('notices.allCategories')}</option>
                <option value="general">{t('notices.general')}</option>
                <option value="academic">{t('notices.academic')}</option>
                <option value="admission">{t('notices.admission')}</option>
                <option value="vacation">{t('notices.vacation')}</option>
              </select>
            </div>
          </div>
        </ScrollReveal>

        {/* Notice List */}
        <ScrollReveal delay={0.1}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => {
                  const dateObj = new Date(notice.date);
                  const day = dateObj.getDate() || '--';
                  const month = dateObj.toLocaleString('default', { month: 'short' }) || '---';
                  return (
                  <div key={notice.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                    <div className="flex items-start">
                      <div className="hidden sm:flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl w-16 h-16 shrink-0 mr-6 text-center border border-blue-100 dark:border-blue-800/50 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <span className="text-xl font-bold leading-none mb-1">{day}</span>
                        <span className="text-xs uppercase font-bold tracking-wider">{month}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="sm:hidden text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md flex items-center border border-blue-100 dark:border-blue-800/50">
                            <Calendar className="w-3 h-3 mr-1.5" /> {notice.date}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 capitalize">
                            {t(`notices.${notice.type || 'general'}`)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {notice.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col gap-3 shrink-0">
                      {notice.fileUrl && (
                        <>
                          <a href={getAbsoluteUrl(notice.fileUrl)} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            <FileText className="w-4 h-4 mr-2" /> View PDF
                          </a>
                          <a href={getDownloadUrl(notice.fileUrl)} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            <Download className="w-4 h-4 mr-2" /> Download
                          </a>
                        </>
                      )}
                      {notice.linkUrl && (
                        <a href={getAbsoluteUrl(notice.linkUrl)} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                          <LinkIcon className="w-4 h-4 mr-2" /> View Link
                        </a>
                      )}
                      {!notice.fileUrl && !notice.linkUrl && (
                        <span className="text-sm text-slate-500 italic">No attachments</span>
                      )}
                    </div>
                  </div>
                )})
              ) : (
                <div className="p-12 text-center">
                  <p className="text-slate-500 dark:text-slate-400 text-lg">No notices found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
