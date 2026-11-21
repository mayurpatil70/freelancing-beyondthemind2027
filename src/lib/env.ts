// Tolerates values pasted into the Vercel dashboard with surrounding quotes or spaces.
export function readEnv(name: string, fallback = '') {
  const value = (process.env[name] || '').trim().replace(/^(['"])(.*)\1$/, '$2').trim();
  return value || fallback;
}
