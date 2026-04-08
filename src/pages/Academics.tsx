import { BookOpen, Settings, Zap, Monitor, Wrench } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function Academics() {
  const { t } = useLanguage();

  const departments = [
    {
      id: 1,
      name: t('academics.departments.iot.name'),
      icon: <Monitor className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      description: t('academics.departments.iot.desc'),
      bengaliName: t('academics.departments.iot.bengaliName'),
      bgClass: 'bg-blue-50 dark:bg-blue-900/20',
      textClass: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 2,
      name: t('academics.departments.electrical.name'),
      icon: <Zap className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />,
      description: t('academics.departments.electrical.desc'),
      bengaliName: t('academics.departments.electrical.bengaliName'),
      bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
      textClass: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      id: 3,
      name: t('academics.departments.civil.name'),
      icon: <Settings className="h-8 w-8 text-slate-600 dark:text-slate-400" />,
      description: t('academics.departments.civil.desc'),
      bengaliName: t('academics.departments.civil.bengaliName'),
      bgClass: 'bg-slate-100 dark:bg-slate-800',
      textClass: 'text-slate-600 dark:text-slate-400'
    },
    {
      id: 4,
      name: t('academics.departments.rac.name'),
      icon: <Wrench className="h-8 w-8 text-red-600 dark:text-red-400" />,
      description: t('academics.departments.rac.desc'),
      bengaliName: t('academics.departments.rac.bengaliName'),
      bgClass: 'bg-red-50 dark:bg-red-900/20',
      textClass: 'text-red-600 dark:text-red-400'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      {/* Page Header */}
      <div className="relative bg-blue-600 dark:bg-blue-900 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{t('academics.title')}</h1>
            <p className="text-blue-100 w-[95%] md:max-w-2xl mx-auto text-lg leading-relaxed">
              {t('academics.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Class Structure */}
        <section className="mb-24">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('academics.structureTitle')}</h2>
              <div className="w-24 h-1.5 bg-blue-600 rounded-full mx-auto"></div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl mr-4">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('academics.preVocational.title')} <span className="text-slate-500 text-lg font-normal">{t('academics.preVocational.grade')}</span></h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                  {t('academics.preVocational.desc')}
                </p>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>{t('academics.preVocational.item1')}</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>{t('academics.preVocational.item2')}</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>{t('academics.preVocational.item3')}</li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-2xl mr-4">
                    <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('academics.sscVocational.title')} <span className="text-slate-500 text-lg font-normal">{t('academics.sscVocational.grade')}</span></h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                  {t('academics.sscVocational.desc')}
                </p>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-3"></span>{t('academics.sscVocational.item1')}</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-3"></span>{t('academics.sscVocational.item2')}</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-3"></span>{t('academics.sscVocational.item3')}</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-3"></span>{t('academics.sscVocational.item4')}</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Departments */}
        <section>
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('academics.departmentsTitle')} <span className="text-slate-500 font-normal">{t('academics.departmentsSubtitle')}</span></h2>
              <div className="w-24 h-1.5 bg-blue-600 rounded-full mx-auto mb-6"></div>
              <p className="text-slate-600 dark:text-slate-400 w-[95%] md:max-w-2xl mx-auto text-lg">
                {t('academics.departmentsDesc')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <div key={dept.id}>
                <ScrollReveal delay={index * 0.1}>
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300 text-center h-full flex flex-col items-center group">
                    <div className={`${dept.bgClass} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {dept.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{dept.name}</h3>
                    <p className={`text-sm font-medium ${dept.textClass} mb-4`}>{dept.bengaliName}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-auto">
                      {dept.description}
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
