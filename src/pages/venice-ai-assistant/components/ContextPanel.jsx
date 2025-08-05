import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContextPanel = ({ currentBot, onBotChange, availableBots, apiUsage }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const usagePercentage = (apiUsage?.used / apiUsage?.limit) * 100;

  return (
    <div className={`bg-card border-l border-border transition-all duration-300 ${isExpanded ? 'w-80' : 'w-12'}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <h3 className="font-semibold text-foreground">Context</h3>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8"
          >
            <Icon name={isExpanded ? "ChevronRight" : "ChevronLeft"} size={16} />
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Current Bot Context */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Current Bot</h4>
            {currentBot ? (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Bot" size={16} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground">{currentBot?.name}</h5>
                    <p className="text-xs text-muted-foreground">@{currentBot?.username}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${currentBot?.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`} />
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commands:</span>
                    <span className="font-medium">{currentBot?.commandCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Webhooks:</span>
                    <span className="font-medium">{currentBot?.webhookCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Deploy:</span>
                    <span className="font-medium">{currentBot?.lastDeploy}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 text-xs"
                  onClick={() => window.location.href = '/bot-configuration'}
                >
                  <Icon name="Settings" size={12} className="mr-1" />
                  Configure
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-lg text-center">
                <Icon name="Bot" size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">No bot selected</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.location.href = '/multi-bot-management'}
                >
                  Select Bot
                </Button>
              </div>
            )}
          </div>

          {/* Bot Selector */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Switch Context</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableBots?.map((bot) => (
                <button
                  key={bot?.id}
                  onClick={() => onBotChange(bot)}
                  className={`w-full p-2 rounded-lg text-left transition-smooth ${
                    currentBot?.id === bot?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${
                      currentBot?.id === bot?.id ? 'bg-primary-foreground/20' : 'bg-muted'
                    }`}>
                      <Icon name="Bot" size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{bot?.name}</p>
                      <p className="text-xs opacity-75 truncate">@{bot?.username}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${bot?.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* API Usage */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">API Usage</h4>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Tokens Used</span>
                <span className="text-sm font-medium">
                  {apiUsage?.used?.toLocaleString()} / {apiUsage?.limit?.toLocaleString()}
                </span>
              </div>
              
              <div className="w-full bg-background rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    usagePercentage > 80 ? 'bg-error' : usagePercentage > 60 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Resets: {apiUsage?.resetDate}</span>
                <span>{Math.round(100 - usagePercentage)}% remaining</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Export Chat', icon: 'Download', action: 'export' },
                { label: 'Clear History', icon: 'Trash2', action: 'clear' },
                { label: 'Save Snippet', icon: 'Save', action: 'save' },
                { label: 'Share Chat', icon: 'Share', action: 'share' }
              ]?.map((action) => (
                <Button
                  key={action?.action}
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => console.log('Action:', action?.action)}
                >
                  <Icon name={action?.icon} size={12} className="mr-1" />
                  {action?.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Code Snippets */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Recent Snippets</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {[
                { title: 'Bot Handler Function', language: 'javascript', time: '2h ago' },
                { title: 'Webhook Configuration', language: 'json', time: '1d ago' },
                { title: 'Command Parser', language: 'javascript', time: '2d ago' }
              ]?.map((snippet, index) => (
                <div key={index} className="p-2 bg-muted rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground truncate">{snippet?.title}</span>
                    <span className="text-muted-foreground">{snippet?.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Code" size={10} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{snippet?.language}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextPanel;