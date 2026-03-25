export const toHttps = (url: string | undefined) =>
  url?.replace(/^http:\/\//i, "https://");
