import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Users, LayoutDashboard, FileText, Settings, LogOut, Menu, Bell, FileSpreadsheet, GraduationCap, User as UserIcon } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import AdminOverview from '../components/admin/AdminOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminContent from '../components/admin/AdminContent';
import AdminSettings from '../components/admin/AdminSettings';
import AdminNotices from '../components/admin/AdminNotices';
import AdminResults from '../components/admin/AdminResults';
import AdminTeachers from '../components/admin/AdminTeachers';
import AdminProfile from '../components/admin/AdminProfile';

type TabType = 'dashboard' | 'users' | 'teachers' | 'notices' | 'results' | 'content' | 'settings' | 'profile';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'results', label: 'Results', icon: FileSpreadsheet },
    { id: 'content', label: 'Website Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row pt-16">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Admin Panel
          </h2>
        </div>
        <nav className="px-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar for mobile */}
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{activeTab.replace('-', ' ')}</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-400">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <ScrollReveal>
            {activeTab === 'dashboard' && <AdminOverview />}
            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'teachers' && <AdminTeachers />}
            {activeTab === 'notices' && <AdminNotices />}
            {activeTab === 'results' && <AdminResults />}
            {activeTab === 'content' && <AdminContent />}
            {activeTab === 'settings' && <AdminSettings />}
            {activeTab === 'profile' && <AdminProfile />}
          </ScrollReveal>
        </main>
      </div>
    </div>
  );
}
