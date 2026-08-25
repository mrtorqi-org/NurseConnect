import { motion } from 'framer-motion';

export function NurseIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="200" cy="200" r="180" fill="url(#nurseGrad1)" opacity="0.1" />
      <circle cx="200" cy="200" r="140" fill="url(#nurseGrad2)" opacity="0.08" />

      {/* Nurse body */}
      <rect x="160" y="180" width="80" height="100" rx="12" fill="#0F766E" />
      {/* Nurse uniform detail */}
      <rect x="175" y="180" width="50" height="100" rx="8" fill="#115E59" />
      {/* Cross on uniform */}
      <rect x="195" y="210" width="10" height="30" rx="2" fill="#CCFBF1" />
      <rect x="188" y="220" width="24" height="10" rx="2" fill="#CCFBF1" />

      {/* Head */}
      <circle cx="200" cy="150" r="35" fill="#FBBF24" />
      {/* Hair */}
      <path d="M165 145 C165 115 235 115 235 145 C235 130 165 130 165 145Z" fill="#1E293B" />
      {/* Eyes */}
      <circle cx="188" cy="152" r="3" fill="#0F172A" />
      <circle cx="212" cy="152" r="3" fill="#0F172A" />
      {/* Smile */}
      <path d="M192 162 Q200 170 208 162" stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Nurse cap */}
      <rect x="180" y="118" width="40" height="18" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="195" y="121" width="10" height="12" rx="2" fill="#DC2626" />

      {/* Stethoscope */}
      <path d="M185 185 C175 200 170 230 185 250" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="185" cy="252" r="5" fill="#475569" />

      {/* Clipboard */}
      <rect x="250" y="195" width="35" height="45" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
      <rect x="260" y="190" width="15" height="8" rx="2" fill="#475569" />
      <line x1="258" y1="210" x2="278" y2="210" stroke="#E2E8F0" strokeWidth="2" />
      <line x1="258" y1="218" x2="278" y2="218" stroke="#E2E8F0" strokeWidth="2" />
      <line x1="258" y1="226" x2="270" y2="226" stroke="#E2E8F0" strokeWidth="2" />

      {/* Heart */}
      <motion.g
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '120px 200px' }}
      >
        <path d="M120 210 C120 200 110 190 100 190 C90 190 80 200 80 210 C80 230 120 245 120 245 C120 245 160 230 160 210 C160 200 150 190 140 190 C130 190 120 200 120 210Z" fill="#DC2626" opacity="0.8" />
      </motion.g>

      {/* Decorative dots */}
      <circle cx="100" cy="120" r="4" fill="#CCFBF1" />
      <circle cx="80" cy="280" r="3" fill="#CCFBF1" />
      <circle cx="300" cy="140" r="3" fill="#CCFBF1" />
      <circle cx="320" cy="300" r="4" fill="#CCFBF1" />
      <circle cx="140" cy="320" r="3" fill="#99F6E4" />

      <defs>
        <linearGradient id="nurseGrad1" x1="0" y1="0" x2="400" y2="400">
          <stop stopColor="#0F766E" />
          <stop offset="1" stopColor="#115E59" />
        </linearGradient>
        <linearGradient id="nurseGrad2" x1="400" y1="0" x2="0" y2="400">
          <stop stopColor="#14B8A6" />
          <stop offset="1" stopColor="#0F766E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HospitalIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Building */}
      <rect x="60" y="80" width="180" height="180" rx="8" fill="#0F766E" />
      <rect x="70" y="90" width="160" height="160" rx="4" fill="#115E59" />

      {/* Windows */}
      {[0, 1, 2].map(row => [0, 1, 2, 3].map(col => (
        <rect key={`${row}-${col}`} x={82 + col * 38} y={100 + row * 48} width="24" height="30" rx="3" fill="#CCFBF1" opacity="0.8" />
      )))}

      {/* Cross on top */}
      <rect x="140" y="50" width="20" height="40" rx="3" fill="#DC2626" />
      <rect x="130" y="60" width="40" height="20" rx="3" fill="#DC2626" />

      {/* Door */}
      <rect x="130" y="210" width="40" height="50" rx="4" fill="#1E293B" />
      <circle cx="165" cy="238" r="3" fill="#FBBF24" />

      {/* Ambulance hint */}
      <rect x="20" y="230" width="30" height="20" rx="4" fill="#F8FAFC" />
      <circle cx="25" cy="252" r="4" fill="#475569" />
      <circle cx="45" cy="252" r="4" fill="#475569" />
      <rect x="28" y="235" width="14" height="3" rx="1" fill="#DC2626" />
      <rect x="33" y="230" width="4" height="13" rx="1" fill="#DC2626" />

      {/* Decorative */}
      <circle cx="260" cy="70" r="5" fill="#CCFBF1" />
      <circle cx="40" cy="100" r="3" fill="#99F6E4" />
    </svg>
  );
}

