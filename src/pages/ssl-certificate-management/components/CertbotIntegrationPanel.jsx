import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CertbotIntegrationPanel = ({ onRenewCertificate, onScheduleRenewal }) => {
  const [renewalConfig, setRenewalConfig] = useState({
    domain: '',
    email: '',
    webroot: '/var/www/html',
    autoRenewal: true,
    renewalDays: 30,
    notificationEmail: true,
    webhookUrl: ''
  });

  const [isRenewing, setIsRenewing] = useState(false);
  const [renewalLogs, setRenewalLogs] = useState([]);

  const renewalFrequencyOptions = [
    { value: '7', label: 'Weekly (7 days)' },
    { value: '14', label: 'Bi-weekly (14 days)' },
    { value: '30', label: 'Monthly (30 days)' },
    { value: '60', label: 'Bi-monthly (60 days)' },
    { value: '90', label: 'Quarterly (90 days)' }
  ];

  const handleInputChange = (field, value) => {
    setRenewalConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleManualRenewal = async () => {
    setIsRenewing(true);
    setRenewalLogs([]);

    // Simulate renewal process with logs
    const logs = [
      "Initializing Certbot renewal process...",
      "Validating domain ownership...",
      "Requesting certificate from Let's Encrypt...",
      "Installing certificate...",
      "Configuring web server...",
      "Certificate renewal completed successfully!"
    ];

    for (let i = 0; i < logs?.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRenewalLogs(prev => [...prev, {
        timestamp: new Date()?.toLocaleTimeString(),
        message: logs?.[i],
        type: i === logs?.length - 1 ? 'success' : 'info'
      }]);
    }

    setIsRenewing(false);
    if (onRenewCertificate) {
      onRenewCertificate(renewalConfig);
    }
  };

  const handleScheduleRenewal = () => {
    if (onScheduleRenewal) {
      onScheduleRenewal(renewalConfig);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Bot" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Certbot Integration</h3>
          <p className="text-sm text-muted-foreground">Automated SSL certificate management</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Configuration Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Certificate Configuration</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Domain Name"
              type="text"
              placeholder="example.com"
              value={renewalConfig?.domain}
              onChange={(e) => handleInputChange('domain', e?.target?.value)}
              required
            />
            
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              value={renewalConfig?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              description="For renewal notifications"
              required
            />
          </div>

          <Input
            label="Webroot Path"
            type="text"
            placeholder="/var/www/html"
            value={renewalConfig?.webroot}
            onChange={(e) => handleInputChange('webroot', e?.target?.value)}
            description="Path for domain validation"
          />

          <Input
            label="Webhook URL (Optional)"
            type="url"
            placeholder="https://your-webhook-url.com"
            value={renewalConfig?.webhookUrl}
            onChange={(e) => handleInputChange('webhookUrl', e?.target?.value)}
            description="Notify external services on renewal"
          />
        </div>

        {/* Auto-Renewal Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Auto-Renewal Settings</h4>
          
          <div className="space-y-3">
            <Checkbox
              label="Enable automatic renewal"
              description="Automatically renew certificates before expiration"
              checked={renewalConfig?.autoRenewal}
              onChange={(e) => handleInputChange('autoRenewal', e?.target?.checked)}
            />

            {renewalConfig?.autoRenewal && (
              <div className="ml-6 space-y-4">
                <Select
                  label="Renewal Frequency"
                  options={renewalFrequencyOptions}
                  value={renewalConfig?.renewalDays}
                  onChange={(value) => handleInputChange('renewalDays', value)}
                  description="How often to check for renewal"
                />

                <Checkbox
                  label="Email notifications"
                  description="Send email notifications for renewal events"
                  checked={renewalConfig?.notificationEmail}
                  onChange={(e) => handleInputChange('notificationEmail', e?.target?.checked)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Manual Renewal Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Manual Renewal</h4>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="default"
              onClick={handleManualRenewal}
              disabled={isRenewing || !renewalConfig?.domain || !renewalConfig?.email}
              loading={isRenewing}
            >
              <Icon name="RotateCcw" size={16} className="mr-2" />
              {isRenewing ? 'Renewing...' : 'Renew Now'}
            </Button>

            <Button
              variant="outline"
              onClick={handleScheduleRenewal}
              disabled={!renewalConfig?.domain || !renewalConfig?.email}
            >
              <Icon name="Calendar" size={16} className="mr-2" />
              Schedule Renewal
            </Button>
          </div>

          {/* Renewal Logs */}
          {renewalLogs?.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-foreground">Renewal Progress</h5>
              <div className="bg-muted rounded-lg p-4 max-h-48 overflow-y-auto">
                {renewalLogs?.map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-2 last:mb-0">
                    <span className="text-xs text-muted-foreground font-mono">
                      {log?.timestamp}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={log?.type === 'success' ? 'CheckCircle' : 'Info'} 
                        size={12} 
                        className={log?.type === 'success' ? 'text-success' : 'text-primary'}
                      />
                      <span className="text-xs text-foreground">{log?.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Information */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Info" size={16} className="text-primary" />
            <h5 className="text-sm font-medium text-foreground">Certbot Status</h5>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium text-foreground">2.7.4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Check:</span>
              <span className="font-medium text-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status:</span>
              <div className="flex items-center space-x-1">
                <Icon name="CheckCircle" size={12} className="text-success" />
                <span className="font-medium text-success">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertbotIntegrationPanel;