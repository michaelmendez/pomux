import { onRequestGet } from "./functions/api/quote.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/quote") {
      return onRequestGet();
    }

    // Try to serve the static asset first
    const assetResponse = await env.ASSETS.fetch(request);

    // If asset found (not 404), return it directly
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // Otherwise fall back to index.html for SPA routing
    const spaRequest = new Request(new URL("/index.html", request.url), request);
    return env.ASSETS.fetch(spaRequest);
  },
};