export function ShieldIllustration({ className = '', verified = false }) {
  return (
    <svg viewBox="0 0 200 220" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M100 20 L180 60 L180 130 C180 170 140 200 100 210 C60 200 20 170 20 130 L20 60 Z"
        fill={verified ? 'url(#shieldGreen)' : 'url(#shieldTeal)'} opacity="0.9" />
      <path d="M100 30 L170 65 L170 130 C170 165 135 192 100 200 C65 192 30 165 30 130 L30 65 Z"
        fill={verified ? 'url(#shieldGreenInner)' : 'url(#shieldTealInner)'} />
      {verified ? (
        <path d="M70 110 L90 130 L130 85" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M100 70 L100 140 M75 105 L125 105" stroke="white" strokeWidth="8" strokeLinecap="round" />
      )}
      <defs>
        <linearGradient id="shieldGreen" x1="20" y1="20" x2="180" y2="210">
          <stop stopColor="#16A34A" />
          <stop offset="1" stopColor="#15803D" />
        </linearGradient>
        <linearGradient id="shieldGreenInner" x1="30" y1="30" x2="170" y2="200">
          <stop stopColor="#22C55E" />
          <stop offset="1" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id="shieldTeal" x1="20" y1="20" x2="180" y2="210">
          <stop stopColor="#0F766E" />
          <stop offset="1" stopColor="#115E59" />
        </linearGradient>
        <linearGradient id="shieldTealInner" x1="30" y1="30" x2="170" y2="200">
          <stop stopColor="#14B8A6" />
          <stop offset="1" stopColor="#0F766E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MatchingIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 300 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Left panel - candidates */}
      <rect x="10" y="20" width="110" height="160" rx="12" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="2" />
      {[0, 1, 2].map(i => (
        <g key={i}>
          <circle cx="40" cy={55 + i * 50} r="14" fill={i === 0 ? '#0F766E' : '#E2E8F0'} />
          <rect x="60" y={46 + i * 50} width="45" height="6" rx="3" fill={i === 0 ? '#0F766E' : '#E2E8F0'} />
          <rect x="60" y={56 + i * 50} width="35" height="4" rx="2" fill={i === 0 ? '#99F6E4' : '#F1F5F9'} />
        </g>
      ))}

      {/* Right panel - requirement */}
      <rect x="180" y="20" width="110" height="160" rx="12" fill="#F0FDFA" stroke="#CCFBF1" strokeWidth="2" />
      <rect x="200" y="40" width="70" height="8" rx="4" fill="#0F766E" />
      <rect x="200" y="56" width="50" height="5" rx="2" fill="#99F6E4" />
      <rect x="200" y="70" width="60" height="5" rx="2" fill="#99F6E4" />
      <rect x="200" y="84" width="40" height="5" rx="2" fill="#99F6E4" />
      <rect x="200" y="100" width="70" height="30" rx="6" fill="#0F766E" />
      <text x="235" y="120" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Match</text>

      {/* Connection lines */}
      <motion.path
        d="M120 55 Q150 55 180 55"
        stroke="#0F766E"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
      />
      <motion.path
        d="M120 105 Q150 105 180 105"
        stroke="#16A34A"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
      />
      <motion.path
        d="M120 155 Q150 155 180 155"
        stroke="#E2E8F0"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, repeatDelay: 3 }}
      />

      {/* Match indicator */}
      <motion.circle
        cx="150"
        cy="55"
        r="8"
        fill="#16A34A"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatDelay: 4 }}
      />
      <motion.path
        d="M146 55 L149 58 L155 52"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3, repeat: Infinity, repeatDelay: 4 }}
      />
    </svg>
  );
}

