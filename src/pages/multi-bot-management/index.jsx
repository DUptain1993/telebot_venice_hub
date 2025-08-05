import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import GlobalStatusBar from '../../components/ui/GlobalStatusBar';
import AIAssistantToggle from '../../components/ui/AIAssistantToggle';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import page-specific components
import BotCard from './components/BotCard';
import BotTable from './components/BotTable';
import FilterToolbar from './components/FilterToolbar';
import BotCreationPanel from './components/BotCreationPanel';
import PerformanceChart from './components/PerformanceChart';

const MultiBotManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBots, setSelectedBots] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isCreationPanelOpen, setIsCreationPanelOpen] = useState(false);
  const [showPerformanceChart, setShowPerformanceChart] = useState(false);

  // Mock bot data
  const [bots, setBots] = useState([
    {
      id: 1,
      name: 'Customer Support Bot',
      username: 'support_bot',
      status: 'active',
      userCount: 15420,
      messageCount: 89650,
      performance: 94,
      lastActivity: '2 min ago',
      version: '2.1.4',
      description: 'Handles customer inquiries and support tickets'
    },
    {
      id: 2,
      name: 'E-commerce Assistant',
      username: 'shop_assistant',
      status: 'active',
      userCount: 8930,
      messageCount: 45230,
      performance: 87,
      lastActivity: '5 min ago',
      version: '1.8.2',
      description: 'Manages product inquiries and order processing'
    },
    {
      id: 3,
      name: 'News Aggregator',
      username: 'news_bot',
      status: 'maintenance',
      userCount: 23100,
      messageCount: 156780,
      performance: 72,
      lastActivity: '1 hour ago',
      version: '3.0.1',
      description: 'Delivers personalized news updates and alerts'
    },
    {
      id: 4,
      name: 'Booking Manager',
      username: 'booking_bot',
      status: 'inactive',
      userCount: 5670,
      messageCount: 28940,
      performance: 45,
      lastActivity: '3 hours ago',
      version: '1.5.7',
      description: 'Handles appointment scheduling and bookings'
    },
    {
      id: 5,
      name: 'AI Code Assistant',
      username: 'code_helper',
      status: 'active',
      userCount: 12800,
      messageCount: 67890,
      performance: 91,
      lastActivity: '1 min ago',
      version: '2.3.0',
      description: 'Venice AI-powered coding assistance and debugging'
    },
    {
      id: 6,
      name: 'Weather Bot',
      username: 'weather_updates',
      status: 'error',
      userCount: 18500,
      messageCount: 92340,
      performance: 23,
      lastActivity: '6 hours ago',
      version: '1.2.8',
      description: 'Provides weather forecasts and alerts'
    },
    {
      id: 7,
      name: 'Fitness Tracker',
      username: 'fitness_bot',
      status: 'active',
      userCount: 9200,
      messageCount: 41560,
      performance: 88,
      lastActivity: '10 min ago',
      version: '2.0.3',
      description: 'Tracks workouts and provides fitness guidance'
    },
    {
      id: 8,
      name: 'Language Tutor',
      username: 'language_bot',
      status: 'active',
      userCount: 6750,
      messageCount: 34280,
      performance: 85,
      lastActivity: '15 min ago',
      version: '1.9.1',
      description: 'Interactive language learning and practice'
    }
  ]);

  // Filter and sort bots
  const filteredAndSortedBots = React.useMemo(() => {
    let filtered = bots?.filter(bot => {
      const matchesSearch = bot?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           bot?.username?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bot?.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort bots
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (sortConfig?.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [bots, searchTerm, statusFilter, sortConfig]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleBotSelect = (botId, isSelected) => {
    if (isSelected) {
      setSelectedBots([...selectedBots, botId]);
    } else {
      setSelectedBots(selectedBots?.filter(id => id !== botId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedBots(filteredAndSortedBots?.map(bot => bot?.id));
    } else {
      setSelectedBots([]);
    }
  };

  const handleSort = (key, direction = null) => {
    const newDirection = direction || (sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc');
    setSortConfig({ key, direction: newDirection });
  };

  const handleQuickAction = (action, bot) => {
    switch (action) {
      case 'monitor': console.log('Monitor bot:', bot?.name);
        // Navigate to monitoring page
        break;
      case 'configure': console.log('Configure bot:', bot?.name);
        // Navigate to configuration page
        window.location.href = '/bot-configuration';
        break;
      case 'logs': console.log('View logs for:', bot?.name);
        // Open logs modal or navigate to logs page
        break;
      case 'more': console.log('More actions for:', bot?.name);
        // Show context menu
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action, botIds) => {
    console.log(`Bulk action: ${action} on bots:`, botIds);
    
    switch (action) {
      case 'start':
        setBots(prev => prev?.map(bot => 
          botIds?.includes(bot?.id) ? { ...bot, status: 'active' } : bot
        ));
        break;
      case 'stop':
        setBots(prev => prev?.map(bot => 
          botIds?.includes(bot?.id) ? { ...bot, status: 'inactive' } : bot
        ));
        break;
      case 'restart':
        setBots(prev => prev?.map(bot => 
          botIds?.includes(bot?.id) ? { ...bot, status: 'active', lastActivity: 'Just now' } : bot
        ));
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${botIds?.length} bot(s)?`)) {
          setBots(prev => prev?.filter(bot => !botIds?.includes(bot?.id)));
          setSelectedBots([]);
        }
        break;
      default:
        break;
    }
  };

  const handleCreateBot = (botData) => {
    const newBot = {
      id: Date.now(),
      name: botData?.name,
      username: botData?.username,
      status: 'inactive',
      userCount: 0,
      messageCount: 0,
      performance: 0,
      lastActivity: 'Never',
      version: '1.0.0',
      description: botData?.description || 'New bot instance'
    };
    
    setBots(prev => [...prev, newBot]);
    console.log('Created new bot:', newBot);
  };

  // Calculate summary statistics
  const summaryStats = React.useMemo(() => {
    const total = bots?.length;
    const active = bots?.filter(bot => bot?.status === 'active')?.length;
    const inactive = bots?.filter(bot => bot?.status === 'inactive')?.length;
    const errors = bots?.filter(bot => bot?.status === 'error')?.length;
    const totalUsers = bots?.reduce((sum, bot) => sum + bot?.userCount, 0);
    const avgPerformance = bots?.reduce((sum, bot) => sum + bot?.performance, 0) / total;

    return { total, active, inactive, errors, totalUsers, avgPerformance };
  }, [bots]);

  return (
    <>
      <Helmet>
        <title>Multi-Bot Management - TeleBot Venice Hub</title>
        <meta name="description" content="Manage multiple Telegram bots efficiently with bulk operations, performance analytics, and unified administrative interface." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          onSidebarToggle={handleSidebarToggle}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleSidebarCollapse}
        />

        <GlobalStatusBar />

        <main className={`pt-32 transition-smooth ${
          isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'
        }`}>
          <div className="px-4 lg:px-8 pb-8">
            {/* Breadcrumb Navigation */}
            <BreadcrumbNavigation />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Multi-Bot Management</h1>
                <p className="text-muted-foreground">
                  Manage and monitor all your Telegram bots from a unified dashboard
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={() => setShowPerformanceChart(!showPerformanceChart)}
                  className="flex items-center space-x-2"
                >
                  <Icon name="BarChart3" size={16} />
                  <span>Analytics</span>
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => setIsCreationPanelOpen(true)}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Plus" size={16} />
                  <span>Create Bot</span>
                </Button>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Bot" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Total Bots</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{summaryStats?.total}</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-muted-foreground">Active</span>
                </div>
                <div className="text-2xl font-bold text-success">{summaryStats?.active}</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Circle" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Inactive</span>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">{summaryStats?.inactive}</div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Users" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Total Users</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {summaryStats?.totalUsers?.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="TrendingUp" size={16} className="text-success" />
                  <span className="text-sm font-medium text-muted-foreground">Avg Performance</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {summaryStats?.avgPerformance?.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            {showPerformanceChart && (
              <div className="mb-8">
                <PerformanceChart 
                  bots={filteredAndSortedBots}
                  selectedBots={selectedBots}
                />
              </div>
            )}

            {/* Filter Toolbar */}
            <div className="mb-6">
              <FilterToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortConfig={sortConfig}
                onSort={handleSort}
                selectedBots={selectedBots}
                onBulkAction={handleBulkAction}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>

            {/* Bot List */}
            {viewMode === 'table' ? (
              <BotTable
                bots={filteredAndSortedBots}
                selectedBots={selectedBots}
                onSelectBot={handleBotSelect}
                onSelectAll={handleSelectAll}
                onQuickAction={handleQuickAction}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedBots?.map((bot) => (
                  <BotCard
                    key={bot?.id}
                    bot={bot}
                    isSelected={selectedBots?.includes(bot?.id)}
                    onSelect={handleBotSelect}
                    onQuickAction={handleQuickAction}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredAndSortedBots?.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Bot" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No bots found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || statusFilter !== 'all' ?'Try adjusting your filters or search terms' :'Get started by creating your first bot'
                  }
                </p>
                {(!searchTerm && statusFilter === 'all') && (
                  <Button
                    variant="default"
                    onClick={() => setIsCreationPanelOpen(true)}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="Plus" size={16} />
                    <span>Create Your First Bot</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Bot Creation Panel */}
        <BotCreationPanel
          isOpen={isCreationPanelOpen}
          onClose={() => setIsCreationPanelOpen(false)}
          onCreateBot={handleCreateBot}
        />

        <AIAssistantToggle />
      </div>
    </>
  );
};

export default MultiBotManagement;