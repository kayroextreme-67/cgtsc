import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Monitor, Calendar, FileText, ChevronRight, Sparkles, GraduationCap } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { getSiteContent, getNotices, SiteContent, Notice } from '../lib/db';

export default function Home() {
  const { t } = useLanguage();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const siteContent = await getSiteContent('main');
      setContent(siteContent || { id: 'main' });
      const siteNotices = await getNotices();
      setNotices(siteNotices.slice(0, 5)); // Show top 5 notices
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Important Notice Banner */}
      {content?.homeNoticeText && (
        <div className="bg-amber-500 text-white py-2 px-4 text-center overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-[marquee_20s_linear_infinite] font-medium">
            {content.homeNoticeText}
          </div>
        </div>
      )}

      {/* Modern SaaS Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-slate-50 dark:bg-slate-950">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>{t('home.hero.badge')}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
              {content?.homeHeroTitle || 'Welcome to Chatkhil Government Technical School and College'}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 w-[95%] md:max-w-2xl mx-auto leading-relaxed">
              {content?.homeSubtitle || 'Empowering students with technical skills and academic excellence for a brighter future.'}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/admission" className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5 flex items-center justify-center">
                {t('home.hero.applyNow')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/about" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
                {t('home.hero.learnMore')}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-16 relative z-20">
        <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('home.features.academicPrograms')}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">{t('home.features.academicProgramsDesc')}</p>
                <Link to="/academics" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 flex items-center text-sm group">
                  {t('home.features.viewPrograms')} <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('home.features.admission')}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">{t('home.features.admissionDesc')}</p>
                <Link to="/admission" className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 flex items-center text-sm group">
                  {t('home.features.admissionDetails')} <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-purple-50 dark:bg-purple-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <Monitor className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('home.features.studentPortal')}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">{t('home.features.studentPortalDesc')}</p>
                <Link to="/login" className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 flex items-center text-sm group">
                  {t('home.features.loginHere')} <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content Area: Intro & Notice Board */}
      <section className="py-20">
        <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Column: Intro */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">{t('home.about.title')}</h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-lg whitespace-pre-wrap">
                    {content?.aboutDescription || t('home.about.desc1')}
                  </p>
                  <Link to="/about" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 group">
                    {t('home.about.readHistory')} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </ScrollReveal>

              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <ScrollReveal delay={0.1}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t('home.keyFeatures.labs')}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('home.keyFeatures.labsDesc')}</p>
                    </div>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t('home.keyFeatures.teachers')}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('home.keyFeatures.teachersDesc')}</p>
                    </div>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t('home.keyFeatures.practical')}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('home.keyFeatures.practicalDesc')}</p>
                    </div>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.4}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t('home.keyFeatures.technical')}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('home.keyFeatures.technicalDesc')}</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Right Column: Notice Board */}
            <div className="lg:col-span-1">
              <ScrollReveal delay={0.2} className="h-full">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] h-full flex flex-col">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold flex items-center text-slate-900 dark:text-white">
                      <Calendar className="mr-2 h-5 w-5 text-blue-500" /> {t('home.noticeBoard.title')}
                    </h3>
                  </div>
                  
                  <div className="flex-grow">
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800 h-[400px] overflow-y-auto custom-scrollbar">
                      {notices.map((notice) => {
                        const isNew = new Date(notice.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        return (
                        <li key={notice.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                          <Link to="/notices" className="block">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                {notice.date}
                              </span>
                              {isNew && (
                                <span className="text-[10px] uppercase tracking-wider font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                                  {t('home.noticeBoard.new')}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                              {notice.title}
                            </p>
                          </Link>
                        </li>
                      )})}
                    </ul>
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-900/50">
                    <Link to="/notices" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 text-sm flex items-center justify-center group">
                      {t('home.noticeBoard.viewAll')} <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