export function EmptyStateIllustration({ type = 'no-data', className = '' }) {
  const illustrations = {
    'no-data': (
      <svg viewBox="0 0 300 250" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="120" r="80" fill="#F0FDFA" />
        <circle cx="150" cy="120" r="60" fill="#CCFBF1" opacity="0.5" />
        <rect x="120" y="90" width="60" height="70" rx="8" fill="#E2E8F0" />
        <rect x="128" y="100" width="44" height="5" rx="2" fill="#CBD5E1" />
        <rect x="128" y="112" width="36" height="5" rx="2" fill="#CBD5E1" />
        <rect x="128" y="124" width="40" height="5" rx="2" fill="#CBD5E1" />
        <rect x="128" y="136" width="20" height="5" rx="2" fill="#CBD5E1" />
        <motion.circle
          cx="150"
          cy="120"
          r="60"
          stroke="#0F766E"
          strokeWidth="2"
          strokeDasharray="8 8"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '150px 120px' }}
        />
        <circle cx="110" cy="80" r="4" fill="#CCFBF1" />
        <circle cx="195" cy="95" r="3" fill="#99F6E4" />
        <circle cx="100" cy="160" r="3" fill="#CCFBF1" />
      </svg>
    ),
    'search': (
      <svg viewBox="0 0 300 250" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="130" cy="110" r="60" fill="#F0FDFA" />
        <circle cx="130" cy="110" r="45" stroke="#0F766E" strokeWidth="4" fill="none" />
        <line x1="162" y1="142" x2="200" y2="180" stroke="#0F766E" strokeWidth="6" strokeLinecap="round" />
        <circle cx="130" cy="110" r="25" fill="#CCFBF1" opacity="0.5" />
        <motion.circle
          cx="130"
          cy="110"
          r="45"
          stroke="#14B8A6"
          strokeWidth="2"
          strokeDasharray="6 6"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '130px 110px' }}
        />
        <circle cx="220" cy="60" r="4" fill="#CCFBF1" />
        <circle cx="70" cy="180" r="3" fill="#99F6E4" />
        <circle cx="240" cy="170" r="3" fill="#CCFBF1" />
      </svg>
    ),
    'nurse': (
      <svg viewBox="0 0 300 250" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="100" r="30" fill="#FBBF24" />
        <path d="M120 95 C120 70 180 70 180 95 C180 80 120 80 120 95Z" fill="#1E293B" />
        <circle cx="140" cy="102" r="2.5" fill="#0F172A" />
        <circle cx="160" cy="102" r="2.5" fill="#0F172A" />
        <path d="M143 112 Q150 118 157 112" stroke="#0F172A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <rect x="125" y="82" width="50" height="14" rx="3" fill="white" stroke="#E2E8F0" strokeWidth="1" />
        <rect x="143" y="85" width="14" height="8" rx="1" fill="#DC2626" />
        <rect x="130" y="130" width="40" height="60" rx="6" fill="#0F766E" />
        <rect x="138" y="145" width="6" height="20" rx="1" fill="#CCFBF1" />
        <rect x="133" y="152" width="16" height="6" rx="1" fill="#CCFBF1" />
        <rect x="100" y="195" width="100" height="10" rx="5" fill="#E2E8F0" />
        <rect x="120" y="195" width="60" height="10" rx="5" fill="#CCFBF1" />
      </svg>
    ),
  };

  return illustrations[type] || illustrations['no-data'];
}

export function FloatingParticles({ count = 6, className = '' }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size: 3 + Math.random() * 6,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 4,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/10"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function GradientBlob({ color = 'primary', className = '' }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className={`w-64 h-64 rounded-full blur-3xl opacity-20 ${
        color === 'primary' ? 'bg-primary' :
        color === 'blue' ? 'bg-info' :
        color === 'amber' ? 'bg-warning' :
        'bg-primary-light'
      }`} />
    </div>
  );
}
