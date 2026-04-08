import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Search, User, Moon, Sun, LogOut, LayoutDashboard, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { getSiteContent, SiteContent } from '../lib/db';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteContent | null>(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getSiteContent('settings');
      setSettings(data || { id: 'settings' });
    };
    loadSettings();
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.academics'), path: '/academics' },
    { name: t('nav.admission'), path: '/admission' },
    { name: t('nav.notices'), path: '/notices' },
    { name: t('nav.teachers'), path: '/teachers' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (!user.role) return '/create-profile';
    if (user.status === 'pending') return '/pending-approval';
    if (user.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm border-b border-slate-200 dark:border-slate-800' : 'bg-white dark:bg-slate-950 border-b border-transparent'}`}>
      {/* Main Navbar */}
      <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto group-hover:scale-105 transition-transform dark:bg-white dark:p-1 dark:rounded-lg" />
            ) : (
              <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:scale-105 transition-transform shadow-sm shadow-blue-500/20">
                <GraduationCap className="h-6 w-6" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold leading-tight text-slate-900 dark:text-white tracking-tight">{settings?.siteName || 'CGTSC'}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('nav.location')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            <AnimatePresence mode="wait">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all relative ${
                    isActive(link.path)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.span
                    key={`${language}-${link.name}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    {link.name}
                  </motion.span>
                </Link>
              ))}
            </AnimatePresence>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center space-x-3">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage} 
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              aria-label="Toggle Language"
            >
              <Globe className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-bold w-12 text-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={language}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    {language === 'en' ? 'EN 🇬🇧' : 'BN 🇧🇩'}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>

            {/* Theme Switcher */}
            <button 
              onClick={toggleTheme} 
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              aria-label="Toggle Theme"
            >
              <span className="sr-only">Toggle theme</span>
              <span
                className={`${
                  isDark ? 'translate-x-7 bg-slate-900' : 'translate-x-1 bg-white'
                } inline-block h-6 w-6 transform rounded-full transition-transform duration-300 ease-in-out flex items-center justify-center shadow-sm`}
              >
                {isDark ? (
                  <Moon className="h-3.5 w-3.5 text-blue-400" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                )}
              </span>
            </button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to={getDashboardLink()} className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} className="h-6 w-6 rounded-full mr-1.5 object-cover border border-slate-200 dark:border-slate-700" />
                  ) : user.role === 'admin' ? (
                    <ShieldCheck className="h-4 w-4 mr-1.5" />
                  ) : (
                    <LayoutDashboard className="h-4 w-4 mr-1.5" />
                  )}
                  <motion.span key={language} initial={{opacity:0}} animate={{opacity:1}}>
                    {user.role === 'admin' ? 'Admin' : t('nav.dashboard')}
                  </motion.span>
                </Link>
                <button onClick={logout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors px-3 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="h-4 w-4 mr-1.5" /> 
                  <motion.span key={language} initial={{opacity:0}} animate={{opacity:1}}>{t('nav.logout')}</motion.span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                <User className="w-4 h-4 mr-1.5" /> 
                <motion.span key={language} initial={{opacity:0}} animate={{opacity:1}}>{t('nav.studentPortal')}</motion.span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center space-x-3">
            <button 
              onClick={toggleLanguage} 
              className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <span className="text-xs font-bold">{language === 'en' ? 'EN' : 'BN'}</span>
            </button>
            <button 
              onClick={toggleTheme} 
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg absolute w-full overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 space-y-2">
                {user ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {user.photoUrl ? (
                        <img src={user.photoUrl} alt={user.name} className="h-5 w-5 rounded-full mr-3 object-cover border border-slate-200 dark:border-slate-700" />
                      ) : user.role === 'admin' ? (
                        <ShieldCheck className="h-5 w-5 mr-3 text-slate-400" />
                      ) : (
                        <LayoutDashboard className="h-5 w-5 mr-3 text-slate-400" />
                      )}
                      {user.role === 'admin' ? 'Admin' : t('nav.dashboard')}
                    </Link>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-5 w-5 mr-3" /> {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                  >
                    <User className="h-5 w-5 mr-2" /> {t('nav.studentPortal')}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
