import type { LoaderFunction } from '@remix-run/cloudflare';
import { providerBaseUrlEnvKeys } from '~/utils/constants';
import { ApiTokenService } from '~/lib/db/services/apiTokenService';

export const loader: LoaderFunction = async ({ context, request }) => {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');

  if (!provider) {
    return Response.json({ isSet: false, source: null });
  }

  try {
    // Check MongoDB first (only if available)
    if (ApiTokenService.isAvailable(context)) {
      try {
        const hasMongoToken = await ApiTokenService.checkApiKeyExists(provider as any, 'default_user', context);
        if (hasMongoToken) {
          return Response.json({ isSet: true, source: 'database' });
        }
      } catch (mongoError) {
        console.log('MongoDB check failed, falling back to environment variables:', mongoError);
      }
    }

    // Check environment variables
    if (providerBaseUrlEnvKeys[provider]?.apiTokenKey) {
      const envVarName = providerBaseUrlEnvKeys[provider].apiTokenKey;
      const isEnvSet = !!(process.env[envVarName] || (context?.cloudflare?.env as Record<string, any>)?.[envVarName]);

      if (isEnvSet) {
        return Response.json({ isSet: true, source: 'environment' });
      }
    }

    return Response.json({ isSet: false, source: null });
  } catch (error) {
    console.error('Error checking API key:', error);
    // Fallback to environment check
    if (providerBaseUrlEnvKeys[provider]?.apiTokenKey) {
      const envVarName = providerBaseUrlEnvKeys[provider].apiTokenKey;
      const isEnvSet = !!(process.env[envVarName] || (context?.cloudflare?.env as Record<string, any>)?.[envVarName]);
      return Response.json({ isSet: isEnvSet, source: isEnvSet ? 'environment' : null });
    }

    return Response.json({ isSet: false, source: null });
  }
};
