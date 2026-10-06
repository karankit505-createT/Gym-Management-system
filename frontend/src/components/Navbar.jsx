import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Dumbbell, 
  LogOut, 
  Menu, 
  X, 
  ShieldAlert, 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Calendar, 
  Award,
  Megaphone,
  MessageSquare,
  User as UserIcon
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logoutUser, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/index.html';
    return location.pathname === path || location.pathname === `${path}.html`;
  };

  const getBrandRedirect = () => {
    if (!isAuthenticated) return '/';
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'staff') return '/staff/dashboard';
    return '/member/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 flex-nowrap">
          
          {/* Brand Logo */}
          <Link to={getBrandRedirect()} className="flex items-center space-x-2.5 group shrink-0">
            <div className="bg-orange-600 text-white p-2 rounded-md">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-heading font-black tracking-wider text-slate-900 uppercase">
                IRON<span className="text-orange-600">PULSE</span> GYM
              </span>
              <span className="block text-[10px] font-medium text-slate-500 tracking-wider uppercase">
                {isAuthenticated ? `${role.toUpperCase()} PORTAL` : 'FITNESS CLUB'}
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            
            {!isAuthenticated && (
              <>
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive('/') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive('/about') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                  }`}
                >
                  About Us
                </Link>
                <Link
                  to="/membership"
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive('/membership') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                  }`}
                >
                  Membership
                </Link>
                <Link
                  to="/facilities"
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive('/facilities') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                  }`}
                >
                  Facilities
                </Link>
                <Link
                  to="/testimonials"
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive('/testimonials') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                  }`}
                >
                  Testimonials
                </Link>
              </>
            )}

            {/* MEMBER */}
            {isAuthenticated && role === 'user' && (
              <>
                <Link
                  to="/member/dashboard"
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive('/member/dashboard') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/member/choose-plan"
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive('/member/choose-plan') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Choose Plan</span>
                </Link>
                <Link
                  to="/member/payments"
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    isActive('/member/payments') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Payments</span>
                </Link>
              </>
            )}

            {/* STAFF */}
            {isAuthenticated && role === 'staff' && (
              <Link
                to="/staff/dashboard"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  isActive('/staff/dashboard') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Attendance & Operations</span>
              </Link>
            )}

            {/* ADMIN */}
            {isAuthenticated && role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold ${
                    isActive('/admin/dashboard') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/admin/members"
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold ${
                    isActive('/admin/members') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Members</span>
                </Link>
                <Link
                  to="/admin/staff"
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold ${
                    isActive('/admin/staff') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Staff</span>
                </Link>
                <Link
                  to="/admin/plans"
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold ${
                    isActive('/admin/plans') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Plans</span>
                </Link>
                <Link
                  to="/admin/payments"
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold ${
                    isActive('/admin/payments') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Reports</span>
                </Link>
                <Link
                  to="/admin/announcements"
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold ${
                    isActive('/admin/announcements') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Notices</span>
                </Link>
                <Link
                  to="/admin/inquiries"
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold ${
                    isActive('/admin/inquiries') ? 'text-orange-600 font-bold bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Inquiries</span>
                </Link>
              </>
            )}

          </div>

          {/* Right Profile & Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
                <Link to="/member/profile" className="flex items-center space-x-2 hover:opacity-80">
                  <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                    {user?.photo ? (
                      <img src={`http://localhost:5000/uploads/${user.photo}`} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
                    <span className="text-[10px] text-orange-600 font-semibold uppercase">{role}</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-orange-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                >
                  Join Gym
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-orange-600 rounded-md border border-slate-200 bg-slate-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-orange-600" /> : <Menu className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {!isAuthenticated && (
            <div className="space-y-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Home</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">About Us</Link>
              <Link to="/membership" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Membership</Link>
              <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Facilities</Link>
              <Link to="/testimonials" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Testimonials</Link>
              <div className="pt-2 border-t border-slate-200 flex flex-col space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-xs font-bold border border-slate-300 rounded-md text-slate-800">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-xs font-bold bg-orange-600 text-white rounded-md">Join Gym</Link>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <div className="space-y-1">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <span className="text-[10px] text-orange-600 font-semibold uppercase">{role}</span>
                  </div>
                </div>
                <Link to="/member/profile" onClick={() => setMobileMenuOpen(false)} className="px-2.5 py-1 bg-white text-xs font-bold border border-slate-300 rounded-md text-slate-700">Profile</Link>
              </div>

              {role === 'user' && (
                <>
                  <Link to="/member/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">My Dashboard</Link>
                  <Link to="/member/choose-plan" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Choose Plan</Link>
                  <Link to="/member/payments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Payment History</Link>
                </>
              )}

              {role === 'staff' && (
                <Link to="/staff/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Attendance & Operations</Link>
              )}

              {role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Dashboard</Link>
                  <Link to="/admin/members" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Members</Link>
                  <Link to="/admin/staff" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Staff</Link>
                  <Link to="/admin/plans" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Plans</Link>
                  <Link to="/admin/payments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Reports</Link>
                  <Link to="/admin/announcements" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Notices</Link>
                  <Link to="/admin/inquiries" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-md">Inquiries</Link>
                </>
              )}

              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-md border border-orange-200 mt-2"
              >
                Logout Account
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
