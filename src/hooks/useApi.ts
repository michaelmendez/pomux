import { useEffect, useState } from "react";

type UseApiReturn<T = null> = {
  data: T;
  isLoading: boolean;
  error: string;
};

export default function useApi<T = null>(url: string): UseApiReturn<T | null> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let skip = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const request = await fetch(url);

        if (!request.ok) {
          const message = `Request failed (${request.status} ${request.statusText})`;
          setError(message);
          console.error("[useApi] Non-OK response", {
            url,
            status: request.status,
            statusText: request.statusText,
          });
          throw new Error(message);
        }

        if (!skip) {
          const contentType = request.headers.get("content-type") ?? "";

          if (!contentType.includes("application/json")) {
            const rawBody = await request.text();
            const preview = rawBody.slice(0, 120).replace(/\s+/g, " ").trim();
            const message = `Expected JSON but got ${contentType || "unknown content-type"}. Possible /api routing fallback to index.html.`;

            setError(message);
            console.error("[useApi] Invalid response content type", {
              url,
              contentType,
              preview,
            });
            throw new Error(message);
          }

          const data = await request.json();
          setData(data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown network error";

        if (!skip) {
          setError(message);
        }

        console.error("[useApi] Fetch failed", {
          url,
          message,
          error: err,
        });
      } finally {
        if (!skip) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      skip = true;
    };
  }, [url]);

  return { data, isLoading, error };
}
