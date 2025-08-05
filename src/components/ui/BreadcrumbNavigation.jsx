import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const BreadcrumbNavigation = ({ customBreadcrumbs = null }) => {
  const location = useLocation();

  // Route configuration for breadcrumb generation
  const routeConfig = {
    '/': { label: 'Dashboard', icon: 'Home' },
    '/bot-configuration': { label: 'Bot Configuration', icon: 'Settings', parent: '/' },
    '/venice-ai-assistant': { label: 'Venice AI Assistant', icon: 'Brain', parent: '/' },
    '/ssl-certificate-management': { label: 'SSL Certificate Management', icon: 'Shield', parent: '/' },
    '/multi-bot-management': { label: 'Multi-Bot Management', icon: 'Network', parent: '/' },
    '/settings': { label: 'Settings', icon: 'Settings', parent: '/' },
    '/help': { label: 'Help', icon: 'HelpCircle', parent: '/' },
    '/admin': { label: 'Admin', icon: 'UserCog', parent: '/' }
  };

  // Generate breadcrumb trail
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Dashboard', path: '/', icon: 'Home' }];

    if (pathSegments?.length === 0) {
      return breadcrumbs;
    }

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const config = routeConfig?.[currentPath];
      
      if (config) {
        breadcrumbs?.push({
          label: config?.label,
          path: currentPath,
          icon: config?.icon,
          isLast: index === pathSegments?.length - 1
        });
      } else {
        // Handle dynamic segments (like bot IDs)
        const formattedLabel = segment?.split('-')?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ');
        
        breadcrumbs?.push({
          label: formattedLabel,
          path: currentPath,
          icon: 'ChevronRight',
          isLast: index === pathSegments?.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render if only dashboard
  if (breadcrumbs?.length <= 1 && location.pathname === '/') {
    return null;
  }

  const handleNavigation = (path) => {
    if (path !== location.pathname) {
      window.location.href = path;
    }
  };

  return (
    <nav className="flex items-center space-x-1 py-3" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-muted-foreground mx-2" 
              />
            )}
            
            {crumb?.isLast ? (
              // Current page - not clickable
              (<div className="flex items-center space-x-2 px-2 py-1">
                <Icon 
                  name={crumb?.icon} 
                  size={14} 
                  className="text-primary" 
                />
                <span className="text-sm font-medium text-foreground">
                  {crumb?.label}
                </span>
              </div>)
            ) : (
              // Clickable breadcrumb
              (<Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(crumb?.path)}
                className="flex items-center space-x-2 px-2 py-1 h-auto text-muted-foreground hover:text-foreground transition-fast"
              >
                <Icon 
                  name={crumb?.icon} 
                  size={14} 
                />
                <span className="text-sm">
                  {crumb?.label}
                </span>
              </Button>)
            )}
          </li>
        ))}
      </ol>
      {/* Quick Actions for Current Page */}
      {location.pathname !== '/' && (
        <div className="ml-auto flex items-center space-x-2">
          {/* Refresh/Reload Action */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location?.reload()}
            className="w-6 h-6"
            title="Refresh page"
          >
            <Icon name="RotateCcw" size={14} />
          </Button>

          {/* Context-specific actions based on current route */}
          {location.pathname === '/bot-configuration' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log('Save configuration')}
              className="w-6 h-6"
              title="Save configuration"
            >
              <Icon name="Save" size={14} />
            </Button>
          )}

          {location.pathname === '/ssl-certificate-management' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log('Check SSL status')}
              className="w-6 h-6"
              title="Check SSL status"
            >
              <Icon name="RefreshCw" size={14} />
            </Button>
          )}

          {location.pathname === '/multi-bot-management' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log('Add new bot')}
              className="w-6 h-6"
              title="Add new bot"
            >
              <Icon name="Plus" size={14} />
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default BreadcrumbNavigation;