import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ onSidebarToggle, isSidebarCollapsed = false }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();

  const primaryNavItems = [
    { label: 'Bots', path: '/bot-configuration', icon: 'Bot' },
    { label: 'AI Assistant', path: '/venice-ai-assistant', icon: 'Brain' },
    { label: 'Security', path: '/ssl-certificate-management', icon: 'Shield' },
    { label: 'Multi-Bot', path: '/multi-bot-management', icon: 'Network' }
  ];

  const secondaryNavItems = [
    { label: 'Settings', path: '/settings', icon: 'Settings' },
    { label: 'Help', path: '/help', icon: 'HelpCircle' },
    { label: 'Admin', path: '/admin', icon: 'UserCog' }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname?.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border shadow-elevation-1">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section - Logo and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          {/* Mobile Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Icon name="Menu" size={20} />
          </Button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Bot" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">TeleBot Venice Hub</h1>
            </div>
          </div>
        </div>

        {/* Center Section - Primary Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActiveRoute(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              className="flex items-center space-x-2 px-3 py-2"
            >
              <Icon name={item?.icon} size={16} />
              <span className="text-sm font-medium">{item?.label}</span>
            </Button>
          ))}
        </nav>

        {/* Right Section - More Menu and User Actions */}
        <div className="flex items-center space-x-2">
          {/* More Menu (Desktop) */}
          <div className="hidden lg:block relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMoreMenu}
              className="flex items-center space-x-1"
            >
              <Icon name="MoreHorizontal" size={16} />
              <span className="text-sm">More</span>
            </Button>

            {/* More Menu Dropdown */}
            {isMoreMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-90" 
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-2 z-100">
                  <div className="py-2">
                    {secondaryNavItems?.map((item) => (
                      <button
                        key={item?.path}
                        onClick={() => {
                          handleNavigation(item?.path);
                          setIsMoreMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-fast"
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full bg-muted"
            aria-label="User profile"
          >
            <Icon name="User" size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;