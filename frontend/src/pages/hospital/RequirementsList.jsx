import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations';

export default function RequirementsList() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/recruitment/requirements/')
      .then(res => setRequirements(res.data.results || res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-4xl space-y-4">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
      {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <PageTransition>
      <div className="max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Requirements</h1>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/hospital/requirements/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark">
              <Plus className="w-4 h-4" /> New Requirement
            </Link>
          </motion.div>
        </div>
        {requirements.length ? (
          <StaggerContainer>
            {requirements.map(r => (
              <StaggerItem key={r.id}>
                <HoverCard>
                  <Link to={`/hospital/requirements/${r.id}`}
                    className="block bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-text-primary">{r.title}</h3>
                        <p className="text-sm text-text-secondary mt-1">{r.quantity} nurses {r.specialization_display} {r.min_experience}+ years exp</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === 'shortlisted' ? 'bg-green-50 text-success' : r.status === 'processing' ? 'bg-amber-50 text-warning' : 'bg-gray-100 text-text-secondary'}`}>
                        {r.status_display}
                      </span>
                    </div>
                  </Link>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 bg-white rounded-xl border border-border">
            <p className="text-text-secondary">No requirements yet</p>
            <Link to="/hospital/requirements/new" className="mt-3 inline-block text-sm text-primary font-medium hover:underline">Create your first requirement</Link>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
