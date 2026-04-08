import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Youtube, GraduationCap, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getSiteContent, SiteContent } from '../lib/db';

export default function Footer() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SiteContent | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const siteSettings = await getSiteContent('settings');
      setSettings(siteSettings || { id: 'settings' });
      const siteContent = await getSiteContent('main');
      setContent(siteContent || { id: 'main' });
    };
    loadData();
  }, []);

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto dark:bg-white dark:p-1 dark:rounded-lg" />
              ) : (
                <div className="bg-blue-600 p-2 rounded-xl text-white shadow-sm">
                  <GraduationCap className="h-6 w-6" />
                </div>
              )}
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{settings?.siteName || 'CGTSC'}</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed max-w-sm">
              {t('footer.desc')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-all">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-5">{t('footer.platform')}</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t('nav.about')}</Link></li>
              <li><Link to="/academics" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t('nav.academics')}</Link></li>
              <li><Link to="/admission" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t('nav.admission')}</Link></li>
              <li><Link to="/notices" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t('nav.notices')}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-5">{t('footer.resources')}</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/results" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t('home.academicResults')}</Link></li>
              <li><Link to="/gallery" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t('nav.gallery')}</Link></li>
              <li><a href="http://www.bteb.gov.bd/" target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t('footer.btebPortal')}</a></li>
              <li><a href="https://moedu.gov.bd/" target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"><ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" /> {t('footer.moedu')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-5">{t('footer.contact')}</h3>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-blue-500 shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/CY5q5LQTP1Ng76Y57" target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {content?.contactAddress || t('footer.address')}
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-blue-500 shrink-0" />
                <a href={`tel:${content?.contactPhone || '+8801234567890'}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {content?.contactPhone || '+880 1234-567890'}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-blue-500 shrink-0" />
                <a href={`mailto:${content?.contactEmail || 'info@cgtsc.edu.bd'}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {content?.contactEmail || 'info@cgtsc.edu.bd'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} {settings?.siteName || 'Chatkhil Government Technical School and College'}. {t('footer.rights')}
          </p>
          <div className="flex space-x-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
