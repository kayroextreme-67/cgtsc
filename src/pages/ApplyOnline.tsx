import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, User, Mail, Phone, BookOpen, PlusCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteContent } from '../contexts/SiteContentContext';
import { useAuth } from '../contexts/AuthContext';
import { getUserApplication, updateApplication, AdmissionApplication } from '../lib/db';
import { useToast } from '../contexts/ToastContext';

export default function ApplyOnline() {
  const navigate = useNavigate();
  const { content } = useSiteContent();
  const { user } = useAuth();
  const toast = useToast();
  const [existingApp, setExistingApp] = useState<AdmissionApplication | null>(null);
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: '',
    religion: '',
    bloodGroup: '',
    phone: '',
    email: '',
    address: '',
    previousSchool: '',
    classToApply: '',
  });

  useEffect(() => {
    const fetchApp = async () => {
      if (user) {
        const app = await getUserApplication(user.id);
        if (app) {
          setExistingApp(app);
          setFormData({
            studentName: app.studentName || '',
            fatherName: app.fatherName || '',
            motherName: app.motherName || '',
            dob: app.dob || '',
            gender: app.gender || '',
            religion: app.religion || '',
            bloodGroup: app.bloodGroup || '',
            phone: app.phone || '',
            email: app.email || '',
            address: app.address || '',
            previousSchool: app.previousSchool || '',
            classToApply: app.classToApply || '',
          });
        }
      }
    };
    fetchApp();
  }, [user]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const admissionFee = content?.admissionFee || "10";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors duration-300">
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="sm:mx-auto sm:w-full sm:w-[95%] md:max-w-md relative z-10 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto h-24 w-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
            <Lock className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Account Required</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            You must create a Visitor Account or log in to apply for admission. This allows you to track your application and update your profile later if admitted.
          </p>
          <div className="space-y-4">
            <Link to="/login" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Log In
            </Link>
            <Link to="/create-profile" className="w-full flex justify-center py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Create Visitor Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError('');

    // Capture all form data including custom fields
    const form = e.currentTarget;
    const formDataObj = new FormData(form);
    const data = Object.fromEntries(formDataObj.entries());

    if (existingApp) {
      // Update existing application directly
      try {
        const success = await updateApplication(existingApp.id, {
          studentName: data.studentName as string,
          fatherName: data.fatherName as string,
          motherName: data.motherName as string,
          dob: data.dob as string,
          gender: data.gender as string,
          religion: data.religion as string,
          bloodGroup: data.bloodGroup as string,
          phone: data.phone as string,
          email: data.email as string,
          address: data.address as string,
          previousSchool: data.previousSchool as string,
          classToApply: data.classToApply as string,
        });

        if (success) {
          toast.success('Application updated successfully!');
          navigate('/dashboard');
        } else {
          setPaymentError('Failed to update application. Please try again.');
        }
      } catch (error) {
        setPaymentError('An error occurred while updating the application.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    try {
      // 1. Save form data to localStorage to submit to Formspree AFTER successful payment
      localStorage.setItem('pendingAdmissionData', JSON.stringify(data));

      // 2. Call Netlify Function to get payment URL
      const response = await fetch('/.netlify/functions/createPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.studentName,
          email: data.email || 'no-email@example.com', // Rupantor Pay requires email
          phone: data.phone,
          address: data.address,
          classToApply: data.classToApply,
          amount: admissionFee
        }),
      });

      const responseText = await response.text();
      let result;
      
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Failed to parse payment response:", responseText);
        throw new Error("Invalid response from payment server. If you are in the preview environment, Netlify functions may not be available.");
      }

      if (response.ok && result.payment_url) {
        // 3. Redirect to Rupantor Pay
        window.location.href = result.payment_url;
      } else {
        setPaymentError(result.error || 'Failed to initialize payment. Please try again.');
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      setPaymentError(error.message || 'An error occurred while connecting to the payment gateway.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-300">
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="w-[95%] md:max-w-2xl lg:max-w-3xl mx-auto relative z-10">
        <Link to="/admission" className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-8 font-medium transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Admission Info
        </Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="bg-blue-600 dark:bg-blue-900 p-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">Online Admission Application</h1>
            <p className="text-blue-100">Fill out the form below to apply for the 2026 academic year.</p>
          </div>
          
          <form onSubmit={handlePaymentSubmit} className="p-8 space-y-8">
            {paymentError && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {paymentError}
              </div>
            )}
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <User className="w-5 h-5 mr-2 text-blue-500" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student's Full Name *</label>
                  <input required type="text" name="studentName" value={formData.studentName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth *</label>
                  <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender *</label>
                  <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Family Info */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <User className="w-5 h-5 mr-2 text-blue-500" /> Family Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Father's Name *</label>
                  <input required type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mother's Name *</label>
                  <input required type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <Phone className="w-5 h-5 mr-2 text-blue-500" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Present Address *</label>
                  <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"></textarea>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" /> Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class to Apply For *</label>
                  <select required name="classToApply" value={formData.classToApply} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                    <option value="">Select Class</option>
                    <option value="6">Class 6</option>
                    <option value="9">Class 9 (SSC Vocational)</option>
                    <option value="11">Class 11 (HSC Vocational)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Previous School Name *</label>
                  <input required type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            {content?.admissionFormFields && content.admissionFormFields.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <PlusCircle className="w-5 h-5 mr-2 text-blue-500" /> Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.admissionFormFields.map((field: any) => (
                    <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {field.label} {field.required && '*'}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          required={field.required}
                          name={field.label}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.split(',').map((opt: string) => (
                            <option key={opt.trim()} value={opt.trim()}>
                              {opt.trim()}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          required={field.required}
                          name={field.label}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center h-full pt-2">
                          <input
                            required={field.required}
                            type="checkbox"
                            name={field.label}
                            className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                          />
                          <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">Yes</span>
                        </div>
                      ) : (
                        <input
                          required={field.required}
                          type={field.type}
                          name={field.label}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6">
              {!existingApp && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Admission Fee:</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">৳{admissionFee}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    You will be redirected to a secure payment gateway to complete your application.
                  </p>
                </div>
              )}
              <button type="submit" disabled={isProcessing} className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm shadow-blue-500/20 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                {isProcessing ? 'Processing...' : existingApp ? 'Update Application' : `Proceed to Secure Payment (৳${admissionFee})`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
