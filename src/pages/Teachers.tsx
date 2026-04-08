import { useState, useEffect } from 'react';
import { Mail, Phone } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { getTeachers, Teacher } from '../lib/db';

export default function Teachers() {
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await getTeachers();
      
      // If no CMS data, use default fallback
      if (data.length === 0) {
        const teacherList = t('teachers.list') as Array<{name: string, designation: string, department: string}>;
        if (teacherList && Array.isArray(teacherList)) {
          setTeachers([
            {
              id: '1',
              name: teacherList[0]?.name || 'Principal',
              designation: teacherList[0]?.designation || 'Principal',
              photoUrl: 'https://picsum.photos/seed/principal/300/300',
              createdAt: Date.now()
            }
          ]);
        }
      } else {
        setTeachers(data);
      }
      setIsLoading(false);
    };
    loadData();
  }, [t]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      {/* Page Header */}
      <div className="relative bg-blue-600 dark:bg-blue-900 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{t('teachers.title')}</h1>
            <p className="text-blue-100 w-[95%] md:max-w-2xl mx-auto text-lg leading-relaxed">
              {t('teachers.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Principal Section */}
        {teachers.length > 0 && (
        <div className="mb-24">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('teachers.administration')}</h2>
              <div className="w-24 h-1.5 bg-blue-600 rounded-full mx-auto"></div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <div className="w-[95%] md:max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
              <div className="md:flex flex-col items-center">
                <div className="w-full h-72 bg-slate-200 dark:bg-slate-800 relative">
                  <img className="w-full h-full object-cover object-top" src={teachers[0].photoUrl || 'https://via.placeholder.com/300x300'} alt={teachers[0].name} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-8 text-center w-full relative -mt-10 bg-white dark:bg-slate-900 rounded-t-3xl">
                  <div className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold tracking-wide uppercase mb-4 border border-blue-100 dark:border-blue-800/50">{teachers[0].designation}</div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{teachers[0].name}</h3>
                  {(teachers[0].phone || teachers[0].email) && (
                    <div className="mt-4 flex flex-col items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      {teachers[0].phone && (
                        <a href={`tel:${teachers[0].phone}`} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <Phone className="w-4 h-4" />
                          <span>{teachers[0].phone}</span>
                        </a>
                      )}
                      {teachers[0].email && (
                        <a href={`mailto:${teachers[0].email}`} className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <Mail className="w-4 h-4" />
                          <span>{teachers[0].email}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
        )}

        {/* Faculty Grid */}
        {teachers.length > 1 && (
        <div>
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('teachers.faculty')}</h2>
              <div className="w-24 h-1.5 bg-blue-600 rounded-full mx-auto"></div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teachers.slice(1).map((teacher, index) => (
              <div key={teacher.id}>
                <ScrollReveal delay={index * 0.1}>
                  <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden hover:-translate-y-2 transition-all duration-300 group h-full flex flex-col">
                    <div className="h-64 overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                      <img 
                        src={teacher.photoUrl || 'https://via.placeholder.com/300x300'} 
                        alt={teacher.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6 text-center flex-grow flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{teacher.name}</h3>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">{teacher.designation}</p>
                      {(teacher.phone || teacher.email) && (
                        <div className="mt-auto flex flex-col items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                          {teacher.phone && (
                            <a href={`tel:${teacher.phone}`} className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{teacher.phone}</span>
                            </a>
                          )}
                          {teacher.email && (
                            <a href={`mailto:${teacher.email}`} className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              <Mail className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[180px]">{teacher.email}</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
        )}

      </div>
    </div>
  );
}
