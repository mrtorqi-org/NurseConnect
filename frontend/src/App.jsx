import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Public pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Candidate pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfile from './pages/candidate/CandidateProfile';
import Verification from './pages/candidate/Verification';

// Hospital pages
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import HospitalProfile from './pages/hospital/HospitalProfile';
import CreateRequirement from './pages/hospital/CreateRequirement';
import RequirementsList from './pages/hospital/RequirementsList';
import RequirementDetail from './pages/hospital/RequirementDetail';
import ShortlistView from './pages/hospital/ShortlistView';

// Verifier pages
import VerifierDashboard from './pages/verifier/VerifierDashboard';
import HospitalVerification from './pages/verifier/HospitalVerification';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRequirements from './pages/admin/AdminRequirements';
import RequirementMatches from './pages/admin/RequirementMatches';
import ShortlistBuilder from './pages/admin/ShortlistBuilder';
import ShortlistDetail from './pages/admin/ShortlistDetail';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role === 'admin' ? 'admin' : user.role}`} />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (user) return <Navigate to={`/${user.role === 'admin' ? 'admin' : user.role}`} />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Candidate */}
        <Route path="/candidate" end element={<ProtectedRoute allowedRoles={['candidate']}><DashboardLayout role="candidate"><CandidateDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/candidate/profile" element={<ProtectedRoute allowedRoles={['candidate']}><DashboardLayout role="candidate"><CandidateProfile /></DashboardLayout></ProtectedRoute>} />
        <Route path="/candidate/verification" element={<ProtectedRoute allowedRoles={['candidate']}><DashboardLayout role="candidate"><Verification /></DashboardLayout></ProtectedRoute>} />

        {/* Hospital */}
        <Route path="/hospital" element={<ProtectedRoute allowedRoles={['hospital']}><DashboardLayout role="hospital"><HospitalDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/hospital/profile" element={<ProtectedRoute allowedRoles={['hospital']}><DashboardLayout role="hospital"><HospitalProfile /></DashboardLayout></ProtectedRoute>} />
        <Route path="/hospital/requirements/new" element={<ProtectedRoute allowedRoles={['hospital']}><DashboardLayout role="hospital"><CreateRequirement /></DashboardLayout></ProtectedRoute>} />
        <Route path="/hospital/requirements" element={<ProtectedRoute allowedRoles={['hospital']}><DashboardLayout role="hospital"><RequirementsList /></DashboardLayout></ProtectedRoute>} />
        <Route path="/hospital/requirements/:id" element={<ProtectedRoute allowedRoles={['hospital']}><DashboardLayout role="hospital"><RequirementDetail /></DashboardLayout></ProtectedRoute>} />
        <Route path="/hospital/shortlists" element={<ProtectedRoute allowedRoles={['hospital']}><DashboardLayout role="hospital"><ShortlistView /></DashboardLayout></ProtectedRoute>} />

        {/* Verifier */}
        <Route path="/verifier" element={<ProtectedRoute allowedRoles={['verifier']}><DashboardLayout role="verifier"><VerifierDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/verifier/hospitals/:id" element={<ProtectedRoute allowedRoles={['verifier']}><DashboardLayout role="verifier"><HospitalVerification /></DashboardLayout></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout role="admin"><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/requirements" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout role="admin"><AdminRequirements /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/requirements/:id/matches" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout role="admin"><RequirementMatches /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/shortlists/new" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout role="admin"><ShortlistBuilder /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/shortlists/:id" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout role="admin"><ShortlistDetail /></DashboardLayout></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
