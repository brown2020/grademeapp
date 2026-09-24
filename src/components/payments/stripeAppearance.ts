import type { Appearance } from "@stripe/stripe-js";

export type ColorScheme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function subscribeColorScheme(callback: () => void) {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function getColorScheme(): ColorScheme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/**
 * Our tokens are oklch(), which Stripe's appearance API doesn't accept, so resolve
 * each CSS variable through a canvas to an sRGB `rgb()` string.
 */
function tokenColor(ctx: CanvasRenderingContext2D | null, name: string, fallback: string) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!ctx || !raw) return fallback;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = fallback;
  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

export function buildStripeAppearance(scheme: ColorScheme): Appearance {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const dark = scheme === "dark";
  const color = (name: string, light: string, darkFallback: string) =>
    tokenColor(ctx, name, dark ? darkFallback : light);

  const border = color("--input", "rgb(212, 212, 206)", "rgb(68, 70, 76)");
  const ring = color("--ring", "rgb(22, 128, 88)", "rgb(94, 196, 150)");

  return {
    theme: dark ? "night" : "stripe",
    variables: {
      colorPrimary: color("--primary", "rgb(22, 110, 76)", "rgb(94, 196, 150)"),
      colorBackground: color("--surface", "rgb(255, 255, 255)", "rgb(32, 34, 38)"),
      colorText: color("--foreground", "rgb(30, 33, 40)", "rgb(237, 236, 232)"),
      colorTextSecondary: color("--muted-foreground", "rgb(100, 104, 114)", "rgb(163, 166, 174)"),
      colorTextPlaceholder: color("--muted-foreground", "rgb(100, 104, 114)", "rgb(163, 166, 174)"),
      colorDanger: color("--destructive", "rgb(200, 50, 40)", "rgb(230, 100, 90)"),
      fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
      borderRadius: "8px",
      spacingUnit: "4px",
    },
    rules: {
      ".Input": { borderColor: border, boxShadow: "none" },
      ".Input:focus": { borderColor: ring, boxShadow: `0 0 0 3px ${ring.replace("rgb", "rgba").replace(")", ", 0.25)")}` },
      ".Tab": { borderColor: border, boxShadow: "none" },
      ".Label": { fontWeight: "500" },
    },
  };
}
