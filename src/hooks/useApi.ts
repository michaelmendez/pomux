import { API_RESPONSE_PREVIEW_CHARS } from "@/constants/consts";
import { useQuery } from "@tanstack/react-query";

export default function useApi<T = null>(url: string) {
  return useQuery<T | null>({
    queryKey: [url],
    queryFn: async () => {
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

      return (await request.json()) as T;
    },
    staleTime: 60 * 1000,
    retry: 1,
  });
}
