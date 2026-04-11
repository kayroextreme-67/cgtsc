import React, { useState, useEffect } from 'react';
import { getApplications, updateApplication, updateUser, AdmissionApplication } from '../../lib/db';
import { CheckCircle, XCircle, Search, Eye, X, Save } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function AdminApplications() {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewingApp, setViewingApp] = useState<AdmissionApplication | null>(null);
  const [approveForm, setApproveForm] = useState({ studentId: '', classLevel: '', section: '', roll: '' });
  const toast = useToast();

  const loadApplications = async () => {
    setLoading(true);
    const apps = await getApplications();
    setApplications(apps);
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingApp) return;

    try {
      // Update application status
      await updateApplication(viewingApp.id, { status: 'approved' });
      
      // Update user role to student
      await updateUser(viewingApp.userId, {
        role: 'student',
        status: 'approved',
        studentId: approveForm.studentId,
        class: parseInt(approveForm.classLevel),
        section: approveForm.section as any,
        phone: viewingApp.phone
      });

      // Send SMS
      try {
        await fetch('/.netlify/functions/sendSms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: viewingApp.phone,
            message: `Congratulations ${viewingApp.studentName}! Your admission application for Class ${viewingApp.classToApply} has been approved. Your Student ID is ${approveForm.studentId}. Welcome to CGTSC!`
          })
        });
      } catch (smsError) {
        console.error('Failed to send SMS:', smsError);
      }

      toast.success('Application approved and user upgraded to student.');
      setViewingApp(null);
      await loadApplications();
    } catch (error) {
      toast.error('Failed to approve application.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateApplication(id, { status: 'rejected' });
      
      // Find the application to get the phone number
      const app = applications.find(a => a.id === id);
      if (app) {
        // Send SMS
        try {
          await fetch('/.netlify/functions/sendSms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: app.phone,
              message: `Dear ${app.studentName}, we regret to inform you that your admission application for Class ${app.classToApply} has been rejected. Please contact CGTSC administration for details.`
            })
          });
        } catch (smsError) {
          console.error('Failed to send SMS:', smsError);
        }
      }

      toast.success('Application rejected.');
      await loadApplications();
    } catch (error) {
      toast.error('Failed to reject application.');
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search applications by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Applicant</th>
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Class</th>
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Payment</th>
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
                <th className="p-4 font-medium text-slate-500 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">Loading applications...</td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No applications found.</td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{app.studentName}</div>
                      <div className="text-sm text-slate-500">{app.phone}</div>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      Class {app.classToApply}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <span className={`font-medium ${app.paymentStatus === 'COMPLETED' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {app.paymentStatus}
                        </span>
                        <div className="text-slate-500 text-xs mt-1">Txn: {app.transactionId}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-md capitalize ${
                        app.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        app.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewingApp(app)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-900/20" title="View & Approve">
                          <Eye className="w-5 h-5" />
                        </button>
                        {app.status === 'pending' && (
                          <button onClick={() => handleReject(app.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20" title="Reject">
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Details</h3>
              <button onClick={() => setViewingApp(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Student Info</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-slate-500">Name:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.studentName}</span></p>
                  <p><span className="text-slate-500">DOB:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.dob}</span></p>
                  <p><span className="text-slate-500">Gender:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.gender}</span></p>
                  <p><span className="text-slate-500">Religion:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.religion}</span></p>
                  <p><span className="text-slate-500">Blood Group:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.bloodGroup}</span></p>
                  <p><span className="text-slate-500">Previous School:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.previousSchool}</span></p>
                  <p><span className="text-slate-500">Class Applied:</span> <span className="font-medium text-slate-900 dark:text-white">Class {viewingApp.classToApply}</span></p>
                  {viewingApp.birthCertificate && <p><span className="text-slate-500">Birth Certificate No:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.birthCertificate}</span></p>}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Contact Info</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-slate-500">Father:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.fatherName}</span></p>
                  <p><span className="text-slate-500">Mother:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.motherName}</span></p>
                  <p><span className="text-slate-500">Phone:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.phone}</span></p>
                  <p><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.email}</span></p>
                  <p><span className="text-slate-500">Address:</span> <span className="font-medium text-slate-900 dark:text-white">{viewingApp.address}</span></p>
                </div>
              </div>
            </div>

            {(viewingApp.studentPhotoUrl || viewingApp.birthCertificateUrl) && (
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Uploaded Documents</h4>
                <div className="grid grid-cols-2 gap-4">
                  {viewingApp.studentPhotoUrl && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Student Photo</p>
                      <a href={viewingApp.studentPhotoUrl} target="_blank" rel="noopener noreferrer">
                        <img src={viewingApp.studentPhotoUrl} alt="Student" className="w-24 h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                      </a>
                    </div>
                  )}
                  {viewingApp.birthCertificateUrl && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Birth Certificate</p>
                      <a href={viewingApp.birthCertificateUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {viewingApp.status === 'pending' && (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Approve Application</h4>
                <form onSubmit={handleApprove} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign Student ID</label>
                      <input required type="text" value={approveForm.studentId} onChange={e => setApproveForm({...approveForm, studentId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class</label>
                      <select required value={approveForm.classLevel} onChange={e => setApproveForm({...approveForm, classLevel: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        <option value="">Select Class</option>
                        <option value="6">Class 6</option>
                        <option value="9">Class 9</option>
                        <option value="11">Class 11</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section/Trade</label>
                      <input required type="text" value={approveForm.section} onChange={e => setApproveForm({...approveForm, section: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setViewingApp(null)} className="px-6 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium">
                      Approve & Upgrade to Student
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
