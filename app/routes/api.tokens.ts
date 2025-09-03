import { type ActionFunctionArgs, type LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { ApiTokenService } from '~/lib/db/services/apiTokenService';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');

  try {
    // Check if MongoDB is available
    if (!ApiTokenService.isAvailable(context)) {
      console.log('MongoDB not available, returning empty response');
      if (provider) {
        return json({
          provider,
          hasToken: false,
          apiKey: null
        });
      } else {
        return json({ apiKeys: {} });
      }
    }

    if (provider) {
      // Get specific provider token
      const apiKey = await ApiTokenService.getApiKey(provider as any, 'default_user', context);
      return json({
        provider,
        hasToken: !!apiKey,
        apiKey: apiKey || null
      });
    } else {
      // Get all tokens
      const allApiKeys = await ApiTokenService.getAllApiKeys('default_user', context);
      return json({ apiKeys: allApiKeys });
    }
  } catch (error) {
    console.error('Error in tokens loader:', error);
    // Return empty response instead of error to prevent app crash
    if (provider) {
      return json({
        provider,
        hasToken: false,
        apiKey: null
      });
    } else {
      return json({ apiKeys: {} });
    }
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
  const method = request.method;

  try {
    switch (method) {
      case 'POST': {
        // Save/Update token
        const { provider, apiKey } = await request.json();

        if (!provider || !apiKey) {
          return json({ error: 'Provider and apiKey are required' }, { status: 400 });
        }

        if (!['OpenRouter', 'HuggingFace', 'LMStudio'].includes(provider)) {
          return json({ error: 'Invalid provider' }, { status: 400 });
        }

        // Check if MongoDB is available
        if (!ApiTokenService.isAvailable(context)) {
          return json({ error: 'Database not available. Please use cookies fallback.' }, { status: 503 });
        }

        const savedToken = await ApiTokenService.saveApiKey(provider, apiKey, 'default_user', context);
        return json({
          success: true,
          message: `${provider} API key saved successfully`,
          token: savedToken
        });
      }

      case 'DELETE': {
        // Delete token
        const { provider } = await request.json();

        if (!provider) {
          return json({ error: 'Provider is required' }, { status: 400 });
        }

        // Check if MongoDB is available
        if (!ApiTokenService.isAvailable(context)) {
          return json({ error: 'Database not available. Please use cookies fallback.' }, { status: 503 });
        }

        const deleted = await ApiTokenService.deleteApiKey(provider, 'default_user', context);
        if (deleted) {
          return json({
            success: true,
            message: `${provider} API key deleted successfully`
          });
        } else {
          return json({ error: 'Failed to delete API key' }, { status: 500 });
        }
      }

      default:
        return json({ error: 'Method not allowed' }, { status: 405 });
    }
  } catch (error) {
    console.error('Error in tokens action:', error);
    return json({ error: 'Database error. Please use cookies fallback.' }, { status: 500 });
  }
}
