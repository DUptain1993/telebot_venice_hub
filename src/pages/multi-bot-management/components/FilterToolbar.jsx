import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange, 
  sortConfig, 
  onSort,
  selectedBots,
  onBulkAction,
  viewMode,
  onViewModeChange
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [savedFilters, setSavedFilters] = useState([
    { id: 1, name: "Active Bots", filters: { status: "active" } },
    { id: 2, name: "High Performance", filters: { performance: ">80" } },
    { id: 3, name: "Recent Activity", filters: { lastActivity: "today" } }
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'error', label: 'Error' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'userCount-desc', label: 'Most Users' },
    { value: 'userCount-asc', label: 'Least Users' },
    { value: 'performance-desc', label: 'Best Performance' },
    { value: 'performance-asc', label: 'Worst Performance' },
    { value: 'lastActivity-desc', label: 'Recently Active' },
    { value: 'lastActivity-asc', label: 'Least Active' }
  ];

  const bulkActions = [
    { value: 'start', label: 'Start Selected', icon: 'Play' },
    { value: 'stop', label: 'Stop Selected', icon: 'Square' },
    { value: 'restart', label: 'Restart Selected', icon: 'RotateCcw' },
    { value: 'configure', label: 'Bulk Configure', icon: 'Settings' },
    { value: 'export', label: 'Export Config', icon: 'Download' },
    { value: 'delete', label: 'Delete Selected', icon: 'Trash2' }
  ];

  const handleSortChange = (value) => {
    const [key, direction] = value?.split('-');
    onSort(key, direction);
  };

  const handleBulkActionSelect = (action) => {
    onBulkAction(action, selectedBots);
  };

  const handleSaveCurrentFilter = () => {
    const newFilter = {
      id: Date.now(),
      name: `Filter ${savedFilters?.length + 1}`,
      filters: { 
        search: searchTerm, 
        status: statusFilter,
        sort: `${sortConfig?.key}-${sortConfig?.direction}`
      }
    };
    setSavedFilters([...savedFilters, newFilter]);
  };

  const handleLoadSavedFilter = (filter) => {
    if (filter?.filters?.search) onSearchChange(filter?.filters?.search);
    if (filter?.filters?.status) onStatusFilterChange(filter?.filters?.status);
    if (filter?.filters?.sort) {
      const [key, direction] = filter?.filters?.sort?.split('-');
      onSort(key, direction);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Main Filter Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Left Section - Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search bots by name or username..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusFilterChange}
              placeholder="Filter by status"
            />
          </div>

          {/* Sort */}
          <div className="w-full sm:w-48">
            <Select
              options={sortOptions}
              value={`${sortConfig?.key}-${sortConfig?.direction}`}
              onChange={handleSortChange}
              placeholder="Sort by"
            />
          </div>
        </div>

        {/* Right Section - View Mode and Actions */}
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className="px-3"
            >
              <Icon name="Table" size={16} />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="px-3"
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2"
          >
            <Icon name="Filter" size={16} />
            <span>Filters</span>
            <Icon name={showAdvancedFilters ? "ChevronUp" : "ChevronDown"} size={14} />
          </Button>
        </div>
      </div>
      {/* Bulk Actions Bar */}
      {selectedBots?.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedBots?.length} bot{selectedBots?.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {bulkActions?.map((action) => (
              <Button
                key={action?.value}
                variant={action?.value === 'delete' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => handleBulkActionSelect(action?.value)}
                className="flex items-center space-x-1"
              >
                <Icon name={action?.icon} size={14} />
                <span className="hidden sm:inline">{action?.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* Saved Filters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground">Saved Filters</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveCurrentFilter}
                className="flex items-center space-x-1"
              >
                <Icon name="Save" size={14} />
                <span>Save Current</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {savedFilters?.map((filter) => (
                <Button
                  key={filter?.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoadSavedFilter(filter)}
                  className="flex items-center space-x-1"
                >
                  <Icon name="Filter" size={12} />
                  <span>{filter?.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Additional Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Performance Range
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min %"
                  className="w-20"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max %"
                  className="w-20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                User Count Range
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  className="w-20"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="w-20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Last Active
              </label>
              <Select
                options={[
                  { value: 'all', label: 'Any time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This week' },
                  { value: 'month', label: 'This month' }
                ]}
                placeholder="Select timeframe"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;