import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import GlobalStatusBar from '../../components/ui/GlobalStatusBar';
import AIAssistantToggle from '../../components/ui/AIAssistantToggle';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all components
import CertificateOverviewCard from './components/CertificateOverviewCard';
import CertificateDetailsPanel from './components/CertificateDetailsPanel';
import CertbotIntegrationPanel from './components/CertbotIntegrationPanel';
import CertificateUploadSection from './components/CertificateUploadSection';
import SecurityMonitoringPanel from './components/SecurityMonitoringPanel';
import TroubleshootingSection from './components/TroubleshootingSection';
import AlertManagementPanel from './components/AlertManagementPanel';

const SSLCertificateManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock certificate data
  const certificates = [
    {
      id: 1,
      domain: 'telebot-venice.com',
      issuer: "Let\'s Encrypt Authority X3",
      status: 'valid',
      type: 'Domain Validated (DV)',
      issuedDate: '2024-11-05',
      expiryDate: '2025-02-05',
      autoRenewal: true
    },
    {
      id: 2,
      domain: 'api.telebot-venice.com',
      issuer: "Let\'s Encrypt Authority X3",
      status: 'expiring',
      type: 'Domain Validated (DV)',
      issuedDate: '2024-08-15',
      expiryDate: '2024-11-15',
      autoRenewal: true
    },
    {
      id: 3,
      domain: 'staging.telebot-venice.com',
      issuer: 'Custom CA',
      status: 'valid',
      type: 'Self-Signed',
      issuedDate: '2024-10-01',
      expiryDate: '2025-10-01',
      autoRenewal: false
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'certbot', label: 'Auto-Renewal', icon: 'Bot' },
    { id: 'upload', label: 'Upload Certificate', icon: 'Upload' },
    { id: 'monitoring', label: 'Security Monitoring', icon: 'Activity' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: 'Tool' },
    { id: 'alerts', label: 'Alert Management', icon: 'Bell' }
  ];

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleViewCertificateDetails = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleCloseCertificateDetails = () => {
    setSelectedCertificate(null);
  };

  const handleDownloadCertificate = (certificate) => {
    console.log('Downloading certificate for:', certificate?.domain);
    // In a real implementation, this would trigger certificate download
  };

  const handleRenewCertificate = (certificate) => {
    console.log('Renewing certificate for:', certificate?.domain);
    // In a real implementation, this would trigger certificate renewal
  };

  const handleScheduleRenewal = (config) => {
    console.log('Scheduling renewal with config:', config);
    // In a real implementation, this would save renewal configuration
  };

  const handleUploadCertificate = (uploadData) => {
    console.log('Uploading certificate:', uploadData);
    // In a real implementation, this would process certificate upload
  };

  const handleRunDiagnostics = (results) => {
    console.log('Diagnostics completed:', results);
    // In a real implementation, this would process diagnostic results
  };

  const handleGetAIHelp = (helpRequest) => {
    console.log('AI help requested:', helpRequest);
    // In a real implementation, this would integrate with Venice AI
    window.location.href = '/venice-ai-assistant';
  };

  const handleSaveAlerts = (alertSettings) => {
    console.log('Saving alert settings:', alertSettings);
    // In a real implementation, this would save alert configuration
  };

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.querySelector('aside');
        if (sidebar && !sidebar?.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">SSL Certificates Overview</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and monitor your SSL certificates
                </p>
              </div>
              <Button
                variant="default"
                onClick={() => setActiveTab('upload')}
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Add Certificate
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates?.map((certificate) => (
                <CertificateOverviewCard
                  key={certificate?.id}
                  certificate={certificate}
                  onRenew={handleRenewCertificate}
                  onViewDetails={handleViewCertificateDetails}
                />
              ))}
            </div>
          </div>
        );

      case 'certbot':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Certbot Integration</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure automated SSL certificate renewal
              </p>
            </div>
            <CertbotIntegrationPanel
              onRenewCertificate={handleRenewCertificate}
              onScheduleRenewal={handleScheduleRenewal}
            />
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Upload Custom Certificate</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Install your own SSL certificate files
              </p>
            </div>
            <CertificateUploadSection
              onUploadCertificate={handleUploadCertificate}
            />
          </div>
        );

      case 'monitoring':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Security Monitoring</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time SSL security analysis and monitoring
              </p>
            </div>
            <SecurityMonitoringPanel
              onRunDiagnostics={handleRunDiagnostics}
            />
          </div>
        );

      case 'troubleshooting':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">SSL Troubleshooting</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Diagnose and resolve SSL certificate issues
              </p>
            </div>
            <TroubleshootingSection
              onGetAIHelp={handleGetAIHelp}
            />
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Alert Management</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure SSL certificate notifications and alerts
              </p>
            </div>
            <AlertManagementPanel
              onSaveAlerts={handleSaveAlerts}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onSidebarToggle={handleSidebarToggle}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      {/* Global Status Bar */}
      <GlobalStatusBar />
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleSidebarCollapse}
      />
      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      } pt-32`}>
        <div className="px-4 lg:px-8 pb-8">
          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation />

          {/* Tab Navigation */}
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>
      {/* Certificate Details Modal */}
      {selectedCertificate && (
        <CertificateDetailsPanel
          certificate={selectedCertificate}
          onClose={handleCloseCertificateDetails}
          onDownload={handleDownloadCertificate}
        />
      )}
      {/* AI Assistant Toggle */}
      <AIAssistantToggle />
    </div>
  );
};

export default SSLCertificateManagement;