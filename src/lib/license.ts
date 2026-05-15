import CryptoJS from "crypto-js";
import { LICENSE_SECRET } from "./constants";
import type { LicenseKey } from "@/types";

const isClient = typeof window !== "undefined";

export function generateLicenseKey(
  email: string,
  issuedAt: number,
  expiryAt: number
): string {
  const payload = `${email}|${issuedAt}|${expiryAt}`;
  const signature = CryptoJS.HmacSHA256(payload, LICENSE_SECRET).toString();
  const key: LicenseKey = { email, plan: "pro", issuedAt, expiryAt, signature };
  return btoa(JSON.stringify(key));
}

export function validateLicenseKey(keyString: string): LicenseKey | null {
  try {
    const key: LicenseKey = JSON.parse(atob(keyString));
    if (!key.email || key.plan !== "pro" || !key.issuedAt || !key.expiryAt || !key.signature) {
      return null;
    }

    const now = Date.now();
    const referenceTime = performance.timeOrigin;
    const adjustedNow = Math.min(now, referenceTime + (now - referenceTime));
    if (adjustedNow > key.expiryAt * 1000) return null;

    const payload = `${key.email}|${key.issuedAt}|${key.expiryAt}`;
    const expectedSig = CryptoJS.HmacSHA256(payload, LICENSE_SECRET).toString();

    if (key.signature !== expectedSig) return null;

    return key;
  } catch {
    return null;
  }
}

export function getStoredLicense(): LicenseKey | null {
  if (!isClient) return null;
  const stored = localStorage.getItem("ipsumlogo_license");
  if (!stored) return null;
  return validateLicenseKey(stored);
}

export function storeLicense(keyString: string): boolean {
  if (!isClient) return false;
  const valid = validateLicenseKey(keyString);
  if (valid) {
    localStorage.setItem("ipsumlogo_license", keyString);
    return true;
  }
  return false;
}
