import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CertificateDetailsPanel = ({ certificate, onClose, onDownload }) => {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Certificate Details', icon: 'FileText' },
    { id: 'chain', label: 'Certificate Chain', icon: 'Link' },
    { id: 'security', label: 'Security Analysis', icon: 'Shield' }
  ];

  const certificateDetails = {
    serialNumber: "4A:B2:C3:D4:E5:F6:78:90:12:34:56:78:90:AB:CD:EF",
    fingerprint: "SHA256: 1A:2B:3C:4D:5E:6F:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB",
    algorithm: "RSA 2048-bit",
    keyUsage: ["Digital Signature", "Key Encipherment"],
    extendedKeyUsage: ["Server Authentication"],
    subjectAlternativeNames: [
      certificate?.domain,
      `www.${certificate?.domain}`,
      `api.${certificate?.domain}`
    ]
  };

  const certificateChain = [
    {
      level: 0,
      name: certificate?.domain,
      type: "End Entity Certificate",
      issuer: certificate?.issuer,
      status: "valid"
    },
    {
      level: 1,
      name: "Let\'s Encrypt Authority X3",
      type: "Intermediate Certificate",
      issuer: "DST Root CA X3",
      status: "valid"
    },
    {
      level: 2,
      name: "DST Root CA X3",
      type: "Root Certificate",
      issuer: "Self-signed",
      status: "valid"
    }
  ];

  const securityAnalysis = {
    grade: "A+",
    score: 95,
    vulnerabilities: [],
    recommendations: [
      "Certificate is properly configured",
      "Strong encryption algorithms in use",
      "No known security issues detected"
    ],
    protocols: {
      "TLS 1.3": { supported: true, recommended: true },
      "TLS 1.2": { supported: true, recommended: true },
      "TLS 1.1": { supported: false, recommended: false },
      "TLS 1.0": { supported: false, recommended: false }
    }
  };

  const renderDetailsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Basic Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Common Name:</span>
              <span className="text-sm font-medium text-foreground">{certificate?.domain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Issuer:</span>
              <span className="text-sm font-medium text-foreground">{certificate?.issuer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valid From:</span>
              <span className="text-sm font-medium text-foreground">
                {new Date(certificate.issuedDate)?.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valid Until:</span>
              <span className="text-sm font-medium text-foreground">
                {new Date(certificate.expiryDate)?.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Technical Details</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Serial Number:</span>
              <span className="text-sm font-mono text-foreground text-right">
                {certificateDetails?.serialNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Algorithm:</span>
              <span className="text-sm font-medium text-foreground">{certificateDetails?.algorithm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Key Usage:</span>
              <div className="text-right">
                {certificateDetails?.keyUsage?.map((usage, index) => (
                  <div key={index} className="text-sm text-foreground">{usage}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Subject Alternative Names</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {certificateDetails?.subjectAlternativeNames?.map((name, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <Icon name="Globe" size={14} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Fingerprint</h4>
        <div className="p-3 bg-muted rounded-md">
          <p className="text-xs font-mono text-foreground break-all">
            {certificateDetails?.fingerprint}
          </p>
        </div>
      </div>
    </div>
  );

  const renderChainTab = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Certificate Chain Validation</h4>
      <div className="space-y-3">
        {certificateChain?.map((cert, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-full">
              <Icon name="CheckCircle" size={16} className="text-success" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-foreground">{cert?.name}</h5>
                <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                  {cert?.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{cert?.type}</p>
              <p className="text-xs text-muted-foreground">Issued by: {cert?.issuer}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Level {cert?.level}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Security Grade</h4>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-success">{securityAnalysis?.grade}</div>
          <div className="text-sm text-muted-foreground">({securityAnalysis?.score}/100)</div>
        </div>
      </div>

      <div className="space-y-4">
        <h5 className="font-medium text-foreground">Protocol Support</h5>
        <div className="space-y-2">
          {Object.entries(securityAnalysis?.protocols)?.map(([protocol, info]) => (
            <div key={protocol} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <span className="font-medium text-foreground">{protocol}</span>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={info?.supported ? "CheckCircle" : "XCircle"} 
                  size={16} 
                  className={info?.supported ? "text-success" : "text-muted-foreground"}
                />
                <span className="text-sm text-muted-foreground">
                  {info?.recommended ? "Recommended" : "Not Recommended"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h5 className="font-medium text-foreground">Security Recommendations</h5>
        <div className="space-y-2">
          {securityAnalysis?.recommendations?.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-2 p-3 bg-success/5 border border-success/20 rounded-lg">
              <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
              <span className="text-sm text-foreground">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Certificate Details</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(certificate)}
            >
              <Icon name="Download" size={14} className="mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-fast ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'chain' && renderChainTab()}
          {activeTab === 'security' && renderSecurityTab()}
        </div>
      </div>
    </div>
  );
};

export default CertificateDetailsPanel;