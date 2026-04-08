import { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Gallery() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<{src: string, title: string, category: string} | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setImages([
        { id: '1', url: 'https://picsum.photos/seed/school1/800/600', category: 'Campus', categoryLabel: t('gallery.campus'), caption: t('gallery.images.mainBuilding') },
        { id: '2', url: 'https://picsum.photos/seed/school2/800/600', category: 'Labs', categoryLabel: t('gallery.labs'), caption: t('gallery.images.computerLab') },
        { id: '3', url: 'https://picsum.photos/seed/school3/800/600', category: 'Events', categoryLabel: t('gallery.events'), caption: t('gallery.images.sportsDay') },
        { id: '4', url: 'https://picsum.photos/seed/school4/800/600', category: 'Classrooms', categoryLabel: t('gallery.classrooms'), caption: t('gallery.images.digitalClassroom') },
        { id: '5', url: 'https://picsum.photos/seed/school5/800/600', category: 'Campus', categoryLabel: t('gallery.campus'), caption: t('gallery.images.playground') },
        { id: '6', url: 'https://picsum.photos/seed/school6/800/600', category: 'Labs', categoryLabel: t('gallery.labs'), caption: t('gallery.images.electricalWorkshop') },
        { id: '7', url: 'https://picsum.photos/seed/school7/800/600', category: 'Events', categoryLabel: t('gallery.events'), caption: t('gallery.images.scienceFair') },
        { id: '8', url: 'https://picsum.photos/seed/school8/800/600', category: 'Labs', categoryLabel: t('gallery.labs'), caption: t('gallery.images.automotiveLab') },
        { id: '9', url: 'https://picsum.photos/seed/school9/800/600', category: 'Events', categoryLabel: t('gallery.events'), caption: t('gallery.images.independenceDay') },
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [t]);

  const categories = [
    { id: 'All', label: t('gallery.all') },
    { id: 'Campus', label: t('gallery.campus') },
    { id: 'Events', label: t('gallery.events') },
    { id: 'Labs', label: t('gallery.labs') },
    { id: 'Classrooms', label: t('gallery.classrooms') }
  ];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
      {/* Page Header */}
      <div className="relative bg-blue-600 dark:bg-blue-900 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{t('gallery.title')}</h1>
            <p className="text-blue-100 w-[95%] md:max-w-2xl mx-auto text-lg leading-relaxed">
              {t('gallery.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Filter Buttons */}
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Image Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={image.id} 
                className="group relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] cursor-pointer aspect-[4/3] bg-slate-200 dark:bg-slate-800"
                onClick={() => setSelectedImage({src: image.url, title: image.caption, category: image.categoryLabel || image.category})}
              >
                <img 
                  src={image.url} 
                  alt={image.caption} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-bold rounded-full mb-3">
                      {image.categoryLabel || image.category || 'Gallery'}
                    </span>
                    <h3 className="text-xl text-white font-bold flex items-center justify-between">
                      {image.caption}
                      <ZoomIn className="h-5 w-5 text-white/70" />
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 p-4 md:p-8 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all backdrop-blur-md z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.title} 
                  className="w-full max-h-[80vh] object-contain bg-black/50"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
                  <span className="text-blue-400 font-medium text-sm mb-2 block">{selectedImage.category}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{selectedImage.title}</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
