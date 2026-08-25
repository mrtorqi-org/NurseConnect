import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, User, ShieldCheck, Building2, ClipboardList,
  FileText, Users, LogOut, Menu, X, CheckCircle
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navConfig = {
  candidate: [
    { to: '/candidate', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/candidate/profile', icon: User, label: 'My Profile' },
    { to: '/candidate/verification', icon: ShieldCheck, label: 'Verification' },
  ],
  hospital: [
    { to: '/hospital', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/hospital/profile', icon: Building2, label: 'Hospital Profile' },
    { to: '/hospital/requirements', icon: ClipboardList, label: 'Requirements' },
    { to: '/hospital/requirements/new', icon: FileText, label: 'New Requirement' },
    { to: '/hospital/shortlists', icon: Users, label: 'Shortlists' },
  ],
  verifier: [
    { to: '/verifier', icon: LayoutDashboard, label: 'Dashboard', end: true },
  ],
  admin: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/requirements', icon: ClipboardList, label: 'Requirements' },
  ],
};

const roleLabels = { candidate: 'Nurse Candidate', hospital: 'Hospital', verifier: 'Verifier', admin: 'Admin' };
const roleColors = {
  candidate: 'from-teal-500 to-emerald-500',
  hospital: 'from-blue-500 to-indigo-500',
  verifier: 'from-violet-500 to-purple-500',
  admin: 'from-primary to-teal-400',
};

export default function DashboardLayout({ children, role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = navConfig[role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — dark gradient */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 gradient-sidebar flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5"
           >
             <img src="/logo.svg" alt="NurseConnect" className="h-9 w-auto brightness-0 invert" />
             <div>
               <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{roleLabels[role]}</p>
             </div>
          </motion.div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-teal-400 to-emerald-400"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <item.icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
            <motion.div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColors[role]} flex items-center justify-center text-white font-semibold text-sm shadow-lg`}
              whileHover={{ scale: 1.1 }}
            >
              {user?.first_name?.[0] || user?.username?.[0] || '?'}
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-[11px] text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: 2 }}
            className="flex items-center gap-2.5 text-sm text-white/40 hover:text-red-400 w-full px-3 py-2 rounded-xl hover:bg-white/5 transition-all mt-1"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — glass */}
        <header className="h-14 glass border-b border-border/60 flex items-center px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 mr-3 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          {role === 'candidate' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium"
            >
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <CheckCircle className="w-3.5 h-3.5" />
              </motion.div>
              Profile Active
            </motion.div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 gradient-mesh">
          {children}
        </main>
      </div>
    </div>
  );
}
