
import sys
sys.stdout.write('Script started')

# Read Landing.jsx
with open('src/pages/public/Landing.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Hero: replace SVG placeholder with hero.jpg + badges over image
old = """<div className="relative">
                {/* Glow behind */}
                <div className="w-96 h-64 rounded-2xl relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">"""
new = """<div className="relative w-[420px] h-[340px]">
                <img src="/hero.jpg" alt="Nursing professionals" className="w-full h-full object-cover rounded-3xl shadow-2xl shadow-black/30" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/\* Glow behind */}
                <div className="absolute inset-0 w-full h-full rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20">"""

# Check if old exists
if old in c:
    sys.stdout.write('FOUND hero placeholder')
else:
    sys.stdout.write('NOT FOUND hero placeholder')
    # check a substring
    if 'Glow behind' in c:
        sys.stdout.write('Glow behind IS in file')
    else:
        sys.stdout.write('Glow behind NOT in file')
