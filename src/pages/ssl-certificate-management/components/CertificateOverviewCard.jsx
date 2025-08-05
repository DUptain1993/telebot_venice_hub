import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CertificateOverviewCard = ({ certificate, onRenew, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'valid':
        return 'text-success';
      case 'expiring':
        return 'text-warning';
      case 'expired':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return 'CheckCircle';
      case 'expiring':
        return 'AlertTriangle';
      case 'expired':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilExpiry(certificate?.expiryDate);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Shield" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{certificate?.domain}</h3>
            <p className="text-sm text-muted-foreground">{certificate?.issuer}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Icon 
            name={getStatusIcon(certificate?.status)} 
            size={16} 
            className={getStatusColor(certificate?.status)}
          />
          <span className={`text-sm font-medium capitalize ${getStatusColor(certificate?.status)}`}>
            {certificate?.status}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Valid Until:</span>
          <span className="font-medium text-foreground">
            {new Date(certificate.expiryDate)?.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Days Remaining:</span>
          <span className={`font-medium ${daysLeft <= 30 ? 'text-warning' : daysLeft <= 7 ? 'text-error' : 'text-success'}`}>
            {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Certificate Type:</span>
          <span className="font-medium text-foreground">{certificate?.type}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Auto-Renewal:</span>
          <div className="flex items-center space-x-1">
            <Icon 
              name={certificate?.autoRenewal ? "CheckCircle" : "XCircle"} 
              size={14} 
              className={certificate?.autoRenewal ? "text-success" : "text-muted-foreground"}
            />
            <span className="font-medium text-foreground">
              {certificate?.autoRenewal ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
      {certificate?.status === 'expiring' && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">
              Certificate expires in {daysLeft} days
            </span>
          </div>
        </div>
      )}
      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(certificate)}
          className="flex-1"
        >
          <Icon name="Eye" size={14} className="mr-2" />
          View Details
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => onRenew(certificate)}
          className="flex-1"
        >
          <Icon name="RotateCcw" size={14} className="mr-2" />
          Renew Now
        </Button>
      </div>
    </div>
  );
};

export default CertificateOverviewCard;