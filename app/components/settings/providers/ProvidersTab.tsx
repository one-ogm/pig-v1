import React, { useState } from 'react';
import { HuggingFaceTab } from './HuggingFaceTab';
import { OpenRouterTab } from './OpenRouterTab';
import { LMStudioTab } from './LMStudioTab';

type TabId = 'huggingface' | 'openrouter' | 'lmstudio';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'huggingface', label: 'HuggingFace', icon: '/icons/HuggingFace.svg' },
  { id: 'openrouter', label: 'OpenRouter', icon: '/icons/OpenRouter.svg' },
  { id: 'lmstudio', label: 'LMStudio', icon: '/icons/LMStudio.svg' },
];

export default function ProvidersTab() {
  const [activeTab, setActiveTab] = useState<TabId>('huggingface');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'huggingface':
        return <HuggingFaceTab />;
      case 'openrouter':
        return <OpenRouterTab />;
      case 'lmstudio':
        return <LMStudioTab />;
      default:
        return <HuggingFaceTab />;
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-bolt-elements-textPrimary mb-2">Provider Settings</h2>
        <p className="text-sm text-bolt-elements-textSecondary">
          Configure your AI providers and API keys. Each provider offers different models and capabilities.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-bolt-elements-borderColor mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-bolt-elements-focus text-bolt-elements-textPrimary bg-bolt-elements-bg-depth-2'
                : 'border-transparent text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:border-bolt-elements-borderColor'
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
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
}
