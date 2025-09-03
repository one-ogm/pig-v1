import React, { useState, useEffect } from 'react';
import { Switch } from '~/components/ui/Switch';
import { useSettings } from '~/lib/hooks/useSettings';
import { APIKeyManager } from '~/components/chat/APIKeyManager';
import type { ProviderInfo } from '~/types/model';

export function HuggingFaceTab() {
  const { providers, updateProviderSettings } = useSettings();
  const [apiKey, setApiKey] = useState('');
  
  const huggingfaceProvider = providers['HuggingFace'];
  
  // Create a ProviderInfo object for APIKeyManager
  const providerInfo: ProviderInfo = {
    name: 'HuggingFace',
    getApiKeyLink: 'https://huggingface.co/settings/tokens',
    labelForGetApiKey: 'Get HuggingFace Token',
    icon: 'i-ph:key',
    staticModels: [],
    getDynamicModels: () => Promise.resolve([])
  };

  if (!huggingfaceProvider) {
    return (
      <div className="text-center py-8">
        <p className="text-bolt-elements-textSecondary">HuggingFace provider not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Provider Header */}
      <div className="flex items-center justify-between p-6 bg-bolt-elements-bg-depth-2 rounded-lg border border-bolt-elements-borderColor">
        <div className="flex items-center gap-4">
          <img
            src="/icons/HuggingFace.svg"
            alt="HuggingFace icon"
            className="w-12 h-12 dark:invert"
            onError={(e) => {
              e.currentTarget.src = '/icons/Default.svg';
            }}
          />
          <div>
            <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">HuggingFace</h3>
            <p className="text-sm text-bolt-elements-textSecondary">
              Access open-source models hosted on HuggingFace Hub
            </p>
          </div>
        </div>
        <Switch
          checked={huggingfaceProvider.settings.enabled}
          onCheckedChange={(enabled) => {
            updateProviderSettings('HuggingFace', { 
              ...huggingfaceProvider.settings, 
              enabled 
            });
          }}
        />
      </div>

      {/* Provider Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-bolt-elements-bg-depth-1 rounded-lg border border-bolt-elements-borderColor">
          <h4 className="font-medium text-bolt-elements-textPrimary mb-2">About HuggingFace</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            HuggingFace provides access to thousands of open-source AI models. You'll need a free API token to get started.
          </p>
        </div>
        <div className="p-4 bg-bolt-elements-bg-depth-1 rounded-lg border border-bolt-elements-borderColor">
          <h4 className="font-medium text-bolt-elements-textPrimary mb-2">Available Models</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            Qwen2.5-Coder, CodeLlama, Hermes-3, Yi-1.5, Llama-3.1, and many more open-source models.
          </p>
        </div>
      </div>

      {/* API Key Configuration */}
      {huggingfaceProvider.settings.enabled && (
        <div className="p-6 bg-bolt-elements-bg-depth-1 rounded-lg border border-bolt-elements-borderColor">
          <h4 className="font-medium text-bolt-elements-textPrimary mb-4">API Key Configuration</h4>
          <p className="text-sm text-bolt-elements-textSecondary mb-4">
            Configure your HuggingFace API token to access models. You can get a free token from HuggingFace.
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
        <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Need Help?</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Visit <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">HuggingFace Settings</a> to create an API token</li>
          <li>• Choose "Read" access for basic model usage</li>
          <li>• The token is free and gives you access to thousands of models</li>
        </ul>
      </div>
    </div>
  );
}
