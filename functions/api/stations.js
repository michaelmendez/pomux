const DEFAULT_RADIO_STATIONS_URL =
  "https://de1.api.radio-browser.info/json/stations/bytag/synthwave?limit=20&hidebroken=true&order=random";

export async function onRequestGet(context) {
  const stationsUrl = context.env?.RADIO_STATIONS_URL || DEFAULT_RADIO_STATIONS_URL;

  try {
    const response = await fetch(stationsUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch radio stations" }), {
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
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Radio service unavailable" }), {
      status: 502,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
