import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationArea = ({ 
  activeConversation, 
  messages, 
  onSendMessage, 
  isTyping, 
  onApplyCode,
  currentBot 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef?.current?.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSend = () => {
    if (inputValue?.trim()) {
      onSendMessage(inputValue?.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    // Could add toast notification here
  };

  const formatTimestamp = (date) => {
    return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message) => {
    const isUser = message?.sender === 'user';
    
    return (
      <div key={message?.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
          {/* Message Header */}
          <div className={`flex items-center mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-center space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isUser ? 'bg-primary' : 'bg-accent'
              }`}>
                <Icon 
                  name={isUser ? 'User' : 'Brain'} 
                  size={12} 
                  className={isUser ? 'text-primary-foreground' : 'text-accent-foreground'}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {isUser ? 'You' : 'Venice AI'}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(message?.timestamp)}
              </span>
            </div>
          </div>

          {/* Message Content */}
          <div className={`rounded-lg p-4 ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-foreground'
          }`}>
            {message?.type === 'text' && (
              <p className="whitespace-pre-wrap">{message?.content}</p>
            )}
            
            {message?.type === 'code' && (
              <div className="space-y-3">
                {message?.explanation && (
                  <p className="text-sm mb-3">{message?.explanation}</p>
                )}
                <div className="bg-background/10 rounded-md overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border/20">
                    <span className="text-xs font-medium">{message?.language || 'javascript'}</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(message?.content)}
                        className="w-6 h-6"
                      >
                        <Icon name="Copy" size={12} />
                      </Button>
                      {!isUser && onApplyCode && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onApplyCode(message?.content, message?.language)}
                          className="w-6 h-6"
                        >
                          <Icon name="Download" size={12} />
                        </Button>
                      )}
                    </div>
                  </div>
                  <pre className="p-3 text-sm overflow-x-auto">
                    <code>{message?.content}</code>
                  </pre>
                </div>
              </div>
            )}

            {message?.type === 'suggestion' && (
              <div className="space-y-2">
                <p className="text-sm">{message?.content}</p>
                <div className="flex flex-wrap gap-2">
                  {message?.suggestions?.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="Brain" size={16} className="text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              {activeConversation?.title || 'New Conversation'}
            </h2>
            {currentBot && (
              <p className="text-xs text-muted-foreground">
                Context: {currentBot?.name}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>Online</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8"
          >
            <Icon name={isExpanded ? "Minimize2" : "Maximize2"} size={14} />
          </Button>
        </div>
      </div>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
              <Icon name="Brain" size={32} className="text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Welcome to Venice AI Assistant
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              I'm here to help you with Telegram bot development, code generation, debugging, and best practices.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                'Create a new bot handler',
                'Debug webhook issues',
                'Generate bot commands',
                'Optimize bot performance'
              ]?.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages?.map(renderMessage)}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[80%]">
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center mr-2">
                      <Icon name="Brain" size={12} className="text-accent-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">Venice AI is typing...</span>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e?.target?.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Venice AI about bot development, code generation, or debugging..."
              className="w-full min-h-[44px] max-h-32 px-4 py-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={1}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10"
              title="Attach file"
            >
              <Icon name="Paperclip" size={16} />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={handleSend}
              disabled={!inputValue?.trim()}
              className="w-10 h-10"
            >
              <Icon name="Send" size={16} />
            </Button>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            {[
              { label: 'Code', icon: 'Code' },
              { label: 'Debug', icon: 'Bug' },
              { label: 'Optimize', icon: 'Zap' }
            ]?.map((action) => (
              <Button
                key={action?.label}
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setInputValue(`Help me ${action?.label?.toLowerCase()} `)}
              >
                <Icon name={action?.icon} size={12} className="mr-1" />
                {action?.label}
              </Button>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationArea;