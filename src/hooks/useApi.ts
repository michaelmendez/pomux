import { useEffect, useState } from "react";

type UseApiReturn<T = null> = {
  data: T;
  isLoading: boolean,
  error: string;
}

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
          setError("Something went wrong while fetching the request");
          throw new Error(`HTTP error: ${request.status}`);
        }

        if (!skip) {
          const data = await request.json();
          setData(data);
        }
      } catch (err) {
        console.error(err); // SIMULATE LOG TO RUM LIKE SENTRY, DATADOG...
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

  return { data, isLoading, error }
}
