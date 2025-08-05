import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AIAssistantToggle = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const location = useLocation();

  // Hide toggle when on AI Assistant page
  useEffect(() => {
    setIsVisible(location.pathname !== '/venice-ai-assistant');
  }, [location.pathname]);

  // Simulate AI availability status
  useEffect(() => {
    const checkAIStatus = () => {
      setIsAssistantActive(Math.random() > 0.2); // 80% availability simulation
    };
    
    checkAIStatus();
    const interval = setInterval(checkAIStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleToggleAssistant = () => {
    if (isAssistantActive) {
      setIsPanelOpen(!isPanelOpen);
    } else {
      // Navigate to full AI Assistant page if service is unavailable
      window.location.href = '/venice-ai-assistant';
    }
  };

  const handleNavigateToFullAssistant = () => {
    window.location.href = '/venice-ai-assistant';
    setIsPanelOpen(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-80">
        <Button
          variant={isAssistantActive ? "default" : "secondary"}
          size="lg"
          onClick={handleToggleAssistant}
          className={`
            relative rounded-full shadow-elevation-2 transition-smooth
            ${isAssistantActive ? 'hover:shadow-elevation-3' : 'opacity-75'}
          `}
          disabled={!isAssistantActive}
        >
          <Icon 
            name="Brain" 
            size={20} 
            className={isAssistantActive ? 'text-primary-foreground' : 'text-muted-foreground'}
          />
          <span className="ml-2 font-medium">
            Venice AI
          </span>
          
          {/* Status Indicator */}
          <div className={`
            absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background
            ${isAssistantActive ? 'bg-success animate-pulse-gentle' : 'bg-muted-foreground'}
          `} />
        </Button>
      </div>
      {/* AI Assistant Panel Overlay */}
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-70"
            onClick={() => setIsPanelOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed right-6 bottom-24 w-80 max-w-[calc(100vw-3rem)] z-80 bg-card border border-border rounded-lg shadow-elevation-3 animate-slide-in-right">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Brain" size={18} className="text-primary" />
                <h3 className="font-medium text-foreground">Venice AI Assistant</h3>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-gentle" />
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNavigateToFullAssistant}
                  className="w-6 h-6"
                  title="Open full assistant"
                >
                  <Icon name="Maximize2" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPanelOpen(false)}
                  className="w-6 h-6"
                  title="Close panel"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-4 space-y-4">
              {/* Quick Actions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => {
                      // Simulate quick action
                      console.log('Generate bot config');
                    }}
                  >
                    <Icon name="Settings" size={14} className="mr-1" />
                    Bot Config
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => {
                      // Simulate quick action
                      console.log('Debug webhook');
                    }}
                  >
                    <Icon name="Bug" size={14} className="mr-1" />
                    Debug
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => {
                      // Simulate quick action
                      console.log('SSL check');
                    }}
                  >
                    <Icon name="Shield" size={14} className="mr-1" />
                    SSL Check
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => {
                      // Simulate quick action
                      console.log('Code review');
                    }}
                  >
                    <Icon name="Code" size={14} className="mr-1" />
                    Review
                  </Button>
                </div>
              </div>

              {/* Context Awareness */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Current Context</h4>
                <div className="text-xs text-muted-foreground bg-muted rounded-md p-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={12} />
                    <span>Page: {location.pathname?.replace('/', '')?.replace('-', ' ') || 'Dashboard'}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Icon name="Clock" size={12} />
                    <span>Ready to assist with current workflow</span>
                  </div>
                </div>
              </div>

              {/* Quick Chat Input */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Quick Question</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ask Venice AI..."
                    className="flex-1 px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e?.key === 'Enter') {
                        // Handle quick question
                        console.log('Quick question:', e?.target?.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="default"
                    size="sm"
                    className="px-3"
                  >
                    <Icon name="Send" size={14} />
                  </Button>
                </div>
              </div>

              {/* Full Assistant Link */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleNavigateToFullAssistant}
                className="w-full justify-center"
              >
                <Icon name="ExternalLink" size={14} className="mr-2" />
                Open Full Assistant
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AIAssistantToggle;