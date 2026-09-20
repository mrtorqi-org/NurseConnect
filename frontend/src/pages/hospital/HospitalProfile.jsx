import { useState, useEffect } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Edit2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../../components/animations';
import { validatePhone } from '../../utils/validators';

export default function HospitalProfile() {
  const [profile, setProfile] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [credForm, setCredForm] = useState('');
  const [showCred, setShowCred] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const load = () => {
    Promise.all([
      api.get('/hospitals/profile/'),
      api.get('/hospitals/verification/status/'),
    ]).then(([p, v]) => {
      setProfile(p.data);
      setForm({ hospital_name: p.data.hospital_name, address: p.data.address, city: p.data.city, state: p.data.state, phone: p.data.phone, website: p.data.website, description: p.data.description, registration_number: p.data.registration_number });
      setVerification(v.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    const pErr = validatePhone(form.phone);
    if (pErr) { setPhoneError(pErr); return; }
    setPhoneError('');
    await api.put('/hospitals/profile/', form);
    toast.success('Profile updated');
    setEditing(false);
    load();
  };

  const submitCredentials = async () => {
    if (!credForm.trim()) { toast.error('Enter credentials'); return; }
    await api.post('/hospitals/verification/submit/', { credentials_text: credForm });
    toast.success('Credentials submitted');
    setShowCred(false); load();
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
      {[1, 2].map(i => <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />)}
    </div>
  );

  const vStatus = verification?.status;

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-text-primary">Hospital Profile</h1>

        {/* Verification status */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`p-5 rounded-xl border ${vStatus === 'approved' ? 'bg-green-50 border-success/20' : vStatus === 'rejected' ? 'bg-red-50 border-error/20' : 'bg-amber-50 border-warning/20'}`}>
          <div className="flex items-center gap-3">
            <motion.div animate={vStatus === 'approved' ? { rotate: [0, 10, -10, 0] } : {}} transition={{ repeat: Infinity, duration: 3 }}>
              <ShieldCheck className={`w-6 h-6 ${vStatus === 'approved' ? 'text-success' : vStatus === 'rejected' ? 'text-error' : 'text-warning'}`} />
            </motion.div>
            <div>
              <p className="font-semibold">Verification: {vStatus === 'approved' ? 'Approved ✓' : vStatus === 'rejected' ? 'Rejected' : 'Pending'}</p>
              {vStatus === 'pending' && <p className="text-sm text-text-secondary">Submit credentials and wait for verifier approval.</p>}
              {vStatus === 'rejected' && verification?.reason && <p className="text-sm text-error">{verification.reason}</p>}
            </div>
          </div>
        </motion.div>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Hospital Details</h2>
            <button onClick={() => setEditing(!editing)} className="text-sm text-primary hover:underline flex items-center gap-1"><Edit2 className="w-4 h-4" /> Edit</button>
          </div>
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {['hospital_name', 'registration_number', 'address', 'city', 'state', 'phone', 'website'].map(f => (
                  <div key={f}>
                    <label className="block text-sm font-medium mb-1 capitalize">{f.replace('_', ' ')}</label>
                    <input value={form[f] || ''} onChange={e => { setForm({ ...form, [f]: e.target.value }); if (f === 'phone') setPhoneError(''); }} onBlur={f === 'phone' ? () => setPhoneError(validatePhone(form.phone)) : undefined} className={'w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary transition-shadow ' + (f === 'phone' && phoneError ? 'border-red-300' : 'border-border')} placeholder={f === 'phone' ? 'e.g. 9876543210' : ''} />
                    {f === 'phone' && phoneError && <p className='text-xs text-red-500 mt-1'>{phoneError}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary" rows={3} />
                </div>
                <motion.button onClick={save} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">Save</motion.button>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm space-y-1 text-text-secondary">
                {['hospital_name', 'registration_number', 'address', 'city', 'state', 'phone', 'website', 'description'].map(f => (
                  <p key={f}><span className="font-medium text-text-primary capitalize">{f.replace('_', ' ')}:</span> {profile[f] || '—'}</p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {vStatus === 'pending' && !verification?.credentials_text && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text-primary mb-3">Submit Credentials</h2>
            <textarea value={credForm} onChange={e => setCredForm(e.target.value)} placeholder="Describe your hospital credentials..."
              className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary transition-shadow" rows={4} />
            <motion.button onClick={submitCredentials} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-3 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">Submit Credentials</motion.button>
          </motion.div>
        )}

        {verification?.credentials_text && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text-primary mb-3">Submitted Credentials</h2>
            <p className="text-sm text-text-secondary">{verification.credentials_text}</p>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
