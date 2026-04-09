import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Navigation } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { useForm, ValidationError } from '@formspree/react';
import { motion } from 'motion/react';
import { useSiteContent } from '../contexts/SiteContentContext';

export default function Contact() {
  const { t } = useLanguage();
  const [state, handleSubmit] = useForm('xlgokeyd');
  const { content } = useSiteContent();

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

            {/* Google Map Link Button */}
            <ScrollReveal delay={0.3}>
              <a 
                href="https://maps.app.goo.gl/yWYE6M9Eo17SNU739" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 relative group overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(59,130,246,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-transparent dark:from-blue-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Decorative background elements */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl group-hover:bg-blue-200/50 dark:group-hover:bg-blue-800/20 transition-colors duration-500"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl group-hover:bg-purple-200/50 dark:group-hover:bg-purple-800/20 transition-colors duration-500"></div>

                <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 group-hover:scale-150"></div>
                    <div className="w-24 h-24 bg-white dark:bg-slate-800 shadow-xl rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-10 border border-slate-50 dark:border-slate-700">
                      <MapPin className="h-12 w-12 text-blue-600 dark:text-blue-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      View on Google Maps
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                      Click here to open our location directly in the Google Maps app for easy navigation and directions.
                    </p>
                  </div>
                  
                  <div className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-slate-900/20 dark:shadow-white/10 group-hover:shadow-blue-500/30">
                    Open Map <Navigation className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </a>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </div>
  );
}
