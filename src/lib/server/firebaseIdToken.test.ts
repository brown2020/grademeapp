import { afterEach, describe, expect, it } from "vitest";
import { setFirebaseJwksLoader, verifyFirebaseIdToken } from "./firebaseIdToken";

const PROJECT = "grademe-test";

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlJson(value: unknown): string {
  return base64Url(new TextEncoder().encode(JSON.stringify(value)));
}

async function signedToken(privateKey: CryptoKey, payload: Record<string, unknown>, kid = "test-kid") {
  const header = base64UrlJson({ alg: "RS256", kid });
  const body = base64UrlJson(payload);
  const signature = new Uint8Array(
    await crypto.subtle.sign({ name: "RSASSA-PKCS1-v1_5" }, privateKey, new TextEncoder().encode(`${header}.${body}`))
  );
  return `${header}.${body}.${base64Url(signature)}`;
}

describe("verifyFirebaseIdToken", () => {
  afterEach(() => {
    setFirebaseJwksLoader(null);
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECTID;
  });

  it("accepts an RS256 token signed by the configured key and rejects tampering", async () => {
    const pair = await crypto.subtle.generateKey(
      { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
      true,
      ["sign", "verify"]
    );
    const jwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
    setFirebaseJwksLoader(async () => [{ ...jwk, kid: "test-kid", alg: "RS256", use: "sig" }]);
    process.env.NEXT_PUBLIC_FIREBASE_PROJECTID = PROJECT;

    const now = 1_700_000_000_000;
    const payload = {
      iss: `https://securetoken.google.com/${PROJECT}`,
      aud: PROJECT,
      sub: "alice",
      exp: Math.floor(now / 1000) + 600,
    };
    const token = await signedToken(pair.privateKey, payload);
    expect(await verifyFirebaseIdToken(token, now)).toBe(true);

    const [header, , signature] = token.split(".");
    const forged = base64UrlJson({ ...payload, sub: "mallory" });
    expect(await verifyFirebaseIdToken(`${header}.${forged}.${signature}`, now)).toBe(false);
    expect(await verifyFirebaseIdToken(token, now + 2 * 60 * 60 * 1000)).toBe(false);
    delete process.env.NEXT_PUBLIC_FIREBASE_PROJECTID;
    expect(await verifyFirebaseIdToken(token, now)).toBe(false);
  });
});
