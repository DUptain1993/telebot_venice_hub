import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BotCard = ({ bot, onSelect, isSelected, onQuickAction }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-muted-foreground bg-muted';
      case 'error':
        return 'text-error bg-error/10';
      case 'maintenance':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'CheckCircle';
      case 'inactive':
        return 'Circle';
      case 'error':
        return 'XCircle';
      case 'maintenance':
        return 'AlertTriangle';
      default:
        return 'Circle';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000)?.toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000)?.toFixed(1)}K`;
    return num?.toString();
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 transition-smooth hover:shadow-elevation-2 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(bot?.id, e?.target?.checked)}
            className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <div className="flex-1">
            <h3 className="font-medium text-foreground truncate">{bot?.name}</h3>
            <p className="text-sm text-muted-foreground truncate">@{bot?.username}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bot?.status)}`}>
          <Icon name={getStatusIcon(bot?.status)} size={12} />
          <span className="capitalize">{bot?.status}</span>
        </div>
      </div>
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">{formatNumber(bot?.userCount)}</div>
          <div className="text-xs text-muted-foreground">Users</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">{formatNumber(bot?.messageCount)}</div>
          <div className="text-xs text-muted-foreground">Messages</div>
        </div>
      </div>
      {/* Performance Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Performance</span>
          <span>{bot?.performance}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-smooth ${
              bot?.performance >= 80 ? 'bg-success' : 
              bot?.performance >= 60 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${bot?.performance}%` }}
          />
        </div>
      </div>
      {/* Last Activity */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span>Last active: {bot?.lastActivity}</span>
        <span>v{bot?.version}</span>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAction('monitor', bot)}
          className="flex-1"
        >
          <Icon name="Activity" size={14} className="mr-1" />
          Monitor
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickAction('configure', bot)}
          className="flex-1"
        >
          <Icon name="Settings" size={14} className="mr-1" />
          Config
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuickAction('more', bot)}
          className="w-8 h-8"
        >
          <Icon name="MoreVertical" size={14} />
        </Button>
      </div>
    </div>
  );
};

export default BotCard;