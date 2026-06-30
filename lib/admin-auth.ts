const encoder = new TextEncoder();

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function signWithHmacSha256(data: string, secret: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  return bytesToHex(new Uint8Array(signature));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export async function createAdminSessionToken(username: string, secret: string, ttlMs = 1000 * 60 * 60 * 12): Promise<string> {
  const expiresAt = Date.now() + ttlMs;
  const payload = `${username}.${expiresAt}`;
  const signature = await signWithHmacSha256(payload, secret);
  return `${username}.${expiresAt}.${signature}`;
}

export async function verifyAdminSessionToken(token: string, secret: string, expectedUsername: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  const [username, expiresAtRaw, signature] = parts;
  if (!username || !expiresAtRaw || !signature) {
    return false;
  }

  if (username !== expectedUsername) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  const payload = `${username}.${expiresAtRaw}`;
  const expectedSignature = await signWithHmacSha256(payload, secret);
  return safeEqual(signature, expectedSignature);
}