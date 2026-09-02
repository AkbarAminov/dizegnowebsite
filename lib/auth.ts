// Single admin account defined by ADMIN_EMAIL / ADMIN_PASSWORD. The session
// is a signed, expiring cookie (HMAC-SHA256 via Web Crypto, so the same code
// runs in proxy.ts and in server actions).

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

async function signingKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function toHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string) {
  if (!/^[0-9a-f]{64}$/.test(hex)) return null;
  return Uint8Array.from(hex.match(/../g)!, (pair) => parseInt(pair, 16));
}

export async function createSessionToken(): Promise<string> {
  const expiresAt = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  const signature = await crypto.subtle.sign("HMAC", await signingKey(), encoder.encode(expiresAt));
  return `${expiresAt}.${toHex(signature)}`;
}

export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [expiresAt, signatureHex] = token.split(".");
  if (!expiresAt || !signatureHex || Number(expiresAt) < Date.now()) return false;
  const signature = fromHex(signatureHex);
  if (!signature) return false;
  return crypto.subtle.verify("HMAC", await signingKey(), signature, encoder.encode(expiresAt));
}

export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return false;
  const [emailOk, passwordOk] = await Promise.all([
    constantTimeEqual(email, ADMIN_EMAIL),
    constantTimeEqual(password, ADMIN_PASSWORD),
  ]);
  return emailOk && passwordOk;
}

// Compares fixed-length digests so timing does not leak how much of the
// secret matched.
async function constantTimeEqual(a: string, b: string) {
  const [x, y] = await Promise.all(
    [a, b].map(async (value) => new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))))
  );
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
