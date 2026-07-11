/**
 * Next.js 16 on Windows writes RSC segment files into nested directories
 * (e.g. __next.!KG1haW4p/about/__PAGE__.txt) but the client requests flat
 * dot-separated paths (__next.!KG1haW4p.about.__PAGE__.txt).
 * https://github.com/vercel/next.js/issues/92339
 */
import fs from 'fs/promises';
import path from 'path';

const OUT_DIR = path.join(process.cwd(), 'out');
const NEXT_PREFIX = '__next.';

async function listFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function flattenPath(filePath) {
  const rel = path.relative(OUT_DIR, filePath);
  const components = rel.split(path.sep);
  const nextIndex = components.findIndex((segment) => segment.startsWith(NEXT_PREFIX));
  if (nextIndex < 0 || nextIndex >= components.length - 1) return null;

  const prefix = components.slice(0, nextIndex);
  const flattened = components.slice(nextIndex).join('.');
  return path.join(OUT_DIR, ...prefix, flattened);
}

async function removeEmptyDirs(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeEmptyDirs(path.join(dir, entry.name));
    }
  }

  try {
    const remaining = await fs.readdir(dir);
    if (remaining.length === 0 && dir !== OUT_DIR) {
      await fs.rmdir(dir);
    }
  } catch {
    /* ignore */
  }
}

async function main() {
  const files = await listFiles(OUT_DIR);
  let renamed = 0;

  // Deepest paths first so parent dirs can be cleaned up after moves.
  files.sort((a, b) => b.split(path.sep).length - a.split(path.sep).length);

  for (const source of files) {
    const target = flattenPath(source);
    if (!target || target === source) continue;

    await fs.mkdir(path.dirname(target), { recursive: true });
    try {
      await fs.rename(source, target);
      renamed++;
    } catch (err) {
      if (err.code === 'EEXIST') {
        await fs.unlink(source);
        renamed++;
      } else {
        throw err;
      }
    }
  }

  await removeEmptyDirs(OUT_DIR);
  console.log(`[fix-rsc-paths] Renamed ${renamed} RSC segment file(s).`);
}

main().catch((err) => {
  console.error('[fix-rsc-paths] Failed:', err);
  process.exit(1);
});
