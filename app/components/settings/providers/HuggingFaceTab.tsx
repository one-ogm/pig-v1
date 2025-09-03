import React, { useState } from 'react';
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
    getDynamicModels: () => Promise.resolve([]),
  };

  if (!huggingfaceProvider) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <div className="i-ph:warning w-6 h-6 text-red-500" />
          </div>
          <p className="text-bolt-elements-textSecondary">HuggingFace provider not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Provider Header Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 via-yellow-500/10 to-red-500/10 border border-bolt-elements-borderColor">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <img
                  src="/icons/HuggingFace.svg"
                  alt="HuggingFace icon"
                  className="w-10 h-10 dark:invert"
                  onError={(e) => {
                    e.currentTarget.src = '/icons/Default.svg';
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-bolt-elements-textPrimary">HuggingFace</h3>
                  <span className="px-3 py-1 text-sm font-medium bg-green-500/20 text-green-400 rounded-full">
                    Free Access
                  </span>
                </div>
                <p className="text-bolt-elements-textSecondary text-lg mb-3">
                  Access thousands of open-source AI models hosted on HuggingFace Hub
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs bg-bolt-elements-bg-depth-3 text-bolt-elements-textSecondary rounded-md">
                    Qwen2.5-Coder
                  </span>
                  <span className="px-2 py-1 text-xs bg-bolt-elements-bg-depth-3 text-bolt-elements-textSecondary rounded-md">
                    CodeLlama
                  </span>
                  <span className="px-2 py-1 text-xs bg-bolt-elements-bg-depth-3 text-bolt-elements-textSecondary rounded-md">
                    Llama-3.1
                  </span>
                  <span className="px-2 py-1 text-xs bg-bolt-elements-bg-depth-3 text-bolt-elements-textSecondary rounded-md">
                    +1000s more
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-bolt-elements-textSecondary">Provider Status</p>
                  <p
                    className={`text-sm font-medium ${
                      huggingfaceProvider.settings.enabled ? 'text-green-400' : 'text-bolt-elements-textTertiary'
                    }`}
                  >
                    {huggingfaceProvider.settings.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <Switch
                  checked={huggingfaceProvider.settings.enabled}
                  onCheckedChange={(enabled) => {
                    updateProviderSettings('HuggingFace', {
                      ...huggingfaceProvider.settings,
                      enabled,
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
            <div className="i-ph:gift w-6 h-6 text-green-400" />
          </div>
          <h4 className="font-semibold text-bolt-elements-textPrimary mb-2">Free to Use</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            Access thousands of open-source models with a free API token. No usage fees required.
          </p>
        </div>

        <div className="group p-6 rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor hover:border-bolt-elements-focus/50 transition-all duration-200">
          <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <div className="i-ph:code w-6 h-6 text-orange-400" />
          </div>
          <h4 className="font-semibold text-bolt-elements-textPrimary mb-2">Code-Specialized</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            Many models are specifically trained for coding tasks, including Qwen2.5-Coder and CodeLlama.
          </p>
        </div>

        <div className="group p-6 rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor hover:border-bolt-elements-focus/50 transition-all duration-200">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <div className="i-ph:heart w-6 h-6 text-blue-400" />
          </div>
          <h4 className="font-semibold text-bolt-elements-textPrimary mb-2">Open Source</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            All models are open-source and community-driven, ensuring transparency and continuous improvement.
          </p>
        </div>
      </div>

      {/* Popular Models Showcase */}
      <div className="rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor overflow-hidden">
        <div className="px-6 py-4 bg-bolt-elements-bg-depth-3 border-b border-bolt-elements-borderColor">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <div className="i-ph:star w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h4 className="font-semibold text-bolt-elements-textPrimary">Popular Models</h4>
              <p className="text-sm text-bolt-elements-textSecondary">
                Top performing open-source models available on HuggingFace
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Qwen/Qwen2.5-Coder-32B-Instruct', description: 'Advanced coding assistant', icon: 'i-ph:code' },
              {
                name: 'meta-llama/Llama-3.1-70B-Instruct',
                description: 'General purpose large model',
                icon: 'i-ph:chat-circle',
              },
              {
                name: 'codellama/CodeLlama-34b-Instruct-hf',
                description: "Meta's code generation model",
                icon: 'i-ph:brackets-curly',
              },
              { name: '01-ai/Yi-1.5-34B-Chat', description: 'Bilingual conversational AI', icon: 'i-ph:globe' },
            ].map((model, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-bolt-elements-bg-depth-1 border border-bolt-elements-borderColor hover:border-bolt-elements-focus/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-bolt-elements-focus/20 flex items-center justify-center">
                    <div className={`${model.icon} w-4 h-4 text-bolt-elements-focus`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-bolt-elements-textPrimary text-sm truncate">{model.name}</p>
                    <p className="text-xs text-bolt-elements-textSecondary mt-1">{model.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Key Configuration */}
      {huggingfaceProvider.settings.enabled && (
        <div className="rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor overflow-hidden">
          <div className="px-6 py-4 bg-bolt-elements-bg-depth-3 border-b border-bolt-elements-borderColor">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-bolt-elements-focus/20 flex items-center justify-center">
                <div className="i-ph:key w-4 h-4 text-bolt-elements-focus" />
              </div>
              <div>
                <h4 className="font-semibold text-bolt-elements-textPrimary">API Token Configuration</h4>
                <p className="text-sm text-bolt-elements-textSecondary">
                  Configure your HuggingFace API token for model access
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <APIKeyManager provider={providerInfo} apiKey={apiKey} setApiKey={setApiKey} />
          </div>
        </div>
      )}

      {/* Getting Started Section */}
      <div className="rounded-xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <div className="i-ph:rocket-launch w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-orange-200 mb-3">Getting Started with HuggingFace</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-medium text-orange-400">
                    1
                  </div>
                  <div>
                    <p className="text-sm text-orange-300 font-medium">Create Free Account</p>
                    <p className="text-xs text-orange-400 mt-1">
                      Sign up at{' '}
                      <a
                        href="https://huggingface.co"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-orange-300"
                      >
                        HuggingFace.co
                      </a>{' '}
                      for free access
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-medium text-orange-400">
                    2
                  </div>
                  <div>
                    <p className="text-sm text-orange-300 font-medium">Generate API Token</p>
                    <p className="text-xs text-orange-400 mt-1">
                      Visit{' '}
                      <a
                        href="https://huggingface.co/settings/tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-orange-300"
                      >
                        Token Settings
                      </a>{' '}
                      and create a "Read" access token
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-medium text-orange-400">
                    3
                  </div>
                  <div>
                    <p className="text-sm text-orange-300 font-medium">Start Exploring</p>
                    <p className="text-xs text-orange-400 mt-1">
                      Browse thousands of models and find the perfect one for your project
                    </p>
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
