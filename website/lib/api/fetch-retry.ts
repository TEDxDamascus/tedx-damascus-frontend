/**
 * The backend API (api.tedxdamascus.sy) is on a small/flaky origin — plain
 * TLS connection resets under load are common (reproduced repeatedly during
 * this project's own local builds). With `output: "export"`, a single failed
 * `generateStaticParams()` fetch doesn't crash the build — each caller's
 * try/catch quietly falls back to an empty/partial list — but it silently
 * drops that content's page from the entire deploy, with no error to point
 * at. Retrying a couple of times here meaningfully cuts how often fresh
 * content goes missing from a build for no reason other than one bad
 * request.
 */
export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  retries = 4,
  delayMs = 600,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url, init);
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }
  throw lastError;
}
