const requiredEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value as string;
};

export const env = {
  radioStationsUrl: requiredEnvVar("VITE_RADIO_STATIONS_URL"),
  quotesUrl: requiredEnvVar("VITE_QUOTES_URL"),
  githubUrl: requiredEnvVar("VITE_GITHUB_URL"),
} as const;
