import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations';

export default function ShortlistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shortlist, setShortlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get('/recruitment/shortlists/' + id + '/')
      .then(res => setShortlist(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const sendShortlist = async () => {
    setSending(true);
    try {
      await api.post('/recruitment/shortlists/' + id + '/send/');
      toast.success('Shortlist sent to hospital!');
      setShortlist(prev => ({ ...prev, is_sent: true }));
    } catch (err) {
      toast.error('Failed');
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="max-w-3xl space-y-6">
      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
      <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );
  if (!shortlist) return <div className="text-center py-12 text-text-secondary">Not found</div>;

  return (
    <PageTransition>
      <div className="max-w-3xl space-y-6">
        <motion.button onClick={() => navigate(-1)} className="text-sm text-primary hover:underline" whileHover={{ x: -4 }}>Back</motion.button>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Shortlist: {shortlist.requirement_title}</h1>
              <p className="text-text-secondary mt-1">{shortlist.candidate_count} candidates</p>
            </div>
            {shortlist.is_sent ? (
              <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="px-4 py-2 bg-green-50 text-success rounded-lg text-sm font-medium">Sent to Hospital</motion.span>
            ) : (
              <motion.button onClick={sendShortlist} disabled={sending} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">
                {sending ? 'Sending...' : 'Send to Hospital'}
              </motion.button>
            )}
          </div>
        </motion.div>

        <StaggerContainer>
          {shortlist.candidates && shortlist.candidates.map(sc => (
            <StaggerItem key={sc.id}>
              <HoverCard className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center gap-4">
                  <motion.div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-lg" whileHover={{ scale: 1.15 }}>
                    {sc.candidate_detail?.full_name?.[0] || '?'}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary">{sc.candidate_detail?.full_name}</h3>
                    <p className="text-sm text-text-secondary">{sc.candidate_detail?.qualifications?.[0]?.degree_display || '—'}</p>
                  </div>
                  {sc.candidate_detail?.verification?.is_fully_verified && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-3 py-1 bg-green-50 text-success text-xs font-medium rounded-full">Verified</motion.span>
                  )}
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}
