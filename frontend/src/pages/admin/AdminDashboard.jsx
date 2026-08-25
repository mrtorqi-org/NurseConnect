import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Users, Building2, ClipboardList, CheckCircle, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCounter, AnimatedProgress, HoverCard } from '../../components/animations';
import { FloatingParticles } from '../../components/illustrations';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/recruitment/admin/stats/'),
      api.get('/recruitment/requirements/').catch(() => ({ data: { results: [] } })),
    ]).then(([s, r]) => {
      setStats(s.data);
      setRequirements(r.data.results || r.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-5xl space-y-6">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
      <div className="grid sm:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl shimmer" />)}
      </div>
      <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
    </div>
  );

  const statCards = [
    { icon: Users, label: 'Total Candidates', value: stats?.total_candidates || 0, gradient: 'from-teal-500 to-emerald-500', bgLight: 'from-teal-50 to-emerald-50' },
    { icon: CheckCircle, label: 'Verified', value: stats?.verified_candidates || 0, gradient: 'from-green-500 to-emerald-600', bgLight: 'from-green-50 to-emerald-50' },
    { icon: Building2, label: 'Hospitals', value: stats?.total_hospitals || 0, gradient: 'from-blue-500 to-indigo-500', bgLight: 'from-blue-50 to-indigo-50' },
    { icon: ClipboardList, label: 'Requirements', value: stats?.total_requirements || 0, gradient: 'from-amber-500 to-orange-500', bgLight: 'from-amber-50 to-orange-50' },
  ];

  return (
    <PageTransition>
      <div className="max-w-5xl space-y-6">
        {/* Header with gradient mesh */}
        <div className="relative gradient-mesh-strong rounded-2xl p-6 border border-border/40">
          <FloatingParticles count={5} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center shadow-lg shadow-primary/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
                <p className="text-sm text-text-secondary">Overview of your recruitment platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient stat cards */}
        <StaggerContainer className="grid sm:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <StaggerItem key={i}>
              <HoverCard className={`relative overflow-hidden bg-gradient-to-br ${s.bgLight} p-5 rounded-2xl border border-white/60`}>
                <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${s.gradient} opacity-10 rounded-full`} />
                <div className="relative z-10">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-text-secondary mt-3">{s.label}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1"><AnimatedCounter value={s.value} /></p>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Requirements table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h2 className="font-semibold text-text-primary">Recruitment Requirements</h2>
            </div>
            <Link to="/admin/requirements" className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {requirements.length ? (
            <StaggerContainer>
              {requirements.slice(0, 5).map(r => (
                <StaggerItem key={r.id}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.status === 'shortlisted' ? 'bg-green-500' : r.status === 'processing' ? 'bg-amber-500' : 'bg-gray-300'}`} />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{r.title}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{r.hospital_name} · {r.quantity} nurses · {r.specialization_display}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === 'shortlisted' ? 'bg-green-50 text-green-700 border border-green-200' : r.status === 'processing' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                        {r.status_display}
                      </span>
                      {r.status === 'pending' && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link to={`/admin/requirements/${r.id}/matches`} className="text-xs text-primary font-medium bg-primary-light px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors">
                            Find Matches
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-text-secondary font-medium">No requirements yet</p>
              <p className="text-sm text-text-secondary/60 mt-1">Requirements will appear here once hospitals create them</p>
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
