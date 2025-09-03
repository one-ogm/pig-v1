import React, { useState } from 'react';
import { HuggingFaceTab } from './HuggingFaceTab';
import { OpenRouterTab } from './OpenRouterTab';
import { LMStudioTab } from './LMStudioTab';

type TabId = 'huggingface' | 'openrouter' | 'lmstudio';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  description: string;
  badge?: string;
}

const tabs: Tab[] = [
  {
    id: 'huggingface',
    label: 'HuggingFace',
    icon: '/icons/HuggingFace.svg',
    description: 'Open-source models',
    badge: 'Free',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    icon: '/icons/OpenRouter.svg',
    description: 'Unified API access',
    badge: 'Popular',
  },
  {
    id: 'lmstudio',
    label: 'LMStudio',
    icon: '/icons/LMStudio.svg',
    description: 'Local models',
    badge: 'Private',
  },
];

export default function ProvidersTab() {
  const [activeTab, setActiveTab] = useState<TabId>('openrouter');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'huggingface':
        return <HuggingFaceTab />;
      case 'openrouter':
        return <OpenRouterTab />;
      case 'lmstudio':
        return <LMStudioTab />;
      default:
        return <OpenRouterTab />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-bolt-elements-borderColor bg-bolt-elements-bg-depth-1">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-bolt-elements-textPrimary mb-2">Provider Settings</h2>
          <p className="text-bolt-elements-textSecondary">
            Configure your AI providers and API keys. Each provider offers different models and capabilities.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 bg-bolt-elements-bg-depth-1 border-b border-bolt-elements-borderColor">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative min-w-0 flex-1 sm:flex-none sm:min-w-[200px] px-4 py-4 text-left transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-bolt-elements-textPrimary'
                    : 'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary'
                }`}
              >
                {/* Tab Content */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-bolt-elements-focus/20'
                        : 'bg-bolt-elements-bg-depth-3 group-hover:bg-bolt-elements-bg-depth-4'
                    }`}
                  >
                    <img
                      src={tab.icon}
                      alt={`${tab.label} icon`}
                      className="w-5 h-5 dark:invert"
                      onError={(e) => {
                        e.currentTarget.src = '/icons/Default.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{tab.label}</span>
                      {tab.badge && (
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            tab.badge === 'Popular'
                              ? 'bg-blue-500/20 text-blue-400'
                              : tab.badge === 'Free'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-purple-500/20 text-purple-400'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-bolt-elements-textTertiary truncate">{tab.description}</p>
                  </div>
                </div>

                {/* Active Tab Indicator */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-bolt-elements-focus scale-x-100'
                      : 'bg-transparent scale-x-0 group-hover:bg-bolt-elements-borderColor group-hover:scale-x-100'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="min-h-[500px]">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
