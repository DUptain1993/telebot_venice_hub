import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const GlobalStatusBar = () => {
  const [statusData, setStatusData] = useState({
    activeBots: 3,
    sslStatus: 'valid',
    sslExpiry: '45 days',
    systemHealth: 'healthy',
    lastUpdate: new Date()
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusData(prev => ({
        ...prev,
        lastUpdate: new Date()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid': case'healthy':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error': case'expired':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid': case'healthy':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error': case'expired':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const handleNavigateToSSL = () => {
    window.location.href = '/ssl-certificate-management';
  };

  const handleNavigateToBots = () => {
    window.location.href = '/multi-bot-management';
  };

  return (
    <div className="sticky top-16 z-90 bg-muted/50 border-b border-border backdrop-blur-sm">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Status Indicators */}
          <div className="flex items-center space-x-6">
            {/* Active Bots */}
            <button
              onClick={handleNavigateToBots}
              className="flex items-center space-x-2 hover:bg-muted/80 rounded-md px-2 py-1 transition-fast"
            >
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-gentle" />
                <Icon name="Bot" size={14} className="text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-foreground">
                {statusData?.activeBots} Active
              </span>
            </button>

            {/* SSL Status */}
            <button
              onClick={handleNavigateToSSL}
              className="flex items-center space-x-2 hover:bg-muted/80 rounded-md px-2 py-1 transition-fast"
            >
              <Icon 
                name={getStatusIcon(statusData?.sslStatus)} 
                size={14} 
                className={getStatusColor(statusData?.sslStatus)}
              />
              <span className="text-xs font-medium text-foreground">
                SSL: {statusData?.sslExpiry}
              </span>
            </button>

            {/* System Health */}
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(statusData?.systemHealth)} 
                size={14} 
                className={getStatusColor(statusData?.systemHealth)}
              />
              <span className="text-xs font-medium text-foreground capitalize">
                {statusData?.systemHealth}
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Last Update */}
            <span className="text-xs text-muted-foreground">
              Updated {statusData?.lastUpdate?.toLocaleTimeString()}
            </span>

            {/* Expand/Collapse Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-6 h-6"
              aria-label={isExpanded ? "Collapse status" : "Expand status"}
            >
              <Icon 
                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                size={12} 
              />
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bot Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Bot Status
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Active Bots:</span>
                    <span className="font-medium text-success">{statusData?.activeBots}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total Configured:</span>
                    <span className="font-medium text-foreground">5</span>
                  </div>
                </div>
              </div>

              {/* SSL Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Security Status
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">SSL Certificates:</span>
                    <span className={`font-medium ${getStatusColor(statusData?.sslStatus)}`}>
                      Valid
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Next Renewal:</span>
                    <span className="font-medium text-foreground">{statusData?.sslExpiry}</span>
                  </div>
                </div>
              </div>

              {/* System Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  System Health
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">API Status:</span>
                    <span className="font-medium text-success">Online</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Webhook Health:</span>
                    <span className="font-medium text-success">Healthy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalStatusBar;