import { ZOHO_TOKEN_FUNCTION_URL } from './zoho-config';

export async function getAccessToken(): Promise<string> {
  const response = await fetch(ZOHO_TOKEN_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch access token: ${response.statusText}`);
  }

  const data = await response.json();
  const output = data.details?.output;

  if (!output) {
    throw new Error('Invalid token response: missing details.output');
  }

  const parsed = JSON.parse(output);
  const rawToken = parsed.accessToken;

  if (rawToken.startsWith('Zoho-oauthtoken ')) {
    return rawToken;
  }

  return `Zoho-oauthtoken ${rawToken}`;
}