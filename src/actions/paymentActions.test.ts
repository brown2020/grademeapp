import { beforeEach, describe, expect, it, vi } from "vitest";

const cookiesMock = vi.fn();
const verifyIdTokenMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => cookiesMock(),
}));

vi.mock("@/firebase/firebaseAdmin", () => ({
  adminAuth: {
    verifyIdToken: (...args: unknown[]) => verifyIdTokenMock(...args),
  },
}));

vi.mock("stripe", () => {
  class StripeMock {
    paymentIntents = {
      create: vi.fn(),
      retrieve: vi.fn(),
    };
  }
  return { default: StripeMock };
});

describe("paymentActions auth gate", () => {
  beforeEach(() => {
    vi.resetModules();
    cookiesMock.mockReset();
    verifyIdTokenMock.mockReset();
  });

  it("rejects createPaymentIntent without a session cookie", async () => {
    cookiesMock.mockResolvedValue({
      get: () => undefined,
    });
    const { createPaymentIntent } = await import("./paymentActions");
    await expect(createPaymentIntent(500)).rejects.toThrow(
      /Authentication required/i,
    );
    expect(verifyIdTokenMock).not.toHaveBeenCalled();
  });

  it("rejects validatePaymentIntent without a session cookie", async () => {
    cookiesMock.mockResolvedValue({
      get: () => undefined,
    });
    const { validatePaymentIntent } = await import("./paymentActions");
    await expect(validatePaymentIntent("pi_test")).rejects.toThrow(
      /Authentication required/i,
    );
  });
});
