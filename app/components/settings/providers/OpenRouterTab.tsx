import React, { useState } from 'react';
import { Switch } from '~/components/ui/Switch';
import { useSettings } from '~/lib/hooks/useSettings';
import { APIKeyManager } from '~/components/chat/APIKeyManager';
import type { ProviderInfo } from '~/types/model';

export function OpenRouterTab() {
  const { providers, updateProviderSettings } = useSettings();
  const [apiKey, setApiKey] = useState('');
  
  const openrouterProvider = providers['OpenRouter'];
  
  // Create a ProviderInfo object for APIKeyManager
  const providerInfo: ProviderInfo = {
    name: 'OpenRouter',
    getApiKeyLink: 'https://openrouter.ai/settings/keys',
    labelForGetApiKey: 'Get OpenRouter Key',
    icon: 'i-ph:key',
    staticModels: [],
    getDynamicModels: () => Promise.resolve([])
  };

  if (!openrouterProvider) {
    return (
      <div className="text-center py-8">
        <p className="text-bolt-elements-textSecondary">OpenRouter provider not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Provider Header */}
      <div className="flex items-center justify-between p-6 bg-bolt-elements-bg-depth-2 rounded-lg border border-bolt-elements-borderColor">
        <div className="flex items-center gap-4">
          <img
            src="/icons/OpenRouter.svg"
            alt="OpenRouter icon"
            className="w-12 h-12 dark:invert"
            onError={(e) => {
              e.currentTarget.src = '/icons/Default.svg';
            }}
          />
          <div>
            <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">OpenRouter</h3>
            <p className="text-sm text-bolt-elements-textSecondary">
              Unified API access to multiple AI models from different providers
            </p>
          </div>
        </div>
        <Switch
          checked={openrouterProvider.settings.enabled}
          onCheckedChange={(enabled) => {
            updateProviderSettings('OpenRouter', { 
              ...openrouterProvider.settings, 
              enabled 
            });
          }}
        />
      </div>

      {/* Provider Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-bolt-elements-bg-depth-1 rounded-lg border border-bolt-elements-borderColor">
          <h4 className="font-medium text-bolt-elements-textPrimary mb-2">About OpenRouter</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            OpenRouter provides unified access to models from OpenAI, Anthropic, Google, Meta, and many others through a single API.
          </p>
        </div>
        <div className="p-4 bg-bolt-elements-bg-depth-1 rounded-lg border border-bolt-elements-borderColor">
          <h4 className="font-medium text-bolt-elements-textPrimary mb-2">Available Models</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            Claude 3.5 Sonnet, GPT-4, Gemini, Llama, Deepseek-Coder, Mistral, Qwen, and 200+ other models.
          </p>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">💰 Flexible Pricing</h4>
        <p className="text-sm text-green-800 dark:text-green-300">
          Pay only for what you use with transparent per-token pricing. Often cheaper than direct provider APIs with competitive rates.
        </p>
      </div>

      {/* API Key Configuration */}
      {openrouterProvider.settings.enabled && (
        <div className="p-6 bg-bolt-elements-bg-depth-1 rounded-lg border border-bolt-elements-borderColor">
          <h4 className="font-medium text-bolt-elements-textPrimary mb-4">API Key Configuration</h4>
          <p className="text-sm text-bolt-elements-textSecondary mb-4">
            Configure your OpenRouter API key to access multiple AI models through a unified interface.
          </p>
          <APIKeyManager
            provider={providerInfo}
            apiKey={apiKey}
            setApiKey={setApiKey}
          />
        </div>
      )}

      {/* Help Section */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Getting Started</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Visit <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer" className="underline">OpenRouter Settings</a> to create an API key</li>
          <li>• Add credits to your account to start using models</li>
          <li>• Monitor usage and costs in real-time on the OpenRouter dashboard</li>
          <li>• Try different models to find the best fit for your use case</li>
        </ul>
      </div>
    </div>
  );
}
