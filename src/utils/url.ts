export function toAbsoluteUrl(path: string, base: string = globalThis.location.origin) {
  return new URL(path, base).toString();
}
