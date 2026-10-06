import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Scroll to top automatically on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Membership from './pages/Membership';
import Facilities from './pages/Facilities';
import Testimonials from './pages/Testimonials';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Member Pages
import MemberDashboard from './pages/MemberDashboard';
import ChoosePlan from './pages/ChoosePlan';
import MemberProfile from './pages/MemberProfile';
import PaymentHistory from './pages/PaymentHistory';

// Staff Page
import StaffDashboard from './pages/StaffDashboard';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageMembers from './pages/ManageMembers';
import ManageStaff from './pages/ManageStaff';
import ManagePlans from './pages/ManagePlans';
import PaymentReports from './pages/PaymentReports';
import ManageAnnouncements from './pages/ManageAnnouncements';
import ManageInquiries from './pages/ManageInquiries';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1F2937] font-sans selection:bg-orange-600 selection:text-white">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/about.html" element={<About />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/membership.html" element={<Membership />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/facilities.html" element={<Facilities />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/testimonials.html" element={<Testimonials />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Member Routes */}
              <Route
                path="/member/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member/choose-plan"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <ChoosePlan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member/profile"
                element={
                  <ProtectedRoute allowedRoles={['user', 'staff', 'admin']}>
                    <MemberProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member/payments"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <PaymentHistory />
                  </ProtectedRoute>
                }
              />

              {/* Staff Routes */}
              <Route
                path="/staff/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/members"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageMembers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/staff"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageStaff />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/plans"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManagePlans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PaymentReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/announcements"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageAnnouncements />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/inquiries"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageInquiries />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
