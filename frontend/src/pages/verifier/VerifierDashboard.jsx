import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { ShieldCheck, Building2, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations';
import { EmptyStateIllustration, FloatingParticles } from '../../components/illustrations';

export default function VerifierDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/hospitals/verifier/pending/')
      .then(res => setHospitals(res.data.results || res.data || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      <div className="h-24 rounded-2xl shimmer" />
      <div className="h-10 rounded-xl shimmer" />
      {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-2xl shimmer" />)}
    </div>
  );

  return (
    <PageTransition>
      <div className="space-y-4">
        {/* Header */}
        <div className="relative gradient-mesh-strong rounded-2xl p-6 border border-border/40">
          <FloatingParticles count={3} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Verifier Dashboard</h1>
                <p className="text-sm text-text-secondary">Review and approve hospital registrations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending count badge */}
        {hospitals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              {hospitals.length} hospital{hospitals.length > 1 ? 's' : ''} pending verification
            </span>
          </motion.div>
        )}

        {/* Hospital cards */}
        {hospitals.length ? (
          <StaggerContainer>
            {hospitals.map(h => (
              <StaggerItem key={h.id}>
                <HoverCard className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{h.hospital_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <p className="text-xs text-text-secondary">
                          Submitted: {new Date(h.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                    <Link to={`/verifier/hospitals/${h.id}`} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-teal-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition-shadow">
                      Review <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-2xl border border-border/60 shadow-sm"
          >
            <EmptyStateIllustration type="search" className="w-40 h-32 mx-auto mb-4" />
            <p className="text-text-secondary font-medium">No pending hospital verifications</p>
            <p className="text-sm text-text-secondary/60 mt-1">All caught up! Check back later.</p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
