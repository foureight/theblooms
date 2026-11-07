import { mkdir, rm } from "fs/promises";

const DEFAULT_RETRIES = 80;
const RETRY_MS = 50;

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
