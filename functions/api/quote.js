const ZEN_QUOTES_URL = "https://zenquotes.io/api/random";

export async function onRequestGet() {
  try {
    const response = await fetch(ZEN_QUOTES_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch quote" }), {
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
    return new Response(JSON.stringify({ error: "Quote service unavailable" }), {
      status: 502,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
