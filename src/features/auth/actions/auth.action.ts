"use server";

import { cookies, headers } from "next/headers";
import { authService } from "../services/auth.service";

const COOKIE_NAME = "cv_auth_session";
const MIN_RESPONSE_DELAY_MS = 1000;

async function getClientIp(): Promise<string> {
  try {
    const headerStore = await headers();

    // 1. Cloudflare Connecting IP (highest priority)
    const cfConnectingIp = headerStore.get("cf-connecting-ip");
    if (cfConnectingIp) {
      return cfConnectingIp.trim();
    }

    // 2. True-Client-IP (Cloudflare Enterprise / Akamai)
    const trueClientIp = headerStore.get("true-client-ip");
    if (trueClientIp) {
      return trueClientIp.trim();
    }

    // 3. X-Real-IP (Nginx / reverse proxy)
    const realIp = headerStore.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }

    // 4. X-Forwarded-For (standard reverse proxy chain)
    const forwarded = headerStore.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }

    return "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

export async function loginAction(password: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    if (!authService.isAuthRequired()) {
      return { success: true };
    }

    const ip = await getClientIp();

    // 1. Check if client IP is currently rate-limited
    const rateLimit = authService.checkRateLimit(ip);
    if (rateLimit.isLocked) {
      return {
        success: false,
        error: `Too many failed attempts. Please wait ${rateLimit.remainingSeconds}s before trying again.`,
      };
    }

    // 2. Verify password with constant-time comparison
    const isValid = authService.verifyPassword(password);
    if (!isValid) {
      const failInfo = authService.recordFailedAttempt(ip);
      if (failInfo.isNowLocked) {
        return {
          success: false,
          error: `Too many failed attempts. Rate limit reached, please wait ${failInfo.remainingSeconds}s.`,
        };
      }
      return {
        success: false,
        error: `Incorrect password. (${failInfo.remainingAttempts} attempts remaining)`,
      };
    }

    // 3. Clear failed attempts on successful verification
    authService.recordSuccessfulLogin(ip);

    const token = authService.createJwtSession();
    const cookieStore = await cookies();


    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return { success: true };
  } finally {
    // 4. Force at least 1-second delay before sending response (anti-brute-force)
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_RESPONSE_DELAY_MS) {
      await new Promise((resolve) => setTimeout(resolve, MIN_RESPONSE_DELAY_MS - elapsed));
    }
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}

export async function getAuthStatusAction(): Promise<{
  isRequired: boolean;
  isAuthenticated: boolean;
}> {
  const isRequired = authService.isAuthRequired();
  if (!isRequired) {
    return { isRequired: false, isAuthenticated: true };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const isAuthenticated = authService.verifySessionToken(token);

  return { isRequired, isAuthenticated };
}
