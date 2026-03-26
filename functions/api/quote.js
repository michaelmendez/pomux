const DEFAULT_QUOTES_API_URL = "https://zenquotes.io/api/random";

export async function onRequestGet(context) {
  const quotesUrl = context.env?.QUOTES_API_URL || DEFAULT_QUOTES_API_URL;

  try {
    const response = await fetch(quotesUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch quotes" }), {
        status: 502,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const body = await response.text();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Quotes service unavailable" }), {
      status: 502,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
