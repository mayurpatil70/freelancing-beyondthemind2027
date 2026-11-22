import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { readLocalDb } from '@/lib/storage/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized. Please login to admin.' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const commitMsg = body.message || 'chore(cms): update session cards & SEO keywords via admin';

    // 1. Ensure current memory DB is written to src/data/db.json
    const db = readLocalDb();
    const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
    if (fs.existsSync(path.dirname(dbPath))) {
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    }

    // 2. Check if git CLI is available
    let gitAvailable = false;
    try {
      execSync('git --version', { stdio: 'ignore' });
      gitAvailable = true;
    } catch {
      gitAvailable = false;
    }

    let gitPushed = false;
    let gitLogOutput = '';

    if (gitAvailable) {
      try {
        // Ensure git user config
        try {
          execSync('git config user.name', { stdio: 'pipe' });
        } catch {
          execSync('git config user.name "Beyond The Mind Admin"');
          execSync('git config user.email "admin@beyondthemind2027.com"');
        }

        execSync('git add src/data/db.json', { stdio: 'pipe' });

        // Check if there are changes to commit
        let hasChanges = false;
        try {
          const status = execSync('git status --porcelain src/data/db.json', { encoding: 'utf-8' });
          hasChanges = status.trim().length > 0;
        } catch {}

        if (hasChanges) {
          execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { stdio: 'pipe' });
        }

        // Push to origin main
        try {
          const pushResult = execSync('git push origin main', { encoding: 'utf-8', timeout: 20000 });
          gitPushed = true;
          gitLogOutput = pushResult ? pushResult.trim() : 'Up to date with origin/main';
        } catch (pushErr: any) {
          console.warn('Git push command note:', pushErr?.message || pushErr);
          gitLogOutput = pushErr?.message || 'Remote push skipped (requires git credentials in this environment)';
        }
      } catch (gitErr: any) {
        console.error('Git local operation error:', gitErr);
      }
    }

    // 3. Fallback: GitHub REST API if GITHUB_TOKEN or GH_TOKEN is configured
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!gitPushed && token) {
      try {
        const repo = 'mayurpatil70/freelancing-beyondthemind2027';
        const filePath = 'src/data/db.json';
        const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'BeyondTheMind-Admin-CMS',
          },
        });

        if (getRes.ok) {
          const fileMeta = await getRes.json();
          const contentBase64 = Buffer.from(JSON.stringify(db, null, 2)).toString('base64');
          const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
              'User-Agent': 'BeyondTheMind-Admin-CMS',
            },
            body: JSON.stringify({
              message: commitMsg,
              content: contentBase64,
              sha: fileMeta.sha,
              branch: 'main',
            }),
          });

          if (putRes.ok) {
            return NextResponse.json({
              success: true,
              message: 'Card keywords synced and successfully pushed directly to GitHub repository!',
              method: 'github_rest_api',
            });
          }
        }
      } catch (apiErr: any) {
        console.error('GitHub API push error:', apiErr);
      }
    }

    if (gitPushed) {
      return NextResponse.json({
        success: true,
        message: 'Successfully pushed card keyword updates to GitHub origin/main!',
        details: gitLogOutput,
        method: 'git_cli',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Card keywords updated in CMS database and saved to db.json! Changes are live on the website.',
      note: gitLogOutput || 'Saved to local & cloud CMS.',
    });
  } catch (err: any) {
    console.error('GitHub Push API error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Unexpected error during push' },
      { status: 500 }
    );
  }
}
