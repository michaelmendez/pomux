import { API_RESPONSE_PREVIEW_CHARS } from "@/constants/consts";
import { useEffect, useState } from "react";

type UseApiReturn<T = null> = {
  data: T;
  isLoading: boolean;
  error: string;
};

type ApiState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string;
};

export default function useApi<T = null>(url: string): UseApiReturn<T | null> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: "" }));

      try {
        const request = await fetch(url);

        if (!request.ok) {
          const message = `Request failed (${request.status} ${request.statusText})`;
          console.error("[useApi] Non-OK response", {
            url,
            status: request.status,
            statusText: request.statusText,
          });
          throw new Error(message);
        }

        if (cancelled) return;

        const contentType = request.headers.get("content-type") ?? "";

        if (!contentType.includes("application/json")) {
          const rawBody = await request.text();
          const preview = rawBody
            .slice(0, API_RESPONSE_PREVIEW_CHARS)
            .replaceAll(/\s+/g, " ")
            .trim();
          const message = `Expected JSON but got ${contentType || "unknown content-type"}. Possible /api routing fallback to index.html.`;

          console.error("[useApi] Invalid response content type", {
            url,
            contentType,
            preview,
          });
          throw new Error(message);
        }

        const data = await request.json();
        if (!cancelled) {
          setState({ data, isLoading: false, error: "" });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown network error";

        console.error("[useApi] Fetch failed", {
          url,
          message,
          error: err,
        });

        if (!cancelled) {
          setState((prev) => ({ ...prev, isLoading: false, error: message }));
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data: state.data, isLoading: state.isLoading, error: state.error };
}
