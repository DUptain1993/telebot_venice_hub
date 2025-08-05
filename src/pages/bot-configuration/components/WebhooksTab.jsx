import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const WebhooksTab = ({ webhookConfig, onWebhookConfigChange, onSave, hasUnsavedChanges }) => {
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testPayload, setTestPayload] = useState('');

  const sslCertificateOptions = [
    { value: 'auto', label: 'Auto-generated (Recommended)' },
    { value: 'custom', label: 'Custom Certificate' },
    { value: 'none', label: 'No SSL (Development Only)' }
  ];

  const handleConfigChange = (field, value) => {
    onWebhookConfigChange({ ...webhookConfig, [field]: value });
  };

  const testWebhook = async () => {
    if (!webhookConfig?.url) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    // Simulate webhook testing
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate simulation
      setTestResult({
        success: isSuccess,
        status: isSuccess ? 200 : 500,
        message: isSuccess ? 'Webhook is responding correctly' : 'Connection failed - check URL and SSL configuration',
        responseTime: Math.floor(Math.random() * 500) + 100,
        timestamp: new Date()?.toISOString()
      });
      setIsTesting(false);
    }, 2000);
  };

  const generateTestPayload = () => {
    const payload = {
      update_id: 123456789,
      message: {
        message_id: 1,
        from: {
          id: 987654321,
          is_bot: false,
          first_name: "Test",
          last_name: "User",
          username: "testuser"
        },
        chat: {
          id: 987654321,
          first_name: "Test",
          last_name: "User",
          username: "testuser",
          type: "private"
        },
        date: Math.floor(Date.now() / 1000),
        text: "/start"
      }
    };
    setTestPayload(JSON.stringify(payload, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* Webhook Configuration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Webhook" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Webhook Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <Input
            label="Webhook URL"
            type="url"
            placeholder="https://your-domain.com/webhook/bot-token"
            description="HTTPS endpoint where Telegram will send updates"
            value={webhookConfig?.url || ''}
            onChange={(e) => handleConfigChange('url', e?.target?.value)}
            required
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Select
              label="SSL Certificate"
              description="Choose SSL certificate configuration"
              options={sslCertificateOptions}
              value={webhookConfig?.sslType || 'auto'}
              onChange={(value) => handleConfigChange('sslType', value)}
            />
            
            <Input
              label="Max Connections"
              type="number"
              placeholder="40"
              description="Maximum allowed simultaneous connections (1-100)"
              value={webhookConfig?.maxConnections || ''}
              onChange={(e) => handleConfigChange('maxConnections', e?.target?.value)}
              min="1"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Allowed Updates
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { key: 'message', label: 'Messages' },
                { key: 'edited_message', label: 'Edited Messages' },
                { key: 'channel_post', label: 'Channel Posts' },
                { key: 'callback_query', label: 'Callback Queries' },
                { key: 'inline_query', label: 'Inline Queries' },
                { key: 'shipping_query', label: 'Shipping Queries' },
                { key: 'pre_checkout_query', label: 'Pre-checkout' },
                { key: 'poll', label: 'Polls' }
              ]?.map((update) => (
                <label key={update?.key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={webhookConfig?.allowedUpdates?.includes(update?.key) || false}
                    onChange={(e) => {
                      const current = webhookConfig?.allowedUpdates || [];
                      const updated = e?.target?.checked
                        ? [...current, update?.key]
                        : current?.filter(u => u !== update?.key);
                      handleConfigChange('allowedUpdates', updated);
                    }}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{update?.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Webhook Testing */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="TestTube" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Webhook Testing</h3>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateTestPayload}
              iconName="Code"
              iconPosition="left"
            >
              Generate Test Payload
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={testWebhook}
              loading={isTesting}
              iconName="Play"
              iconPosition="left"
              disabled={!webhookConfig?.url}
            >
              Test Webhook
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Payload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Test Payload
            </label>
            <textarea
              value={testPayload}
              onChange={(e) => setTestPayload(e?.target?.value)}
              placeholder="Click 'Generate Test Payload' to create sample data"
              rows={12}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-xs"
            />
          </div>
          
          {/* Test Results */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Test Results
            </label>
            <div className="border border-border rounded-md bg-background p-4 h-80 overflow-y-auto">
              {isTesting ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-sm text-muted-foreground">Testing webhook connection...</p>
                  </div>
                </div>
              ) : testResult ? (
                <div className="space-y-3">
                  <div className={`flex items-center space-x-2 ${
                    testResult?.success ? 'text-success' : 'text-destructive'
                  }`}>
                    <Icon 
                      name={testResult?.success ? "CheckCircle" : "XCircle"} 
                      size={16} 
                    />
                    <span className="font-medium">
                      {testResult?.success ? 'Success' : 'Failed'}
                    </span>
                    <span className="text-sm">({testResult?.status})</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Message:</span>
                      <p className="text-foreground mt-1">{testResult?.message}</p>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Response Time:</span>
                      <span className="text-foreground ml-2">{testResult?.responseTime}ms</span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Timestamp:</span>
                      <span className="text-foreground ml-2">
                        {new Date(testResult.timestamp)?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Icon name="TestTube" size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No test results yet</p>
                    <p className="text-xs mt-1">Click 'Test Webhook' to run connectivity test</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Webhook Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Activity" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Webhook Status</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Globe" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Current URL</span>
            </div>
            <p className="text-xs text-muted-foreground break-all">
              {webhookConfig?.url || 'Not configured'}
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Shield" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">SSL Status</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                webhookConfig?.sslType === 'none' ? 'bg-warning' : 'bg-success'
              }`} />
              <span className="text-xs text-muted-foreground">
                {webhookConfig?.sslType === 'none' ? 'Disabled' : 'Enabled'}
              </span>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Zap" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Last Test</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {testResult ? new Date(testResult.timestamp)?.toLocaleString() : 'Never tested'}
            </p>
          </div>
        </div>
      </div>
      {/* Save Actions */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">You have unsaved webhook changes</span>
          </div>
          
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Webhook Config
          </Button>
        </div>
      )}
    </div>
  );
};

export default WebhooksTab;