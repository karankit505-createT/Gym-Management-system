import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Dumbbell, 
  User as UserIcon, 
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
  MessageSquare
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

  // Determine brand logo link per role
  const getBrandRedirect = () => {
    if (!isAuthenticated) return '/';
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'staff') return '/staff/dashboard';
    return '/member/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gym-border/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 flex-nowrap">
          
          {/* Logo */}
          <Link to={getBrandRedirect()} className="flex items-center space-x-3.5 group whitespace-nowrap flex-shrink-0">
            <div className="bg-gym-orange/20 p-2.5 sm:p-3 rounded-2xl border border-gym-orange/40 group-hover:bg-gym-orange transition-colors duration-300">
              <Dumbbell className="h-7 w-7 sm:h-8 sm:w-8 text-gym-orange group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans whitespace-nowrap">
                IRON<span className="text-gym-orange">PULSE</span>
              </span>
              <span className="block text-[10px] sm:text-xs font-bold tracking-widest text-gym-muted uppercase whitespace-nowrap">
                {isAuthenticated ? `${role.toUpperCase()} PORTAL` : 'FITNESS & GYM CLUB'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Switches to Mobile Hamburger below 1024px) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-nowrap">
            
            {/* VISITOR (NOT LOGGED IN) */}
            {!isAuthenticated && (
              <>
                <Link
                  to="/"
                  className={`px-3 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-extrabold whitespace-nowrap transition-all ${
                    isActive('/') ? 'text-gym-orange font-black' : 'text-slate-200 hover:text-white hover:bg-gym-card/80'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  className={`px-3 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-extrabold whitespace-nowrap transition-all ${
                    isActive('/about') ? 'text-gym-orange font-black' : 'text-slate-200 hover:text-white hover:bg-gym-card/80'
                  }`}
                >
                  About Us
                </Link>

                <Link
                  to="/membership"
                  className={`px-3 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-extrabold whitespace-nowrap transition-all ${
                    isActive('/membership') ? 'text-gym-orange font-black' : 'text-slate-200 hover:text-white hover:bg-gym-card/80'
                  }`}
                >
                  Membership
                </Link>

                <Link
                  to="/facilities"
                  className={`px-3 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-extrabold whitespace-nowrap transition-all ${
                    isActive('/facilities') ? 'text-gym-orange font-black' : 'text-slate-200 hover:text-white hover:bg-gym-card/80'
                  }`}
                >
                  Facilities
                </Link>

                <Link
                  to="/testimonials"
                  className={`px-3 xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-extrabold whitespace-nowrap transition-all ${
                    isActive('/testimonials') ? 'text-gym-orange font-black' : 'text-slate-200 hover:text-white hover:bg-gym-card/80'
                  }`}
                >
                  Testimonials
                </Link>
              </>
            )}

            {/* MEMBER (USER) */}
            {isAuthenticated && role === 'user' && (
              <>
                <Link
                  to="/member/dashboard"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive('/member/dashboard') ? 'text-gym-orange font-black' : 'text-slate-300 hover:text-white hover:bg-gym-card'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>
                <Link
                  to="/member/choose-plan"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive('/member/choose-plan') ? 'text-gym-orange font-black' : 'text-slate-300 hover:text-white hover:bg-gym-card'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Choose Plan</span>
                </Link>
                <Link
                  to="/member/payments"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive('/member/payments') ? 'text-gym-orange font-black' : 'text-slate-300 hover:text-white hover:bg-gym-card'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Payment History</span>
                </Link>
              </>
            )}

            {/* STAFF */}
            {isAuthenticated && role === 'staff' && (
              <Link
                to="/staff/dashboard"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-extrabold whitespace-nowrap transition-colors ${
                  isActive('/staff/dashboard') ? 'text-gym-orange font-black' : 'text-slate-300 hover:text-white hover:bg-gym-card'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Attendance & Member Check-In</span>
              </Link>
            )}

            {/* ADMIN */}
            {isAuthenticated && role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive('/admin/dashboard') ? 'text-gym-orange font-black' : 'text-slate-300 hover:text-white hover:bg-gym-card'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/admin/members"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive('/admin/members') ? 'text-gym-orange font-black' : 'text-slate-300 hover:text-white hover:bg-gym-card'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Members</span>
                </Link>
                <Link
                  to="/admin/staff"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive('/admin/staff') ? 'text-gym-orange font-black' : 'text-slate-300 hover:text-white hover:bg-gym-card'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Staff</span>
                </Link>
                <Link
                  to="/admin/plans"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive('/admin/plans') ? 'text-gym-orange font-black' : 'text-slate-300 hover:text-white hover:bg-gym-card'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Plans</span>
                </Link>
                <Link
                  to="/admin/payments"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive('/admin/payments') ? 'text-gym-orange font-black' : 'text-slate-300 hover:text-white hover:bg-gym-card'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Reports</span>
                </Link>
                <Link
                  to="/admin/announcements"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive('/admin/announcements') ? 'text-gym-orange font-black' : 'text-slate-300 hover:text-white hover:bg-gym-card'
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Notices</span>
                </Link>
                <Link
                  to="/admin/inquiries"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-colors ${
                    isActive('/admin/inquiries') ? 'text-gym-orange font-black' : 'text-slate-300 hover:text-white hover:bg-gym-card'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Inquiries</span>
                </Link>
              </>
            )}

          </div>

          {/* Right Profile / Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3 whitespace-nowrap flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 bg-gym-card px-3 py-1.5 rounded-xl border border-gym-border whitespace-nowrap">
                <Link to="/member/profile" className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-gym-orange/30 border border-gym-orange flex items-center justify-center text-gym-orange font-bold text-xs uppercase overflow-hidden">
                    {user?.photo ? (
                      <img src={`http://localhost:5000/uploads/${user.photo}`} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight whitespace-nowrap">{user?.name}</p>
                    <span className="text-[10px] text-gym-orange font-medium uppercase tracking-wider whitespace-nowrap">{role}</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-gym-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 whitespace-nowrap">
                <Link
                  to="/login"
                  className="px-4 xl:px-5 py-2.5 text-xs xl:text-sm font-extrabold text-slate-200 hover:text-white hover:bg-gym-card/80 rounded-xl whitespace-nowrap transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 xl:px-6 py-2.5 text-xs xl:text-sm font-black bg-gym-orange hover:bg-gym-orangeHover text-white rounded-xl shadow-xl shadow-gym-orange/30 transform hover:-translate-y-0.5 whitespace-nowrap transition-all"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Menu Toggle Button (Visible below 1024px) */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-7 h-7 text-gym-orange" /> : <Menu className="w-7 h-7 text-gym-orange" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (visible on screens < 1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-gym-border px-4 pt-3 pb-6 space-y-2">
          {!isAuthenticated && (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Home</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">About Us</Link>
              <Link to="/membership" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Membership</Link>
              <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Facilities</Link>
              <Link to="/testimonials" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Testimonials</Link>
              <div className="pt-2 flex flex-col space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 text-slate-200 bg-gym-card rounded-md">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 text-white bg-gym-orange rounded-md">Register Now</Link>
              </div>
            </>
          )}

          {isAuthenticated && (
            <>
              {role === 'user' && (
                <>
                  <Link to="/member/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">My Dashboard</Link>
                  <Link to="/member/choose-plan" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Choose Plan</Link>
                  <Link to="/member/payments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Payment History</Link>
                  <Link to="/member/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">My Profile</Link>
                </>
              )}

              {role === 'staff' && (
                <>
                  <Link to="/staff/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Attendance & Check-In</Link>
                  <Link to="/member/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">My Profile</Link>
                </>
              )}

              {role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Admin Dashboard</Link>
                  <Link to="/admin/members" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Manage Members</Link>
                  <Link to="/admin/staff" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Manage Staff</Link>
                  <Link to="/admin/plans" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Manage Plans</Link>
                  <Link to="/admin/payments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Payment Reports</Link>
                  <Link to="/admin/announcements" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Manage Notices</Link>
                  <Link to="/admin/inquiries" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">Contact Inquiries</Link>
                  <Link to="/member/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-slate-200 hover:bg-gym-card">My Profile</Link>
                </>
              )}

              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left px-3 py-2 text-red-400 font-semibold hover:bg-red-500/10 rounded-md mt-2"
              >
                Logout ({user?.name})
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
