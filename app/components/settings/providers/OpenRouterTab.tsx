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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <div className="i-ph:warning w-6 h-6 text-red-500" />
          </div>
          <p className="text-bolt-elements-textSecondary">OpenRouter provider not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Provider Header Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 border border-bolt-elements-borderColor">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <img
                  src="/icons/OpenRouter.svg"
                  alt="OpenRouter icon"
                  className="w-10 h-10 dark:invert"
                  onError={(e) => {
                    e.currentTarget.src = '/icons/Default.svg';
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-bolt-elements-textPrimary">OpenRouter</h3>
                  <span className="px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-400 rounded-full">
                    Popular Choice
                  </span>
                </div>
                <p className="text-bolt-elements-textSecondary text-lg mb-3">
                  Unified API access to 200+ AI models from different providers
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs bg-bolt-elements-bg-depth-3 text-bolt-elements-textSecondary rounded-md">
                    Claude 3.5 Sonnet
                  </span>
                  <span className="px-2 py-1 text-xs bg-bolt-elements-bg-depth-3 text-bolt-elements-textSecondary rounded-md">
                    GPT-4
                  </span>
                  <span className="px-2 py-1 text-xs bg-bolt-elements-bg-depth-3 text-bolt-elements-textSecondary rounded-md">
                    Gemini Pro
                  </span>
                  <span className="px-2 py-1 text-xs bg-bolt-elements-bg-depth-3 text-bolt-elements-textSecondary rounded-md">
                    +200 more
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-bolt-elements-textSecondary">Provider Status</p>
                  <p className={`text-sm font-medium ${
                    openrouterProvider.settings.enabled ? 'text-green-400' : 'text-bolt-elements-textTertiary'
                  }`}>
                    {openrouterProvider.settings.enabled ? 'Enabled' : 'Disabled'}
                  </p>
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
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group p-6 rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor hover:border-bolt-elements-focus/50 transition-all duration-200">
          <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <div className="i-ph:currency-dollar w-6 h-6 text-green-400" />
          </div>
          <h4 className="font-semibold text-bolt-elements-textPrimary mb-2">Flexible Pricing</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            Pay only for what you use with transparent per-token pricing. Often cheaper than direct provider APIs.
          </p>
        </div>

        <div className="group p-6 rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor hover:border-bolt-elements-focus/50 transition-all duration-200">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <div className="i-ph:stack w-6 h-6 text-blue-400" />
          </div>
          <h4 className="font-semibold text-bolt-elements-textPrimary mb-2">Unified API</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            Access models from OpenAI, Anthropic, Google, Meta, and many others through a single interface.
          </p>
        </div>

        <div className="group p-6 rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor hover:border-bolt-elements-focus/50 transition-all duration-200">
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <div className="i-ph:chart-line w-6 h-6 text-purple-400" />
          </div>
          <h4 className="font-semibold text-bolt-elements-textPrimary mb-2">Real-time Monitoring</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            Monitor usage and costs in real-time on the OpenRouter dashboard with detailed analytics.
          </p>
        </div>
      </div>

      {/* API Key Configuration */}
      {openrouterProvider.settings.enabled && (
        <div className="rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor overflow-hidden">
          <div className="px-6 py-4 bg-bolt-elements-bg-depth-3 border-b border-bolt-elements-borderColor">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-bolt-elements-focus/20 flex items-center justify-center">
                <div className="i-ph:key w-4 h-4 text-bolt-elements-focus" />
              </div>
              <div>
                <h4 className="font-semibold text-bolt-elements-textPrimary">API Key Configuration</h4>
                <p className="text-sm text-bolt-elements-textSecondary">
                  Configure your OpenRouter API key to access multiple AI models
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <APIKeyManager
              provider={providerInfo}
              apiKey={apiKey}
              setApiKey={setApiKey}
            />
          </div>
        </div>
      )}

      {/* Getting Started Section */}
      <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <div className="i-ph:rocket-launch w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-200 mb-3">Getting Started with OpenRouter</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium text-blue-400">1</div>
                  <div>
                    <p className="text-sm text-blue-300 font-medium">Create Account & Get API Key</p>
                    <p className="text-xs text-blue-400 mt-1">
                      Visit <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">OpenRouter Settings</a> to create your API key
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium text-blue-400">2</div>
                  <div>
                    <p className="text-sm text-blue-300 font-medium">Add Credits</p>
                    <p className="text-xs text-blue-400 mt-1">Add credits to your account to start using models</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium text-blue-400">3</div>
                  <div>
                    <p className="text-sm text-blue-300 font-medium">Start Building</p>
                    <p className="text-xs text-blue-400 mt-1">Try different models to find the best fit for your use case</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
