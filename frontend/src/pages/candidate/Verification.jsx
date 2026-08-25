import { useState, useEffect } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { ShieldCheck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, AnimatedProgress } from '../../components/animations';

export default function Verification() {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    api.get('/candidates/verification/status/')
      .then(res => setVerification(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submitVerification = async () => {
    setSubmitting(true);
    try { await api.post('/candidates/verification/submit/'); toast.success('Verification submitted'); load(); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const verifyDigiLocker = async () => {
    setSubmitting(true);
    try { await api.post('/candidates/verification/digilocker/'); toast.success('DigiLocker verified!'); load(); }
    catch (err) { toast.error('Failed'); }
    finally { setSubmitting(false); }
  };

  const verifyKNMC = async () => {
    setSubmitting(true);
    try { await api.post('/candidates/verification/knmc/'); toast.success('KNMC verified!'); load(); }
    catch (err) { toast.error('Failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="max-w-2xl space-y-6">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
      {[1,2].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />)}
    </div>
  );

  const StatusIcon = ({ status }) => {
    if (status === 'verified') return <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><CheckCircle className="w-6 h-6 text-success" /></motion.div>;
    if (status === 'pending') return <Clock className="w-6 h-6 text-warning" />;
    if (status === 'rejected') return <AlertCircle className="w-6 h-6 text-error" />;
    return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
  };

  const statusLabel = (s) => {
    if (s === 'verified') return <span className="text-success font-medium">✓ Verified</span>;
    if (s === 'pending') return <span className="text-warning font-medium">● Pending</span>;
    if (s === 'rejected') return <span className="text-error font-medium">✗ Rejected</span>;
    return <span className="text-text-secondary">Not submitted</span>;
  };

  const overall = verification?.overall_status;
  const stepsDone = (verification?.digilocker_status === 'verified' ? 1 : 0) + (verification?.knmc_status === 'verified' ? 1 : 0);

  return (
    <PageTransition>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-text-primary">Verification</h1>
        <p className="text-text-secondary">Complete verification to make your profile eligible for recruitment.</p>

        {/* Overall Status */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl border ${overall === 'verified' ? 'bg-green-50 border-success/20' : 'bg-white border-border'}`}>
          <div className="flex items-center gap-3">
            <motion.div animate={overall === 'verified' ? { rotate: [0, 10, -10, 0] } : {}} transition={{ repeat: Infinity, duration: 3 }}>
              <ShieldCheck className={`w-8 h-8 ${overall === 'verified' ? 'text-success' : 'text-text-secondary'}`} />
            </motion.div>
            <div>
              <h2 className="font-semibold text-lg text-text-primary">Overall Status</h2>
              <p className="text-sm">{statusLabel(overall)}</p>
            </div>
          </div>
          {overall !== 'verified' && (
            <>
              <div className="mt-4"><AnimatedProgress value={(stepsDone / 2) * 100} barClassName={stepsDone === 2 ? 'bg-success' : 'bg-primary'} /></div>
              <p className="mt-2 text-sm text-text-secondary">{stepsDone}/2 steps completed</p>
            </>
          )}
        </motion.div>

        {/* Submit first */}
        {verification?.digilocker_status === 'not_submitted' && verification?.knmc_status === 'not_submitted' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white p-6 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">Ready to verify?</h3>
            <p className="text-sm text-text-secondary mb-4">Submit your verification request to begin the process.</p>
            <motion.button onClick={submitVerification} disabled={submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Verification Request'}
            </motion.button>
          </motion.div>
        )}

        {/* DigiLocker */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon status={verification?.digilocker_status} />
              <div>
                <h3 className="font-semibold text-text-primary">DigiLocker Verification</h3>
                <p className="text-sm text-text-secondary">Mock identity verification</p>
              </div>
            </div>
            <div>{statusLabel(verification?.digilocker_status)}</div>
          </div>
          {verification?.digilocker_status === 'pending' && (
            <motion.button onClick={verifyDigiLocker} disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="mt-4 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50">
              {submitting ? 'Verifying...' : 'Verify with DigiLocker'}
            </motion.button>
          )}
          {verification?.digilocker_status === 'not_submitted' && <p className="mt-3 text-sm text-text-secondary">Submit verification request first.</p>}
        </motion.div>

        {/* KNMC */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon status={verification?.knmc_status} />
              <div>
                <h3 className="font-semibold text-text-primary">KNMC License Verification</h3>
                <p className="text-sm text-text-secondary">Mock nursing license verification</p>
              </div>
            </div>
            <div>{statusLabel(verification?.knmc_status)}</div>
          </div>
          {verification?.knmc_status === 'pending' && (
            <motion.button onClick={verifyKNMC} disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="mt-4 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50">
              {submitting ? 'Verifying...' : 'Verify with KNMC'}
            </motion.button>
          )}
          {verification?.knmc_status === 'not_submitted' && <p className="mt-3 text-sm text-text-secondary">Submit verification request first.</p>}
        </motion.div>
      </div>
    </PageTransition>
  );
}
