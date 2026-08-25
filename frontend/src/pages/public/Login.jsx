import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { validateEmail } from '../../utils/validators';
import { FloatingParticles } from '../../components/illustrations';
import { BlurFade } from '../../components/animations';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }
    setEmailError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left panel — gradient with illustration */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero-radial relative overflow-hidden items-center justify-center">
        <FloatingParticles count={8} />

        {/* Decorative rings */}
        <div className="absolute top-20 left-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="w-40 h-40 border border-white/10 rounded-full"
          />
        </div>
        <div className="absolute bottom-20 right-20">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="w-60 h-60 border border-white/10 rounded-full"
          />
        </div>

        <div className="relative z-10 text-center px-12">
          <BlurFade delay={0.25}>
            <div className="w-72 h-56 rounded-2xl mx-auto mb-8 overflow-hidden shadow-2xl border border-white/20">
              <img src="/login.jpg" alt="Nurse at workstation" className="w-full h-full object-cover" />
            </div>
          </BlurFade>
          <BlurFade delay={0.25 * 2}>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Welcome back to NurseConnect
            </h2>
          </BlurFade>
          <BlurFade delay={0.25 * 3}>
            <p className="text-white/60 mt-3 max-w-sm mx-auto text-pretty">
              Sign in to manage your recruitment workflow
            </p>
          </BlurFade>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 gradient-mesh relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <img src="/logo.svg" alt="NurseConnect" className="h-9 w-auto" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-primary/5 border border-border/50 p-8">
            <BlurFade delay={0.25}>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">Sign in</h1>
            </BlurFade>
            <BlurFade delay={0.25 * 2}>
              <p className="text-text-secondary mt-1 text-pretty">Enter your credentials to continue</p>
            </BlurFade>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  onBlur={() => setEmailError(validateEmail(email))}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${emailError ? 'border-red-300' : 'border-border'}`}
                  placeholder="you@example.com"
                />
              </motion.div>
              {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border bg-gray-50/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-gradient-to-r from-primary to-teal-600 text-white py-2.5 rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:text-primary-dark transition-colors">
                Register here
              </Link>
            </p>
          </div>
          
          
        </motion.div>
      </div>
    </div>
  );
}
