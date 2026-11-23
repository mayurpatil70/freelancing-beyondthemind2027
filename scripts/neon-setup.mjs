import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';

const root = process.cwd();
const env = process.env;

if (!env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Run with: node --env-file=.env scripts/neon-setup.mjs');
  process.exit(1);
}

const sql = neon(env.DATABASE_URL);

const schema = fs.readFileSync(path.join(root, 'db', 'schema.sql'), 'utf-8');
for (const statement of schema.split(/;\s*$/m).map((s) => s.trim()).filter(Boolean)) {
  await sql.query(statement);
}
console.log('Schema applied');

const localDbPath = path.join(root, 'src', 'data', 'db.json');
if (fs.existsSync(localDbPath)) {
  const local = JSON.parse(fs.readFileSync(localDbPath, 'utf-8'));
  const keys = ['settings', 'experiences', 'healingSessions', 'blogCategories', 'blogPosts', 'programme', 'testimonials', 'gallery', 'faqs', 'attractions', 'weatherClothing'];
  for (const key of keys) {
    if (local[key] === undefined) continue;
    const rows = await sql.query(
      'INSERT INTO cms_content (key, data) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO NOTHING RETURNING key',
      [key, JSON.stringify(local[key])]
    );
    console.log(rows.length ? `Seeded ${key}` : `Kept existing ${key}`);
  }
}

if (env.NEON_STORAGE_ENDPOINT && env.NEON_STORAGE_ACCESS_KEY_ID && env.NEON_STORAGE_SECRET_ACCESS_KEY) {
  const s3 = new S3Client({
    region: env.NEON_STORAGE_REGION || 'ap-southeast-1',
    endpoint: env.NEON_STORAGE_ENDPOINT,
    credentials: { accessKeyId: env.NEON_STORAGE_ACCESS_KEY_ID, secretAccessKey: env.NEON_STORAGE_SECRET_ACCESS_KEY },
    forcePathStyle: true,
  });
  await s3.send(
    new PutBucketCorsCommand({
      Bucket: env.NEON_MEDIA_BUCKET || 'btm-media',
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: ['*'],
            AllowedMethods: ['GET', 'HEAD', 'PUT'],
            AllowedHeaders: ['*'],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    })
  );
  console.log('Media bucket CORS configured');
}
