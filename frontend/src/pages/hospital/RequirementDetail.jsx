import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { motion } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem } from '../../components/animations';

export default function RequirementDetail() {
  const { id } = useParams();
  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/recruitment/requirements/${id}/`)
      .then(res => setReq(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-3xl space-y-6">
      <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
      <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );
  if (!req) return <div className="text-center py-12 text-text-secondary">Requirement not found</div>;

  return (
    <PageTransition>
      <div className="max-w-3xl space-y-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/hospital/requirements" className="text-sm text-primary hover:underline">← Back to Requirements</Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-text-primary">{req.title}</h1>
            <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === 'shortlisted' ? 'bg-green-50 text-success' : req.status === 'processing' ? 'bg-amber-50 text-warning' : 'bg-gray-100 text-text-secondary'}`}>
              {req.status_display}
            </motion.span>
          </div>
          <StaggerContainer className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['Position:', req.position_type],
              ['Quantity:', `${req.quantity} nurses`],
              ['Min Qualification:', req.qualification_display],
              ['Min Experience:', `${req.min_experience}+ years`],
              ['Specialization:', req.specialization_display],
              ['License Required:', req.license_required ? 'Yes' : 'No'],
            ].map(([label, value], i) => (
              <StaggerItem key={i}>
                <span className="text-text-secondary">{label}</span> <span className="font-medium">{value}</span>
              </StaggerItem>
            ))}
          </StaggerContainer>
          {req.additional_criteria && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-text-secondary">Additional Criteria:</p>
              <p className="text-sm mt-1">{req.additional_criteria}</p>
            </div>
          )}
        </motion.div>
        {req.status === 'shortlisted' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-green-50 rounded-xl border border-success/20 p-6">
            <p className="font-semibold text-success">Shortlist Available</p>
            <p className="text-sm text-text-secondary mt-1">Admin has created a shortlist for this requirement. Check your shortlists page.</p>
            <Link to="/hospital/shortlists" className="mt-3 inline-block text-sm text-primary font-medium hover:underline">View Shortlists →</Link>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
