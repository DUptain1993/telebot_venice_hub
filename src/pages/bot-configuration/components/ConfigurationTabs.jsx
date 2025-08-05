import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const ConfigurationTabs = ({ activeTab, onTabChange, hasUnsavedChanges }) => {
  const tabs = [
    {
      id: 'basic',
      label: 'Basic Settings',
      icon: 'Settings',
      description: 'Bot token, name, and profile'
    },
    {
      id: 'commands',
      label: 'Commands',
      icon: 'Terminal',
      description: 'Define bot commands and responses'
    },
    {
      id: 'webhooks',
      label: 'Webhooks',
      icon: 'Webhook',
      description: 'Configure webhook endpoints'
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: 'Cog',
      description: 'AI integration and security settings'
    }
  ];

  return (
    <div className="border-b border-border bg-card">
      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <nav className="flex space-x-1 px-6" aria-label="Configuration tabs">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => onTabChange(tab?.id)}
              className={`
                relative flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-smooth
                ${activeTab === tab?.id
                  ? 'bg-background text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon 
                name={tab?.icon} 
                size={16} 
                className={activeTab === tab?.id ? 'text-primary' : 'text-muted-foreground'}
              />
              <span>{tab?.label}</span>
              
              {/* Unsaved changes indicator */}
              {hasUnsavedChanges && activeTab === tab?.id && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </nav>
      </div>
      {/* Mobile Tab Selector */}
      <div className="md:hidden px-4 py-3">
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e?.target?.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
          >
            {tabs?.map((tab) => (
              <option key={tab?.id} value={tab?.id}>
                {tab?.label} - {tab?.description}
              </option>
            ))}
          </select>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
        
        {hasUnsavedChanges && (
          <div className="flex items-center space-x-2 mt-2 text-warning">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
            <span className="text-xs">Unsaved changes in current tab</span>
          </div>
        )}
      </div>
      {/* Tab Description */}
      <div className="px-6 py-2 bg-muted/30 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {tabs?.find(tab => tab?.id === activeTab)?.description}
        </p>
      </div>
    </div>
  );
};

export default ConfigurationTabs;