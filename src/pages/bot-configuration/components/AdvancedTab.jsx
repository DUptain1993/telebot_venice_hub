import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedTab = ({ advancedConfig, onAdvancedConfigChange, onSave, hasUnsavedChanges }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidatingApiKey, setIsValidatingApiKey] = useState(false);
  const [apiKeyValidation, setApiKeyValidation] = useState({ isValid: null, message: '' });

  const logLevelOptions = [
    { value: 'error', label: 'Error Only' },
    { value: 'warn', label: 'Warnings & Errors' },
    { value: 'info', label: 'Info, Warnings & Errors' },
    { value: 'debug', label: 'All Messages (Debug)' }
  ];

  const rateLimitOptions = [
    { value: '1', label: '1 message per second' },
    { value: '5', label: '5 messages per second' },
    { value: '10', label: '10 messages per second' },
    { value: '30', label: '30 messages per second' },
    { value: 'unlimited', label: 'No limit (Not recommended)' }
  ];

  const handleConfigChange = (field, value) => {
    onAdvancedConfigChange({ ...advancedConfig, [field]: value });
    
    if (field === 'veniceApiKey') {
      setApiKeyValidation({ isValid: null, message: '' });
    }
  };

  const validateApiKey = async () => {
    if (!advancedConfig?.veniceApiKey) {
      setApiKeyValidation({ isValid: false, message: 'API key is required' });
      return;
    }

    setIsValidatingApiKey(true);
    
    // Simulate API key validation
    setTimeout(() => {
      const isValid = advancedConfig?.veniceApiKey?.length >= 32;
      setApiKeyValidation({
        isValid: !!isValid,
        message: isValid ? 'API key is valid and active' : 'Invalid API key format or expired'
      });
      setIsValidatingApiKey(false);
    }, 1500);
  };

  const generateApiKey = () => {
    // Simulate API key generation
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'vn_';
    for (let i = 0; i < 48; i++) {
      result += chars?.charAt(Math.floor(Math.random() * chars?.length));
    }
    handleConfigChange('veniceApiKey', result);
  };

  return (
    <div className="space-y-6">
      {/* Venice AI Integration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Brain" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Venice AI Integration</h3>
        </div>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable Venice AI Assistant"
            description="Allow Venice AI to provide coding assistance and bot optimization suggestions"
            checked={advancedConfig?.enableVeniceAI || false}
            onChange={(e) => handleConfigChange('enableVeniceAI', e?.target?.checked)}
          />
          
          {advancedConfig?.enableVeniceAI && (
            <div className="space-y-4 pl-6 border-l-2 border-primary/20">
              <div className="relative">
                <Input
                  label="Venice AI API Key"
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your Venice AI API key"
                  description="Get your API key from Venice AI dashboard"
                  value={advancedConfig?.veniceApiKey || ''}
                  onChange={(e) => handleConfigChange('veniceApiKey', e?.target?.value)}
                  error={apiKeyValidation?.isValid === false ? apiKeyValidation?.message : ''}
                  required
                  className="font-mono text-sm"
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-8 w-6 h-6"
                >
                  <Icon name={showApiKey ? "EyeOff" : "Eye"} size={14} />
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={validateApiKey}
                  loading={isValidatingApiKey}
                  iconName="CheckCircle"
                  iconPosition="left"
                  disabled={!advancedConfig?.veniceApiKey}
                >
                  Validate Key
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateApiKey}
                  iconName="Key"
                  iconPosition="left"
                >
                  Generate Test Key
                </Button>
                
                {apiKeyValidation?.isValid === true && (
                  <div className="flex items-center space-x-2 text-success">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-sm font-medium">{apiKeyValidation?.message}</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Checkbox
                  label="Auto Code Review"
                  description="Automatically review bot code for improvements"
                  checked={advancedConfig?.autoCodeReview || false}
                  onChange={(e) => handleConfigChange('autoCodeReview', e?.target?.checked)}
                />
                
                <Checkbox
                  label="Performance Suggestions"
                  description="Get AI-powered performance optimization tips"
                  checked={advancedConfig?.performanceSuggestions || false}
                  onChange={(e) => handleConfigChange('performanceSuggestions', e?.target?.checked)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Rate Limiting */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Gauge" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Rate Limiting</h3>
        </div>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable Rate Limiting"
            description="Protect your bot from spam and excessive requests"
            checked={advancedConfig?.enableRateLimit || false}
            onChange={(e) => handleConfigChange('enableRateLimit', e?.target?.checked)}
          />
          
          {advancedConfig?.enableRateLimit && (
            <div className="space-y-4 pl-6 border-l-2 border-primary/20">
              <Select
                label="Rate Limit"
                description="Maximum messages per user per second"
                options={rateLimitOptions}
                value={advancedConfig?.rateLimit || '5'}
                onChange={(value) => handleConfigChange('rateLimit', value)}
              />
              
              <Input
                label="Burst Limit"
                type="number"
                placeholder="10"
                description="Maximum burst messages allowed before rate limiting kicks in"
                value={advancedConfig?.burstLimit || ''}
                onChange={(e) => handleConfigChange('burstLimit', e?.target?.value)}
                min="1"
                max="100"
              />
              
              <Input
                label="Cooldown Period (seconds)"
                type="number"
                placeholder="60"
                description="How long users must wait after hitting rate limit"
                value={advancedConfig?.cooldownPeriod || ''}
                onChange={(e) => handleConfigChange('cooldownPeriod', e?.target?.value)}
                min="1"
                max="3600"
              />
            </div>
          )}
        </div>
      </div>
      {/* Logging Configuration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Logging Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <Select
            label="Log Level"
            description="Choose what types of events to log"
            options={logLevelOptions}
            value={advancedConfig?.logLevel || 'info'}
            onChange={(value) => handleConfigChange('logLevel', value)}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Checkbox
              label="Log User Messages"
              description="Store user messages for debugging (privacy sensitive)"
              checked={advancedConfig?.logUserMessages || false}
              onChange={(e) => handleConfigChange('logUserMessages', e?.target?.checked)}
            />
            
            <Checkbox
              label="Log Bot Responses"
              description="Store bot responses for analysis"
              checked={advancedConfig?.logBotResponses || false}
              onChange={(e) => handleConfigChange('logBotResponses', e?.target?.checked)}
            />
            
            <Checkbox
              label="Log Webhook Events"
              description="Store webhook events and payloads"
              checked={advancedConfig?.logWebhookEvents || false}
              onChange={(e) => handleConfigChange('logWebhookEvents', e?.target?.checked)}
            />
            
            <Checkbox
              label="Log Errors Only"
              description="Only log errors and critical issues"
              checked={advancedConfig?.logErrorsOnly || false}
              onChange={(e) => handleConfigChange('logErrorsOnly', e?.target?.checked)}
            />
          </div>
          
          <Input
            label="Log Retention (days)"
            type="number"
            placeholder="30"
            description="How long to keep logs before automatic deletion"
            value={advancedConfig?.logRetention || ''}
            onChange={(e) => handleConfigChange('logRetention', e?.target?.value)}
            min="1"
            max="365"
          />
        </div>
      </div>
      {/* Security Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Checkbox
              label="Validate Webhook Signature"
              description="Verify that webhook requests come from Telegram"
              checked={advancedConfig?.validateWebhookSignature || false}
              onChange={(e) => handleConfigChange('validateWebhookSignature', e?.target?.checked)}
            />
            
            <Checkbox
              label="Block Unknown Users"
              description="Only allow interactions from known users"
              checked={advancedConfig?.blockUnknownUsers || false}
              onChange={(e) => handleConfigChange('blockUnknownUsers', e?.target?.checked)}
            />
            
            <Checkbox
              label="Enable IP Whitelist"
              description="Only accept requests from whitelisted IP addresses"
              checked={advancedConfig?.enableIpWhitelist || false}
              onChange={(e) => handleConfigChange('enableIpWhitelist', e?.target?.checked)}
            />
            
            <Checkbox
              label="Encrypt Stored Data"
              description="Encrypt sensitive data at rest"
              checked={advancedConfig?.encryptStoredData || false}
              onChange={(e) => handleConfigChange('encryptStoredData', e?.target?.checked)}
            />
          </div>
          
          {advancedConfig?.enableIpWhitelist && (
            <div className="pl-6 border-l-2 border-primary/20">
              <label className="block text-sm font-medium text-foreground mb-2">
                Whitelisted IP Addresses
              </label>
              <textarea
                placeholder="Enter IP addresses, one per line&#10;149.154.160.0/20&#10;91.108.4.0/22"
                value={advancedConfig?.ipWhitelist || ''}
                onChange={(e) => handleConfigChange('ipWhitelist', e?.target?.value)}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include Telegram's IP ranges for webhook functionality
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Save Actions */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">You have unsaved advanced configuration changes</span>
          </div>
          
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Advanced Config
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedTab;