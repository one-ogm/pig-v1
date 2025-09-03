import { ApiTokenService } from '~/lib/db/services/apiTokenService';

export function parseCookies(cookieHeader: string | null) {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) {
    return cookies;
  }

  // Split the cookie string by semicolons and spaces
  const items = cookieHeader.split(';').map((cookie) => cookie.trim());

  items.forEach((item) => {
    const [name, ...rest] = item.split('=');

    if (name && rest.length > 0) {
      // Decode the name and value, and join value parts in case it contains '='
      const decodedName = decodeURIComponent(name.trim());
      const decodedValue = decodeURIComponent(rest.join('=').trim());
      cookies[decodedName] = decodedValue;
    }
  });

  return cookies;
}

export function getApiKeysFromCookie(cookieHeader: string | null): Record<string, string> {
  const cookies = parseCookies(cookieHeader);
  return cookies.apiKeys ? JSON.parse(cookies.apiKeys) : {};
}

export function getProviderSettingsFromCookie(cookieHeader: string | null): Record<string, any> {
  const cookies = parseCookies(cookieHeader);
  return cookies.providers ? JSON.parse(cookies.providers) : {};
}

// New function to get API keys from both MongoDB and cookies
export async function getAllApiKeys(cookieHeader: string | null): Promise<Record<string, string>> {
  try {
    // Get API keys from MongoDB
    const mongoKeys = await ApiTokenService.getAllApiKeys();

    // Get API keys from cookies as fallback
    const cookieKeys = getApiKeysFromCookie(cookieHeader);

    // MongoDB keys take precedence over cookie keys
    return { ...cookieKeys, ...mongoKeys };
  } catch (error) {
    console.error('Error getting API keys from MongoDB, falling back to cookies:', error);
    // Fallback to cookies only if MongoDB fails
    return getApiKeysFromCookie(cookieHeader);
  }
}
