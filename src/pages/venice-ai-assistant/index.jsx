import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import GlobalStatusBar from '../../components/ui/GlobalStatusBar';

import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ConversationHistory from './components/ConversationHistory';
import ConversationArea from './components/ConversationArea';
import ContextPanel from './components/ContextPanel';

const VeniceAIAssistant = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState('conv-1');
  const [isTyping, setIsTyping] = useState(false);
  const [currentBot, setCurrentBot] = useState(null);

  // Mock data for conversations
  const [conversations] = useState([
    {
      id: 'conv-1',
      title: 'Bot Setup & Configuration',
      preview: 'Help me create a new Telegram bot with webhook configuration...',
      messageCount: 12,
      hasCode: true,
      updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
      createdAt: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: 'conv-2',
      title: 'Webhook Debugging',
      preview: 'My webhook is not receiving updates properly. Can you help debug?',
      messageCount: 8,
      hasCode: true,
      updatedAt: new Date(Date.now() - 7200000), // 2 hours ago
      createdAt: new Date(Date.now() - 172800000) // 2 days ago
    },
    {
      id: 'conv-3',
      title: 'Command Handler Optimization',
      preview: 'Looking to optimize my command handling system for better performance...',
      messageCount: 15,
      hasCode: true,
      updatedAt: new Date(Date.now() - 86400000), // 1 day ago
      createdAt: new Date(Date.now() - 259200000) // 3 days ago
    },
    {
      id: 'conv-4',
      title: 'SSL Certificate Issues',
      preview: 'Having trouble with SSL certificate configuration for HTTPS webhooks...',
      messageCount: 6,
      hasCode: false,
      updatedAt: new Date(Date.now() - 172800000), // 2 days ago
      createdAt: new Date(Date.now() - 345600000) // 4 days ago
    }
  ]);

  // Mock data for messages
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'user',
      type: 'text',
      content: 'I need help setting up a new Telegram bot with proper webhook configuration. Can you guide me through the process?',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 'msg-2',
      sender: 'ai',
      type: 'text',
      content: `I'd be happy to help you set up a Telegram bot with webhook configuration! Let me guide you through the essential steps.\n\nFirst, let's create the basic bot structure and then configure the webhook for receiving updates.`,
      timestamp: new Date(Date.now() - 3580000)
    },
    {
      id: 'msg-3',
      sender: 'ai',
      type: 'code',
      language: 'javascript',
      explanation: 'Here\'s a basic Express.js server setup for your Telegram bot with webhook configuration:',
      content: `const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 443;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Create bot instance
const bot = new TelegramBot(BOT_TOKEN);

// Middleware for parsing JSON
app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Set webhook
bot.setWebHook(\`\${WEBHOOK_URL}/webhook\`);

// Basic command handlers
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome! Your bot is now active.');
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Available commands:\\n/start - Start the bot\\n/help - Show this help message');
});

// Start server with HTTPS
const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(PORT, () => {
  console.log(\`Bot server running on port \${PORT}\`);
});`,
      timestamp: new Date(Date.now() - 3560000)
    },
    {
      id: 'msg-4',
      sender: 'user',
      type: 'text',
      content: 'This looks great! How do I handle SSL certificates for the webhook? I\'m planning to deploy on Render.',
      timestamp: new Date(Date.now() - 3540000)
    },
    {
      id: 'msg-5',
      sender: 'ai',
      type: 'suggestion',
      content: 'For Render deployment, you have a few options for SSL certificates. Here are the recommended approaches:',
      suggestions: [
        'Use Render\'s automatic SSL',
        'Configure Let\'s Encrypt',
        'Upload custom certificates',
        'Set up domain verification'
      ],
      timestamp: new Date(Date.now() - 3520000)
    }
  ]);

  // Mock data for available bots
  const [availableBots] = useState([
    {
      id: 'bot-1',
      name: 'Customer Support Bot',
      username: 'customer_support_bot',
      status: 'active',
      commandCount: 8,
      webhookCount: 2,
      lastDeploy: '2 hours ago'
    },
    {
      id: 'bot-2',
      name: 'News Aggregator Bot',
      username: 'news_aggregator_bot',
      status: 'inactive',
      commandCount: 12,
      webhookCount: 1,
      lastDeploy: '1 day ago'
    },
    {
      id: 'bot-3',
      name: 'Task Manager Bot',
      username: 'task_manager_bot',
      status: 'active',
      commandCount: 15,
      webhookCount: 3,
      lastDeploy: '30 minutes ago'
    }
  ]);

  // Mock API usage data
  const [apiUsage] = useState({
    used: 45230,
    limit: 100000,
    resetDate: 'Jan 15, 2025'
  });

  // Set initial bot context
  useEffect(() => {
    setCurrentBot(availableBots?.[0]);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    // In a real app, you would load messages for this conversation
  };

  const handleNewConversation = () => {
    const newConversationId = `conv-${Date.now()}`;
    setActiveConversationId(newConversationId);
    setMessages([]);
  };

  const handleSendMessage = (content) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      type: 'text',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        type: 'text',
        content: `I understand you're asking about: "${content}"\n\nLet me help you with that. Based on your current bot context and the question, here's what I recommend...`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleApplyCode = (code, language) => {
    console.log('Applying code to bot configuration:', { code, language });
    // In a real app, this would integrate with the bot configuration system
  };

  const handleBotChange = (bot) => {
    setCurrentBot(bot);
  };

  const activeConversation = conversations?.find(conv => conv?.id === activeConversationId);

  return (
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
      
      <main className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
      } pt-32`}>
        <div className="px-4 pb-4">
          <BreadcrumbNavigation />
        </div>
        
        <div className="h-[calc(100vh-8rem)] flex">
          {/* Left Panel - Conversation History */}
          <div className="w-80 hidden lg:block">
            <ConversationHistory
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
            />
          </div>

          {/* Center Panel - Conversation Area */}
          <div className="flex-1">
            <ConversationArea
              activeConversation={activeConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              onApplyCode={handleApplyCode}
              currentBot={currentBot}
            />
          </div>

          {/* Right Panel - Context Panel */}
          <div className="hidden xl:block">
            <ContextPanel
              currentBot={currentBot}
              onBotChange={handleBotChange}
              availableBots={availableBots}
              apiUsage={apiUsage}
            />
          </div>
        </div>
      </main>

      {/* Mobile Conversation History Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-90">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-card">
            <ConversationHistory
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={(id) => {
                handleSelectConversation(id);
                setIsSidebarOpen(false);
              }}
              onNewConversation={() => {
                handleNewConversation();
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VeniceAIAssistant;