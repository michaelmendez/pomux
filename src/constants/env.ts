const envOrFallback = (key: string, fallback: string): string => {
  const value = import.meta.env[key];
  return (value as string | undefined) ?? fallback;
};

export const env = {
  radioStationsUrl: envOrFallback("VITE_RADIO_STATIONS_URL", "/api/stations"),
  quotesUrl: envOrFallback("VITE_QUOTES_URL", "/api/quote"),
  githubUrl: envOrFallback("VITE_GITHUB_URL", "https://github.com/michaelmendez"),
} as const;
