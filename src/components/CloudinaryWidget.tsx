import React, { useEffect, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

interface CloudinaryWidgetProps {
  onUploadSuccess: (url: string) => void;
  buttonText?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  folder?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function CloudinaryWidget({ 
  onUploadSuccess, 
  buttonText = 'Upload File', 
  resourceType = 'auto',
  folder = 'cgtsc_uploads',
  className = '',
  children
}: CloudinaryWidgetProps) {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.warn('Cloudinary environment variables are not set.');
      return;
    }

    // @ts-ignore
    if (window.cloudinary) {
      // @ts-ignore
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          sources: ['local', 'camera', 'url'],
          resourceType: resourceType,
          folder: folder,
          multiple: false,
          theme: 'minimal',
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info: ', result.info);
            onUploadSuccess(result.info.secure_url);
          }
        }
      );
    }
  }, [onUploadSuccess, resourceType, folder]);

  const openWidget = (e: React.MouseEvent) => {
    e.preventDefault();
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      
      if (!cloudName || !uploadPreset) {
        alert('Cloudinary environment variables are missing. Please ensure you have added VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your Netlify Environment Variables (the VITE_ prefix is required).');
      } else if (!window.cloudinary) {
        alert('Cloudinary script is still loading. Please try again in a few seconds.');
      } else {
        alert('Cloudinary widget failed to initialize. Please check your configuration.');
      }
    }
  };

  return (
    <button
      onClick={openWidget}
      className={children ? className : `inline-flex items-center justify-center px-4 py-2 border border-slate-300 dark:border-slate-600 shadow-sm text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
    >
      {children || (
        <>
          <UploadCloud className="w-4 h-4 mr-2" />
          {buttonText}
        </>
      )}
    </button>
  );
}
