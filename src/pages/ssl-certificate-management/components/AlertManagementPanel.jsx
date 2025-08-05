import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AlertManagementPanel = ({ onSaveAlerts }) => {
  const [alertSettings, setAlertSettings] = useState({
    renewalReminders: {
      enabled: true,
      daysBeforeExpiry: [30, 14, 7, 1],
      emailNotifications: true,
      webhookNotifications: false,
      slackNotifications: false
    },
    securityAlerts: {
      enabled: true,
      certificateErrors: true,
      handshakeFailures: true,
      securityGradeChanges: true,
      vulnerabilityDetection: true
    },
    deliveryChannels: {
      email: 'admin@example.com',
      webhookUrl: '',
      slackWebhook: ''
    },
    alertFrequency: 'immediate',
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    }
  });

  const [testAlert, setTestAlert] = useState({
    type: '',
    isRunning: false,
    result: null
  });

  const alertFrequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly Digest' },
    { value: 'daily', label: 'Daily Summary' },
    { value: 'weekly', label: 'Weekly Report' }
  ];

  const testAlertTypes = [
    { value: 'renewal-reminder', label: 'Renewal Reminder' },
    { value: 'security-alert', label: 'Security Alert' },
    { value: 'certificate-error', label: 'Certificate Error' },
    { value: 'handshake-failure', label: 'Handshake Failure' }
  ];

  const handleSettingChange = (category, field, value) => {
    setAlertSettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [field]: value
      }
    }));
  };

  const handleArraySettingChange = (category, field, value, checked) => {
    setAlertSettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [field]: checked 
          ? [...prev?.[category]?.[field], value]
          : prev?.[category]?.[field]?.filter(item => item !== value)
      }
    }));
  };

  const runTestAlert = async (alertType) => {
    setTestAlert({ type: alertType, isRunning: true, result: null });

    // Simulate sending test alert
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResult = {
      success: true,
      message: `Test ${alertType} sent successfully`,
      timestamp: new Date(),
      deliveredTo: []
    };

    // Add delivery channels based on settings
    if (alertSettings?.renewalReminders?.emailNotifications && alertSettings?.deliveryChannels?.email) {
      mockResult?.deliveredTo?.push(`Email: ${alertSettings?.deliveryChannels?.email}`);
    }
    if (alertSettings?.renewalReminders?.webhookNotifications && alertSettings?.deliveryChannels?.webhookUrl) {
      mockResult?.deliveredTo?.push('Webhook endpoint');
    }
    if (alertSettings?.renewalReminders?.slackNotifications && alertSettings?.deliveryChannels?.slackWebhook) {
      mockResult?.deliveredTo?.push('Slack channel');
    }

    setTestAlert({ type: alertType, isRunning: false, result: mockResult });
  };

  const handleSaveSettings = () => {
    if (onSaveAlerts) {
      onSaveAlerts(alertSettings);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Bell" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Alert Management</h3>
            <p className="text-sm text-muted-foreground">Configure SSL certificate notifications</p>
          </div>
        </div>
        <Button
          variant="default"
          onClick={handleSaveSettings}
        >
          <Icon name="Save" size={16} className="mr-2" />
          Save Settings
        </Button>
      </div>
      <div className="space-y-6">
        {/* Renewal Reminders */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={alertSettings?.renewalReminders?.enabled}
              onChange={(e) => handleSettingChange('renewalReminders', 'enabled', e?.target?.checked)}
            />
            <h4 className="font-medium text-foreground">Renewal Reminders</h4>
          </div>

          {alertSettings?.renewalReminders?.enabled && (
            <div className="ml-6 space-y-4">
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-foreground">Reminder Schedule</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[30, 14, 7, 3, 1]?.map(days => (
                    <div key={days} className="flex items-center space-x-2">
                      <Checkbox
                        checked={alertSettings?.renewalReminders?.daysBeforeExpiry?.includes(days)}
                        onChange={(e) => handleArraySettingChange('renewalReminders', 'daysBeforeExpiry', days, e?.target?.checked)}
                      />
                      <span className="text-sm text-foreground">{days} day{days !== 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-sm font-medium text-foreground">Delivery Methods</h5>
                <div className="space-y-2">
                  <Checkbox
                    label="Email notifications"
                    checked={alertSettings?.renewalReminders?.emailNotifications}
                    onChange={(e) => handleSettingChange('renewalReminders', 'emailNotifications', e?.target?.checked)}
                  />
                  <Checkbox
                    label="Webhook notifications"
                    checked={alertSettings?.renewalReminders?.webhookNotifications}
                    onChange={(e) => handleSettingChange('renewalReminders', 'webhookNotifications', e?.target?.checked)}
                  />
                  <Checkbox
                    label="Slack notifications"
                    checked={alertSettings?.renewalReminders?.slackNotifications}
                    onChange={(e) => handleSettingChange('renewalReminders', 'slackNotifications', e?.target?.checked)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Alerts */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={alertSettings?.securityAlerts?.enabled}
              onChange={(e) => handleSettingChange('securityAlerts', 'enabled', e?.target?.checked)}
            />
            <h4 className="font-medium text-foreground">Security Alerts</h4>
          </div>

          {alertSettings?.securityAlerts?.enabled && (
            <div className="ml-6 space-y-2">
              <Checkbox
                label="Certificate errors and validation failures"
                checked={alertSettings?.securityAlerts?.certificateErrors}
                onChange={(e) => handleSettingChange('securityAlerts', 'certificateErrors', e?.target?.checked)}
              />
              <Checkbox
                label="SSL handshake failures"
                checked={alertSettings?.securityAlerts?.handshakeFailures}
                onChange={(e) => handleSettingChange('securityAlerts', 'handshakeFailures', e?.target?.checked)}
              />
              <Checkbox
                label="Security grade changes"
                checked={alertSettings?.securityAlerts?.securityGradeChanges}
                onChange={(e) => handleSettingChange('securityAlerts', 'securityGradeChanges', e?.target?.checked)}
              />
              <Checkbox
                label="Vulnerability detection"
                checked={alertSettings?.securityAlerts?.vulnerabilityDetection}
                onChange={(e) => handleSettingChange('securityAlerts', 'vulnerabilityDetection', e?.target?.checked)}
              />
            </div>
          )}
        </div>

        {/* Delivery Channels */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Delivery Channels</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              value={alertSettings?.deliveryChannels?.email}
              onChange={(e) => handleSettingChange('deliveryChannels', 'email', e?.target?.value)}
              description="Primary email for notifications"
            />

            <Input
              label="Webhook URL"
              type="url"
              placeholder="https://your-webhook-url.com"
              value={alertSettings?.deliveryChannels?.webhookUrl}
              onChange={(e) => handleSettingChange('deliveryChannels', 'webhookUrl', e?.target?.value)}
              description="HTTP endpoint for webhook notifications"
            />
          </div>

          <Input
            label="Slack Webhook URL"
            type="url"
            placeholder="https://hooks.slack.com/services/..."
            value={alertSettings?.deliveryChannels?.slackWebhook}
            onChange={(e) => handleSettingChange('deliveryChannels', 'slackWebhook', e?.target?.value)}
            description="Slack incoming webhook URL"
          />
        </div>

        {/* Alert Frequency */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Alert Frequency</h4>
          
          <Select
            options={alertFrequencyOptions}
            value={alertSettings?.alertFrequency}
            onChange={(value) => setAlertSettings(prev => ({ ...prev, alertFrequency: value }))}
            description="How often to send non-critical alerts"
          />
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={alertSettings?.quietHours?.enabled}
              onChange={(e) => handleSettingChange('quietHours', 'enabled', e?.target?.checked)}
            />
            <h4 className="font-medium text-foreground">Quiet Hours</h4>
          </div>

          {alertSettings?.quietHours?.enabled && (
            <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                value={alertSettings?.quietHours?.startTime}
                onChange={(e) => handleSettingChange('quietHours', 'startTime', e?.target?.value)}
              />
              <Input
                label="End Time"
                type="time"
                value={alertSettings?.quietHours?.endTime}
                onChange={(e) => handleSettingChange('quietHours', 'endTime', e?.target?.value)}
              />
            </div>
          )}
        </div>

        {/* Test Alerts */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Test Alerts</h4>
          
          <div className="flex items-center space-x-3">
            <Select
              options={testAlertTypes}
              value={testAlert?.type}
              onChange={(value) => setTestAlert(prev => ({ ...prev, type: value }))}
              placeholder="Select alert type to test"
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => runTestAlert(testAlert?.type)}
              disabled={!testAlert?.type || testAlert?.isRunning}
              loading={testAlert?.isRunning}
            >
              <Icon name="Send" size={16} className="mr-2" />
              Send Test
            </Button>
          </div>

          {testAlert?.result && (
            <div className={`p-4 rounded-lg border ${
              testAlert?.result?.success ? 'border-success/20 bg-success/5' : 'border-error/20 bg-error/5'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <Icon 
                  name={testAlert?.result?.success ? "CheckCircle" : "XCircle"} 
                  size={16} 
                  className={testAlert?.result?.success ? "text-success" : "text-error"}
                />
                <span className="font-medium text-foreground">{testAlert?.result?.message}</span>
              </div>
              
              {testAlert?.result?.deliveredTo?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Delivered to:</span>
                  {testAlert?.result?.deliveredTo?.map((channel, index) => (
                    <div key={index} className="text-sm text-foreground ml-4">• {channel}</div>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-2">
                {testAlert?.result?.timestamp?.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertManagementPanel;