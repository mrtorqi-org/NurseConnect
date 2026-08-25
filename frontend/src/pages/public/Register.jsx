import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowRight, Building2, User, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateEmail, validatePassword, getPasswordStrength, PASSWORD_RULES } from '../../utils/validators';
import { FloatingParticles } from '../../components/illustrations';
import { BlurFade } from '../../components/animations';

const roles = [
  {
    value: 'candidate',
    label: 'Nurse / Candidate',
    desc: 'Register your profile and get matched with hospitals',
    icon: User,
    gradient: 'from-emerald-500 to-teal-500',
    features: ['Create professional profile', 'Get verified credentials', 'Get matched with hospitals'],
  },
  {
    value: 'hospital',
    label: 'Hospital',
    desc: 'Post requirements and find verified nurses',
    icon: Building2,
    gradient: 'from-blue-500 to-indigo-500',
    features: ['Post recruitment needs', 'Review matched candidates', 'View shortlisted profiles'],
  },
];

export default function Register() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(searchParams.get('role') ? 2 : 1);
  const [role, setRole] = useState(searchParams.get('role') || '');
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field on change
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateField = (name, value) => {
    if (name === 'email') return validateEmail(value);
    if (name === 'password') return validatePassword(value);
    if (name === 'password_confirm') {
      if (value !== form.password) return 'Passwords do not match';
      return '';
    }
    if (name === 'name' && !value.trim()) return 'Name is required';
    return '';
  };

  const handleBlur = (name) => {
    const error = validateField(name, form[name]);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Validate all fields
    const errors = {};
    ['name', 'email', 'password', 'password_confirm'].forEach((f) => {
      const err = validateField(f, form[f]);
      if (err) errors[f] = err;
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setError('Please fix the errors below');
      return;
    }
    setLoading(true);
    try {
      await register({ ...form, role });
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msgs = Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
        setError(msgs.join('; '));
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — gradient with features */}
      <div className="hidden lg:flex lg:w-[45%] gradient-hero-radial relative overflow-hidden items-center justify-center p-12">
        <FloatingParticles count={8} />

        <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-2 mb-8">
              <img src="/logo.svg" alt="NurseConnect" className="h-9 w-auto brightness-0 invert" />
            </div>

            <BlurFade delay={0.25}>
              <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">
                Start your journey with<br />
                <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  NurseConnect
                </span>
              </h2>
            </BlurFade>
            <BlurFade delay={0.25 * 2}>
              <p className="text-white/60 mt-4 text-pretty">
                Join a community of verified healthcare professionals and trusted hospitals.
              </p>
            </BlurFade>

            {/* Feature list */}
            <div className="mt-10 space-y-4">
              {['Requirement-driven matching', 'DigiLocker & KNMC verification', 'Real-time candidate tracking', 'Admin-curated shortlists'].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-white/80 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

          {/* Image */}
          <BlurFade delay={0.25 * 3} className="mt-10">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
              <img src="/nurse.jpg" alt="Nursing professionals" className="w-full h-56 object-cover" />
            </div>
          </BlurFade>

          {/* Decorative */}
          <div className="absolute top-10 right-0 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute bottom-20 left-[-40px] w-48 h-48 border border-white/5 rounded-full" />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 gradient-mesh relative overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <img src="/logo.svg" alt="NurseConnect" className="h-9 w-auto" />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="role"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
                <p className="text-text-secondary mt-1">First, tell us who you are</p>

                <div className="mt-8 space-y-4">
                  {roles.map((r) => (
                    <motion.button
                      key={r.value}
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => { setRole(r.value); setStep(2); }}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all group bg-white hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 ${role === r.value ? 'border-primary shadow-lg shadow-primary/10' : 'border-border/60'}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <r.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-text-primary text-lg">{r.label}</div>
                          <div className="text-sm text-text-secondary mt-1">{r.desc}</div>
                          <div className="mt-3 space-y-1.5">
                            {r.features.map(f => (
                              <div key={f} className="flex items-center gap-2 text-xs text-text-secondary">
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                {f}
                              </div>
                            ))}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <p className="mt-6 text-center text-sm text-text-secondary">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-medium hover:text-primary-dark transition-colors">Sign in</Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setStep(1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-text-secondary hover:bg-gray-200 transition-colors"
                  >
                    ←
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                      {role === 'candidate' ? 'Nurse' : 'Hospital'} Registration
                    </h1>
                    <p className="text-sm text-text-secondary">Fill in your details</p>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="bg-white rounded-2xl shadow-xl shadow-primary/5 border border-border/50 p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {['name', 'email', 'password', 'password_confirm'].map((field, i) => (
                      <motion.div
                        key={field}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                          {field === 'name' ? 'Full Name' : field === 'email' ? 'Email' : field === 'password' ? 'Password' : 'Confirm Password'}
                        </label>
                        <div className="relative">
                          <input
                            type={field === 'email' ? 'email' : field.includes('password') && !showPassword ? 'password' : field === 'password_confirm' && !showPassword ? 'password' : 'text'}
                            name={field}
                            required
                            value={form[field]}
                            onChange={handleChange}
                            onBlur={() => handleBlur(field)}
                            onFocus={() => field === 'password' && setPasswordFocused(true)}
                            className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fieldErrors[field] ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-border"}`}
                            placeholder={
                              field === 'name' ? 'Enter full name' :
                              field === 'email' ? 'you@example.com' :
                              field === 'password' ? 'Create a password' :
                              'Confirm password'
                            }
                          />
                          {field.includes('password') && field !== 'password_confirm' && (
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                        {fieldErrors[field] && (
                          <p className="text-xs text-red-500 mt-1.5">{fieldErrors[field]}</p>
                        )}
                        {/* Password strength indicator */}
                        {field === 'password' && form.password && passwordFocused && (
                          <div className="mt-2.5 space-y-1.5">
                            <div className="flex gap-1">
                              {[1,2,3,4].map((i) => {
                                const strength = getPasswordStrength(form.password);
                                return (
                                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength.score ? strength.color : "bg-gray-200"}`} />
                                );
                              })}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-medium ${getPasswordStrength(form.password).score <= 1 ? "text-red-500" : getPasswordStrength(form.password).score <= 2 ? "text-amber-500" : getPasswordStrength(form.password).score <= 3 ? "text-blue-500" : "text-emerald-500"}`}>
                                {getPasswordStrength(form.password).label}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              {PASSWORD_RULES.map((rule) => (
                                <div key={rule.label} className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full ${rule.test(form.password) ? "bg-emerald-500" : "bg-gray-300"}`} />
                                  <span className={`text-[11px] ${rule.test(form.password) ? "text-emerald-600" : "text-text-secondary"}`}>{rule.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-gradient-to-r from-primary to-teal-600 text-white py-2.5 rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? 'Creating account...' : 'Create Account'}
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </motion.button>
                  </form>
                </div>

                <p className="mt-4 text-center text-sm text-text-secondary">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-medium hover:text-primary-dark transition-colors">Sign in</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
