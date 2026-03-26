const requiredEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value as string;
};

const resolveQuotesUrl = (): string => {
  const value = import.meta.env.VITE_QUOTES_URL as string | undefined;

  // Always use same-origin proxy if value is missing or points to ZenQuotes directly.
  if (!value || value.includes("zenquotes.io")) {
    return "/api/quote";
  }

  return value;
};

export const env = {
  radioStationsUrl: requiredEnvVar("VITE_RADIO_STATIONS_URL"),
  quotesUrl: resolveQuotesUrl(),
  githubUrl: requiredEnvVar("VITE_GITHUB_URL"),
} as const;
