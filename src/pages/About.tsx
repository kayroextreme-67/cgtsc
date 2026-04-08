import { useState, useEffect } from 'react';
import { BookOpen, Target, Award } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { getSiteContent, SiteContent } from '../lib/db';

export default function About() {
  const { t } = useLanguage();
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const siteContent = await getSiteContent('main');
      setContent(siteContent || { id: 'main' });
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Page Header */}
      <div className="relative bg-blue-600 dark:bg-blue-900 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{t('about.title')}</h1>
            <p className="text-blue-100 w-[95%] md:max-w-2xl mx-auto text-lg leading-relaxed">
              {t('about.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* History */}
            <ScrollReveal>
              <section className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
                  <span className="w-2 h-8 bg-blue-600 rounded-full mr-4"></span>
                  {t('about.historyTitle')}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-6 whitespace-pre-wrap">
                  {content?.aboutDescription || (
                    <>
                      <p>{t('about.historyText1')}</p>
                      <p>{t('about.historyText2')}</p>
                      <p>{t('about.historyText3')}</p>
                    </>
                  )}
                </div>
              </section>
            </ScrollReveal>

            {/* Mission & Vision */}
            <section className="grid sm:grid-cols-2 gap-8">
              <ScrollReveal delay={0.1}>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 h-full hover:-translate-y-1 transition-transform duration-300">
                  <div className="bg-blue-50 dark:bg-blue-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('about.missionTitle')} <span className="block text-sm font-normal text-slate-500 mt-1">{t('about.missionSubtitle')}</span></h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {t('about.missionText')}
                  </p>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={0.2}>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 h-full hover:-translate-y-1 transition-transform duration-300">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                    <BookOpen className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('about.visionTitle')} <span className="block text-sm font-normal text-slate-500 mt-1">{t('about.visionSubtitle')}</span></h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {t('about.visionText')}
                  </p>
                </div>
              </ScrollReveal>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ScrollReveal delay={0.3}>
              {/* Principal's Message Full */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden sticky top-24 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 text-center border-b border-slate-100 dark:border-slate-800">
                  <div className="w-32 h-32 mx-auto rounded-full border-4 border-white dark:border-slate-700 overflow-hidden mb-6 shadow-lg">
                    <img 
                      src="https://picsum.photos/seed/principal/200/200" 
                      alt="Principal" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('about.principal.name')}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">{t('about.principal.title')}</p>
                </div>
                <div className="p-8">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center text-lg">
                    <Award className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" /> {t('about.principal.messageTitle')}
                  </h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4 leading-relaxed">
                    <p className="font-medium text-slate-800 dark:text-slate-300">
                      {t('about.principal.message1')}
                    </p>
                    <p>
                      {t('about.principal.message2')}
                    </p>
                    <p>
                      {t('about.principal.message3')}
                    </p>
                    <p>
                      {t('about.principal.message4')}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </div>
  );
}
