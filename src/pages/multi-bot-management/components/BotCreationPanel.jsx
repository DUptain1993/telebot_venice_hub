import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BotCreationPanel = ({ isOpen, onClose, onCreateBot }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    description: '',
    template: '',
    token: '',
    webhookUrl: '',
    features: []
  });

  const templates = [
    {
      value: 'basic',
      label: 'Basic Bot',
      description: 'Simple command-response bot with basic functionality',
      features: ['Commands', 'Text Responses', 'User Management']
    },
    {
      value: 'ecommerce',
      label: 'E-commerce Bot',
      description: 'Bot for online store management and customer support',
      features: ['Product Catalog', 'Order Management', 'Payment Integration', 'Customer Support']
    },
    {
      value: 'support',
      label: 'Support Bot',
      description: 'Customer support bot with ticket management',
      features: ['Ticket System', 'FAQ', 'Live Chat Handoff', 'Analytics']
    },
    {
      value: 'ai-assistant',
      label: 'AI Assistant',
      description: 'Venice AI-powered conversational assistant',
      features: ['Natural Language Processing', 'Context Awareness', 'Learning Capabilities', 'Multi-language']
    },
    {
      value: 'custom',
      label: 'Custom Bot',
      description: 'Build from scratch with custom configuration',
      features: ['Full Customization', 'Advanced Features', 'Custom Integrations']
    }
  ];

  const availableFeatures = [
    { value: 'analytics', label: 'Analytics & Reporting' },
    { value: 'payments', label: 'Payment Processing' },
    { value: 'scheduling', label: 'Appointment Scheduling' },
    { value: 'notifications', label: 'Push Notifications' },
    { value: 'multilang', label: 'Multi-language Support' },
    { value: 'ai-integration', label: 'Venice AI Integration' },
    { value: 'webhook', label: 'Webhook Support' },
    { value: 'database', label: 'Database Integration' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev?.features?.includes(feature)
        ? prev?.features?.filter(f => f !== feature)
        : [...prev?.features, feature]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onCreateBot(formData);
    setFormData({
      name: '',
      username: '',
      description: '',
      template: '',
      token: '',
      webhookUrl: '',
      features: []
    });
    setCurrentStep(1);
    onClose();
  };

  const getSelectedTemplate = () => {
    return templates?.find(t => t?.value === formData?.template);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData?.template !== '';
      case 2:
        return formData?.name && formData?.username && formData?.token;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-90" onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-border shadow-elevation-3 z-100 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Create New Bot</h2>
              <p className="text-sm text-muted-foreground">Step {currentStep} of 3</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3]?.map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-smooth ${
                    step <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step < currentStep ? <Icon name="Check" size={14} /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-1 mx-2 rounded-full transition-smooth ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Template</span>
              <span>Configuration</span>
              <span>Features</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Choose Bot Template</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a template to get started quickly with pre-configured features
                </p>
              </div>
              
              <div className="space-y-3">
                {templates?.map((template) => (
                  <div
                    key={template?.value}
                    className={`border rounded-lg p-4 cursor-pointer transition-smooth hover:border-primary/50 ${
                      formData?.template === template?.value 
                        ? 'border-primary bg-primary/5' :'border-border'
                    }`}
                    onClick={() => handleInputChange('template', template?.value)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 mt-1 transition-smooth ${
                        formData?.template === template?.value
                          ? 'border-primary bg-primary' :'border-border'
                      }`}>
                        {formData?.template === template?.value && (
                          <div className="w-2 h-2 bg-primary-foreground rounded-full m-0.5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{template?.label}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{template?.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template?.features?.map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded-md"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Basic Configuration */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Bot Configuration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure basic settings for your {getSelectedTemplate()?.label}
                </p>
              </div>

              <Input
                label="Bot Name"
                type="text"
                placeholder="Enter bot name"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                required
              />

              <Input
                label="Username"
                type="text"
                placeholder="bot_username"
                value={formData?.username}
                onChange={(e) => handleInputChange('username', e?.target?.value)}
                description="Username without @ symbol"
                required
              />

              <Input
                label="Description"
                type="text"
                placeholder="Brief description of your bot"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
              />

              <Input
                label="Bot Token"
                type="password"
                placeholder="Enter bot token from @BotFather"
                value={formData?.token}
                onChange={(e) => handleInputChange('token', e?.target?.value)}
                description="Get this token from @BotFather on Telegram"
                required
              />

              <Input
                label="Webhook URL"
                type="url"
                placeholder="https://your-domain.com/webhook"
                value={formData?.webhookUrl}
                onChange={(e) => handleInputChange('webhookUrl', e?.target?.value)}
                description="HTTPS URL for receiving bot updates"
              />
            </div>
          )}

          {/* Step 3: Features Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Additional Features</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select additional features to enhance your bot's capabilities
                </p>
              </div>

              {/* Template Features (Pre-selected) */}
              {getSelectedTemplate() && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Included with {getSelectedTemplate()?.label}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getSelectedTemplate()?.features?.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                      >
                        <Icon name="Check" size={12} className="inline mr-1" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Features */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Additional Features</h4>
                <div className="space-y-2">
                  {availableFeatures?.map((feature) => (
                    <label
                      key={feature?.value}
                      className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-fast"
                    >
                      <input
                        type="checkbox"
                        checked={formData?.features?.includes(feature?.value)}
                        onChange={() => handleFeatureToggle(feature?.value)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">{feature?.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <Icon name="ChevronLeft" size={16} />
              <span>Previous</span>
            </Button>

            {currentStep < 3 ? (
              <Button
                variant="default"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <Icon name="ChevronRight" size={16} />
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleSubmit}
                className="flex items-center space-x-2"
              >
                <Icon name="Plus" size={16} />
                <span>Create Bot</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BotCreationPanel;