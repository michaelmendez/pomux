const ZEN_QUOTES_URL = "https://zenquotes.io/api/quotes/random?limit=20";

export async function onRequestGet() {
  try {
    const upstream = await fetch(ZEN_QUOTES_URL, {
      headers: { Accept: "application/json" },
    });

    if (!upstream.ok) {
      console.error("[quote-api] Upstream request failed", {
        status: upstream.status,
        statusText: upstream.statusText,
        url: ZEN_QUOTES_URL,
      });

      return new Response(JSON.stringify({ error: "Failed to fetch quote upstream" }), {
        status: 502,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }

    const payload = await upstream.json();

    if (!Array.isArray(payload)) {
      console.error("[quote-api] Invalid payload: expected array", { payloadType: typeof payload });

      return new Response(JSON.stringify({ error: "Invalid quote payload" }), {
        status: 502,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }

    const quotes = payload
      .filter((quote) => typeof quote?.q === "string" && typeof quote?.a === "string")
      .slice(0, 20)
      .map((quote) => ({
        q: quote.q,
        a: quote.a,
        h: typeof quote?.h === "string" ? quote.h : "",
      }));

    if (quotes.length === 0) {
      console.error("[quote-api] Invalid payload: no valid quotes after normalization");

      return new Response(JSON.stringify({ error: "Invalid quote payload" }), {
        status: 502,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }

    return new Response(JSON.stringify(quotes), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=600, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("[quote-api] Unexpected error", { error });

    return new Response(JSON.stringify({ error: "Unable to fetch quote" }), {
      status: 502,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }
}
