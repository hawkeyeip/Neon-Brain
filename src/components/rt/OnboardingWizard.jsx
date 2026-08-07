import React, { useState, useRef } from 'react';
import { 
  X, 
  Check, 
  Download, 
  Upload, 
  ShieldAlert, 
  Sparkles, 
  Info, 
  AlertTriangle, 
  Lock, 
  Server, 
  Key, 
  FileSpreadsheet, 
  FileDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

export default function OnboardingWizard({ isOpen, onClose, onImportData }) {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(1);
  const [securityChecks, setSecurityChecks] = useState({
    csvRule: false,
    airGapped: false,
    passwordIrretrievable: false,
    developerSecrets: false
  });
  
  // CSV Import State
  const [parsedData, setParsedData] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const totalSteps = 5;

  const handleSecurityToggle = (key) => {
    setSecurityChecks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const allSecurityChecked = 
    securityChecks.csvRule && 
    securityChecks.airGapped && 
    securityChecks.passwordIrretrievable && 
    securityChecks.developerSecrets;

  // Local client-side CSV parser
  const parseCSVText = (text) => {
    const lines = [];
    let row = [""];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          row[row.length - 1] += '"';
          i++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push("");
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip LF after CR
        }
        lines.push(row);
        row = [""];
      } else {
        row[row.length - 1] += char;
      }
    }
    if (row.length > 1 || row[0] !== "") {
      lines.push(row);
    }
    return lines;
  };

  // Normalization and validation
  const processCSVData = (rows) => {
    if (rows.length < 2) {
      setImportErrors(["CSV file seems to be empty or contains header only."]);
      return;
    }

    const rawHeaders = rows[0].map(h => h.trim().toLowerCase());
    const dataRows = rows.slice(1);
    
    // Find index maps
    const getIndex = (aliases) => {
      return rawHeaders.findIndex(h => aliases.some(alias => h.includes(alias)));
    };

    const idxName = getIndex(['name', 'title', 'resource']);
    const idxType = getIndex(['type']);
    const idxCategory = getIndex(['category', 'cat']);
    const idxCost = getIndex(['cost', 'price', 'rate']);
    const idxValue = getIndex(['value', 'amount', 'credit']);
    const idxCurrency = getIndex(['currency', 'curr']);
    const idxCycle = getIndex(['cycle', 'billing', 'frequency']);
    const idxExpiry = getIndex(['expiry', 'expiration', 'renewal', 'date']);
    const idxAlert = getIndex(['alert', 'days']);
    const idxUrl = getIndex(['url', 'website', 'link']);
    const idxNotes = getIndex(['notes', 'desc', 'description']);
    const idxBusiness = getIndex(['business', 'corp']);
    const idxTax = getIndex(['tax', 'deductible']);

    if (idxName === -1) {
      setImportErrors(["Could not identify the 'Name' column in your CSV. Please ensure a column named 'Name' exists."]);
      return;
    }

    const resources = [];
    const errors = [];

    dataRows.forEach((row, rowIndex) => {
      // Skip empty rows
      if (row.length === 0 || (row.length === 1 && row[0].trim() === "")) return;

      const name = row[idxName] ? row[idxName].trim() : '';
      if (!name) {
        errors.push(`Row ${rowIndex + 2}: Name is missing. Row skipped.`);
        return;
      }

      // Check and normalize Type
      let type = idxType !== -1 && row[idxType] ? row[idxType].trim().toLowerCase() : 'subscription';
      if (!['subscription', 'credit', 'coupon', 'account', 'other'].includes(type)) {
        if (type.includes('sub')) type = 'subscription';
        else if (type.includes('cred') || type.includes('vouch')) type = 'credit';
        else if (type.includes('coup') || type.includes('promo')) type = 'coupon';
        else if (type.includes('acc')) type = 'account';
        else type = 'other';
      }

      // Normalize Category
      let category = idxCategory !== -1 && row[idxCategory] ? row[idxCategory].trim() : 'Other';
      const matchedCat = CATEGORIES.find(c => c.toLowerCase() === category.toLowerCase());
      if (matchedCat) {
        category = matchedCat;
      } else {
        category = 'Other';
      }

      // Financials
      const cost = idxCost !== -1 && row[idxCost] ? parseFloat(row[idxCost].replace(/[^0-9.]/g, '')) || 0 : 0;
      const value = idxValue !== -1 && row[idxValue] ? parseFloat(row[idxValue].replace(/[^0-9.]/g, '')) || 0 : 0;

      // Currency
      const currency = idxCurrency !== -1 && row[idxCurrency] ? row[idxCurrency].trim().toUpperCase() : 'USD';

      // Billing Cycle
      let billingCycle = idxCycle !== -1 && row[idxCycle] ? row[idxCycle].trim().toLowerCase() : 'monthly';
      if (!['monthly', 'yearly', 'one-time'].includes(billingCycle)) {
        if (billingCycle.includes('month')) billingCycle = 'monthly';
        else if (billingCycle.includes('year') || billingCycle.includes('annual')) billingCycle = 'yearly';
        else billingCycle = 'one-time';
      }

      // Expiry Date
      let expiryDate = idxExpiry !== -1 && row[idxExpiry] ? row[idxExpiry].trim() : '';
      if (expiryDate) {
        // Simple sanitization to see if date parses
        const d = new Date(expiryDate);
        if (isNaN(d.getTime())) {
          errors.push(`Row ${rowIndex + 2}: Date '${expiryDate}' is invalid. Expiring date left blank.`);
          expiryDate = '';
        } else {
          // Format YYYY-MM-DD
          expiryDate = d.toISOString().split('T')[0];
        }
      }

      // Alert Days
      const alertDays = idxAlert !== -1 && row[idxAlert] ? parseInt(row[idxAlert].replace(/[^0-9]/g, '')) || 7 : 7;

      // URL and Notes
      const url = idxUrl !== -1 && row[idxUrl] ? row[idxUrl].trim() : '';
      const notes = idxNotes !== -1 && row[idxNotes] ? row[idxNotes].trim() : '';

      // Toggles
      const checkBool = (val) => {
        if (!val) return false;
        const v = val.trim().toLowerCase();
        return v === 'true' || v === '1' || v === 'yes' || v === 'y';
      };
      const isBusiness = idxBusiness !== -1 ? checkBool(row[idxBusiness]) : false;
      const isTaxWriteOff = idxTax !== -1 ? checkBool(row[idxTax]) : false;

      resources.push({
        id: `import-${Date.now()}-${rowIndex}`,
        name,
        type,
        category,
        cost: type === 'subscription' ? cost : 0,
        value: (type === 'credit' || type === 'coupon') ? value : 0,
        currency,
        billingCycle: type === 'subscription' ? billingCycle : 'one-time',
        expiryDate: expiryDate || null,
        alertDays,
        url,
        notes,
        used: false,
        autoRenew: type === 'subscription',
        isBusiness,
        isTaxWriteOff,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      });
    });

    setParsedData(resources);
    setImportErrors(errors);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = parseCSVText(text);
      processCSVData(rows);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const rows = parseCSVText(text);
        processCSVData(rows);
      };
      reader.readAsText(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const downloadCSVTemplate = () => {
    const headers = [
      "Name",
      "Type",
      "Category",
      "Cost",
      "Value",
      "Currency",
      "Billing Cycle",
      "Next Renewal/Expiry Date",
      "Alert Days",
      "Login URL",
      "Notes",
      "Business Expense",
      "Tax Deductible"
    ];
    
    const sampleRows = [
      ["Netflix Premium", "subscription", "Entertainment", "22.99", "0", "USD", "monthly", "2026-06-15", "5", "https://www.netflix.com", "Billed to Chase Sapphire credit card.", "false", "false"],
      ["Delta Flight Credit", "credit", "Travel", "0", "250.00", "USD", "one-time", "2026-12-31", "14", "https://www.delta.com", "Credit reference: DL-9831A92. Received due to delays.", "false", "false"],
      ["Adobe Suite", "subscription", "Software/SaaS", "54.99", "0", "USD", "monthly", "2026-06-28", "7", "https://www.adobe.com", "Creative Cloud Suite licenses.", "true", "true"]
    ];

    const csvRows = [
      headers.join(","),
      ...sampleRows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
    ];

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "resource_tracker_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const executeImport = () => {
    if (parsedData.length > 0) {
      onImportData(parsedData);
    }
    // Proceed to efficiency tips
    setCurrentStep(4);
  };

  const completeOnboarding = () => {
    localStorage.setItem('resource_tracker_onboarding_completed', 'true');
    onClose();
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card glass-panel">
        
        {/* Header Section */}
        <div className="onboarding-header">
          <div className="onboarding-logo-title">
            <Sparkles className="logo-sparkle animate-pulse" size={24} />
            <h2>Resource Onboarding & Security Vault</h2>
          </div>
          <button className="onboarding-close-btn" onClick={onClose} aria-label="Close onboarding">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="onboarding-progress-bar-wrapper">
          <div 
            className="onboarding-progress-fill" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
          <div className="onboarding-steps-indicator">
            Step {currentStep} of {totalSteps}: {
              currentStep === 1 ? "Welcome Setup" :
              currentStep === 2 ? "Security & Privacy Protocol" :
              currentStep === 3 ? "Data CSV Migration" :
              currentStep === 4 ? "Efficiency Quick-Wins" : "Success & Vault Lock"
            }
          </div>
        </div>

        {/* Body content based on step */}
        <div className="onboarding-body">
          
          {/* STEP 1: Welcome */}
          {currentStep === 1 && (
            <div className="onboarding-step-content welcome-step animate-fade-in">
              <div className="onboarding-hero-icon-container">
                <div className="pulsing-glow-ring"></div>
                <Sparkles size={48} className="hero-neon-purple" />
              </div>
              <h3 className="neon-text-purple">Securely Centralize Your Digital Assets</h3>
              <p className="lead-desc">
                Welcome to your offline-first Resource & Subscription Tracker. In just a few minutes, 
                we will establish robust security acknowledgments, provide a pre-mapped CSV framework for 
                bulk password/credit migration, and provide guidelines for keeping your lists clean.
              </p>
              <div className="onboarding-benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon"><Lock size={18} /></div>
                  <div className="benefit-text">
                    <h4>Local Storage Vault</h4>
                    <p>All data stays 100% locally on your computer inside a secure sandboxed file.</p>
                  </div>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon"><Server size={18} /></div>
                  <div className="benefit-text">
                    <h4>Air-Gapped Processing</h4>
                    <p>Import parsing and data clean-up logic executes solely inside your client browser.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Security Disclaimers */}
          {currentStep === 2 && (
            <div className="onboarding-step-content security-step animate-fade-in">
              <h3 className="neon-text-red">Essential Security Disclaimers (Read First)</h3>
              <p className="section-subtitle-text">
                Before writing single credentials, verify you understand the zero-trust local vault responsibilities.
              </p>

              <div className="security-checklist-container">
                {/* 1. Burn the Bridge CSV Rule */}
                <div 
                  className={`security-rule-card ${securityChecks.csvRule ? 'acknowledged' : ''}`}
                  onClick={() => handleSecurityToggle('csvRule')}
                >
                  <div className="rule-card-checkbox">
                    {securityChecks.csvRule ? <Check size={16} /> : null}
                  </div>
                  <div className="rule-card-text">
                    <h4>
                      <ShieldAlert size={16} className="text-warning-icon" />
                      The "Burn the Bridge" CSV Rule
                    </h4>
                    <p>
                      Password/credit exports from Google Chrome, LastPass, or 1Password are completely <strong>unencrypted plain text</strong>. 
                      You must permanently delete the export file (not just drag it to the trash bin) the exact moment your import is verified.
                    </p>
                  </div>
                </div>

                {/* 2. Air-Gapped Processing */}
                <div 
                  className={`security-rule-card ${securityChecks.airGapped ? 'acknowledged' : ''}`}
                  onClick={() => handleSecurityToggle('airGapped')}
                >
                  <div className="rule-card-checkbox">
                    {securityChecks.airGapped ? <Check size={16} /> : null}
                  </div>
                  <div className="rule-card-text">
                    <h4>
                      <Server size={16} className="text-blue-icon" />
                      Air-Gapped Local Script Execution
                    </h4>
                    <p>
                      No data uploaded here is sent to third-party formatters or external servers. 
                      Parsing runs exclusively locally inside your browser cache. Disconnect your internet during import to verify.
                    </p>
                  </div>
                </div>

                {/* 3. Master Password Irretrievability */}
                <div 
                  className={`security-rule-card ${securityChecks.passwordIrretrievable ? 'acknowledged' : ''}`}
                  onClick={() => handleSecurityToggle('passwordIrretrievable')}
                >
                  <div className="rule-card-checkbox">
                    {securityChecks.passwordIrretrievable ? <Check size={16} /> : null}
                  </div>
                  <div className="rule-card-text">
                    <h4>
                      <Lock size={16} className="text-red-icon" />
                      Master Password Irretrievability Warning
                    </h4>
                    <p>
                      We use a zero-knowledge local architecture. We cannot restore your master key or sync configuration if lost. 
                      If you lose it, your data remains cryptographically locked forever.
                    </p>
                  </div>
                </div>

                {/* 4. Isolate Developer Secrets */}
                <div 
                  className={`security-rule-card ${securityChecks.developerSecrets ? 'acknowledged' : ''}`}
                  onClick={() => handleSecurityToggle('developerSecrets')}
                >
                  <div className="rule-card-checkbox">
                    {securityChecks.developerSecrets ? <Check size={16} /> : null}
                  </div>
                  <div className="rule-card-text">
                    <h4>
                      <Key size={16} className="text-green-icon" />
                      Separate API Keys & SSH Secrets
                    </h4>
                    <p>
                      Do not store raw production environment credentials, SSH root keys, or API tokens alongside standard logins. 
                      Utilize dedicated developer vaults separate from standard consumer services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CSV Import & Pre-Mapped Template */}
          {currentStep === 3 && (
            <div className="onboarding-step-content csv-step animate-fade-in">
              <h3 className="neon-text-blue">Frictionless Bulk Import (Local Parse)</h3>
              <p className="section-subtitle-text">
                Import subscription, voucher, and coupon logs in one click. Download our pre-mapped template schema to format your columns.
              </p>

              <div className="csv-actions-layout">
                {/* Action Buttons */}
                <div className="csv-actions-panel">
                  <button className="btn btn-secondary text-glow" onClick={downloadCSVTemplate}>
                    <FileDown size={18} />
                    Download CSV Template
                  </button>
                  <div className="template-note">
                    <Info size={14} />
                    <span>Includes pre-mapped columns for Name, Type, Category, Cost, Renewal Dates, etc.</span>
                  </div>
                </div>

                {/* Drop Zone */}
                <div 
                  className={`csv-dropzone-container ${dragActive ? 'active' : ''} ${fileName ? 'has-file' : ''}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload} 
                    accept=".csv"
                    className="hidden-file-input"
                  />
                  <div className="dropzone-content">
                    <FileSpreadsheet size={36} className="dropzone-icon" />
                    {fileName ? (
                      <div>
                        <p className="file-upload-name">{fileName}</p>
                        <p className="file-upload-subtext">Click or drag another file to replace</p>
                      </div>
                    ) : (
                      <div>
                        <p className="file-upload-prompt">Drag & Drop your completed CSV file here</p>
                        <p className="file-upload-subtext">or click to browse local files (max 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Preview */}
              {parsedData.length > 0 && (
                <div className="csv-preview-container animate-fade-in">
                  <div className="preview-heading">
                    <h4>Ready to Import ({parsedData.length} records parsed)</h4>
                    {importErrors.length > 0 && (
                      <span className="import-warnings-badge">
                        <AlertTriangle size={12} /> {importErrors.length} Warnings
                      </span>
                    )}
                  </div>
                  
                  {importErrors.length > 0 && (
                    <div className="import-warnings-logs">
                      {importErrors.map((err, idx) => (
                        <div key={idx} className="warning-log-row">
                          <AlertTriangle size={12} /> {err}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="preview-table-wrapper">
                    <table className="preview-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Category</th>
                          <th>Amount</th>
                          <th>Expiry/Renewal</th>
                          <th>Cycle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.slice(0, 10).map((row, idx) => (
                          <tr key={idx}>
                            <td>{row.name}</td>
                            <td>
                              <span className={`type-preview-badge ${row.type}`}>
                                {row.type}
                              </span>
                            </td>
                            <td>{row.category}</td>
                            <td>
                              {row.type === 'subscription' ? (
                                <span className="text-red-glow">-${row.cost.toFixed(2)}</span>
                              ) : (
                                <span className="text-green-glow">+${row.value.toFixed(2)}</span>
                              )}
                            </td>
                            <td>{row.expiryDate || <span className="text-muted">None</span>}</td>
                            <td>{row.billingCycle}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedData.length > 10 && (
                      <div className="preview-table-footer">
                        Showing first 10 of {parsedData.length} entries...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Efficiency Recommendations */}
          {currentStep === 4 && (
            <div className="onboarding-step-content efficiency-step animate-fade-in">
              <h3 className="neon-text-green">Efficiency Guide & Recommendations</h3>
              <p className="section-subtitle-text">
                Managing a large digital footprint is exhausting. Adopt these bite-sized tactics to stay organized.
              </p>

              <div className="efficiency-tips-grid">
                
                {/* 1. 80/20 Strategy */}
                <div className="efficiency-card">
                  <div className="efficiency-card-icon purple">
                    <Sparkles size={20} />
                  </div>
                  <div className="efficiency-card-info">
                    <h4>The 80/20 "Ad-Hoc" Populate Method</h4>
                    <p>
                      Avoid weekend audits. Bulk import your <strong>top 20%</strong> vital services (banking, work email, hosting). 
                      For the remaining 80%, log them into the tracker incrementally as you naturally log in over the next few months.
                    </p>
                  </div>
                </div>

                {/* 2. Automated Receipt Pipelines */}
                <div className="efficiency-card">
                  <div className="efficiency-card-icon blue">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div className="efficiency-card-info">
                    <h4>Automated Receipt Pipelines</h4>
                    <p>
                      Create email forwarding rules. Route renewal invoices or "payment confirmation" emails to a designated folder. 
                      Audit this folder once a month to pull renew dates and costs without manual tracker lookups.
                    </p>
                  </div>
                </div>

                {/* 3. Subscription Sandbox */}
                <div className="efficiency-card">
                  <div className="efficiency-card-icon green">
                    <Key size={20} />
                  </div>
                  <div className="efficiency-card-info">
                    <h4>Virtual "Sandbox" Credit Cards</h4>
                    <p>
                      Use virtual credit card networks (e.g. Privacy.com or Revolut) to isolate monthly SaaS subscriptions. 
                      Assign a single virtual card with spending limits to each subscription to easily audit renewals and block hidden billing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Success Page */}
          {currentStep === 5 && (
            <div className="onboarding-step-content success-step animate-fade-in">
              <div className="success-lottie-container">
                <div className="success-radar-ring"></div>
                <div className="success-radar-ring-2"></div>
                <Check size={52} className="success-icon-neon" />
              </div>
              <h3 className="neon-text-green">Local Vault Secure & Configured</h3>
              <p className="lead-desc text-center">
                All done! You have reviewed critical security guidelines and populated your local vault database. 
                Your dashboard metrics, category trends, and expiry calendar are ready.
              </p>
              
              <div className="success-meta-box">
                {parsedData.length > 0 && (
                  <div className="meta-stat-row">
                    <span>Imported Resources:</span>
                    <strong className="text-green-glow">{parsedData.length} records</strong>
                  </div>
                )}
                <div className="meta-stat-row">
                  <span>Vault Encryption:</span>
                  <strong>AES-256 (Local Cache)</strong>
                </div>
                <div className="meta-stat-row">
                  <span>Data Portability:</span>
                  <strong>Full JSON Export Ready</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="onboarding-footer">
          {currentStep > 1 && currentStep < 5 && (
            <button 
              className="btn btn-secondary onboarding-nav-btn"
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}

          <div className="step-dots-container">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <span 
                key={idx} 
                className={`step-dot-indicator ${currentStep === idx + 1 ? 'active' : ''}`}
              />
            ))}
          </div>

          {currentStep === 1 && (
            <button 
              className="btn btn-primary onboarding-nav-btn"
              onClick={() => setCurrentStep(2)}
            >
              Get Started <ChevronRight size={16} />
            </button>
          )}

          {currentStep === 2 && (
            <div className="security-next-wrapper">
              {!allSecurityChecked && (
                <span className="security-nag-text">
                  Acknowledge all policies to continue
                </span>
              )}
              <button 
                className="btn btn-primary onboarding-nav-btn"
                onClick={() => setCurrentStep(3)}
                disabled={!allSecurityChecked}
                title={!allSecurityChecked ? "Please click/check all 4 disclaimers above to confirm you understand" : ""}
              >
                Accept & Proceed <ChevronRight size={16} />
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <button 
              className="btn btn-primary onboarding-nav-btn"
              onClick={executeImport}
            >
              {parsedData.length > 0 ? (
                <>Import & Next <ChevronRight size={16} /></>
              ) : (
                <>Skip Import <ChevronRight size={16} /></>
              )}
            </button>
          )}

          {currentStep === 4 && (
            <button 
              className="btn btn-primary onboarding-nav-btn"
              onClick={() => setCurrentStep(5)}
            >
              Finish Setup <ChevronRight size={16} />
            </button>
          )}

          {currentStep === 5 && (
            <button 
              className="btn btn-primary onboarding-nav-btn success-btn-neon"
              onClick={completeOnboarding}
            >
              Enter Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
