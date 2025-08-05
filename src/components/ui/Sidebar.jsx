import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isOpen = false, onClose, isCollapsed = false, onToggleCollapse }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationSections = [
    {
      title: 'Bots',
      items: [
        { 
          label: 'Bot Configuration', 
          path: '/bot-configuration', 
          icon: 'Settings',
          description: 'Configure individual bot settings'
        },
        { 
          label: 'Multi-Bot Management', 
          path: '/multi-bot-management', 
          icon: 'Network',
          description: 'Manage multiple bot instances'
        }
      ]
    },
    {
      title: 'AI Assistant',
      items: [
        { 
          label: 'Venice AI Assistant', 
          path: '/venice-ai-assistant', 
          icon: 'Brain',
          description: 'AI-powered coding companion'
        }
      ]
    },
    {
      title: 'Security',
      items: [
        { 
          label: 'SSL Certificate Management', 
          path: '/ssl-certificate-management', 
          icon: 'Shield',
          description: 'Manage SSL certificates and security'
        }
      ]
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname?.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarClasses = `
    fixed left-0 top-16 bottom-0 z-90 bg-card border-r border-border shadow-elevation-1 transition-medium
    ${isMobile 
      ? `${isOpen ? 'translate-x-0' : '-translate-x-full'} w-80`
      : `${isCollapsed ? 'w-16' : 'w-60'} translate-x-0`
    }
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 top-16 bg-black/20 z-80 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <h2 className="text-sm font-medium text-muted-foreground">Navigation</h2>
            )}
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="w-6 h-6"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Icon 
                  name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                  size={14} 
                />
              </Button>
            )}
          </div>

          {/* Navigation Content */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {navigationSections?.map((section) => (
              <div key={section?.title} className="space-y-2">
                {!isCollapsed && (
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                    {section?.title}
                  </h3>
                )}
                
                <div className="space-y-1">
                  {section?.items?.map((item) => {
                    const isActive = isActiveRoute(item?.path);
                    
                    return (
                      <button
                        key={item?.path}
                        onClick={() => handleNavigation(item?.path)}
                        className={`
                          flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-smooth
                          ${isActive 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'text-foreground hover:bg-muted hover:text-foreground'
                          }
                          ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}
                        `}
                        title={isCollapsed ? item?.label : item?.description}
                      >
                        <Icon 
                          name={item?.icon} 
                          size={18} 
                          className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item?.label}</span>
                        )}
                        {!isCollapsed && isActive && (
                          <div className="ml-auto w-2 h-2 bg-primary-foreground rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-muted-foreground" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">Developer</p>
                  <p className="text-xs text-muted-foreground truncate">admin@telebot.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;