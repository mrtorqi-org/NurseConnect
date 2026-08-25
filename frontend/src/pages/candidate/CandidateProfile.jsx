import { useState, useEffect } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, X, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem, HoverCard } from '../../components/animations';
import { validatePhone } from '../../utils/validators';

const DEGREES = [
  { value: 'GNM', label: 'GNM' }, { value: 'BSC', label: 'B.Sc Nursing' },
  { value: 'MSC', label: 'M.Sc Nursing' }, { value: 'POST_BASIC', label: 'Post Basic B.Sc' },
  { value: 'DIPLOMA', label: 'Diploma' }, { value: 'PHD', label: 'Ph.D' },
];

const SPECIALIZATIONS = [
  { value: 'ICU', label: 'ICU / Critical Care' }, { value: 'GENERAL', label: 'General Nursing' },
  { value: 'PEDIATRIC', label: 'Pediatric' }, { value: 'CARDIAC', label: 'Cardiac Care' },
  { value: 'EMERGENCY', label: 'Emergency / Trauma' }, { value: 'OPERATING_ROOM', label: 'Operating Room' },
  { value: 'OBSTETRIC', label: 'Obstetric / Maternity' }, { value: 'NEONATAL', label: 'Neonatal' },
];

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div className="absolute inset-0 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2 }}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}

