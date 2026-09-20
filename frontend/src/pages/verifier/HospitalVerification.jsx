import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/animations';

export default function HospitalVerification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');

  useEffect(() => {
    api.get(`/hospitals/verifier/${id}/`)
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action) => {
    try {
      await api.put(`/hospitals/verifier/${id}/`, { action, reason });
      toast.success(`Hospital ${action}d`);
      navigate('/verifier');
    } catch (err) {
      toast.error('Failed');
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
      <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );
  if (!data) return <div className="text-center py-12 text-text-secondary">Not found</div>;

  return (
    <PageTransition>
      <div className="space-y-6">
        <motion.button onClick={() => navigate(-1)} className="text-sm text-primary hover:underline" whileHover={{ x: -4 }}>← Back</motion.button>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-border p-6">
          <h1 className="text-2xl font-bold text-text-primary">{data.hospital_name}</h1>
          <p className="text-sm text-text-secondary mt-1">Submitted: {new Date(data.submitted_at).toLocaleString()}</p>
          <div className="mt-4 pt-4 border-t border-border">
            <h2 className="font-semibold text-text-primary mb-2">Submitted Credentials</h2>
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{data.credentials_text || 'No credentials provided'}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-border p-6">
          <h2 className="font-semibold text-text-primary mb-3">Verification Decision</h2>
          <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (optional)"
            className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary transition-shadow mb-4" rows={3} />
          <div className="flex gap-3">
            <motion.button onClick={() => handleAction('approve')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 bg-success text-white rounded-lg font-medium hover:opacity-90">Approve</motion.button>
            <motion.button onClick={() => handleAction('reject')} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 bg-error text-white rounded-lg font-medium hover:opacity-90">Reject</motion.button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
