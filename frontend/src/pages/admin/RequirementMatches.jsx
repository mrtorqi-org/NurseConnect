import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, AnimatedCounter, HoverCard } from '../../components/animations';

export default function RequirementMatches() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.get(`/recruitment/requirements/${id}/matches/`)
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const toggle = (cid) => {
    setSelected(prev => prev.includes(cid) ? prev.filter(x => x !== cid) : [...prev, cid]);
  };

  const createShortlist = async () => {
    if (!selected.length) { toast.error('Select at least one candidate'); return; }
    setCreating(true);
    try {
      const res = await api.post('/recruitment/shortlists/', {
        requirement_id: parseInt(id),
        candidate_ids: selected,
        notes: '',
      });
      toast.success('Shortlist created!');
      navigate(`/admin/shortlists/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl space-y-6">
      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
      <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
      <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );
  if (!data) return <div className="text-center py-12 text-text-secondary">Not found</div>;

  return (
    <PageTransition>
      <div className="max-w-5xl space-y-6">
        <motion.button onClick={() => navigate(-1)} className="text-sm text-primary hover:underline" whileHover={{ x: -4 }}>
          ← Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-border p-6"
        >
          <h1 className="text-2xl font-bold text-text-primary">{data.requirement?.title}</h1>
          <p className="text-text-secondary mt-1">
            <AnimatedCounter value={data.required} className="font-semibold" /> nurses required · {data.total_matches} candidates found
          </p>
          <div className="flex items-center gap-3 mt-3 text-sm text-text-secondary">
            <span>Qualification: {data.requirement?.qualification_display}</span>
            <span>·</span>
            <span>Experience: {data.requirement?.min_experience}+ years</span>
            <span>·</span>
            <span>Specialization: {data.requirement?.specialization_display}</span>
          </div>
        </motion.div>

        {data.matches?.length ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-border overflow-hidden"
            >
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">Candidate</th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">Qualification</th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">Experience</th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">Specialization</th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">Verified</th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">Match</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <StaggerContainer>
                    {data.matches.map(m => (
                      <StaggerItem key={m.id}>
                        <motion.tr
                          className={`hover:bg-gray-50 ${selected.includes(m.id) ? 'bg-primary-light/30' : ''}`}
                          whileHover={{ backgroundColor: selected.includes(m.id) ? undefined : 'rgba(0,0,0,0.02)' }}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <motion.div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-xs" whileHover={{ scale: 1.15 }}>
                                {m.full_name?.[0] || '?'}
                              </motion.div>
                              <span className="text-sm font-medium text-text-primary">{m.full_name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-text-secondary">{m.qualifications?.[0]?.degree || '—'}</td>
                          <td className="px-5 py-4 text-sm text-text-secondary">{m.total_experience} years</td>
                          <td className="px-5 py-4 text-sm text-text-secondary">{m.specializations?.[0] || '—'}</td>
                          <td className="px-5 py-4">
                            {m.is_verified ? <CheckCircle className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-error" />}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1">
                              {m.match_details?.qualification_match && <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ delay: 0.5 }} className="w-2 h-2 rounded-full bg-success" title="Qualification match" />}
                              {m.match_details?.experience_match && <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ delay: 0.6 }} className="w-2 h-2 rounded-full bg-success" title="Experience match" />}
                              {m.match_details?.specialization_match && <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ delay: 0.7 }} className="w-2 h-2 rounded-full bg-success" title="Specialization match" />}
                              {m.match_details?.license_match && <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ delay: 0.8 }} className="w-2 h-2 rounded-full bg-success" title="License match" />}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <motion.button onClick={() => toggle(m.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selected.includes(m.id) ? 'bg-primary text-white' : 'border border-border text-text-secondary hover:bg-gray-50'}`}>
                              {selected.includes(m.id) ? 'Selected' : 'Select'}
                            </motion.button>
                          </td>
                        </motion.tr>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </tbody>
              </table>
            </motion.div>

            {/* Sticky action bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl border border-border p-4 flex items-center justify-between sticky bottom-4 shadow-lg"
            >
              <p className="text-sm text-text-secondary">
                Selected: <span className="font-semibold text-text-primary"><AnimatedCounter value={selected.length} /></span> / {data.required} required
              </p>
              <motion.button onClick={createShortlist} disabled={creating || !selected.length}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">
                {creating ? 'Creating...' : 'Create Shortlist'}
              </motion.button>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 bg-white rounded-xl border border-border">
            <p className="text-text-secondary">No matching candidates found</p>
            <p className="text-sm text-text-secondary mt-1">Try adjusting the recruitment criteria or check again later.</p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
