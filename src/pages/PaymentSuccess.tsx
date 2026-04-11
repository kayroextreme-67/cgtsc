import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Download, Printer, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { createApplication } from '../lib/db';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const { user } = useAuth();
  
  // Try to get the real bank/mobile TrxID first, fallback to gateway's order ID
  const transactionId = searchParams.get('bank_trx_id') || 
                        searchParams.get('sender_trx_id') || 
                        searchParams.get('mobile_trx_id') || 
                        searchParams.get('trxId') || 
                        searchParams.get('transactionId') || 
                        searchParams.get('transaction_id') || 
                        searchParams.get('trx_id');
  
  const paymentAmount = searchParams.get('paymentAmount') || searchParams.get('amount');
  const status = searchParams.get('status')?.toLowerCase();

  const isSuccess = status === 'completed' || status === 'success' || status === 'successful' || status === 'paid';

  useEffect(() => {
    const submitToFormspree = async () => {
      // 1. Get saved form data
      const savedData = localStorage.getItem('pendingAdmissionData');
      
      if (savedData && isSuccess) {
        try {
          const parsedData = JSON.parse(savedData);
          setStudentData(parsedData);
          
          // Add payment info to the form data
          const finalData = {
            ...parsedData,
            paymentStatus: 'COMPLETED',
            transactionId: transactionId,
            amountPaid: paymentAmount,
            paymentDate: new Date().toLocaleString()
          };

          // 2. Submit to Formspree
          // Using the direct URL since Formspree endpoints are meant to be public 
          // and Vite hides non-VITE_ prefixed env vars from the browser.
          const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xwvwnnqp';
          
          const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalData)
          });

          // 3. Save to Firebase if user is logged in
          if (user) {
            await createApplication({
              userId: user.id,
              studentName: finalData.studentName || '',
              fatherName: finalData.fatherName || '',
              motherName: finalData.motherName || '',
              dob: finalData.dob || '',
              gender: finalData.gender || '',
              religion: finalData.religion || '',
              bloodGroup: finalData.bloodGroup || '',
              phone: finalData.phone || '',
              email: finalData.email || '',
              address: finalData.address || '',
              previousSchool: finalData.previousSchool || '',
              classToApply: finalData.classToApply || '',
              transactionId: finalData.transactionId || '',
              paymentStatus: finalData.paymentStatus || '',
              amountPaid: finalData.amountPaid || '',
              paymentDate: finalData.paymentDate || '',
              status: 'pending'
            });
          }

          if (response.ok) {
            setSubmitSuccess(true);
            // Clear the pending data so it doesn't submit again on refresh
            localStorage.removeItem('pendingAdmissionData');
          } else {
            console.error('Formspree submission failed');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      } else if (!savedData && isSuccess) {
        // If no saved data but status is completed, it might be a page refresh
        // We still show success, but we can't submit to Formspree again
        setSubmitSuccess(true);
      }
      
      setIsSubmitting(false);
    };

    submitToFormspree();
  }, [status, transactionId, paymentAmount]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add Watermark
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(80);
    doc.text('PAID', 105, 150, { angle: 45, align: 'center' });

    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    
    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('CGTSC Admission Receipt', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Payment Successful', 105, 30, { align: 'center' });
    
    doc.line(20, 35, 190, 35); // Draw a line

    // Transaction Details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction Details', 20, 50);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Transaction ID: ${transactionId || 'N/A'}`, 20, 60);
    doc.text(`Amount Paid: BDT ${paymentAmount || 'N/A'}`, 20, 70);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 80);

    // Applicant Details
    if (studentData) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Applicant Details', 20, 100);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${studentData.studentName || 'N/A'}`, 20, 110);
      doc.text(`Phone: ${studentData.phone || 'N/A'}`, 20, 120);
      doc.text(`Class Applied For: Class ${studentData.classToApply || 'N/A'}`, 20, 130);
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated receipt and does not require a signature.', 105, 280, { align: 'center' });

    // Save the PDF
    doc.save(`CGTSC_Receipt_${transactionId || 'Admission'}.pdf`);
  };

  if (!isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="mx-auto h-24 w-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Payment Failed or Pending</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Your payment could not be verified. Please try again or contact support.
          </p>
          <Link to="/apply-online" className="inline-flex items-center justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-300">
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="w-[95%] md:max-w-2xl mx-auto relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden" id="receipt-container">
          
          {/* Receipt Header */}
          <div className="bg-green-600 dark:bg-green-700 p-8 text-white text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto h-20 w-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100">Your admission application has been received.</p>
          </div>
          
          {/* Receipt Body */}
          <div className="p-8">
            {isSubmitting ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Finalizing your application...</p>
              </div>
            ) : (
              <>
                <div className="border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Transaction Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-slate-500 dark:text-slate-400">Transaction ID:</div>
                    <div className="font-medium text-slate-900 dark:text-white text-right">{transactionId}</div>
                    
                    <div className="text-slate-500 dark:text-slate-400">Amount Paid:</div>
                    <div className="font-medium text-slate-900 dark:text-white text-right">৳{paymentAmount}</div>
                    
                    <div className="text-slate-500 dark:text-slate-400">Date:</div>
                    <div className="font-medium text-slate-900 dark:text-white text-right">{new Date().toLocaleDateString()}</div>
                  </div>
                </div>

                {studentData && (
                  <div className="border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Applicant Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-slate-500 dark:text-slate-400">Name:</div>
                      <div className="font-medium text-slate-900 dark:text-white text-right">{studentData.studentName}</div>
                      
                      <div className="text-slate-500 dark:text-slate-400">Phone:</div>
                      <div className="font-medium text-slate-900 dark:text-white text-right">{studentData.phone}</div>
                      
                      <div className="text-slate-500 dark:text-slate-400">Class:</div>
                      <div className="font-medium text-slate-900 dark:text-white text-right">Class {studentData.classToApply}</div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-8">
                  <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
                    A confirmation email has been sent to the school administration. Please keep this receipt for your records.
                  </p>
                </div>

                {/* Actions (Hidden during print) */}
                <div className="flex flex-col sm:flex-row gap-4 print:hidden">
                  <button onClick={handlePrint} className="flex-1 flex items-center justify-center py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <Printer className="w-4 h-4 mr-2" /> Print Receipt
                  </button>
                  <button onClick={handleDownloadPDF} className="flex-1 flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4 mr-2" /> Save as PDF
                  </button>
                </div>
                
                <div className="mt-6 text-center print:hidden">
                  <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Return to Homepage <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-container, #receipt-container * {
            visibility: visible;
          }
          #receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
            border: none;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
