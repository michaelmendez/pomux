import { onRequestGet } from "./functions/api/quote.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/quote") {
      return onRequestGet();
    }

    return env.ASSETS.fetch(request);
  },
};
