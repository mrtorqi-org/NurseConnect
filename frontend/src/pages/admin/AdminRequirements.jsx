import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations';
import { Loader2, Check } from 'lucide-react';

export default function AdminRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    api.get('/recruitment/requirements/')
      .then(res => setRequirements(res.data.results || res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (reqId) => {
    if (!window.confirm('Approve this requirement and automatically shortlist matching verified candidates?')) return;
    setApproving(reqId);
    try {
      const res = await api.post(`/recruitment/requirements/${reqId}/approve/`);
      toast.success(`Approved! ${res.data.candidates_shortlisted} verified candidates shortlisted.`);
      // Refresh requirements
      const reqRes = await api.get('/recruitment/requirements/');
      setRequirements(reqRes.data.results || reqRes.data || []);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to approve requirement');
    } finally {
      setApproving(null);
    }
  };

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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.status === 'shortlisted' ? 'bg-green-50 text-success' : 
                        r.status === 'approved' ? 'bg-blue-50 text-blue-600' : 
                        r.status === 'processing' ? 'bg-amber-50 text-warning' : 
                        r.status === 'completed' ? 'bg-blue-50 text-info' : 
                        'bg-gray-100 text-text-secondary'
                      }`}>
                        {r.status_display}
                      </span>
                      {(r.status === 'pending' || r.status === 'processing') && (
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => handleApprove(r.id)}
                            disabled={approving === r.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1.5 text-xs font-medium bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {approving === r.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            Approve & Auto-Shortlist
                          </motion.button>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to={`/admin/requirements/${r.id}/matches`} className="text-sm text-primary font-medium hover:underline">
                              Find Matches
                            </Link>
                          </motion.div>
                        </div>
                      )}
                      {r.status === 'approved' && (
                        <span className="text-xs text-blue-600 font-medium">Auto-shortlisting...</span>
                      )}
                      {r.status !== 'pending' && r.status !== 'processing' && r.status !== 'approved' && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link to={`/admin/requirements/${r.id}/matches`} className="text-sm text-primary font-medium hover:underline">
                            View
                          </Link>
                        </motion.div>
                      )}
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
