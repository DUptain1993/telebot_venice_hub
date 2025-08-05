import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationHistory = ({ conversations, activeConversationId, onSelectConversation, onNewConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredConversations = conversations?.filter(conv =>
    conv?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    conv?.preview?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date?.toLocaleDateString();
  };

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-full'}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </Button>
        </div>
        
        {!isCollapsed && (
          <>
            {/* Search */}
            <div className="relative mb-3">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* New Conversation Button */}
            <Button
              variant="default"
              size="sm"
              onClick={onNewConversation}
              className="w-full justify-start"
            >
              <Icon name="Plus" size={16} className="mr-2" />
              New Conversation
            </Button>
          </>
        )}
      </div>
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed ? (
          <div className="p-2 space-y-1">
            {filteredConversations?.map((conversation) => (
              <button
                key={conversation?.id}
                onClick={() => onSelectConversation(conversation?.id)}
                className={`w-full text-left p-3 rounded-lg transition-smooth ${
                  activeConversationId === conversation?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-medium text-sm truncate flex-1 mr-2">
                    {conversation?.title}
                  </h3>
                  <span className="text-xs opacity-75 flex-shrink-0">
                    {formatDate(conversation?.updatedAt)}
                  </span>
                </div>
                <p className="text-xs opacity-75 line-clamp-2">
                  {conversation?.preview}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="MessageCircle" size={12} className="opacity-60" />
                    <span className="text-xs opacity-60">{conversation?.messageCount}</span>
                  </div>
                  {conversation?.hasCode && (
                    <Icon name="Code" size={12} className="opacity-60" />
                  )}
                </div>
              </button>
            ))}
            
            {filteredConversations?.length === 0 && (
              <div className="text-center py-8">
                <Icon name="MessageCircle" size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {conversations?.slice(0, 5)?.map((conversation) => (
              <Button
                key={conversation?.id}
                variant={activeConversationId === conversation?.id ? "default" : "ghost"}
                size="icon"
                onClick={() => onSelectConversation(conversation?.id)}
                className="w-8 h-8"
                title={conversation?.title}
              >
                <Icon name="MessageCircle" size={14} />
              </Button>
            ))}
          </div>
        )}
      </div>
      {/* Quick Templates */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <h3 className="text-sm font-medium text-foreground mb-2">Quick Templates</h3>
          <div className="space-y-1">
            {[
              { label: 'Bot Setup', icon: 'Settings' },
              { label: 'Webhook Config', icon: 'Link' },
              { label: 'Command Handler', icon: 'Terminal' },
              { label: 'Error Debug', icon: 'Bug' }
            ]?.map((template) => (
              <Button
                key={template?.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => {
                  // Handle template selection
                  console.log('Template selected:', template?.label);
                }}
              >
                <Icon name={template?.icon} size={14} className="mr-2" />
                {template?.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;