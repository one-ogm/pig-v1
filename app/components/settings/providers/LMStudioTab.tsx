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
  const [modelCount, setModelCount] = useState<number>(0);

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
        setModelCount(data.data?.length || 0);
        logStore.logProvider(`LMStudio connection successful. Found ${data.data?.length || 0} models`, {
          provider: 'LMStudio',
          baseUrl,
          modelCount: data.data?.length || 0,
        });
      } else {
        setConnectionStatus('error');
        setModelCount(0);
        logStore.logProvider(`LMStudio connection failed: ${response.status}`, {
          provider: 'LMStudio',
          baseUrl,
          status: response.status,
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      setModelCount(0);
      logStore.logProvider(`LMStudio connection error: ${error}`, {
        provider: 'LMStudio',
        error: String(error),
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <div className="i-ph:warning w-6 h-6 text-red-500" />
          </div>
          <p className="text-bolt-elements-textSecondary">LMStudio provider not found</p>
        </div>
      </div>
    );
  }

  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case 'success':
        return (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <div className="i-ph:check-circle-fill w-4 h-4" />
            <span className="text-sm font-medium">Connected ({modelCount} models)</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <div className="i-ph:x-circle-fill w-4 h-4" />
            <span className="text-sm font-medium">Connection failed</span>
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
    <div className="space-y-8">
      {/* Provider Header Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-bolt-elements-borderColor">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <img
                  src="/icons/LMStudio.svg"
                  alt="LMStudio icon"
                  className="w-10 h-10 dark:invert"
                  onError={(e) => {
                    e.currentTarget.src = '/icons/Default.svg';
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-bolt-elements-textPrimary">LMStudio</h3>
                  <span className="px-3 py-1 text-sm font-medium bg-purple-500/20 text-purple-400 rounded-full">
                    Private & Local
                  </span>
                </div>
                <p className="text-bolt-elements-textSecondary text-lg mb-3">
                  Run AI models locally on your machine with complete privacy and control
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-bolt-elements-textSecondary">Local Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-bolt-elements-textSecondary">No Internet Required</span>
                  </div>
                  {getConnectionStatusDisplay()}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-bolt-elements-textSecondary">Provider Status</p>
                  <p
                    className={`text-sm font-medium ${
                      lmstudioProvider.settings.enabled ? 'text-green-400' : 'text-bolt-elements-textTertiary'
                    }`}
                  >
                    {lmstudioProvider.settings.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <Switch
                  checked={lmstudioProvider.settings.enabled}
                  onCheckedChange={(enabled) => {
                    updateProviderSettings('LMStudio', {
                      ...lmstudioProvider.settings,
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
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <div className="i-ph:shield-check w-6 h-6 text-purple-400" />
          </div>
          <h4 className="font-semibold text-bolt-elements-textPrimary mb-2">Complete Privacy</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            Your data never leaves your machine. No cloud processing, no data collection, complete control.
          </p>
        </div>

        <div className="group p-6 rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor hover:border-bolt-elements-focus/50 transition-all duration-200">
          <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <div className="i-ph:wifi-slash w-6 h-6 text-green-400" />
          </div>
          <h4 className="font-semibold text-bolt-elements-textPrimary mb-2">Offline Capable</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            Work without internet connection. Perfect for secure environments or unreliable connectivity.
          </p>
        </div>

        <div className="group p-6 rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor hover:border-bolt-elements-focus/50 transition-all duration-200">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <div className="i-ph:currency-circle-dollar w-6 h-6 text-blue-400" />
          </div>
          <h4 className="font-semibold text-bolt-elements-textPrimary mb-2">No Usage Costs</h4>
          <p className="text-sm text-bolt-elements-textSecondary">
            Once downloaded, use models as much as you want without per-token or API costs.
          </p>
        </div>
      </div>

      {/* Server Configuration */}
      {lmstudioProvider.settings.enabled && (
        <div className="rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor overflow-hidden">
          <div className="px-6 py-4 bg-bolt-elements-bg-depth-3 border-b border-bolt-elements-borderColor">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-bolt-elements-focus/20 flex items-center justify-center">
                  <div className="i-ph:gear w-4 h-4 text-bolt-elements-focus" />
                </div>
                <div>
                  <h4 className="font-semibold text-bolt-elements-textPrimary">Server Configuration</h4>
                  <p className="text-sm text-bolt-elements-textSecondary">
                    Configure the connection to your local LMStudio server
                  </p>
                </div>
              </div>
              {getConnectionStatusDisplay()}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {envBaseUrl && (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="i-ph:check-circle w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Environment URL Detected</p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">{envBaseUrl}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-3">
                {envBaseUrl ? 'Override Base URL:' : 'Server Base URL:'}
              </label>
              <div className="flex gap-3">
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
                      baseUrl: newBaseUrl,
                    });
                    setConnectionStatus('idle');
                    setModelCount(0);
                  }}
                  placeholder="http://localhost:1234"
                  className="flex-1 bg-white dark:bg-bolt-elements-background-depth-4 px-4 py-3 rounded-lg border border-bolt-elements-borderColor focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus text-bolt-elements-textPrimary"
                />
                <IconButton
                  onClick={testConnection}
                  disabled={isTestingConnection}
                  title="Test Connection"
                  className="bg-bolt-elements-focus/10 hover:bg-bolt-elements-focus/20 text-bolt-elements-focus px-6 py-3 rounded-lg border border-bolt-elements-focus/20 hover:border-bolt-elements-focus/40 transition-all duration-200"
                >
                  {isTestingConnection ? (
                    <div className="i-ph:spinner animate-spin w-4 h-4" />
                  ) : (
                    <div className="i-ph:link w-4 h-4" />
                  )}
                  <span className="ml-2 text-sm font-medium">Test Connection</span>
                </IconButton>
              </div>
              <p className="text-xs text-bolt-elements-textTertiary mt-2">
                Default LMStudio server runs on localhost:1234. Make sure the server is running before testing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      <div className="rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <div className="i-ph:rocket-launch w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-purple-200 mb-4">Setup LMStudio in 4 Easy Steps</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">
                    1
                  </div>
                  <div>
                    <p className="text-sm text-purple-300 font-medium mb-1">Download & Install LMStudio</p>
                    <p className="text-xs text-purple-400">
                      Get LMStudio from{' '}
                      <a
                        href="https://lmstudio.ai/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-purple-300"
                      >
                        lmstudio.ai
                      </a>{' '}
                      and install on your system
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">
                    2
                  </div>
                  <div>
                    <p className="text-sm text-purple-300 font-medium mb-1">Download a Model</p>
                    <p className="text-xs text-purple-400">
                      Browse and download models like Llama, Mistral, CodeLlama, or Qwen from the built-in model browser
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">
                    3
                  </div>
                  <div>
                    <p className="text-sm text-purple-300 font-medium mb-1">Start the Local Server</p>
                    <p className="text-xs text-purple-400">
                      Launch the local server in LMStudio (usually accessible at localhost:1234)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400">
                    4
                  </div>
                  <div>
                    <p className="text-sm text-purple-300 font-medium mb-1">Test Connection</p>
                    <p className="text-xs text-purple-400">
                      Use the "Test Connection" button above to verify everything is working properly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="rounded-xl bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor overflow-hidden">
        <div className="px-6 py-4 bg-bolt-elements-bg-depth-3 border-b border-bolt-elements-borderColor">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <div className="i-ph:wrench w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h4 className="font-semibold text-bolt-elements-textPrimary">Troubleshooting</h4>
              <p className="text-sm text-bolt-elements-textSecondary">Common issues and solutions</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                icon: 'i-ph:desktop',
                issue: 'Connection Refused',
                solution: 'Make sure LMStudio server is running and accessible',
              },
              {
                icon: 'i-ph:number-square-one',
                issue: 'Wrong Port',
                solution: 'Check that the port number matches your LMStudio configuration (default: 1234)',
              },
              {
                icon: 'i-ph:globe',
                issue: 'Docker Issues',
                solution: 'If using Docker, try replacing localhost with host.docker.internal',
              },
              {
                icon: 'i-ph:shield',
                issue: 'Firewall',
                solution: 'Ensure firewall allows connections to the specified port',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-bolt-elements-bg-depth-1 border border-bolt-elements-borderColor"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-bolt-elements-focus/20 flex items-center justify-center">
                  <div className={`${item.icon} w-4 h-4 text-bolt-elements-focus`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-bolt-elements-textPrimary">{item.issue}</p>
                  <p className="text-xs text-bolt-elements-textSecondary mt-1">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
