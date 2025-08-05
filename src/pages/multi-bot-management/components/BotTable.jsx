import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BotTable = ({ bots, selectedBots, onSelectBot, onSelectAll, onQuickAction, sortConfig, onSort }) => {
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

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const isAllSelected = bots?.length > 0 && selectedBots?.length === bots?.length;
  const isIndeterminate = selectedBots?.length > 0 && selectedBots?.length < bots?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('name')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary"
                >
                  <span>Bot Name</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('status')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('userCount')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary"
                >
                  <span>Users</span>
                  <Icon name={getSortIcon('userCount')} size={14} />
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('messageCount')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary"
                >
                  <span>Messages</span>
                  <Icon name={getSortIcon('messageCount')} size={14} />
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('performance')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary"
                >
                  <span>Performance</span>
                  <Icon name={getSortIcon('performance')} size={14} />
                </Button>
              </th>
              <th className="px-4 py-3 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('lastActivity')}
                  className="flex items-center space-x-1 font-medium text-foreground hover:text-primary"
                >
                  <span>Last Activity</span>
                  <Icon name={getSortIcon('lastActivity')} size={14} />
                </Button>
              </th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bots?.map((bot) => (
              <tr key={bot?.id} className="border-b border-border hover:bg-muted/30 transition-fast">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedBots?.includes(bot?.id)}
                    onChange={(e) => onSelectBot(bot?.id, e?.target?.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Bot" size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{bot?.name}</div>
                      <div className="text-sm text-muted-foreground">@{bot?.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bot?.status)}`}>
                    <Icon name={getStatusIcon(bot?.status)} size={12} />
                    <span className="capitalize">{bot?.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{formatNumber(bot?.userCount)}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{formatNumber(bot?.messageCount)}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-smooth ${
                          bot?.performance >= 80 ? 'bg-success' : 
                          bot?.performance >= 60 ? 'bg-warning' : 'bg-error'
                        }`}
                        style={{ width: `${bot?.performance}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-10">{bot?.performance}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-muted-foreground">{bot?.lastActivity}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onQuickAction('monitor', bot)}
                      className="w-8 h-8"
                      title="Monitor bot"
                    >
                      <Icon name="Activity" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onQuickAction('configure', bot)}
                      className="w-8 h-8"
                      title="Configure bot"
                    >
                      <Icon name="Settings" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onQuickAction('logs', bot)}
                      className="w-8 h-8"
                      title="View logs"
                    >
                      <Icon name="FileText" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onQuickAction('more', bot)}
                      className="w-8 h-8"
                      title="More actions"
                    >
                      <Icon name="MoreHorizontal" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BotTable;