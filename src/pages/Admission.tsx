import { Link } from 'react-router-dom';
import { CheckCircle2, Download, FileText, HelpCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteContent } from '../contexts/SiteContentContext';

export default function Admission() {
  const { t } = useLanguage();
  const { content } = useSiteContent();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      {/* Page Header */}
      <div className="relative bg-blue-600 dark:bg-blue-900 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{content?.admissionTitle || t('admission.title')}</h1>
            <p className="text-blue-100 w-[95%] md:max-w-2xl mx-auto text-lg leading-relaxed">
              {content?.admissionSubtitle || t('admission.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Admission Notice */}
            <ScrollReveal>
              <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{content?.admissionNoticeTitle || t('admission.noticeTitle')} <span className="text-slate-500 font-normal text-lg">{content?.admissionNoticeSubtitle || t('admission.noticeSubtitle')}</span></h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed whitespace-pre-line">
                  {content?.admissionNoticeDesc || t('admission.noticeDesc')}
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-xl mr-4 shrink-0">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{t('admission.appDeadline')}</h4>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{content?.admissionDeadline || t('admission.deadlineDate')}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Requirements */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t('admission.reqTitle')} <span className="text-slate-500 font-normal text-lg">{t('admission.reqSubtitle')}</span></h2>
                
                <div className="space-y-10">
                  <div>
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-blue-600 dark:bg-blue-400 rounded-full mr-3"></span>
                      {content?.admissionClass6Title || t('admission.class6Title')}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{content?.admissionClass6Req1 || t('admission.class6Req1')}</span>
                      </li>
                      <li className="flex items-start bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{content?.admissionClass6Req2 || t('admission.class6Req2')}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-full mr-3"></span>
                      {content?.admissionClass9Title || t('admission.class9Title')}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{content?.admissionClass9Req1 || t('admission.class9Req1')}</span>
                      </li>
                      <li className="flex items-start bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{content?.admissionClass9Req2 || t('admission.class9Req2')}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-purple-600 dark:bg-purple-400 rounded-full mr-3"></span>
                      {content?.admissionClass11Title || t('admission.class11Title')}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{content?.admissionClass11Req1 || t('admission.class11Req1')}</span>
                      </li>
                      <li className="flex items-start bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{content?.admissionClass11Req2 || t('admission.class11Req2')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Step by Step Process */}
            <ScrollReveal delay={0.2}>
              <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-10">{content?.admissionProcessTitle || t('admission.processTitle')} <span className="text-slate-500 font-normal text-lg">{content?.admissionProcessSubtitle || t('admission.processSubtitle')}</span></h2>
                
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-blue-100 before:via-blue-300 before:to-blue-100 dark:before:from-slate-800 dark:before:via-slate-600 dark:before:to-slate-800">
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-blue-600 text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-lg">
                      1
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{content?.admissionStep1Title || t('admission.step1Title')}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{content?.admissionStep1Desc || t('admission.step1Desc')}</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-blue-600 text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-lg">
                      2
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{content?.admissionStep2Title || t('admission.step2Title')}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{content?.admissionStep2Desc || t('admission.step2Desc')}</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-blue-600 text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-lg">
                      3
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{content?.admissionStep3Title || t('admission.step3Title')}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{content?.admissionStep3Desc || t('admission.step3Desc')}</p>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Download Form */}
            <ScrollReveal delay={0.3}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-3xl shadow-lg text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 relative z-10">{content?.admissionApplyOnlineTitle || t('admission.applyOnline')}</h3>
                <p className="text-blue-100 text-sm mb-8 relative z-10 leading-relaxed">{content?.admissionApplyOnlineDesc || t('admission.applyOnlineDesc')}</p>
                <Link to="/apply" className="w-full bg-white text-blue-900 hover:bg-blue-50 font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all hover:-translate-y-1 shadow-lg relative z-10">
                  <FileText className="h-5 w-5 mr-2" /> {t('admission.applyNow')}
                </Link>
              </div>
            </ScrollReveal>

            {/* Help & Contact */}
            <ScrollReveal delay={0.4}>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                    <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {content?.admissionHelpTitle || t('admission.helpTitle')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {content?.admissionHelpDesc || t('admission.helpDesc')}
                </p>
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">{t('admission.phone')}</p>
                    <p className="text-slate-900 dark:text-white font-medium">{content?.admissionPhone || '01700-000000'}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">{t('admission.email')}</p>
                    <p className="text-slate-900 dark:text-white font-medium">{content?.admissionEmail || 'admission@cgtsc.edu.bd'}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">{t('admission.time')}</p>
                    <p className="text-slate-900 dark:text-white font-medium">{content?.admissionTime || '9:00 AM - 2:00 PM'}</p>
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
