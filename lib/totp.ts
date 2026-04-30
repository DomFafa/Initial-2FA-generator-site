const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export type SecretValidation =
  | { ok: true; normalized: string; bytes: Uint8Array }
  | { ok: false; code: "empty" | "invalid_chars" | "too_short" | "decode_failed"; message: string };

export function normalizeSecret(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase().replace(/=+$/g, "");
}

export function validateAndDecodeSecret(input: string): SecretValidation {
  const normalized = normalizeSecret(input);

  if (!normalized) {
    return { ok: false, code: "empty", message: "Enter a Base32 2FA secret to generate a code." };
  }

  if (!/^[A-Z2-7]+$/.test(normalized)) {
    return {
      ok: false,
      code: "invalid_chars",
      message: "This secret contains characters outside Base32. Use letters A-Z and numbers 2-7."
    };
  }

  if (normalized.length < 8) {
    return {
      ok: false,
      code: "too_short",
      message: "This secret looks too short. Check that you copied the full 2FA secret."
    };
  }

  try {
    const bytes = decodeBase32(normalized);
    if (bytes.length < 5) {
      return {
        ok: false,
        code: "too_short",
        message: "This secret decodes to too few bytes. Check the original 2FA setup key."
      };
    }
    return { ok: true, normalized, bytes };
  } catch {
    return {
      ok: false,
      code: "decode_failed",
      message: "The secret could not be decoded. Check the secret and try again."
    };
  }
}

export function secondsRemaining(now = Date.now(), period = 30): number {
  return period - (Math.floor(now / 1000) % period);
}

export async function generateTotp(secretBytes: Uint8Array, now = Date.now()): Promise<string> {
  const counter = Math.floor(now / 1000 / 30);
  const counterBytes = new ArrayBuffer(8);
  const view = new DataView(counterBytes);
  view.setUint32(4, counter, false);
  const keyData = new ArrayBuffer(secretBytes.byteLength);
  new Uint8Array(keyData).set(secretBytes);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBytes));
  const offset = signature[signature.length - 1] & 0x0f;
  const binary =
    ((signature[offset] & 0x7f) << 24) |
    ((signature[offset + 1] & 0xff) << 16) |
    ((signature[offset + 2] & 0xff) << 8) |
    (signature[offset + 3] & 0xff);

  return String(binary % 1_000_000).padStart(6, "0");
}

function decodeBase32(secret: string): Uint8Array {
  let bits = "";

  for (const char of secret) {
    const value = BASE32_ALPHABET.indexOf(char);
    if (value === -1) {
      throw new Error("Invalid Base32 character");
    }
    bits += value.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }

  return new Uint8Array(bytes);
}
