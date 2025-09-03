import React, { useState, useEffect } from 'react';
import { Switch } from '~/components/ui/Switch';
import { useSettings } from '~/lib/hooks/useSettings';
import { IconButton } from '~/components/ui/IconButton';
import { logStore } from '~/lib/stores/logs';
import { providerBaseUrlEnvKeys } from '~/utils/constants';

export function LMStudioTab() {
  const { providers, updateProviderSettings } = useSettings();
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const lmstudioProvider = providers['LMStudio'];
  
  // Get environment base URL if set
  const envBaseUrlKey = providerBaseUrlEnvKeys['LMStudio']?.baseUrlKey;
  const envBaseUrl = envBaseUrlKey ? import.meta.env[envBaseUrlKey] : undefined;

  const testConnection = async () => {
    if (!lmstudioProvider?.settings.enabled) return;
    
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    
    try {
      const baseUrl = lmstudioProvider.settings.baseUrl || envBaseUrl || 'http://localhost:1234';
      const response = await fetch(`${baseUrl}/v1/models`);
      
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus('success');
        logStore.logProvider(`LMStudio connection successful. Found ${data.data?.length || 0} models`, {
          provider: 'LMStudio',
          baseUrl,
          modelCount: data.data?.length || 0
        });
      } else {
        setConnectionStatus('error');
        logStore.logProvider(`LMStudio connection failed: ${response.status}`, {
          provider: 'LMStudio',
          baseUrl,
          status: response.status
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      logStore.logProvider(`LMStudio connection error: ${error}`, {
        provider: 'LMStudio',
        error: String(error)
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  useEffect(() => {
    if (lmstudioProvider?.settings.enabled) {
      // Auto-test connection when enabled
      testConnection();
    }
  }, [lmstudioProvider?.settings.enabled]);

  if (!lmstudioProvider) {
    return (
      <div className="text-center py-8">
        <p className="text-bolt-elements-textSecondary">LMStudio provider not found</p>
      </div>
    );
  }

  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case 'success':
        return (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <div className="i-ph:check-circle-fill w-4 h-4" />
            <span className="text-sm">Connected</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <div className="i-ph:x-circle-fill w-4 h-4" />
            <span className="text-sm">Connection failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-bolt-elements-textSecondary">
            <div className="i-ph:circle w-4 h-4" />
            <span className="text-sm">Not tested</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Provider Header */}
      <div className="flex items-center justify-between p-6 bg-bolt-elements-bg-depth-2 rounded-lg border border-bolt-elements-borderColor">
        <div className="flex items-center gap-4">
          <img
            src="/icons/LMStudio.svg"
            alt="LMStudio icon"
            className="w-12 h-12 dark:invert"
            onError={(e) => {
              e.currentTarget.src = '/icons/Default.svg';
            }}
          />
          <div>
            <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">LMStudio</h3>
            <p className="text-sm text-bolt-elements-textSecondary">
              Run AI models locally on your machine with LMStudio
            </p>
          </div>
        </div>
        <Switch
          checked={lmstudioProvider.settings.enabled}
          onCheckedChange={(enabled) => {
            updateProviderSettings('LMStudio', { 
              ...lmstudioProvider.settings, 
              enabled 
            });
          }}
        />
      </div>

      {/* Provider Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-bolt-elements-bg-depth-1 rounded-lg border border-bolt-elements-borderColor">
          <h4 className="font-medium text-bolt-elements-textPrimary mb-2">About LMStudio</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            LMStudio lets you run AI models locally on your computer. This gives you complete privacy and control over your data.
          </p>
        </div>
        <div className="p-4 bg-bolt-elements-bg-depth-1 rounded-lg border border-bolt-elements-borderColor">
          <h4 className="font-medium text-bolt-elements-textPrimary mb-2">Local Benefits</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            No internet required, complete privacy, no usage costs, and support for many open-source models.
          </p>
        </div>
      </div>

      {/* Base URL Configuration */}
      {lmstudioProvider.settings.enabled && (
        <div className="p-6 bg-bolt-elements-bg-depth-1 rounded-lg border border-bolt-elements-borderColor">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-bolt-elements-textPrimary">Server Configuration</h4>
            {getConnectionStatusDisplay()}
          </div>
          
          <p className="text-sm text-bolt-elements-textSecondary mb-4">
            Configure the base URL where your LMStudio server is running. Default is http://localhost:1234
          </p>

          {envBaseUrl && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
              <span className="text-sm text-green-800 dark:text-green-200">
                Environment URL: {envBaseUrl}
              </span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-2">
                {envBaseUrl ? 'Override Base URL:' : 'Base URL:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lmstudioProvider.settings.baseUrl || ''}
                  onChange={(e) => {
                    let newBaseUrl: string | undefined = e.target.value;
                    if (newBaseUrl && newBaseUrl.trim().length === 0) {
                      newBaseUrl = undefined;
                    }
                    updateProviderSettings('LMStudio', { 
                      ...lmstudioProvider.settings, 
                      baseUrl: newBaseUrl 
                    });
                    setConnectionStatus('idle');
                  }}
                  placeholder="http://localhost:1234"
                  className="flex-1 bg-white dark:bg-bolt-elements-background-depth-4 px-3 py-2 rounded-md border border-bolt-elements-borderColor focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus text-bolt-elements-textPrimary"
                />
                <IconButton
                  onClick={testConnection}
                  disabled={isTestingConnection}
                  title="Test Connection"
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 px-4"
                >
                  {isTestingConnection ? (
                    <div className="i-ph:spinner animate-spin w-4 h-4" />
                  ) : (
                    <div className="i-ph:link w-4 h-4" />
                  )}
                  <span className="ml-2 text-sm">Test</span>
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h4 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">⚙️ Setup Instructions</h4>
        <ol className="text-sm text-yellow-800 dark:text-yellow-300 space-y-2 list-decimal list-inside">
          <li>Download and install <a href="https://lmstudio.ai/" target="_blank" rel="noopener noreferrer" className="underline">LMStudio</a></li>
          <li>Download a model (e.g., Llama, Mistral, or CodeLlama)</li>
          <li>Start the local server in LMStudio (usually on port 1234)</li>
          <li>Test the connection using the button above</li>
        </ol>
      </div>

      {/* Troubleshooting */}
      <div className="p-4 bg-bolt-elements-bg-depth-1 rounded-lg border border-bolt-elements-borderColor">
        <h4 className="font-medium text-bolt-elements-textPrimary mb-2">Troubleshooting</h4>
        <ul className="text-sm text-bolt-elements-textSecondary space-y-1">
          <li>• Make sure LMStudio server is running and accessible</li>
          <li>• Check that the port number matches your LMStudio configuration</li>
          <li>• If using Docker, try replacing localhost with host.docker.internal</li>
          <li>• Ensure firewall allows connections to the specified port</li>
        </ul>
      </div>
    </div>
  );
}
