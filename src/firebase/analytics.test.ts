import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  app: { options: { measurementId: "G-GWRP3K8W2J" as string | undefined } },
  hasClientConfig: true,
  supported: true,
  failInit: false,
}));

const calls = vi.hoisted(() => ({
  getAnalytics: vi.fn((..._args: unknown[]) => ({ name: "analytics" })),
  initializeAnalytics: vi.fn((..._args: unknown[]) => ({ name: "analytics" })),
  isSupported: vi.fn(async () => state.supported),
  logEvent: vi.fn((..._args: unknown[]) => undefined),
}));

vi.mock("@/firebase/firebaseClient", () => ({
  get app() {
    return state.app;
  },
  get hasClientConfig() {
    return state.hasClientConfig;
  },
}));

vi.mock("firebase/analytics", () => ({
  getAnalytics: (app: unknown) => calls.getAnalytics(app),
  initializeAnalytics: (app: unknown, options: unknown) => {
    if (state.failInit) throw new Error("analytics init failed");
    return calls.initializeAnalytics(app, options);
  },
  isSupported: () => calls.isSupported(),
  logEvent: (...args: unknown[]) => calls.logEvent(...args),
}));

function stubBrowser(cookie: string, href = "https://grade.me/grader") {
  const url = new URL(href);
  vi.stubGlobal("document", { cookie, title: "Grade.me" });
  vi.stubGlobal("window", { location: { search: url.search, href } });
}

async function loadTracker() {
  vi.resetModules();
  return import("./analytics");
}

beforeEach(() => {
  state.app = { options: { measurementId: "G-GWRP3K8W2J" } };
  state.hasClientConfig = true;
  state.supported = true;
  state.failInit = false;
  calls.getAnalytics.mockClear();
  calls.initializeAnalytics.mockClear();
  calls.isSupported.mockClear();
  calls.logEvent.mockClear();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("trackPageView", () => {
  it("does not start Analytics before cookie consent", async () => {
    stubBrowser("");
    const { trackPageView } = await loadTracker();
    await trackPageView("/grader");
    expect(calls.isSupported).not.toHaveBeenCalled();
    expect(calls.getAnalytics).not.toHaveBeenCalled();
    expect(calls.logEvent).not.toHaveBeenCalled();
  });

  it("initializes the existing measurement id and logs page_view after consent", async () => {
    stubBrowser("CookieConsent=true", "https://grade.me/grader?draft=1");
    const { trackPageView } = await loadTracker();
    await trackPageView("/grader");

    const app = calls.initializeAnalytics.mock.calls[0]?.[0] as
      | { options: { measurementId?: string } }
      | undefined;
    if (!app) throw new Error("initializeAnalytics was not called");
    expect(app.options.measurementId).toBe("G-GWRP3K8W2J");
    expect(calls.initializeAnalytics).toHaveBeenCalledWith(app, {
      config: { send_page_view: false },
    });
    expect(calls.getAnalytics).toHaveBeenCalledWith(app);
    expect(calls.logEvent).toHaveBeenCalledTimes(1);
    expect(calls.logEvent).toHaveBeenCalledWith(expect.anything(), "page_view", {
      page_path: "/grader?draft=1",
      page_location: "https://grade.me/grader?draft=1",
      page_title: "Grade.me",
    });
  });

  it("logs page_view again when the client route changes", async () => {
    stubBrowser("CookieConsent=true", "https://grade.me/");
    const { trackPageView } = await loadTracker();
    await trackPageView("/");
    stubBrowser("CookieConsent=true", "https://grade.me/rubrics");
    await trackPageView("/rubrics");

    expect(calls.getAnalytics).toHaveBeenCalledTimes(1);
    expect(calls.logEvent).toHaveBeenCalledTimes(2);
    expect(calls.logEvent.mock.calls[1]?.[2]).toMatchObject({ page_path: "/rubrics" });
  });

  it("skips a repeated view of the same path", async () => {
    stubBrowser("CookieConsent=true");
    const { trackPageView } = await loadTracker();
    await trackPageView("/grader");
    await trackPageView("/grader");
    expect(calls.logEvent).toHaveBeenCalledTimes(1);
  });

  it("does not call getAnalytics when the browser cannot support it", async () => {
    state.supported = false;
    stubBrowser("CookieConsent=true");
    const { trackPageView } = await loadTracker();
    await trackPageView("/grader");
    expect(calls.isSupported).toHaveBeenCalled();
    expect(calls.getAnalytics).not.toHaveBeenCalled();
    expect(calls.logEvent).not.toHaveBeenCalled();
  });

  it("does not replace a missing measurement id", async () => {
    state.app = { options: { measurementId: "  " } };
    stubBrowser("CookieConsent=true");
    const { trackPageView } = await loadTracker();
    await trackPageView("/grader");
    expect(calls.isSupported).not.toHaveBeenCalled();
    expect(calls.logEvent).not.toHaveBeenCalled();
  });

  it("keeps the page usable when Analytics fails to start", async () => {
    state.failInit = true;
    stubBrowser("CookieConsent=true");
    const { trackPageView } = await loadTracker();
    await expect(trackPageView("/grader")).resolves.toBeUndefined();
    expect(calls.logEvent).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });
});
