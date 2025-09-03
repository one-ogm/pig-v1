import React, { useState, useEffect, useCallback } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import type { ProviderInfo } from '~/types/model';
import Cookies from 'js-cookie';

interface APIKeyManagerProps {
  provider: ProviderInfo;
  apiKey: string;
  setApiKey: (key: string) => void;
  getApiKeyLink?: string;
  labelForGetApiKey?: string;
}

// cache which stores whether the provider's API key is set via environment variable or database
const providerKeyStatusCache: Record<string, { isSet: boolean; source: string | null }> = {};

const apiKeyMemoizeCache: { [k: string]: Record<string, string> } = {};

export function getApiKeysFromCookies() {
  const storedApiKeys = Cookies.get('apiKeys');
  let parsedKeys: Record<string, string> = {};

  if (storedApiKeys) {
    parsedKeys = apiKeyMemoizeCache[storedApiKeys];

    if (!parsedKeys) {
      parsedKeys = apiKeyMemoizeCache[storedApiKeys] = JSON.parse(storedApiKeys);
    }
  }

  return parsedKeys;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const APIKeyManager: React.FC<APIKeyManagerProps> = ({ provider, apiKey, setApiKey }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [keyStatus, setKeyStatus] = useState<{ isSet: boolean; source: string | null }>({ isSet: false, source: null });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState('');

  // Load API key from MongoDB when provider changes
  useEffect(() => {
    loadApiKeyFromDatabase();
  }, [provider.name]);

  const loadApiKeyFromDatabase = useCallback(async () => {
    try {
      const response = await fetch(`/api/tokens?provider=${encodeURIComponent(provider.name)}`);
      const data = await response.json();
      
      if (data.apiKey) {
        setCurrentApiKey(data.apiKey);
        setApiKey(data.apiKey);
        setTempKey(data.apiKey);
      } else {
        // Fallback to cookies
        const savedKeys = getApiKeysFromCookies();
        const savedKey = savedKeys[provider.name] || '';
        setCurrentApiKey(savedKey);
        setApiKey(savedKey);
        setTempKey(savedKey);
      }
    } catch (error) {
      console.error('Failed to load API key from database:', error);
      // Fallback to cookies
      const savedKeys = getApiKeysFromCookies();
      const savedKey = savedKeys[provider.name] || '';
      setCurrentApiKey(savedKey);
      setApiKey(savedKey);
      setTempKey(savedKey);
    }
    
    setIsEditing(false);
  }, [provider.name, setApiKey]);

  const checkApiKeyStatus = useCallback(async () => {
    // Check cache first
    if (providerKeyStatusCache[provider.name]) {
      setKeyStatus(providerKeyStatusCache[provider.name]);
      return;
    }

    try {
      const response = await fetch(`/api/check-env-key?provider=${encodeURIComponent(provider.name)}`);
      const data = await response.json();
      const status = { isSet: data.isSet, source: data.source };

      // Cache the result
      providerKeyStatusCache[provider.name] = status;
      setKeyStatus(status);
    } catch (error) {
      console.error('Failed to check API key status:', error);
      setKeyStatus({ isSet: false, source: null });
    }
  }, [provider.name]);

  useEffect(() => {
    checkApiKeyStatus();
  }, [checkApiKeyStatus]);

  const handleSave = async () => {
    if (!tempKey.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      // Save to MongoDB
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: provider.name,
          apiKey: tempKey.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('API key saved to database:', result.message);
        
        // Update parent state
        setApiKey(tempKey);
        setCurrentApiKey(tempKey);
        
        // Also save to cookies as fallback
        const currentKeys = getApiKeysFromCookies();
        const newKeys = { ...currentKeys, [provider.name]: tempKey };
        Cookies.set('apiKeys', JSON.stringify(newKeys));
        
        // Clear cache to refresh status
        delete providerKeyStatusCache[provider.name];
        checkApiKeyStatus();
        
        setIsEditing(false);
      } else {
        const error = await response.json();
        console.error('Failed to save API key:', error.error);
        alert('Failed to save API key to database. Saving to cookies as fallback.');
        
        // Fallback to cookies only
        const currentKeys = getApiKeysFromCookies();
        const newKeys = { ...currentKeys, [provider.name]: tempKey };
        Cookies.set('apiKeys', JSON.stringify(newKeys));
        setApiKey(tempKey);
        setCurrentApiKey(tempKey);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Network error saving API key:', error);
      alert('Network error. Saving to cookies as fallback.');
      
      // Fallback to cookies only
      const currentKeys = getApiKeysFromCookies();
      const newKeys = { ...currentKeys, [provider.name]: tempKey };
      Cookies.set('apiKeys', JSON.stringify(newKeys));
      setApiKey(tempKey);
      setCurrentApiKey(tempKey);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusDisplay = () => {
    if (currentApiKey) {
      return (
        <>
          <div className="i-ph:check-circle-fill text-green-500 w-4 h-4" />
          <span className="text-xs text-green-500">Set via UI/Database</span>
        </>
      );
    } else if (keyStatus.isSet) {
      return (
        <>
          <div className="i-ph:check-circle-fill text-green-500 w-4 h-4" />
          <span className="text-xs text-green-500">
            Set via {keyStatus.source === 'database' ? 'Database' : 'Environment Variable'}
          </span>
        </>
      );
    } else {
      return (
        <>
          <div className="i-ph:x-circle-fill text-red-500 w-4 h-4" />
          <span className="text-xs text-red-500">Not Set (Please set via UI or ENV_VAR)</span>
        </>
      );
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-bolt-elements-textSecondary">{provider?.name} API Key:</span>
          {!isEditing && (
            <div className="flex items-center gap-2">
              {getStatusDisplay()}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={tempKey}
                placeholder="Enter API Key"
                onChange={(e) => setTempKey(e.target.value)}
                className="w-[300px] px-3 py-1.5 pr-10 text-sm rounded border border-bolt-elements-borderColor 
                          bg-bolt-elements-prompt-background text-bolt-elements-textPrimary 
                          focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus"
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide API Key" : "Show API Key"}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-bolt-elements-background-depth-3"
              >
                <div className={`${showPassword ? 'i-ph:eye-slash' : 'i-ph:eye'} w-4 h-4`} />
              </IconButton>
            </div>
            <IconButton
              onClick={handleSave}
              title="Save API Key"
              disabled={isSaving || !tempKey.trim()}
              className="bg-green-500/10 hover:bg-green-500/20 text-green-500 disabled:opacity-50"
            >
              <div className={`${isSaving ? 'i-ph:spinner animate-spin' : 'i-ph:check'} w-4 h-4`} />
            </IconButton>
            <IconButton
              onClick={() => {
                setIsEditing(false);
                setTempKey(currentApiKey);
                setShowPassword(false);
              }}
              title="Cancel"
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500"
            >
              <div className="i-ph:x w-4 h-4" />
            </IconButton>
          </div>
        ) : (
          <>
            {currentApiKey && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-bolt-elements-background-depth-3 rounded border border-bolt-elements-borderColor">
                <span className="text-xs text-bolt-elements-textSecondary font-mono">
                  {showPassword ? currentApiKey : maskApiKey(currentApiKey)}
                </span>
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide API Key" : "Show API Key"}
                  className="bg-transparent hover:bg-bolt-elements-background-depth-4 p-1"
                >
                  <div className={`${showPassword ? 'i-ph:eye-slash' : 'i-ph:eye'} w-3 h-3`} />
                </IconButton>
              </div>
            )}
            <IconButton
              onClick={() => setIsEditing(true)}
              title="Edit API Key"
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500"
            >
              <div className="i-ph:pencil-simple w-4 h-4" />
            </IconButton>
            {provider?.getApiKeyLink && !currentApiKey && (
              <IconButton
                onClick={() => window.open(provider?.getApiKeyLink)}
                title="Get API Key"
                className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 flex items-center gap-2"
              >
                <span className="text-xs whitespace-nowrap">{provider?.labelForGetApiKey || 'Get API Key'}</span>
                <div className={`${provider?.icon || 'i-ph:key'} w-4 h-4`} />
              </IconButton>
            )}
          </>
        )}
      </div>
    </div>
  );
};
