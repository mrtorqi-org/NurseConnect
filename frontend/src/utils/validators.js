// NurseConnect — Validation Utilities

// Email: standard RFC-like check
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

// Indian phone: 10 digits starting with 6-9, optional +91 prefix
export const PHONE_REGEX = /^(?:\+91[\s\-]?)?[6-9]\d{9}$/;

// Password strength rules
export const PASSWORD_RULES = [
  { test: (p) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p) => /[a-z]/.test(p), label: 'One lowercase letter' },
  { test: (p) => /[0-9]/.test(p), label: 'One number' },
  { test: (p) => /[^A-Za-z0-9]/.test(p), label: 'One special character' },
];

export function validateEmail(value) {
  if (!value) return 'Email is required';
  if (!EMAIL_REGEX.test(value)) return 'Enter a valid email address';
  return '';
}

export function validatePhone(value) {
  if (!value) return ''; // optional in some contexts
  if (!PHONE_REGEX.test(value.replace(/\s/g, ''))) {
    return 'Enter a valid Indian phone number (10 digits starting with 6-9)';
  }
  return '';
}

export function validatePassword(value) {
  if (!value) return 'Password is required';
  const failures = PASSWORD_RULES.filter((r) => !r.test(value));
  if (failures.length) {
    return 'Password must have: ' + failures.map((f) => f.label).join(', ');
  }
  return '';
}

export function getPasswordStrength(value) {
  if (!value) return { score: 0, label: '', color: '' };
  const passed = PASSWORD_RULES.filter((r) => r.test(value)).length;
  if (passed <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (passed <= 3) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
  if (passed === 4) return { score: 3, label: 'Good', color: 'bg-blue-500' };
  return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
}
