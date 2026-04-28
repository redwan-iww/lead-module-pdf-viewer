const ZOHO_TOKEN_FUNCTION_URL =
  'https://www.zohoapis.com/crm/v7/functions/getaccesstokentest/actions/execute?auth_type=apikey&zapikey=1003.69377e4c023746b678620c179deee294.eff03852627bfad3ec15cdb073c2e8b3';

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