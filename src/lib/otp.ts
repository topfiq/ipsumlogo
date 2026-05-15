"use client";

const OTP_STORAGE_KEY = "ipsumlogo_otp_data";

interface OtpData {
  code: string;
  phone: string;
  expiresAt: number;
  verified: boolean;
}

export function getOtpData(): OtpData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(OTP_STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveOtpData(data: OtpData) {
  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(data));
}

export function clearOtpData() {
  localStorage.removeItem(OTP_STORAGE_KEY);
}

export function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendOtpViaOnesender(
  phone: string,
  code: string,
  onesenderUrl: string,
  onesenderKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${onesenderUrl}/api/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": onesenderKey,
      },
      body: JSON.stringify({
        to: phone.replace(/[^0-9]/g, ""),
        type: "text",
        message: `Your Ipsumlogo verification code is: *${code}*\n\nThis code expires in 5 minutes.`,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: text.slice(0, 200) };
    }

    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message || "Network error" };
  }
}

export function simulateSendOtp(phone: string, code: string): { success: boolean } {
  console.log(`[OTP Simulation] Sending code ${code} to ${phone}`);
  return { success: true };
}
