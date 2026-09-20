import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/animations';

const SPECS = [
  { value: 'ANY', label: 'Any' }, { value: 'ICU', label: 'ICU / Critical Care' },
  { value: 'GENERAL', label: 'General Nursing' }, { value: 'PEDIATRIC', label: 'Pediatric' },
  { value: 'CARDIAC', label: 'Cardiac Care' }, { value: 'EMERGENCY', label: 'Emergency / Trauma' },
  { value: 'OPERATING_ROOM', label: 'Operating Room' }, { value: 'OBSTETRIC', label: 'Obstetric / Maternity' },
  { value: 'NEONATAL', label: 'Neonatal' }, { value: 'ORTHOPEDIC', label: 'Orthopedic' },
];
const QUALS = [
  { value: 'ANY', label: 'Any' }, { value: 'GNM', label: 'GNM' },
  { value: 'BSC', label: 'B.Sc Nursing' }, { value: 'MSC', label: 'M.Sc Nursing' },
  { value: 'POST_BASIC', label: 'Post Basic B.Sc' }, { value: 'DIPLOMA', label: 'Diploma' },
];

export default function CreateRequirement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', position_type: '', quantity: 1,
    min_qualification: 'ANY', min_experience: 0,
    specialization: 'ANY', license_required: true, additional_criteria: '',
  });

  const update = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.position_type) { toast.error('Title and position type are required'); return; }
    setLoading(true);
    try {
      await api.post('/recruitment/requirements/', form);
      toast.success('Requirement created');
      navigate('/hospital/requirements');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Requirement Title *', key: 'title', type: 'text', placeholder: 'e.g., ICU Nurse Recruitment' },
    { label: 'Position Type *', key: 'position_type', type: 'text', placeholder: 'e.g., Staff Nurse, Senior Nurse' },
  ];

  return (
    <PageTransition>
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-6">Create Recruitment Requirement</h1>
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-border p-6 space-y-5">
          {fields.map((f, i) => (
            <motion.div key={f.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <label className="block text-sm font-medium text-text-primary mb-1.5">{f.label}</label>
              <input value={form[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" required />
            </motion.div>
          ))}
          <motion.div className="grid grid-cols-2 gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Number Required *</label>
              <input type="number" min={1} value={form.quantity} onChange={e => update('quantity', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Min Experience (years)</label>
              <input type="number" min={0} value={form.min_experience} onChange={e => update('min_experience', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" />
            </div>
          </motion.div>
          <motion.div className="grid grid-cols-2 gap-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Min Qualification</label>
              <select value={form.min_qualification} onChange={e => update('min_qualification', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                {QUALS.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Specialization</label>
              <select value={form.specialization} onChange={e => update('specialization', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                {SPECS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </motion.div>
          <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <input type="checkbox" checked={form.license_required} onChange={e => update('license_required', e.target.checked)}
              className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
            <label className="text-sm font-medium text-text-primary">License Required</label>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Additional Criteria</label>
            <textarea value={form.additional_criteria} onChange={e => update('additional_criteria', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" rows={3}
              placeholder="Any additional requirements or notes..." />
          </motion.div>
          <motion.div className="flex gap-3 pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50">
              {loading ? 'Creating...' : 'Submit Requirement'}
            </motion.button>
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
          </motion.div>
        </motion.form>
      </div>
    </PageTransition>
  );
}
