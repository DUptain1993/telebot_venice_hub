import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityMonitoringPanel = ({ onRunDiagnostics }) => {
  const [monitoringData, setMonitoringData] = useState({
    connectionHealth: {
      status: 'healthy',
      responseTime: 245,
      uptime: 99.9,
      lastCheck: new Date()
    },
    sslHandshake: {
      averageTime: 180,
      successRate: 99.8,
      failedAttempts: 2,
      lastFailure: new Date(Date.now() - 86400000) // 1 day ago
    },
    securityGrade: {
      overall: 'A+',
      score: 95,
      vulnerabilities: 0,
      lastScan: new Date(Date.now() - 3600000) // 1 hour ago
    },
    certificateChain: {
      status: 'valid',
      depth: 3,
      trustScore: 100,
      issues: []
    }
  });

  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [diagnosticsResults, setDiagnosticsResults] = useState(null);

  // Simulate real-time monitoring updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMonitoringData(prev => ({
        ...prev,
        connectionHealth: {
          ...prev?.connectionHealth,
          responseTime: Math.floor(Math.random() * 100) + 200,
          lastCheck: new Date()
        }
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': case'valid':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error': case'critical':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': case'valid':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error': case'critical':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getGradeColor = (grade) => {
    if (grade?.startsWith('A')) return 'text-success';
    if (grade?.startsWith('B')) return 'text-warning';
    return 'text-error';
  };

  const runSecurityDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setDiagnosticsResults(null);

    // Simulate diagnostic process
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockResults = {
      timestamp: new Date(),
      tests: [
        {
          name: 'SSL Certificate Validity',
          status: 'passed',
          details: 'Certificate is valid and properly configured'
        },
        {
          name: 'Certificate Chain Verification',
          status: 'passed',
          details: 'Complete certificate chain is properly installed'
        },
        {
          name: 'Protocol Security',
          status: 'passed',
          details: 'TLS 1.2 and 1.3 are properly configured'
        },
        {
          name: 'Cipher Suite Analysis',
          status: 'passed',
          details: 'Strong cipher suites are enabled'
        },
        {
          name: 'HSTS Configuration',
          status: 'warning',
          details: 'HSTS header could be improved with longer max-age'
        },
        {
          name: 'Certificate Transparency',
          status: 'passed',
          details: 'Certificate is logged in CT logs'
        }
      ],
      recommendations: [
        'Consider increasing HSTS max-age to 31536000 seconds',
        'Enable OCSP stapling for better performance',
        'Consider implementing Certificate Authority Authorization (CAA) records'
      ]
    };

    setDiagnosticsResults(mockResults);
    setIsRunningDiagnostics(false);

    if (onRunDiagnostics) {
      onRunDiagnostics(mockResults);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Activity" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Security Monitoring</h3>
            <p className="text-sm text-muted-foreground">Real-time SSL security analysis</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={runSecurityDiagnostics}
          loading={isRunningDiagnostics}
        >
          <Icon name="Search" size={16} className="mr-2" />
          {isRunningDiagnostics ? 'Running...' : 'Run Diagnostics'}
        </Button>
      </div>
      <div className="space-y-6">
        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Connection Health */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground">Connection Health</h4>
              <Icon 
                name={getStatusIcon(monitoringData?.connectionHealth?.status)} 
                size={16} 
                className={getStatusColor(monitoringData?.connectionHealth?.status)}
              />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {monitoringData?.connectionHealth?.uptime}%
              </div>
              <div className="text-xs text-muted-foreground">
                {monitoringData?.connectionHealth?.responseTime}ms avg
              </div>
            </div>
          </div>

          {/* SSL Handshake */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground">SSL Handshake</h4>
              <Icon name="Zap" size={16} className="text-primary" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {monitoringData?.sslHandshake?.averageTime}ms
              </div>
              <div className="text-xs text-muted-foreground">
                {monitoringData?.sslHandshake?.successRate}% success
              </div>
            </div>
          </div>

          {/* Security Grade */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground">Security Grade</h4>
              <Icon name="Shield" size={16} className="text-primary" />
            </div>
            <div className="space-y-1">
              <div className={`text-2xl font-bold ${getGradeColor(monitoringData?.securityGrade?.overall)}`}>
                {monitoringData?.securityGrade?.overall}
              </div>
              <div className="text-xs text-muted-foreground">
                {monitoringData?.securityGrade?.score}/100 score
              </div>
            </div>
          </div>

          {/* Certificate Chain */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground">Cert Chain</h4>
              <Icon 
                name={getStatusIcon(monitoringData?.certificateChain?.status)} 
                size={16} 
                className={getStatusColor(monitoringData?.certificateChain?.status)}
              />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {monitoringData?.certificateChain?.trustScore}%
              </div>
              <div className="text-xs text-muted-foreground">
                {monitoringData?.certificateChain?.depth} levels
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Monitoring */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Detailed Monitoring</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Connection Statistics */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-foreground">Connection Statistics</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Average Response Time:</span>
                  <span className="font-medium text-foreground">
                    {monitoringData?.connectionHealth?.responseTime}ms
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uptime (30 days):</span>
                  <span className="font-medium text-success">
                    {monitoringData?.connectionHealth?.uptime}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Check:</span>
                  <span className="font-medium text-foreground">
                    {monitoringData?.connectionHealth?.lastCheck?.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* SSL Performance */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-foreground">SSL Performance</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Handshake Time:</span>
                  <span className="font-medium text-foreground">
                    {monitoringData?.sslHandshake?.averageTime}ms
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span className="font-medium text-success">
                    {monitoringData?.sslHandshake?.successRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Failed Attempts:</span>
                  <span className="font-medium text-foreground">
                    {monitoringData?.sslHandshake?.failedAttempts}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostics Results */}
        {diagnosticsResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Diagnostic Results</h4>
              <span className="text-xs text-muted-foreground">
                {diagnosticsResults?.timestamp?.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              {diagnosticsResults?.tests?.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={test?.status === 'passed' ? 'CheckCircle' : test?.status === 'warning' ? 'AlertTriangle' : 'XCircle'} 
                      size={16} 
                      className={test?.status === 'passed' ? 'text-success' : test?.status === 'warning' ? 'text-warning' : 'text-error'}
                    />
                    <div>
                      <div className="font-medium text-foreground">{test?.name}</div>
                      <div className="text-xs text-muted-foreground">{test?.details}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    test?.status === 'passed' ? 'bg-success/10 text-success' :
                    test?.status === 'warning'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                  }`}>
                    {test?.status}
                  </span>
                </div>
              ))}
            </div>

            {diagnosticsResults?.recommendations?.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-foreground">Recommendations</h5>
                <div className="space-y-1">
                  {diagnosticsResults?.recommendations?.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-primary/5 rounded-md">
                      <Icon name="Lightbulb" size={14} className="text-primary mt-0.5" />
                      <span className="text-sm text-foreground">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityMonitoringPanel;