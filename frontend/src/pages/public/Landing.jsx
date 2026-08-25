import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Search, CheckCircle, Heart, Building2, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { BlurFade, FadeUp, StaggerContainer, StaggerItem, ScaleIn, HoverCard } from '../../components/animations';
import { FloatingParticles } from '../../components/illustrations';

const steps = [
  { icon: Users, step: '01', title: 'Register', desc: 'Nurses create profiles. Hospitals register and get verified.', color: 'from-teal-500 to-emerald-500' },
  { icon: Shield, step: '02', title: 'Verify', desc: 'Credentials are verified through DigiLocker and KNMC.', color: 'from-blue-500 to-cyan-500' },
  { icon: Search, step: '03', title: 'Match', desc: 'Hospitals submit requirements. System finds matching candidates.', color: 'from-violet-500 to-purple-500' },
  { icon: CheckCircle, step: '04', title: 'Shortlist', desc: 'Admin creates shortlists. Hospitals review qualified candidates.', color: 'from-amber-500 to-orange-500' },
];

const features = [
  { icon: Award, title: 'Verified Candidates', desc: 'Every nurse has verified credentials through DigiLocker and KNMC verification.', gradient: 'from-emerald-400 to-teal-500' },
  { icon: Search, title: 'Requirement-Driven', desc: 'Hospitals specify exact requirements. No browsing — just targeted matching.', gradient: 'from-blue-400 to-indigo-500' },
  { icon: Heart, title: 'Admin-Mediated', desc: 'Shortlists are curated by administrators, ensuring quality matches.', gradient: 'from-rose-400 to-pink-500' },
];

