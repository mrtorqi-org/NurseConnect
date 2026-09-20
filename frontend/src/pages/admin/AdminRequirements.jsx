import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { motion } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations';

export default function AdminRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recruitment/requirements/')
      .then(res => setRequirements(res.data.results || res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
      {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <PageTransition>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-text-primary">All Requirements</h1>
        {requirements.length ? (
          <StaggerContainer>
            {requirements.map(r => (
              <StaggerItem key={r.id}>
                <HoverCard className="bg-white rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-text-primary">{r.title}</h3>
                      <p className="text-sm text-text-secondary mt-1">{r.hospital_name} · {r.quantity} nurses · {r.specialization_display} · {r.min_experience}+ years</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === 'shortlisted' ? 'bg-green-50 text-success' : r.status === 'processing' ? 'bg-amber-50 text-warning' : r.status === 'completed' ? 'bg-blue-50 text-info' : 'bg-gray-100 text-text-secondary'}`}>
                        {r.status_display}
                      </span>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to={`/admin/requirements/${r.id}/matches`} className="text-sm text-primary font-medium hover:underline">
                          {r.status === 'pending' ? 'Find Matches' : 'View'}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-text-secondary py-8 text-center">No requirements yet.</motion.div>
        )}
      </div>
    </PageTransition>
  );
}
