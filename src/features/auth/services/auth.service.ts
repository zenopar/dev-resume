import crypto from "node:crypto";

const SESSION_SALT = ":cv_auth_jwt_salt_v1:";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds lockout
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes reset window
const DEFAULT_JWT_EXPIRATION_SECONDS = 30 * 24 * 60 * 60; // 30 days

export interface JwtSessionPayload {
  sub: string;
  iat: number;
  exp: number;
  pwdHash: string;
}

function base64UrlEncode(data: string | Buffer): string {
  return Buffer.from(data)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

interface RateLimitRecord {
  failedAttempts: number;
  lockedUntil: number;
  lastAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (record.lockedUntil < now && now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}

export const authService = {
  isAuthRequired(): boolean {
    const pwd = process.env.PASSWORD;
    return typeof pwd === "string" && pwd.trim().length > 0;
  },

  getJwtSecret(): string {
    const pwd = process.env.PASSWORD ? process.env.PASSWORD.trim() : "";
    return crypto
      .createHash("sha256")
      .update(pwd + SESSION_SALT)
      .digest("hex");
  },

  getPasswordFingerprint(): string {
    const pwd = process.env.PASSWORD ? process.env.PASSWORD.trim() : "";
    return crypto
      .createHash("sha256")
      .update(pwd)
      .digest("hex")
      .slice(0, 16);
  },

  verifyPassword(input: string): boolean {
    if (!this.isAuthRequired()) return true;
    const expected = process.env.PASSWORD!.trim();
    if (typeof input !== "string" || input.length !== expected.length) {
      return false;
    }
    return crypto.timingSafeEqual(Buffer.from(input), Buffer.from(expected));
  },

  createJwtSession(expiresInSeconds = DEFAULT_JWT_EXPIRATION_SECONDS): string {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "HS256", typ: "JWT" };
    const payload: JwtSessionPayload = {
      sub: "cv_studio_auth",
      iat: now,
      exp: now + expiresInSeconds,
      pwdHash: this.getPasswordFingerprint(),
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const message = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac("sha256", this.getJwtSecret())
      .update(message)
      .digest();
    const encodedSignature = base64UrlEncode(signature);

    return `${message}.${encodedSignature}`;
  },

  verifySessionToken(token?: string): boolean {
    if (!this.isAuthRequired()) return true;
    if (!token || typeof token !== "string") return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const message = `${encodedHeader}.${encodedPayload}`;

    // 1. Verify cryptographic HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", this.getJwtSecret())
      .update(message)
      .digest();
    const expectedEncodedSignature = base64UrlEncode(expectedSignature);

    if (encodedSignature.length !== expectedEncodedSignature.length) {
      return false;
    }

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(encodedSignature),
      Buffer.from(expectedEncodedSignature)
    );

    if (!isSignatureValid) return false;

    // 2. Decode and verify payload
    try {
      const payloadJson = base64UrlDecode(encodedPayload);
      const payload = JSON.parse(payloadJson) as JwtSessionPayload;

      // 3. Verify expiration (exp)
      const now = Math.floor(Date.now() / 1000);
      if (typeof payload.exp !== "number" || payload.exp < now) {
        return false;
      }

      // 4. Verify password fingerprint
      if (payload.pwdHash !== this.getPasswordFingerprint()) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  decodeJwtPayload(token: string): JwtSessionPayload | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      return JSON.parse(base64UrlDecode(parts[1])) as JwtSessionPayload;
    } catch {
      return null;
    }
  },

  checkRateLimit(ip: string): { isLocked: boolean; remainingSeconds: number } {
    cleanupRateLimitMap();
    const record = rateLimitMap.get(ip);
    if (!record) return { isLocked: false, remainingSeconds: 0 };

    const now = Date.now();
    if (record.lockedUntil > now) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }

    if (now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
      rateLimitMap.delete(ip);
      return { isLocked: false, remainingSeconds: 0 };
    }

    return { isLocked: false, remainingSeconds: 0 };
  },

  recordFailedAttempt(ip: string): {
    isNowLocked: boolean;
    remainingAttempts: number;
    remainingSeconds: number;
  } {
    const now = Date.now();
    let record = rateLimitMap.get(ip);

    if (!record || now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
      record = {
        failedAttempts: 1,
        lockedUntil: 0,
        lastAttempt: now,
      };
    } else {
      record.failedAttempts += 1;
      record.lastAttempt = now;
    }

    if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_DURATION_MS;
      rateLimitMap.set(ip, record);
      return {
        isNowLocked: true,
        remainingAttempts: 0,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      };
    }

    rateLimitMap.set(ip, record);
    return {
      isNowLocked: false,
      remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts),
      remainingSeconds: 0,
    };
  },

  recordSuccessfulLogin(ip: string): void {
    rateLimitMap.delete(ip);
  },
};
