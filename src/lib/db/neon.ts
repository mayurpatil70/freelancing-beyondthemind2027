import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL || '';

export const isDatabaseConfigured = Boolean(url);

let client: NeonQueryFunction<false, false> | null = null;

export function getSql() {
  if (!isDatabaseConfigured) return null;
  if (!client) client = neon(url);
  return client;
}
