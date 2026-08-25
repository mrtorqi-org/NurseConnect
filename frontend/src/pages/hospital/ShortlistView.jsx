import { useState, useEffect } from 'react';
import api from '../../api/client';
import { Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations';

export default function ShortlistView() {
  const [shortlists, setShortlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/recruitment/hospital/shortlists/')
      .then(res => setShortlists(res.data.results || res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-4xl space-y-4">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
      {[1,2].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <PageTransition>
      <div className="max-w-4xl space-y-4">
        <h1 className="text-2xl font-bold text-text-primary">Shortlists</h1>
        {shortlists.length ? (
          <StaggerContainer>
            {shortlists.map(sl => (
              <StaggerItem key={sl.id}>
                <HoverCard className="bg-white rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="font-semibold text-text-primary">{sl.requirement_title}</h2>
                      <p className="text-sm text-text-secondary">{sl.candidate_count} candidates · Required: {sl.requirement_quantity}</p>
                    </div>
                    <motion.button onClick={() => setExpanded(expanded === sl.id ? null : sl.id)} whileHover={{ scale: 1.02 }} className="text-sm text-primary hover:underline">
                      {expanded === sl.id ? 'Hide' : 'View Candidates'}
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {expanded === sl.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                        className="overflow-hidden">
                        {sl.candidates?.map((sc, i) => (
                          <motion.div key={sc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="p-4 bg-gray-50 rounded-lg mt-3">
                            <div className="flex items-center gap-3">
                              <motion.div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm" whileHover={{ scale: 1.15 }}>
                                {sc.candidate_detail?.full_name?.[0] || '?'}
                              </motion.div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-text-primary">{sc.candidate_detail?.full_name}</p>
                                <p className="text-xs text-text-secondary">
                                  {sc.candidate_detail?.qualifications?.[0]?.degree_display || '—'} · {sc.candidate_detail?.experiences?.[0]?.years_of_experience || 0} years exp
                                  {sc.candidate_detail?.specializations?.length ? ` · ${sc.candidate_detail.specializations[0].name_display}` : ''}
                                </p>
                              </div>
                              {sc.candidate_detail?.verification?.is_fully_verified && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-2 py-0.5 bg-green-50 text-success text-xs rounded-full font-medium">✓ Verified</motion.span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 bg-white rounded-xl border border-border">
            <Users className="w-10 h-10 text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary">No shortlists received yet</p>
            <p className="text-sm text-text-secondary mt-1">Shortlists will appear here once the admin processes your requirements.</p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
