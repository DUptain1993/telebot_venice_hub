import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CertificateUploadSection = ({ onUploadCertificate }) => {
  const [uploadData, setUploadData] = useState({
    certificateFile: null,
    privateKeyFile: null,
    chainFile: null,
    domain: '',
    description: ''
  });
  
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const certificateInputRef = useRef(null);
  const privateKeyInputRef = useRef(null);
  const chainInputRef = useRef(null);

  const handleFileUpload = (fileType, file) => {
    setUploadData(prev => ({
      ...prev,
      [fileType]: file
    }));
    
    // Reset validation when files change
    setValidationResults(null);
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      const file = e?.dataTransfer?.files?.[0];
      // Determine file type based on extension or content
      if (file?.name?.includes('cert') || file?.name?.includes('.crt') || file?.name?.includes('.pem')) {
        handleFileUpload('certificateFile', file);
      } else if (file?.name?.includes('key') || file?.name?.includes('.key')) {
        handleFileUpload('privateKeyFile', file);
      } else if (file?.name?.includes('chain') || file?.name?.includes('ca-bundle')) {
        handleFileUpload('chainFile', file);
      }
    }
  };

  const validateCertificate = async () => {
    if (!uploadData?.certificateFile || !uploadData?.privateKeyFile) {
      return;
    }

    setIsValidating(true);
    
    // Simulate certificate validation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockValidation = {
      isValid: true,
      domain: uploadData?.domain || 'example.com',
      issuer: 'Custom CA',
      validFrom: new Date()?.toISOString(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)?.toISOString(),
      keyMatch: true,
      chainValid: uploadData?.chainFile ? true : false,
      warnings: uploadData?.chainFile ? [] : ['Certificate chain file not provided - may cause trust issues'],
      errors: []
    };

    setValidationResults(mockValidation);
    setIsValidating(false);
  };

  const handleUpload = () => {
    if (validationResults && validationResults?.isValid && onUploadCertificate) {
      onUploadCertificate({
        ...uploadData,
        validation: validationResults
      });
    }
  };

  const FileUploadArea = ({ fileType, label, accept, file, inputRef }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFileUpload(fileType, e?.target?.files?.[0])}
          className="hidden"
        />
        
        {file ? (
          <div className="flex items-center justify-center space-x-2">
            <Icon name="FileText" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">{file?.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleFileUpload(fileType, null)}
              className="w-4 h-4"
            >
              <Icon name="X" size={12} />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Icon name="Upload" size={24} className="text-muted-foreground mx-auto" />
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => inputRef?.current?.click()}
              >
                Choose file
              </Button>
              <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Upload" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Upload Custom Certificate</h3>
          <p className="text-sm text-muted-foreground">Install your own SSL certificate</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Certificate Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Domain Name"
            type="text"
            placeholder="example.com"
            value={uploadData?.domain}
            onChange={(e) => setUploadData(prev => ({ ...prev, domain: e?.target?.value }))}
            required
          />
          
          <Input
            label="Description (Optional)"
            type="text"
            placeholder="Production SSL certificate"
            value={uploadData?.description}
            onChange={(e) => setUploadData(prev => ({ ...prev, description: e?.target?.value }))}
          />
        </div>

        {/* File Upload Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FileUploadArea
            fileType="certificateFile"
            label="Certificate File *"
            accept=".crt,.pem,.cer"
            file={uploadData?.certificateFile}
            inputRef={certificateInputRef}
          />
          
          <FileUploadArea
            fileType="privateKeyFile"
            label="Private Key File *"
            accept=".key,.pem"
            file={uploadData?.privateKeyFile}
            inputRef={privateKeyInputRef}
          />
          
          <FileUploadArea
            fileType="chainFile"
            label="Certificate Chain"
            accept=".crt,.pem,.cer"
            file={uploadData?.chainFile}
            inputRef={chainInputRef}
          />
        </div>

        {/* Validation Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={validateCertificate}
              disabled={!uploadData?.certificateFile || !uploadData?.privateKeyFile || isValidating}
              loading={isValidating}
            >
              <Icon name="CheckCircle" size={16} className="mr-2" />
              {isValidating ? 'Validating...' : 'Validate Certificate'}
            </Button>

            {validationResults && (
              <Button
                variant="default"
                onClick={handleUpload}
                disabled={!validationResults?.isValid}
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Install Certificate
              </Button>
            )}
          </div>

          {/* Validation Results */}
          {validationResults && (
            <div className={`border rounded-lg p-4 ${
              validationResults?.isValid ? 'border-success/20 bg-success/5' : 'border-error/20 bg-error/5'
            }`}>
              <div className="flex items-center space-x-2 mb-3">
                <Icon 
                  name={validationResults?.isValid ? "CheckCircle" : "XCircle"} 
                  size={16} 
                  className={validationResults?.isValid ? "text-success" : "text-error"}
                />
                <h4 className="font-medium text-foreground">
                  {validationResults?.isValid ? 'Certificate Valid' : 'Certificate Invalid'}
                </h4>
              </div>

              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domain:</span>
                    <span className="font-medium text-foreground">{validationResults?.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issuer:</span>
                    <span className="font-medium text-foreground">{validationResults?.issuer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid Until:</span>
                    <span className="font-medium text-foreground">
                      {new Date(validationResults.validUntil)?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Key Match:</span>
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={validationResults?.keyMatch ? "CheckCircle" : "XCircle"} 
                        size={12} 
                        className={validationResults?.keyMatch ? "text-success" : "text-error"}
                      />
                      <span className="font-medium text-foreground">
                        {validationResults?.keyMatch ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {validationResults?.warnings?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <h5 className="font-medium text-warning">Warnings:</h5>
                    {validationResults?.warnings?.map((warning, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Icon name="AlertTriangle" size={12} className="text-warning mt-0.5" />
                        <span className="text-warning">{warning}</span>
                      </div>
                    ))}
                  </div>
                )}

                {validationResults?.errors?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <h5 className="font-medium text-error">Errors:</h5>
                    {validationResults?.errors?.map((error, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Icon name="XCircle" size={12} className="text-error mt-0.5" />
                        <span className="text-error">{error}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="space-y-2 text-sm">
              <h5 className="font-medium text-foreground">Certificate Requirements:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Certificate file must be in PEM or CRT format</li>
                <li>• Private key must match the certificate</li>
                <li>• Certificate chain is recommended for full trust</li>
                <li>• Domain name must match certificate common name</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateUploadSection;