import { mkdir, rm, stat } from "fs/promises";

const DEFAULT_RETRIES = 80;
const RETRY_MS = 50;
/** A lock older than this is left over from a crashed/restarted container. */
const STALE_MS = 30_000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Cross-process mutex via atomic mkdir (works on Zerops Local Storage).
 * Prefer this over in-memory locks when multiple containers share a volume.
 */
export async function withFileLock<T>(
  targetPath: string,
  fn: () => Promise<T>,
  opts?: { retries?: number; retryMs?: number },
): Promise<T> {
  const lockDir = `${targetPath}.lock`;
  const retries = opts?.retries ?? DEFAULT_RETRIES;
  const retryMs = opts?.retryMs ?? RETRY_MS;

  let acquired = false;
  for (let i = 0; i < retries; i++) {
    try {
      await mkdir(lockDir);
      acquired = true;
      break;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException)?.code;
      if (code !== "EEXIST") throw err;
      // Break locks abandoned by a process that died mid-write; otherwise
      // every later order would fail until someone deletes the lock by hand.
      const age = await stat(lockDir)
        .then((s) => Date.now() - s.mtimeMs)
        .catch(() => 0);
      if (age > STALE_MS) {
        await rm(lockDir, { recursive: true, force: true }).catch(() => {});
        continue;
      }
      await sleep(retryMs);
    }
  }

  if (!acquired) {
    throw new Error(`Nepodařilo se získat zámek: ${lockDir}`);
  }

  try {
    return await fn();
  } finally {
    await rm(lockDir, { recursive: true, force: true }).catch(() => {});
  }
}