const stats = [
  { value: '500+', label: 'Verified Nurses' },
  { value: '50+', label: 'Partner Hospitals' },
  { value: '98%', label: 'Match Accuracy' },
  { value: '24h', label: 'Avg. Turnaround' },
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass sticky top-0 z-50 border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="NurseConnect" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-text-secondary hover:text-primary transition-colors hidden sm:block">
              How it works
            </a>
            <a href="#features" className="text-sm text-text-secondary hover:text-primary transition-colors hidden sm:block">
              Features
            </a>
            <Link to="/login" className="text-sm font-medium text-text-primary hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/register">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-gradient-to-r from-primary to-teal-600 text-white px-5 py-2 rounded-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
              >
                Register
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative gradient-hero-radial text-white overflow-hidden">
        <FloatingParticles count={10} />

        {/* Decorative rings */}
        <div className="absolute right-[-100px] top-[-50px] pointer-events-none opacity-20 hidden lg:block">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="w-[500px] h-[500px] border border-white/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-12 border border-white/15 rounded-full"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-24 border border-white/10 rounded-full"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <BlurFade delay={0.25}>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-white/80">Trusted by 50+ hospitals across Kerala</span>
                </div>
              </BlurFade>
              <BlurFade delay={0.25 * 2}>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight">
                  Connect hospitals with
                  <br />
                  <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                    verified nursing talent
                  </span>
                </h1>
              </BlurFade>
              <BlurFade delay={0.25 * 3}>
                <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-xl text-pretty">
                  A requirement-driven recruitment platform. Hospitals specify what they need, and we match verified nursing professionals from our candidate pool.
                </p>
              </BlurFade>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link to="/register?role=candidate">
                  <motion.span
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-white text-primary px-7 py-3.5 rounded-xl font-semibold shadow-xl shadow-black/10 hover:shadow-2xl transition-shadow cursor-pointer"
                  >
                    Register as Nurse
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
                <Link to="/register?role=hospital">
                  <motion.span
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    Register as Hospital
                  </motion.span>
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-12 grid grid-cols-4 gap-6"
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Hero illustration */}
            <div className="hidden lg:flex justify-center relative">
              <BlurFade delay={0.25} className="relative w-[440px] h-[360px]">
                <img src="/hero.jpg" alt="Nursing professionals" className="w-full h-full object-cover rounded-3xl shadow-2xl shadow-black/30" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                {/* Glow behind */}
                <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
                  <svg className="w-24 h-24 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -left-8 top-16 glass-dark rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-xl z-20"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Verified</div>
                    <div className="text-[10px] text-white/50">DigiLocker ✓</div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-4 bottom-20 glass-dark rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-xl z-20"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Search className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Matched</div>
                    <div className="text-[10px] text-white/50">ICU Specialist</div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute right-0 -top-4 glass-dark rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-xl z-20"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">4 yrs exp</div>
                    <div className="text-[10px] text-white/50">B.Sc Nursing</div>
                  </div>
                </motion.div>
              </BlurFade>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 46.7C840 53.3 960 66.7 1080 63.3C1200 60 1320 40 1380 30L1440 20V80H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <BlurFade delay={0.25} inView>
              <div className="inline-flex items-center gap-2 bg-primary-light rounded-full px-4 py-1.5 mb-4">
                <span className="text-sm font-medium text-primary">Simple Process</span>
              </div>
            </BlurFade>
            <BlurFade delay={0.25 * 2} inView>
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
                How NurseConnect Works
              </h2>
            </BlurFade>
            <BlurFade delay={0.25 * 3} inView>
              <p className="text-text-secondary mt-3 text-lg text-pretty">
                A simple, requirement-driven workflow for nurse recruitment
              </p>
            </BlurFade>
          </div>

          <StaggerContainer className="mt-16 grid md:grid-cols-4 gap-6" delay={0.15}>
            {steps.map((item, i) => (
              <StaggerItem key={item.step}>
                <HoverCard className="bg-white p-6 rounded-2xl border border-border/60 h-full relative overflow-hidden group hover:border-primary/30 transition-colors">
                  {/* Gradient top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm mb-4 shadow-lg`}>
                    {item.step}
                  </div>
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <item.icon className="w-6 h-6 text-primary mb-3" />
                  </motion.div>
                  <h3 className="font-semibold text-text-primary text-lg">{item.title}</h3>
                  <p className="text-sm text-text-secondary mt-2 leading-relaxed">{item.desc}</p>

                  {/* Connecting line (except last) */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 -right-3 w-6 h-0.5 bg-border" />
                  )}
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Matching illustration section */}
      <section className="py-16 gradient-mesh-strong relative">
        <div className="max-w-7xl mx-auto px-6">
          <ScaleIn>
            <div className="bg-white rounded-3xl border border-border/60 shadow-xl shadow-primary/5 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <BlurFade delay={0.25} inView>
                  <h2 className="text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
                    Smart candidate matching
                  </h2>
                </BlurFade>
                <BlurFade delay={0.25 * 2} inView>
                  <p className="text-text-secondary mt-4 leading-relaxed text-pretty">
                    Our system automatically matches hospital requirements with verified candidate profiles based on qualifications, experience, specialization, and licensing status.
                  </p>
                </BlurFade>
                <div className="mt-6 flex flex-wrap gap-3">
                  {['Qualification', 'Experience', 'Specialization', 'License'].map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-sm font-medium px-3 py-1.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex justify-center">
                <BlurFade delay={0.25} inView>
                  <img src="/nurse.jpg" alt="Nursing team" className="w-full max-w-sm rounded-2xl shadow-lg object-cover aspect-[4/3]" />
                </BlurFade>
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <BlurFade delay={0.25} inView>
              <div className="inline-flex items-center gap-2 bg-primary-light rounded-full px-4 py-1.5 mb-4">
                <span className="text-sm font-medium text-primary">Why Choose Us</span>
              </div>
            </BlurFade>
            <BlurFade delay={0.25 * 2} inView>
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
                Why NurseConnect
              </h2>
            </BlurFade>
          </div>



          <StaggerContainer className="mt-12 grid md:grid-cols-3 gap-8" delay={0.15}>
            {features.map((item, i) => (
              <StaggerItem key={i}>
                <HoverCard className="p-8 rounded-2xl border border-border/60 h-full relative overflow-hidden group">
                  {/* Gradient icon bg */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl text-text-primary">{item.title}</h3>
                  <p className="text-text-secondary mt-3 leading-relaxed">{item.desc}</p>

                  {/* Decorative corner gradient */}
                  <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-5 rounded-full group-hover:opacity-10 transition-opacity`} />
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA section */}
      <FadeUp>
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <BlurFade delay={0.15} inView className="h-full">
              <img src="/hospital.jpg" alt="" className="w-full h-full object-cover" />
            </BlurFade>
            <div className="absolute inset-0 bg-primary/85" />
          </div>
          <FloatingParticles count={6} className="opacity-30" />

          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <BlurFade delay={0.25} inView>
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Ready to transform nurse recruitment?
              </h2>
            </BlurFade>
            <BlurFade delay={0.25 * 2} inView>
              <p className="text-white/70 mt-4 text-lg max-w-xl mx-auto text-pretty">
                Join NurseConnect today and streamline your recruitment process with verified candidates and smart matching.
              </p>
            </BlurFade>
            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/register">
                <motion.span
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3.5 rounded-xl font-semibold shadow-xl shadow-black/10 hover:shadow-2xl transition-shadow cursor-pointer"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </section>
      </FadeUp>

      {/* Footer */}
      <footer className="border-t border-border py-10 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="NurseConnect" className="h-7 w-auto" />
            </div>
            <div className="text-sm text-text-secondary">
              NurseConnect &copy; {new Date().getFullYear()}. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