export default function CandidateProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone: '', address: '', bio: '' });
  const [showQual, setShowQual] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [showSpec, setShowSpec] = useState(false);
  const [showLic, setShowLic] = useState(false);
  const [qualForm, setQualForm] = useState({ degree: 'BSC', institution: '', year_of_completion: 2024, grade: '' });
  const [expForm, setExpForm] = useState({ hospital_name: '', designation: '', years_of_experience: 1, specialization_name: '' });
  const [specForm, setSpecForm] = useState({ name: 'ICU' });
  const [licForm, setLicForm] = useState({ license_number: '', issuing_body: 'Kerala Nurses and Midwives Council', expiry_date: '' });
  const [phoneError, setPhoneError] = useState('');

  const load = () => {
    api.get('/candidates/profile/').then(res => {
      setProfile(res.data);
      setForm({ phone: res.data.phone || '', address: res.data.address || '', bio: res.data.bio || '' });
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const saveProfile = async () => {
    const pErr = validatePhone(form.phone);
    if (pErr) { setPhoneError(pErr); return; }
    setPhoneError('');
    await api.put('/candidates/profile/', form);
    toast.success('Profile updated');
    setEditing(false);
    load();
  };

  const addQual = async () => { await api.post('/candidates/qualifications/', qualForm); toast.success('Qualification added'); setShowQual(false); load(); };
  const addExp = async () => { await api.post('/candidates/experiences/', expForm); toast.success('Experience added'); setShowExp(false); load(); };
  const addSpec = async () => { await api.post('/candidates/specializations/', specForm); toast.success('Specialization added'); setShowSpec(false); load(); };
  const addLic = async () => { await api.post('/candidates/licenses/', licForm); toast.success('License added'); setShowLic(false); load(); };

  const delItem = async (url) => { await api.delete(url); toast.success('Removed'); load(); };

  if (loading) return (
    <div className="max-w-4xl space-y-6">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />)}
    </div>
  );

  return (
    <PageTransition>
      <div className="max-w-4xl space-y-6">
        <h1 className="text-2xl font-bold text-text-primary">My Profile</h1>

        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Personal Information</h2>
            <button onClick={() => setEditing(!editing)} className="text-sm text-primary hover:underline flex items-center gap-1"><Edit2 className="w-4 h-4" /> Edit</button>
          </div>
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div><label className="block text-sm font-medium mb-1">Phone</label><input value={form.phone} onChange={e => { setForm({...form, phone: e.target.value}); setPhoneError(''); }} onBlur={() => setPhoneError(validatePhone(form.phone))} className={"w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-primary transition-shadow " + (phoneError ? 'border-red-300' : 'border-border')} placeholder="e.g. 9876543210 or +919876543210" />{phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}</div>
                <div><label className="block text-sm font-medium mb-1">Address</label><textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary" rows={2} /></div>
                <div><label className="block text-sm font-medium mb-1">Bio</label><textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary" rows={3} /></div>
                <motion.button onClick={saveProfile} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">Save</motion.button>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm space-y-1 text-text-secondary">
                <p><span className="font-medium text-text-primary">Phone:</span> {profile.phone || '—'}</p>
                <p><span className="font-medium text-text-primary">Address:</span> {profile.address || '—'}</p>
                <p><span className="font-medium text-text-primary">Bio:</span> {profile.bio || '—'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Qualifications */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Qualifications</h2>
            <motion.button onClick={() => setShowQual(true)} whileHover={{ scale: 1.05 }} className="text-sm text-primary hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Add</motion.button>
          </div>
          {profile.qualifications?.length ? (
            <StaggerContainer>{profile.qualifications.map(q => (
              <StaggerItem key={q.id}>
                <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div><p className="text-sm font-medium">{q.degree_display}</p><p className="text-xs text-text-secondary">{q.institution} · {q.year_of_completion}</p></div>
                  <button onClick={() => delItem(`/candidates/qualifications/${q.id}/`)} className="text-xs text-error hover:underline">Remove</button>
                </div>
              </StaggerItem>
            ))}</StaggerContainer>
          ) : <p className="text-sm text-text-secondary">No qualifications added yet.</p>}
        </motion.div>

        {/* Experience */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Experience</h2>
            <motion.button onClick={() => setShowExp(true)} whileHover={{ scale: 1.05 }} className="text-sm text-primary hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Add</motion.button>
          </div>
          {profile.experiences?.length ? (
            <StaggerContainer>{profile.experiences.map(e => (
              <StaggerItem key={e.id}>
                <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div><p className="text-sm font-medium">{e.designation}</p><p className="text-xs text-text-secondary">{e.hospital_name} · {e.years_of_experience} years</p></div>
                  <button onClick={() => delItem(`/candidates/experiences/${e.id}/`)} className="text-xs text-error hover:underline">Remove</button>
                </div>
              </StaggerItem>
            ))}</StaggerContainer>
          ) : <p className="text-sm text-text-secondary">No experience added yet.</p>}
        </motion.div>

        {/* Specializations */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Specializations</h2>
            <motion.button onClick={() => setShowSpec(true)} whileHover={{ scale: 1.05 }} className="text-sm text-primary hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Add</motion.button>
          </div>
          {profile.specializations?.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.specializations.map((s, i) => (
                <motion.span key={s.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className="px-3 py-1 bg-primary-light text-primary text-sm rounded-full flex items-center gap-2">
                  {s.name_display}
                  <button onClick={() => delItem(`/candidates/specializations/${s.id}/`)} className="hover:text-error"><X className="w-3 h-3" /></button>
                </motion.span>
              ))}
            </div>
          ) : <p className="text-sm text-text-secondary">No specializations added yet.</p>}
        </motion.div>

        {/* Licenses */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">Licenses</h2>
            <motion.button onClick={() => setShowLic(true)} whileHover={{ scale: 1.05 }} className="text-sm text-primary hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Add</motion.button>
          </div>
          {profile.licenses?.length ? (
            <StaggerContainer>{profile.licenses.map(l => (
              <StaggerItem key={l.id}>
                <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div><p className="text-sm font-medium">{l.license_number}</p><p className="text-xs text-text-secondary">{l.issuing_body}</p></div>
                  <button onClick={() => delItem(`/candidates/licenses/${l.id}/`)} className="text-xs text-error hover:underline">Remove</button>
                </div>
              </StaggerItem>
            ))}</StaggerContainer>
          ) : <p className="text-sm text-text-secondary">No licenses added yet.</p>}
        </motion.div>

        {/* Modals */}
        <Modal open={showQual} onClose={() => setShowQual(false)} title="Add Qualification">
          <div className="space-y-3">
            <select value={qualForm.degree} onChange={e => setQualForm({...qualForm, degree: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm">{DEGREES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}</select>
            <input placeholder="Institution" value={qualForm.institution} onChange={e => setQualForm({...qualForm, institution: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            <input type="number" placeholder="Year" value={qualForm.year_of_completion} onChange={e => setQualForm({...qualForm, year_of_completion: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            <input placeholder="Grade (optional)" value={qualForm.grade} onChange={e => setQualForm({...qualForm, grade: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            <motion.button onClick={addQual} whileTap={{ scale: 0.98 }} className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">Add Qualification</motion.button>
          </div>
        </Modal>

        <Modal open={showExp} onClose={() => setShowExp(false)} title="Add Experience">
          <div className="space-y-3">
            <input placeholder="Hospital Name" value={expForm.hospital_name} onChange={e => setExpForm({...expForm, hospital_name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            <input placeholder="Designation" value={expForm.designation} onChange={e => setExpForm({...expForm, designation: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            <input type="number" placeholder="Years" value={expForm.years_of_experience} onChange={e => setExpForm({...expForm, years_of_experience: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            <input placeholder="Specialization (optional)" value={expForm.specialization_name} onChange={e => setExpForm({...expForm, specialization_name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            <motion.button onClick={addExp} whileTap={{ scale: 0.98 }} className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">Add Experience</motion.button>
          </div>
        </Modal>

        <Modal open={showSpec} onClose={() => setShowSpec(false)} title="Add Specialization">
          <div className="space-y-3">
            <select value={specForm.name} onChange={e => setSpecForm({name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm">{SPECIALIZATIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
            <motion.button onClick={addSpec} whileTap={{ scale: 0.98 }} className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">Add Specialization</motion.button>
          </div>
        </Modal>

        <Modal open={showLic} onClose={() => setShowLic(false)} title="Add License">
          <div className="space-y-3">
            <input placeholder="License Number" value={licForm.license_number} onChange={e => setLicForm({...licForm, license_number: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            <input placeholder="Issuing Body" value={licForm.issuing_body} onChange={e => setLicForm({...licForm, issuing_body: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            <input type="date" value={licForm.expiry_date} onChange={e => setLicForm({...licForm, expiry_date: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
            <motion.button onClick={addLic} whileTap={{ scale: 0.98 }} className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">Add License</motion.button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}
