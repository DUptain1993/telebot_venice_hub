import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommandsTab = ({ commands, onCommandsChange, onSave, hasUnsavedChanges }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCommand, setNewCommand] = useState({
    name: '',
    description: '',
    response: ''
  });

  const handleAddCommand = () => {
    if (newCommand?.name && newCommand?.description && newCommand?.response) {
      const updatedCommands = [...commands, {
        id: Date.now(),
        ...newCommand,
        enabled: true,
        createdAt: new Date()?.toISOString()
      }];
      onCommandsChange(updatedCommands);
      setNewCommand({ name: '', description: '', response: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteCommand = (commandId) => {
    const updatedCommands = commands?.filter(cmd => cmd?.id !== commandId);
    onCommandsChange(updatedCommands);
  };

  const handleToggleCommand = (commandId) => {
    const updatedCommands = commands?.map(cmd =>
      cmd?.id === commandId ? { ...cmd, enabled: !cmd?.enabled } : cmd
    );
    onCommandsChange(updatedCommands);
  };

  const handleEditCommand = (commandId, field, value) => {
    const updatedCommands = commands?.map(cmd =>
      cmd?.id === commandId ? { ...cmd, [field]: value } : cmd
    );
    onCommandsChange(updatedCommands);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e?.preventDefault();
    if (draggedIndex === null) return;

    const updatedCommands = [...commands];
    const draggedCommand = updatedCommands?.[draggedIndex];
    updatedCommands?.splice(draggedIndex, 1);
    updatedCommands?.splice(dropIndex, 0, draggedCommand);
    
    onCommandsChange(updatedCommands);
    setDraggedIndex(null);
  };

  const exportCommands = () => {
    const dataStr = JSON.stringify(commands, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'bot-commands.json';
    
    const linkElement = document.createElement('a');
    linkElement?.setAttribute('href', dataUri);
    linkElement?.setAttribute('download', exportFileDefaultName);
    linkElement?.click();
  };

  const importCommands = (event) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedCommands = JSON.parse(e?.target?.result);
          onCommandsChange(importedCommands);
        } catch (error) {
          console.error('Invalid JSON file');
        }
      };
      reader?.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Commands Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Terminal" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Bot Commands</h3>
          <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
            {commands?.length} commands
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('import-commands')?.click()}
            iconName="Upload"
            iconPosition="left"
          >
            Import
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportCommands}
            iconName="Download"
            iconPosition="left"
            disabled={commands?.length === 0}
          >
            Export
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowAddForm(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Command
          </Button>
          
          <input
            id="import-commands"
            type="file"
            accept=".json"
            onChange={importCommands}
            className="hidden"
          />
        </div>
      </div>
      {/* Add Command Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-foreground">Add New Command</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAddForm(false)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                label="Command Name"
                type="text"
                placeholder="start"
                description="Command without the '/' prefix"
                value={newCommand?.name}
                onChange={(e) => setNewCommand({...newCommand, name: e?.target?.value})}
                required
              />
              
              <Input
                label="Description"
                type="text"
                placeholder="Start the bot and show welcome message"
                description="Brief description of what this command does"
                value={newCommand?.description}
                onChange={(e) => setNewCommand({...newCommand, description: e?.target?.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Response Template
              </label>
              <textarea
                placeholder="Welcome to our bot! Use /help to see available commands."
                value={newCommand?.response}
                onChange={(e) => setNewCommand({...newCommand, response: e?.target?.value})}
                rows={6}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use variables like {`{user_name}`} for dynamic content
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleAddCommand}
              disabled={!newCommand?.name || !newCommand?.description || !newCommand?.response}
            >
              Add Command
            </Button>
          </div>
        </div>
      )}
      {/* Commands List */}
      <div className="space-y-3">
        {commands?.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 border border-dashed border-border rounded-lg">
            <Icon name="Terminal" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Commands Yet</h4>
            <p className="text-muted-foreground mb-4">
              Start by adding your first bot command to handle user interactions.
            </p>
            <Button
              variant="default"
              onClick={() => setShowAddForm(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Add Your First Command
            </Button>
          </div>
        ) : (
          commands?.map((command, index) => (
            <div
              key={command?.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`bg-card border border-border rounded-lg p-4 transition-smooth cursor-move hover:shadow-elevation-1 ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icon name="GripVertical" size={16} className="text-muted-foreground" />
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                        /{command?.name}
                      </code>
                      <span className={`w-2 h-2 rounded-full ${
                        command?.enabled ? 'bg-success' : 'bg-muted-foreground'
                      }`} />
                    </div>
                    <p className="text-sm text-muted-foreground">{command?.description}</p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-sm text-foreground font-mono leading-relaxed">
                      {command?.response}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleCommand(command?.id)}
                    title={command?.enabled ? 'Disable command' : 'Enable command'}
                  >
                    <Icon 
                      name={command?.enabled ? "Eye" : "EyeOff"} 
                      size={16} 
                      className={command?.enabled ? 'text-success' : 'text-muted-foreground'}
                    />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCommand(command?.id)}
                    title="Delete command"
                  >
                    <Icon name="Trash2" size={16} className="text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Save Actions */}
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">You have unsaved command changes</span>
          </div>
          
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Commands
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommandsTab;