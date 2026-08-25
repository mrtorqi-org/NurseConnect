import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { User, ShieldCheck, ClipboardList, CheckCircle, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCounter, AnimatedProgress, HoverCard } from '../../components/animations';
import { FloatingParticles } from '../../components/illustrations';

export default function CandidateDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/candidates/profile/')
      .then(res => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-4xl space-y-6">
      <div className="h-24 rounded-2xl shimmer" />
      <div className="grid sm:grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl shimmer" />)}
      </div>
    </div>
  );

  const verification = profile?.verification;
  const isVerified = verification?.is_fully_verified;
  const completeness = profile?.profile_completeness || 0;

  const statCards = [
    { icon: User, label: 'Profile', value: `${completeness}%`, gradient: 'from-teal-500 to-emerald-500', bgLight: 'from-teal-50 to-emerald-50' },
    { icon: ShieldCheck, label: 'Verification', value: isVerified ? 'Verified' : 'Pending', gradient: isVerified ? 'from-green-500 to-emerald-600' : 'from-amber-500 to-orange-500', bgLight: isVerified ? 'from-green-50 to-emerald-50' : 'from-amber-50 to-orange-50' },
    { icon: Heart, label: 'Availability', value: profile?.availability ? 'Available' : 'Unavailable', gradient: 'from-blue-500 to-indigo-500', bgLight: 'from-blue-50 to-indigo-50' },
  ];

  return (
    <PageTransition>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="relative gradient-mesh-strong rounded-2xl p-6 border border-border/40">
          <FloatingParticles count={4} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center shadow-lg shadow-primary/20">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Welcome, {profile?.full_name || 'Nurse'}</h1>
                <p className="text-sm text-text-secondary">Manage your profile and verification status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient stat cards */}
        <StaggerContainer className="grid sm:grid-cols-3 gap-4">
          {statCards.map((s, i) => (
            <StaggerItem key={i}>
              <HoverCard className={`relative overflow-hidden bg-gradient-to-br ${s.bgLight} p-5 rounded-2xl border border-white/60`}>
                <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${s.gradient} opacity-10 rounded-full`} />
                <div className="relative z-10">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-text-secondary mt-3">{s.label}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">
                    {typeof s.value === 'string' && s.value.includes('%') ? <AnimatedCounter value={parseInt(s.value)} suffix="%" /> : s.value}
                  </p>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Profile completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="bg-white rounded-2xl border border-border/60 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-text-primary">Profile Completion</h2>
            </div>
            <span className="text-sm font-bold text-primary">{completeness}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full"
            />
          </div>
          <p className="text-xs text-text-secondary mt-2">
            {completeness < 50 ? 'Complete your profile to improve match chances' : completeness < 100 ? 'Looking good! Add more details for better matching' : 'Your profile is fully complete!'}
          </p>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-white rounded-2xl border border-border/60 shadow-sm p-6"
        >
          <h2 className="font-semibold text-text-primary mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link to="/candidate/profile" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition-shadow">
                {completeness < 50 ? 'Complete Profile' : 'Edit Profile'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
            {!isVerified && (
              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                <Link to="/candidate/verification" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary rounded-xl text-sm font-medium hover:bg-primary-light transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                  Start Verification
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Profile available message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary-light/50 to-primary/5 p-6 rounded-2xl border border-primary/10"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full" />
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-dark">Your profile is available to verified hospitals</h3>
              <p className="text-sm text-text-secondary mt-1">When a hospital submits a requirement matching your profile, our system will consider you for shortlisting.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
