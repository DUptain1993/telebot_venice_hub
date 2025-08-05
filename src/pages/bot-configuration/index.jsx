import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import GlobalStatusBar from '../../components/ui/GlobalStatusBar';
import AIAssistantToggle from '../../components/ui/AIAssistantToggle';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ConfigurationTabs from './components/ConfigurationTabs';
import BasicSettingsTab from './components/BasicSettingsTab';
import CommandsTab from './components/CommandsTab';
import WebhooksTab from './components/WebhooksTab';
import AdvancedTab from './components/AdvancedTab';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const BotConfiguration = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Mock bot data
  const [botData, setBotData] = useState({
    id: 'bot_001',
    name: 'Customer Support Bot',
    username: '@customer_support_bot',
    token: '1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk',
    description: 'Automated customer support bot for handling common inquiries and providing instant assistance to users.',
    profileImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop&crop=face',
    status: 'active',
    createdAt: '2025-01-15T10:30:00Z',
    lastModified: '2025-01-20T14:45:00Z'
  });

  // Mock commands data
  const [commands, setCommands] = useState([
    {
      id: 1,
      name: 'start',
      description: 'Start the bot and show welcome message',
      response: `Welcome to our Customer Support Bot! 🤖\n\nI'm here to help you with:\n• Product information\n• Order status\n• Technical support\n• General inquiries\n\nUse /help to see all available commands.`,
      enabled: true,
      createdAt: '2025-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'help',description: 'Show available commands and their descriptions',response: `Available Commands:\n\n/start - Welcome message\n/help - Show this help\n/status - Check order status\n/contact - Contact human support\n/faq - Frequently asked questions\n\nFor immediate assistance, use /contact to reach our support team.`,enabled: true,createdAt: '2025-01-15T10:35:00Z'
    },
    {
      id: 3,
      name: 'status',description: 'Check order status by order number',response: `Please provide your order number to check the status.\n\nFormat: Just send your order number (e.g., #12345)\n\nI'll look up your order and provide current status information.`,
      enabled: true,
      createdAt: '2025-01-15T10:40:00Z'
    },
    {
      id: 4,
      name: 'contact',
      description: 'Connect with human support agent',
      response: `Connecting you with our support team...\n\nPlease describe your issue briefly, and one of our agents will assist you shortly.\n\nAverage response time: 2-5 minutes during business hours.`,
      enabled: true,
      createdAt: '2025-01-15T10:45:00Z'
    },
    {
      id: 5,
      name: 'faq',
      description: 'Show frequently asked questions',
      response: `Frequently Asked Questions:\n\n❓ How do I track my order?\nUse /status command with your order number.\n\n❓ What are your business hours?\nMonday-Friday: 9 AM - 6 PM EST\n\n❓ How do I return an item?\nVisit our returns page or contact support.\n\n❓ Do you offer international shipping?\nYes, we ship to most countries worldwide.`,
      enabled: false,
      createdAt: '2025-01-15T10:50:00Z'
    }
  ]);

  // Mock webhook configuration
  const [webhookConfig, setWebhookConfig] = useState({
    url: 'https://your-bot-domain.onrender.com/webhook/1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk',
    sslType: 'auto',
    maxConnections: 40,
    allowedUpdates: ['message', 'edited_message', 'callback_query', 'inline_query'],
    isActive: true,
    lastTested: '2025-01-20T14:30:00Z'
  });

  // Mock advanced configuration
  const [advancedConfig, setAdvancedConfig] = useState({
    enableVeniceAI: true,
    veniceApiKey: 'vn_1234567890abcdefghijklmnopqrstuvwxyz1234567890abcd',
    autoCodeReview: true,
    performanceSuggestions: false,
    enableRateLimit: true,
    rateLimit: '5',
    burstLimit: 10,
    cooldownPeriod: 60,
    logLevel: 'info',
    logUserMessages: false,
    logBotResponses: true,
    logWebhookEvents: true,
    logErrorsOnly: false,
    logRetention: 30,
    validateWebhookSignature: true,
    blockUnknownUsers: false,
    enableIpWhitelist: false,
    encryptStoredData: true,
    ipWhitelist: ''
  });

  // Custom breadcrumbs for this page
  const customBreadcrumbs = [
    { label: 'Dashboard', path: '/', icon: 'Home' },
    { label: 'Bots', path: '/multi-bot-management', icon: 'Network' },
    { label: botData?.name, path: location.pathname, icon: 'Settings', isLast: true }
  ];

  // Handle data changes and mark as unsaved
  const handleBotDataChange = (newData) => {
    setBotData(newData);
    setHasUnsavedChanges(true);
  };

  const handleCommandsChange = (newCommands) => {
    setCommands(newCommands);
    setHasUnsavedChanges(true);
  };

  const handleWebhookConfigChange = (newConfig) => {
    setWebhookConfig(newConfig);
    setHasUnsavedChanges(true);
  };

  const handleAdvancedConfigChange = (newConfig) => {
    setAdvancedConfig(newConfig);
    setHasUnsavedChanges(true);
  };

  // Save configuration
  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save operation
    setTimeout(() => {
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      setIsSaving(false);
      
      // Show success notification (in a real app, use a toast library)
      console.log('Configuration saved successfully');
    }, 1500);
  };

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        handleSave();
      }, 30000); // Auto-save after 30 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasUnsavedChanges, botData, commands, webhookConfig, advancedConfig]);

  // Handle beforeunload to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e?.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicSettingsTab
            botData={botData}
            onBotDataChange={handleBotDataChange}
            onSave={handleSave}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        );
      case 'commands':
        return (
          <CommandsTab
            commands={commands}
            onCommandsChange={handleCommandsChange}
            onSave={handleSave}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        );
      case 'webhooks':
        return (
          <WebhooksTab
            webhookConfig={webhookConfig}
            onWebhookConfigChange={handleWebhookConfigChange}
            onSave={handleSave}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        );
      case 'advanced':
        return (
          <AdvancedTab
            advancedConfig={advancedConfig}
            onAdvancedConfigChange={handleAdvancedConfigChange}
            onSave={handleSave}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      {/* Global Status Bar */}
      <GlobalStatusBar />
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      {/* Main Content */}
      <main className={`
        pt-20 transition-medium
        ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'}
      `}>
        <div className="px-4 lg:px-6 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <BreadcrumbNavigation customBreadcrumbs={customBreadcrumbs} />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Bot" size={24} color="white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{botData?.name}</h1>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-muted-foreground">{botData?.username}</span>
                      <div className={`flex items-center space-x-1 ${
                        botData?.status === 'active' ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          botData?.status === 'active' ? 'bg-success animate-pulse-gentle' : 'bg-muted-foreground'
                        }`} />
                        <span className="text-xs font-medium capitalize">{botData?.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {lastSaved && (
                  <div className="text-xs text-muted-foreground">
                    Last saved: {lastSaved?.toLocaleTimeString()}
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/multi-bot-management'}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Bots
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  loading={isSaving}
                  iconName="Save"
                  iconPosition="left"
                  disabled={!hasUnsavedChanges}
                >
                  {isSaving ? 'Saving...' : 'Save All Changes'}
                </Button>
              </div>
            </div>
          </div>

          {/* Configuration Interface */}
          <div className="bg-card border border-border rounded-lg shadow-elevation-1 overflow-hidden">
            {/* Configuration Tabs */}
            <ConfigurationTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              hasUnsavedChanges={hasUnsavedChanges}
            />

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-6 flex items-center justify-between bg-muted/30 border border-border rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Bot ID: <code className="bg-muted px-2 py-1 rounded text-xs">{botData?.id}</code>
              </div>
              <div className="text-sm text-muted-foreground">
                Created: {new Date(botData.createdAt)?.toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('Test bot')}
                iconName="Play"
                iconPosition="left"
              >
                Test Bot
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('View logs')}
                iconName="FileText"
                iconPosition="left"
              >
                View Logs
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('Export config')}
                iconName="Download"
                iconPosition="left"
              >
                Export Config
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* AI Assistant Toggle */}
      <AIAssistantToggle />
    </div>
  );
};

export default BotConfiguration;