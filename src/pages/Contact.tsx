import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { useForm, ValidationError } from '@formspree/react';
import { motion } from 'motion/react';
import { getSiteContent, SiteContent } from '../lib/db';

export default function Contact() {
  const { t } = useLanguage();
  const [state, handleSubmit] = useForm('xwvwnnqp');
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const siteContent = await getSiteContent('main');
      setContent(siteContent || { id: 'main' });
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      {/* Page Header */}
      <div className="relative bg-blue-600 dark:bg-blue-900 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{t('contact.title')}</h1>
            <p className="text-blue-100 w-[95%] md:max-w-2xl mx-auto text-lg leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <ScrollReveal delay={0.1}>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 flex items-start hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mr-5 shrink-0">
                  <MapPin className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('contact.address')}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {content?.contactAddress || t('contact.addressText')}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 flex items-start hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mr-5 shrink-0">
                  <Phone className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('contact.phone')}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-1">Office: <a href={`tel:${content?.contactPhone || '+8801700000000'}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{content?.contactPhone || '+880 1700-000000'}</a></p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 flex items-start hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mr-5 shrink-0">
                  <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('contact.email')}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-1"><a href={`mailto:${content?.contactEmail || 'info@cgtsc.edu.bd'}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{content?.contactEmail || 'info@cgtsc.edu.bd'}</a></p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 flex items-start hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mr-5 shrink-0">
                  <Clock className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('contact.officeHours')}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-1">{t('contact.sunThu')}</p>
                  <p className="text-slate-900 dark:text-white font-bold mb-2">09:00 AM - 04:00 PM</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    {t('contact.closed')}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Form */}
            <ScrollReveal delay={0.2}>
              <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                {state.succeeded ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Message Sent!</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 w-[95%] md:max-w-md mx-auto">
                      Thank you for reaching out. We have received your message and will get back to you as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">{t('contact.sendMessage')}</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.fullName')}</label>
                          <input type="text" id="name" name="name" required className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="John Doe" />
                          <ValidationError prefix="Name" field="name" errors={state.errors} />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.email')}</label>
                          <input type="email" id="email" name="email" required className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="john@example.com" />
                          <ValidationError prefix="Email" field="email" errors={state.errors} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.subject')}</label>
                        <input type="text" id="subject" name="subject" required className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="Admission Inquiry" />
                        <ValidationError prefix="Subject" field="subject" errors={state.errors} />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.message')}</label>
                        <textarea id="message" name="message" required rows={5} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none" placeholder="Write your message here..."></textarea>
                        <ValidationError prefix="Message" field="message" errors={state.errors} />
                      </div>
                      <button type="submit" disabled={state.submitting} className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-medium rounded-xl shadow-sm shadow-blue-500/20 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:-translate-y-0.5 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
                        <Send className="h-5 w-5 mr-2" /> {state.submitting ? 'Sending...' : t('contact.sendBtn')}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </ScrollReveal>

            {/* Google Map (Placeholder iframe) */}
            <ScrollReveal delay={0.3}>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 h-[400px] overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.886036814197!2d90.9572!3d23.0512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAzJzA0LjMiTiA5MMKwNTcnMjUuOSJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, borderRadius: '1.25rem' }} 
                  allowFullScreen={true} 
                  loading="lazy"
                  title="Google Map Location"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                ></iframe>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </div>
  );
}
