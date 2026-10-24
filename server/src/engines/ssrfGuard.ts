import dns from 'dns';
import { promisify } from 'util';
import net from 'net';

const lookupAsync = promisify(dns.lookup);

/**
 * SSRF Guard validates URLs before any network operation or inspection.
 * Blocks private networks, loopback, link-local, cloud metadata, and DNS rebinding risks.
 */
export interface SSRFValidationResult {
  isSafe: boolean;
  reason?: string;
  resolvedIps?: string[];
  normalizedUrl?: string;
  hostname?: string;
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'local',
  'broadcasthost',
  'metadata.google.internal',
  'instance-data',
]);

/**
 * Checks if an IPv4 address belongs to a private, loopback, or reserved range.
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return true;

  const [a, b] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;
  // 10.0.0.0/8 (Private)
  if (a === 10) return true;
  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;
  // 169.254.0.0/16 (Link-local / AWS / Azure / GCP metadata 169.254.169.254)
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12 (Private: 172.16 - 172.31)
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;
  // 224.0.0.0/4 (Multicast)
  if (a >= 224 && a <= 239) return true;
  // 240.0.0.0/4 (Reserved / Future)
  if (a >= 240) return true;

  return false;
}

/**
 * Checks if an IPv6 address is loopback, unique local, or link-local.
 */
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '::') return true;
  if (normalized.startsWith('fe80:') || normalized.startsWith('fe90:') || normalized.startsWith('fea0:') || normalized.startsWith('feb0:')) return true; // Link-local
  if (normalized.startsWith('fc00:') || normalized.startsWith('fd00:')) return true; // Unique local
  if (normalized.startsWith('::ffff:')) {
    // IPv4-mapped IPv6
    const v4Part = normalized.replace('::ffff:', '');
    return isPrivateIPv4(v4Part);
  }
  return false;
}

export async function validateUrlForSSRF(rawUrl: string): Promise<SSRFValidationResult> {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isSafe: false, reason: 'URL cannot be empty' };
  }

  // Prepend https:// if no protocol provided for parsing
  let toParse = rawUrl.trim();
  if (!/^https?:\/\//i.test(toParse)) {
    toParse = 'https://' + toParse;
  }

  let parsed: URL;
  try {
    parsed = new URL(toParse);
  } catch {
    return { isSafe: false, reason: 'Malformed or invalid URL syntax' };
  }

  // Only HTTP / HTTPS permitted
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isSafe: false, reason: `Disallowed protocol: ${parsed.protocol}. Only http and https are permitted.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Explicit blocked names or internal suffixes
  if (
    BLOCKED_HOSTNAMES.has(hostname) ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.corp') ||
    hostname.endsWith('.lan')
  ) {
    return { isSafe: false, hostname, reason: 'Blocked internal or localhost hostname' };
  }

  // Direct IP address in hostname
  const ipFamily = net.isIP(hostname);
  if (ipFamily === 4) {
    if (isPrivateIPv4(hostname)) {
      return { isSafe: false, hostname, reason: 'Access to private or loopback IPv4 addresses is forbidden' };
    }
    return {
      isSafe: true,
      hostname,
      normalizedUrl: parsed.toString(),
      resolvedIps: [hostname],
    };
  } else if (ipFamily === 6) {
    if (isPrivateIPv6(hostname)) {
      return { isSafe: false, hostname, reason: 'Access to private or loopback IPv6 addresses is forbidden' };
    }
    return {
      isSafe: true,
      hostname,
      normalizedUrl: parsed.toString(),
      resolvedIps: [hostname],
    };
  }

  // Perform DNS resolution to check behind domain name
  try {
    const lookupResult = await lookupAsync(hostname, { all: true });
    const records = Array.isArray(lookupResult) ? lookupResult : [lookupResult];
    const resolvedIps = records.map((r: any) => r.address);

    if (resolvedIps.length === 0) {
      return { isSafe: false, hostname, reason: 'Domain could not be resolved to any valid IP address' };
    }

    for (const ip of resolvedIps) {
      const family = net.isIP(ip);
      if (family === 4 && isPrivateIPv4(ip)) {
        return {
          isSafe: false,
          hostname,
          resolvedIps,
          reason: `DNS resolution returned private or loopback IPv4 address (${ip})`,
        };
      }
      if (family === 6 && isPrivateIPv6(ip)) {
        return {
          isSafe: false,
          hostname,
          resolvedIps,
          reason: `DNS resolution returned private or loopback IPv6 address (${ip})`,
        };
      }
    }

    return {
      isSafe: true,
      hostname,
      normalizedUrl: parsed.toString(),
      resolvedIps,
    };
  } catch (err: any) {
    // If DNS resolution fails (e.g. offline or non-existent domain), we don't crash.
    return {
      isSafe: false,
      hostname,
      reason: `DNS resolution failed: ${err.message || 'Domain not found'}. May be an unallocated or offline domain.`,
    };
  }
}
