import {
  S3Client,
  PutBucketCorsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { readEnv } from '@/lib/env';

const endpoint = readEnv('NEON_STORAGE_ENDPOINT').replace(/\/+$/, '');
const accessKeyId = readEnv('NEON_STORAGE_ACCESS_KEY_ID');
const secretAccessKey = readEnv('NEON_STORAGE_SECRET_ACCESS_KEY');

export const MEDIA_BUCKET = readEnv('NEON_MEDIA_BUCKET', 'btm-media');
export const PRIVATE_BUCKET = readEnv('NEON_PRIVATE_BUCKET', 'btm-private');

export const isStorageConfigured = Boolean(endpoint && accessKeyId && secretAccessKey);

let client: S3Client | null = null;

function s3() {
  if (!client) {
    client = new S3Client({
      region: readEnv('NEON_STORAGE_REGION', 'ap-southeast-1'),
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }
  return client;
}

export function publicObjectUrl(key: string) {
  return `${endpoint}/${MEDIA_BUCKET}/${key.split('/').map(encodeURIComponent).join('/')}`;
}

export function keyFromPublicUrl(url: string) {
  const prefix = `${endpoint}/${MEDIA_BUCKET}/`;
  if (!endpoint || !url.startsWith(prefix)) return null;
  return url.slice(prefix.length).split('/').map(decodeURIComponent).join('/');
}

let corsReady: Promise<void> | null = null;

export function ensureMediaCors() {
  corsReady ??= s3()
    .send(
      new PutBucketCorsCommand({
        Bucket: MEDIA_BUCKET,
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
    )
    .then(() => undefined)
    .catch((err) => {
      corsReady = null;
      console.warn('Could not set media bucket CORS:', err);
    });
  return corsReady;
}

export function presignUpload(bucket: string, key: string, contentType: string, expiresIn = 900) {
  return getSignedUrl(
    s3(),
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
    { expiresIn, signableHeaders: new Set(['content-type', 'cache-control']) }
  );
}

export function presignDownload(bucket: string, key: string, expiresIn = 300) {
  return getSignedUrl(s3(), new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn });
}

export async function putObject(bucket: string, key: string, body: Buffer, contentType: string) {
  await s3().send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
}

export async function headObject(bucket: string, key: string) {
  try {
    const res = await s3().send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return { size: Number(res.ContentLength || 0), contentType: res.ContentType || '' };
  } catch {
    return null;
  }
}

export async function deleteObject(bucket: string, key: string) {
  await s3().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
