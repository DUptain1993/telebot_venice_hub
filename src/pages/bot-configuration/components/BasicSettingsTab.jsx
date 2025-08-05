import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const BasicSettingsTab = ({ botData, onBotDataChange, onSave, hasUnsavedChanges }) => {
  const [profileImagePreview, setProfileImagePreview] = useState(botData?.profileImage || '');
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [tokenValidation, setTokenValidation] = useState({ isValid: null, message: '' });

  const handleInputChange = (field, value) => {
    onBotDataChange({ ...botData, [field]: value });
    
    if (field === 'token') {
      setTokenValidation({ isValid: null, message: '' });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e?.target?.result;
        setProfileImagePreview(imageUrl);
        handleInputChange('profileImage', imageUrl);
      };
      reader?.readAsDataURL(file);
    }
  };

  const validateToken = async () => {
    if (!botData?.token) {
      setTokenValidation({ isValid: false, message: 'Token is required' });
      return;
    }

    setIsValidatingToken(true);
    
    // Simulate token validation
    setTimeout(() => {
      const isValid = botData?.token?.match(/^\d{10}:[A-Za-z0-9_-]{35}$/);
      setTokenValidation({
        isValid: !!isValid,
        message: isValid ? 'Token is valid' : 'Invalid token format'
      });
      setIsValidatingToken(false);
    }, 1500);
  };

  const removeProfileImage = () => {
    setProfileImagePreview('');
    handleInputChange('profileImage', '');
  };

  return (
    <div className="space-y-6">
      {/* Bot Token Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Key" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Bot Authentication</h3>
        </div>
        
        <div className="space-y-4">
          <Input
            label="Bot Token"
            type="password"
            placeholder="Enter your Telegram bot token"
            description="Get your bot token from @BotFather on Telegram"
            value={botData?.token || ''}
            onChange={(e) => handleInputChange('token', e?.target?.value)}
            error={tokenValidation?.isValid === false ? tokenValidation?.message : ''}
            required
            className="font-mono text-sm"
          />
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={validateToken}
              loading={isValidatingToken}
              iconName="CheckCircle"
              iconPosition="left"
              disabled={!botData?.token}
            >
              Validate Token
            </Button>
            
            {tokenValidation?.isValid === true && (
              <div className="flex items-center space-x-2 text-success">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm font-medium">{tokenValidation?.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Bot Information Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Info" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Bot Information</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Bot Name"
              type="text"
              placeholder="My Awesome Bot"
              description="Display name for your bot"
              value={botData?.name || ''}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              required
            />
            
            <Input
              label="Bot Username"
              type="text"
              placeholder="@my_awesome_bot"
              description="Telegram username (must end with 'bot')"
              value={botData?.username || ''}
              onChange={(e) => handleInputChange('username', e?.target?.value)}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bot Description
              </label>
              <textarea
                placeholder="Describe what your bot does..."
                value={botData?.description || ''}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This description will be shown to users when they interact with your bot
              </p>
            </div>
          </div>
          
          {/* Profile Image Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Profile Image
              </label>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted overflow-hidden">
                    {profileImagePreview ? (
                      <Image
                        src={profileImagePreview}
                        alt="Bot profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Icon name="ImagePlus" size={32} className="text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Upload Image</p>
                      </div>
                    )}
                  </div>
                  
                  {profileImagePreview && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={removeProfileImage}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                    >
                      <Icon name="X" size={12} />
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('profile-image-input')?.click()}
                    iconName="Upload"
                    iconPosition="left"
                  >
                    Upload Image
                  </Button>
                  
                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  Recommended: 512x512px, PNG or JPG
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Save Actions */}
      <div className="flex items-center justify-between bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <>
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">You have unsaved changes</span>
            </>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location?.reload()}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            loading={false}
            iconName="Save"
            iconPosition="left"
            disabled={!botData?.token || !botData?.name}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasicSettingsTab;