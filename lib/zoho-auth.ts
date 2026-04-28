import { ZOHO_TOKEN_FUNCTION_URL } from "./zoho-config";

let cachedToken: string | null = null;

export async function getAccessToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const response = await fetch(ZOHO_TOKEN_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch access token: ${response.statusText}`);
  }

  const data = await response.json();
  const output = data.details?.output;

  if (!output) {
    throw new Error("Invalid token response: missing details.output");
  }

  const parsed = JSON.parse(output);
  const rawToken = parsed.accessToken;

  cachedToken = rawToken.startsWith("Zoho-oauthtoken ")
    ? rawToken
    : `Zoho-oauthtoken ${rawToken}`;

  return cachedToken as string;
}

export function clearCachedToken(): void {
  cachedToken = null;
}

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  retries = 2,
): Promise<T> {
  const response = await fetch(url, options);

  if (response.status === 401 && retries > 0) {
    clearCachedToken();
    await getAccessToken();
    return fetchWithRetry<T>(url, options, retries - 1);
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }

  return response.json();
}
