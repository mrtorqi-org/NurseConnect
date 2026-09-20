import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations';

export default function ShortlistBuilder() {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [matches, setMatches] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    api.get('/recruitment/requirements/')
      .then(res => setRequirements(res.data.results || res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const loadMatches = async (reqId) => {
    setSelectedReq(reqId);
    setSelected([]);
    setLoadingMatches(true);
    try {
      const res = await api.get(`/recruitment/requirements/${reqId}/matches/`);
      setMatches(res.data);
    } catch (err) {
      toast.error('Failed to load matches');
    } finally {
      setLoadingMatches(false);
    }
  };

  const toggle = (cid) => {
    setSelected(prev => prev.includes(cid) ? prev.filter(x => x !== cid) : [...prev, cid]);
  };

  const createShortlist = async () => {
    if (!selected.length) { toast.error('Select candidates'); return; }
    try {
      const res = await api.post('/recruitment/shortlists/', {
        requirement_id: selectedReq, candidate_ids: selected, notes: '',
      });
      toast.success('Shortlist created!');
      navigate(`/admin/shortlists/${res.data.id}`);
    } catch (err) {
      toast.error('Failed');
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
      <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-text-primary">Create Shortlist</h1>
        {!selectedReq ? (
          <div className="space-y-3">
            <p className="text-text-secondary">Select a requirement to find matching candidates:</p>
            <StaggerContainer>
              {requirements.filter(r => r.status === 'pending').map(r => (
                <StaggerItem key={r.id}>
                  <HoverCard>
                    <motion.button onClick={() => loadMatches(r.id)} whileTap={{ scale: 0.99 }}
                      className="w-full text-left bg-white rounded-xl border border-border p-5 hover:border-primary transition-colors">
                      <h3 className="font-semibold text-text-primary">{r.title}</h3>
                      <p className="text-sm text-text-secondary">{r.quantity} nurses · {r.specialization_display} · {r.min_experience}+ years</p>
                    </motion.button>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
            {requirements.filter(r => r.status === 'pending').length === 0 && (
              <p className="text-text-secondary">No pending requirements to process.</p>
            )}
          </div>
        ) : loadingMatches ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        ) : matches ? (
          <div className="space-y-4">
            <motion.button onClick={() => { setSelectedReq(null); setMatches(null); }} className="text-sm text-primary hover:underline" whileHover={{ x: -4 }}>
              ← Choose different requirement
            </motion.button>
            <p className="text-text-secondary">{matches.total_matches} candidates match · {matches.required} required</p>
            <StaggerContainer>
              {matches.matches?.map(m => (
                <StaggerItem key={m.id}>
                  <HoverCard className={`bg-white rounded-xl border p-4 flex items-center justify-between ${selected.includes(m.id) ? 'border-primary bg-primary-light/20' : 'border-border'}`}>
                    <div className="flex items-center gap-3">
                      <motion.div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm" whileHover={{ scale: 1.15 }}>
                        {m.full_name?.[0]}
                      </motion.div>
                      <div>
                        <p className="font-medium text-text-primary">{m.full_name}</p>
                        <p className="text-xs text-text-secondary">{m.qualifications?.[0]?.degree} · {m.total_experience} yrs · {m.specializations?.[0]}</p>
                      </div>
                    </div>
                    <motion.button onClick={() => toggle(m.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${selected.includes(m.id) ? 'bg-primary text-white' : 'border border-border'}`}>
                      {selected.includes(m.id) ? 'Selected' : 'Select'}
                    </motion.button>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-border p-4 flex items-center justify-between sticky bottom-4 shadow-lg">
              <p className="text-sm">Selected: <span className="font-bold">{selected.length}</span> / {matches.required}</p>
              <motion.button onClick={createShortlist} disabled={!selected.length} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">
                Create Shortlist
              </motion.button>
            </motion.div>
          </div>
        ) : null}
      </div>
    </PageTransition>
  );
}
