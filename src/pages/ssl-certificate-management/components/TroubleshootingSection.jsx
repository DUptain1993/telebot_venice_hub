import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TroubleshootingSection = ({ onGetAIHelp }) => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [customIssue, setCustomIssue] = useState('');
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  const commonIssues = [
    { value: 'cert-expired', label: 'Certificate Expired' },
    { value: 'cert-mismatch', label: 'Certificate Domain Mismatch' },
    { value: 'chain-incomplete', label: 'Incomplete Certificate Chain' },
    { value: 'handshake-failure', label: 'SSL Handshake Failure' },
    { value: 'mixed-content', label: 'Mixed Content Warnings' },
    { value: 'renewal-failed', label: 'Auto-renewal Failed' },
    { value: 'browser-warning', label: 'Browser Security Warning' },
    { value: 'performance-slow', label: 'Slow SSL Performance' },
    { value: 'custom', label: 'Other Issue (Describe Below)' }
  ];

  const troubleshootingGuides = {
    'cert-expired': {
      title: 'Certificate Expired',
      icon: 'Clock',
      severity: 'critical',
      steps: [
        'Check certificate expiration date in browser or using openssl command',
        'Backup current certificate configuration',
        'Generate new certificate using Certbot or upload new certificate',
        'Update web server configuration with new certificate',
        'Test SSL configuration and restart services',
        'Verify certificate installation across all domains'
      ],
      commands: [
        'openssl x509 -in certificate.crt -text -noout | grep "Not After"',
        'certbot renew --dry-run',
        'systemctl restart nginx'
      ]
    },
    'cert-mismatch': {
      title: 'Certificate Domain Mismatch',
      icon: 'AlertTriangle',
      severity: 'high',
      steps: [
        'Verify the certificate Common Name (CN) matches your domain',
        'Check Subject Alternative Names (SAN) for additional domains',
        'Ensure all subdomains are covered by the certificate',
        'Generate new certificate with correct domain names if needed',
        'Update DNS records if domain has changed',
        'Test certificate validity for all intended domains'
      ],
      commands: [
        'openssl x509 -in certificate.crt -text -noout | grep -A1 "Subject:"',
        'openssl x509 -in certificate.crt -text -noout | grep -A1 "DNS:"'
      ]
    },
    'chain-incomplete': {
      title: 'Incomplete Certificate Chain',
      icon: 'Link',
      severity: 'medium',
      steps: [
        'Download the complete certificate chain from your CA',
        'Verify intermediate certificates are properly installed',
        'Check certificate chain order (server cert, intermediate, root)',
        'Update web server configuration with complete chain',
        'Test certificate chain using SSL testing tools',
        'Verify trust path to root certificate'
      ],
      commands: [
        'openssl verify -CAfile ca-bundle.crt certificate.crt',
        'openssl s509 -in certificate.crt -text -noout'
      ]
    }
  };

  const runDiagnostic = async () => {
    if (!selectedIssue) return;

    setIsRunningDiagnostic(true);
    
    // Simulate diagnostic process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const guide = troubleshootingGuides?.[selectedIssue];
    const mockResults = {
      issue: selectedIssue,
      title: guide?.title || 'Custom Issue',
      severity: guide?.severity || 'medium',
      detected: true,
      autoFixAvailable: selectedIssue === 'cert-expired' || selectedIssue === 'renewal-failed',
      estimatedFixTime: guide?.severity === 'critical' ? '15-30 minutes' : '5-15 minutes',
      affectedServices: ['HTTPS Website', 'API Endpoints', 'Webhook Delivery'],
      nextSteps: guide?.steps || ['Contact support for assistance with this issue']
    };

    setDiagnosticResults(mockResults);
    setIsRunningDiagnostic(false);
  };

  const handleAIHelp = () => {
    const issueDescription = selectedIssue === 'custom' ? customIssue : 
      commonIssues?.find(issue => issue?.value === selectedIssue)?.label || '';
    
    if (onGetAIHelp) {
      onGetAIHelp({
        issue: issueDescription,
        diagnosticResults,
        context: 'SSL Certificate Troubleshooting'
      });
    }
  };

  const handleAutoFix = async () => {
    if (!diagnosticResults?.autoFixAvailable) return;

    // Simulate auto-fix process
    console.log('Running auto-fix for:', diagnosticResults?.issue);
    
    // In a real implementation, this would trigger the appropriate fix
    if (diagnosticResults?.issue === 'cert-expired') {
      // Trigger certificate renewal
      console.log('Triggering certificate renewal...');
    } else if (diagnosticResults?.issue === 'renewal-failed') {
      // Retry renewal process
      console.log('Retrying renewal process...');
    }
  };

  const selectedGuide = troubleshootingGuides?.[selectedIssue];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Tool" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">SSL Troubleshooting</h3>
          <p className="text-sm text-muted-foreground">Diagnose and resolve SSL certificate issues</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Issue Selection */}
        <div className="space-y-4">
          <Select
            label="Select Issue Type"
            options={commonIssues}
            value={selectedIssue}
            onChange={setSelectedIssue}
            placeholder="Choose the issue you're experiencing"
          />

          {selectedIssue === 'custom' && (
            <Input
              label="Describe Your Issue"
              type="text"
              placeholder="Please describe the SSL issue you're experiencing..."
              value={customIssue}
              onChange={(e) => setCustomIssue(e?.target?.value)}
              description="Provide as much detail as possible for better assistance"
            />
          )}

          <div className="flex items-center space-x-3">
            <Button
              variant="default"
              onClick={runDiagnostic}
              disabled={!selectedIssue || (selectedIssue === 'custom' && !customIssue?.trim())}
              loading={isRunningDiagnostic}
            >
              <Icon name="Search" size={16} className="mr-2" />
              {isRunningDiagnostic ? 'Diagnosing...' : 'Run Diagnostic'}
            </Button>

            <Button
              variant="outline"
              onClick={handleAIHelp}
              disabled={!selectedIssue}
            >
              <Icon name="Brain" size={16} className="mr-2" />
              Get AI Help
            </Button>
          </div>
        </div>

        {/* Diagnostic Results */}
        {diagnosticResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Diagnostic Results</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${
                diagnosticResults?.severity === 'critical' ? 'bg-error/10 text-error' :
                diagnosticResults?.severity === 'high'? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
              }`}>
                {diagnosticResults?.severity} priority
              </span>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3 mb-4">
                <Icon 
                  name={diagnosticResults?.detected ? "AlertTriangle" : "CheckCircle"} 
                  size={20} 
                  className={diagnosticResults?.detected ? "text-warning" : "text-success"}
                />
                <div className="flex-1">
                  <h5 className="font-medium text-foreground">{diagnosticResults?.title}</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    {diagnosticResults?.detected ? 'Issue detected and analyzed' : 'No issues found'}
                  </p>
                </div>
                {diagnosticResults?.autoFixAvailable && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAutoFix}
                  >
                    <Icon name="Zap" size={14} className="mr-2" />
                    Auto Fix
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Estimated Fix Time</div>
                  <div className="font-medium text-foreground">{diagnosticResults?.estimatedFixTime}</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Affected Services</div>
                  <div className="font-medium text-foreground">{diagnosticResults?.affectedServices?.length}</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Auto Fix</div>
                  <div className="font-medium text-foreground">
                    {diagnosticResults?.autoFixAvailable ? 'Available' : 'Manual'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h6 className="text-sm font-medium text-foreground">Affected Services:</h6>
                <div className="flex flex-wrap gap-2">
                  {diagnosticResults?.affectedServices?.map((service, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-warning/10 text-warning rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step-by-Step Guide */}
        {selectedGuide && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon name={selectedGuide?.icon} size={16} className="text-primary" />
              <h4 className="font-medium text-foreground">Step-by-Step Resolution</h4>
            </div>

            <div className="space-y-3">
              {selectedGuide?.steps?.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{step}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedGuide?.commands && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-foreground">Useful Commands:</h5>
                <div className="space-y-2">
                  {selectedGuide?.commands?.map((command, index) => (
                    <div key={index} className="bg-muted rounded-lg p-3">
                      <code className="text-sm font-mono text-foreground">{command}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h5 className="text-sm font-medium text-foreground mb-3">Quick Actions</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Test SSL configuration')}
            >
              <Icon name="TestTube" size={14} className="mr-2" />
              Test SSL Config
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Check certificate expiry')}
            >
              <Icon name="Calendar" size={14} className="mr-2" />
              Check Expiry
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Validate certificate chain')}
            >
              <Icon name="Link" size={14} className="mr-2" />
              Validate Chain
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingSection;