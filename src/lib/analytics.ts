import posthog from "posthog-js";

let inited = false;

export function initPH() {
  if (typeof window === "undefined") return;
  if (inited) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
    autocapture: false,
  } as any);
  inited = true;
}

export const ph = posthog;
