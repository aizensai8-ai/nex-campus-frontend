import net from 'net';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const PORT_FILE = join(dirname(fileURLToPath(import.meta.url)), '../.port');

function isPortFree(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.unref();
    probe.on('error', () => resolve(false));
    // Bind on all interfaces (same as express default) so we detect any occupant
    probe.listen(port, () => {
      probe.close(() => resolve(true));
    });
  });
}

async function isOurServer(port) {
  try {
    const res = await fetch(`http://localhost:${port}/api/health`, {
      signal: AbortSignal.timeout(1500),
    });
    const body = await res.json();
    return body?.message === 'Nex Campus API is running';
  } catch {
    return false;
  }
}

function killProcessOnPort(port) {
  try {
    if (process.platform === 'win32') {
      const out = execSync(
        `netstat -ano | findstr :${port} | findstr LISTENING`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
      ).trim();
      // last token on each matching line is the PID
      const pids = [...new Set(
        out.split('\n')
          .map(l => l.trim().split(/\s+/).pop())
          .filter(p => p && p !== '0')
      )];
      for (const pid of pids) {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      }
    } else {
      const pids = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim();
      if (pids) execSync(`kill -9 ${pids.split('\n').join(' ')}`, { stdio: 'ignore' });
    }
  } catch {
    // process may have already exited
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Find and claim an available port starting from `desired`.
 *
 * Strategy (only for the desired port):
 *   1. Free → use it.
 *   2. Occupied by our own server → kill it, wait, use it.
 *   3. Occupied by something else → fall through to next port.
 *
 * For subsequent ports (desired+1, +2, …) only step 1 applies.
 *
 * Writes the chosen port to server/.port so Vite can read it.
 */
export async function claimPort(desired = 5001) {
  // --- desired port ---
  if (await isPortFree(desired)) {
    writeFileSync(PORT_FILE, String(desired));
    return desired;
  }

  const ours = await isOurServer(desired);
  if (ours) {
    console.log(`\n⚡  Stale Nex Campus instance on :${desired} — stopping it…`);
    killProcessOnPort(desired);
    await sleep(900);
    if (await isPortFree(desired)) {
      writeFileSync(PORT_FILE, String(desired));
      return desired;
    }
  }

  // --- fallback: next open port ---
  for (let port = desired + 1; port <= desired + 20; port++) {
    if (await isPortFree(port)) {
      writeFileSync(PORT_FILE, String(port));
      return port;
    }
  }

  throw new Error(`No available port found in range ${desired}–${desired + 20}`);
}
