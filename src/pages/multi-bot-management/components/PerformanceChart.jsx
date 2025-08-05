import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PerformanceChart = ({ bots, selectedBots }) => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('7d');
  const [metric, setMetric] = useState('performance');

  // Mock performance data
  const generatePerformanceData = () => {
    const days = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date?.setDate(date?.getDate() - i);
      
      const dataPoint = {
        date: timeRange === '24h' ? date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timestamp: date?.getTime()
      };

      // Add data for selected bots or all bots if none selected
      const botsToShow = selectedBots?.length > 0 
        ? bots?.filter(bot => selectedBots?.includes(bot?.id))
        : bots?.slice(0, 5); // Show top 5 bots by default

      botsToShow?.forEach(bot => {
        // Generate realistic performance data with some variation
        const baseValue = bot?.[metric] || 75;
        const variation = (Math.random() - 0.5) * 20;
        dataPoint[bot.name] = Math.max(0, Math.min(100, baseValue + variation));
      });

      data?.push(dataPoint);
    }
    
    return data;
  };

  const chartData = generatePerformanceData();
  
  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const metricOptions = [
    { value: 'performance', label: 'Performance Score' },
    { value: 'userCount', label: 'Active Users' },
    { value: 'messageCount', label: 'Message Volume' },
    { value: 'responseTime', label: 'Response Time' }
  ];

  const chartTypeOptions = [
    { value: 'line', label: 'Line Chart', icon: 'TrendingUp' },
    { value: 'bar', label: 'Bar Chart', icon: 'BarChart3' }
  ];

  const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const botsToShow = selectedBots?.length > 0 
    ? bots?.filter(bot => selectedBots?.includes(bot?.id))
    : bots?.slice(0, 5);

  const formatTooltipValue = (value, name) => {
    switch (metric) {
      case 'performance':
        return [`${value?.toFixed(1)}%`, name];
      case 'userCount':
        return [Math.round(value)?.toLocaleString(), name];
      case 'messageCount':
        return [Math.round(value)?.toLocaleString(), name];
      case 'responseTime':
        return [`${value?.toFixed(0)}ms`, name];
      default:
        return [value, name];
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Performance Analytics</h3>
          <p className="text-sm text-muted-foreground">
            {selectedBots?.length > 0 
              ? `Showing ${selectedBots?.length} selected bot${selectedBots?.length > 1 ? 's' : ''}`
              : 'Showing top 5 bots by performance'
            }
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Select
            options={metricOptions}
            value={metric}
            onChange={setMetric}
            className="w-full sm:w-40"
          />
          
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="w-full sm:w-36"
          />

          <div className="flex items-center bg-muted rounded-lg p-1">
            {chartTypeOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={chartType === option?.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType(option?.value)}
                className="px-3"
                title={option?.label}
              >
                <Icon name={option?.icon} size={16} />
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={metric === 'performance' ? [0, 100] : ['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-popover-foreground)'
                }}
                formatter={formatTooltipValue}
              />
              <Legend />
              {botsToShow?.map((bot, index) => (
                <Line
                  key={bot?.id}
                  type="monotone"
                  dataKey={bot?.name}
                  stroke={colors?.[index % colors?.length]}
                  strokeWidth={2}
                  dot={{ fill: colors?.[index % colors?.length], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: colors?.[index % colors?.length], strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={metric === 'performance' ? [0, 100] : ['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-popover-foreground)'
                }}
                formatter={formatTooltipValue}
              />
              <Legend />
              {botsToShow?.map((bot, index) => (
                <Bar
                  key={bot?.id}
                  dataKey={bot?.name}
                  fill={colors?.[index % colors?.length]}
                  radius={[2, 2, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {botsToShow?.slice(0, 4)?.map((bot, index) => (
            <div key={bot?.id} className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors?.[index % colors?.length] }}
                />
                <span className="text-sm font-medium text-foreground truncate">
                  {bot?.name}
                </span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {metric === 'performance' && `${bot?.[metric]}%`}
                {metric === 'userCount' && bot?.[metric]?.toLocaleString()}
                {metric === 'messageCount' && bot?.[metric]?.toLocaleString()}
                {metric === 'responseTime' && `${Math.round(Math.random() * 200 + 50)}ms`}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric === 'performance' && 'Performance'}
                {metric === 'userCount' && 'Users'}
                {metric === 'messageCount' && 'Messages'}
                {metric === 'responseTime' && 'Avg Response'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;