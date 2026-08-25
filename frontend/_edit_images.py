# -*- coding: utf-8 -*-
import re

p = 'src/pages/public/Landing.jsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "<div className="relative">
                {/* Glow behind */}
                <div className="w-96 h-64 rounded-2xl relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">",
    "<div className="relative w-[420px] h-[340px]">
                <img src="/hero.jpg" alt="Nursing professionals" className="w-full h-full object-cover rounded-3xl shadow-2xl shadow-black/30" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Glow behind */}
                <div className="absolute inset-0 w-full h-full rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20">")
)

print('Hero: ' + ('OK' if '/hero.jpg' in c else 'FAIL'))

c = c.replace(
    "glass-dark rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-xl"",
    "glass-dark rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-xl z-20"")

c = c.replace(
    "</div>
            </div>
          </ScaleIn>",
    "</div>

              <div className="flex-1 flex justify-center">
                <img src="/nurse.jpg" alt="Nursing team" className="w-full max-w-sm rounded-2xl shadow-lg object-cover aspect-[4/3]" />
              </div>
            </div>
          </ScaleIn>",
    1)
print('Matching: ' + ('OK' if 'nurse.jpg' in c else 'FAIL'))

c = c.replace(
    "<div className="absolute inset-0 bg-primary" />",
    "<div className="absolute inset-0"><img src="/hospital.jpg" alt="" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-primary/85" /></div>",
    1)
print('CTA: ' + ('OK' if 'hospital.jpg' in c else 'FAIL'))

with open(p, "w", encoding="utf-8") as f:
    f.write(c)
print('Landing.jsx saved')

p2 = 'src/pages/public/Login.jsx'
with open(p2, 'r', encoding='utf-8') as f:
    c2 = f.read()

c2 = c2.replace(
    "<div className="w-72 h-48 rounded-2xl mx-auto mb-8 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
              <svg className="w-20 h-20 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>",
    "<div className="w-72 h-48 rounded-2xl mx-auto mb-8 overflow-hidden shadow-2xl border border-white/20">
              <img src="/login.jpg" alt="Nurse at workstation" className="w-full h-full object-cover" />
            </div>",
    1)
print('Login: ' + ('OK' if 'login.jpg' in c2 else 'FAIL'))

with open(p2, "w", encoding="utf-8") as f:
    f.write(c2)
print('Login.jsx saved')

p3 = 'src/pages/public/Register.jsx'
with open(p3, 'r', encoding='utf-8') as f:
    c3 = f.read()

c3 = c3.replace(
    "{/* Decorative */}
          <div className="absolute top-10 right-0 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute bottom-20 left-[-40px] w-48 h-48 border border-white/5 rounded-full" />",
    "{/* Image */}
          <div className="mt-10 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <img src="/nurse.jpg" alt="Nursing professionals" className="w-full h-48 object-cover" />
          </div>

          {/* Decorative */}
          <div className="absolute top-10 right-0 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute bottom-20 left-[-40px] w-48 h-48 border border-white/5 rounded-full" />",
    1)
print('Register: ' + ('OK' if 'nurse.jpg' in c3 else 'FAIL'))

with open(p3, "w", encoding="utf-8") as f:
    f.write(c3)
print('Register.jsx saved')

print('All done!')
