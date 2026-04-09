/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admission from './pages/Admission';
import Notices from './pages/Notices';
import Teachers from './pages/Teachers';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import CreateProfile from './pages/CreateProfile';
import PendingApproval from './pages/PendingApproval';
import AdminDashboard from './pages/AdminDashboard';
import ApplyOnline from './pages/ApplyOnline';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import { SiteContentProvider } from './contexts/SiteContentContext';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <SiteContentProvider>
            <AuthProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="academics" element={<Academics />} />
                    <Route path="admission" element={<Admission />} />
                    <Route path="notices" element={<Notices />} />
                    <Route path="teachers" element={<Teachers />} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="results" element={<Results />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="admin" element={<AdminDashboard />} />
                  </Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="/create-profile" element={<CreateProfile />} />
                  <Route path="/pending-approval" element={<PendingApproval />} />
                  <Route path="/apply" element={<ApplyOnline />} />
                </Routes>
              </Router>
            </AuthProvider>
          </SiteContentProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
