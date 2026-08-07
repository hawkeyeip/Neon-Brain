import { useState, useRef } from 'react';
import { 
  Award, 
  Calendar, 
  Check, 
  Copy, 
  Download, 
  Edit2, 
  ExternalLink, 
  FileText, 
  BookOpen, 
  Plus, 
  Sparkles, 
  Trash2, 
  Upload, 
  X, 
  Eye, 
  Code,
  AlertCircle,
  Briefcase
} from 'lucide-react';

// Standard English stop words to filter out for keyword matching
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
  'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here',
  'heres', 'heres', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in',
  'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor',
  'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that',
  'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd',
  'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres',
  'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd',
  'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
]);

const generateId = (prefix) => `${prefix}-${Date.now()}`;

export default function CareerVault({ resources, setResources }) {
  const [subTab, setSubTab] = useState('credentials'); // credentials | snippets | tailor

  // Separate career items
  const credentials = resources.filter(r => r.type === 'credential');
  const snippets = resources.filter(r => r.type === 'resume-snippet');
  const applications = resources.filter(r => r.type === 'job-application');

  // ==========================================
  // CREDENTIALS VAULT STATE & HANDLERS
  // ==========================================
  const [isCredFormOpen, setIsCredFormOpen] = useState(false);
  const [editingCred, setEditingCred] = useState(null);

  // Form inputs
  const [credName, setCredName] = useState('');
  const [credCategory, setCredCategory] = useState('Certification');
  const [credIssuer, setCredIssuer] = useState('');
  const [credIssueDate, setCredIssueDate] = useState('');
  const [credExpiryDate, setCredExpiryDate] = useState('');
  const [credId, setCredId] = useState('');
  const [credUrl, setCredUrl] = useState('');
  const [credNotes, setCredNotes] = useState('');
  const [credSkills, setCredSkills] = useState('');
  const [credCeHours, setCredCeHours] = useState(0);
  const [credAttachment, setCredAttachment] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Lightbox previewer state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxFile, setLightboxFile] = useState(null);

  const openLightbox = (file) => {
    setLightboxFile(file);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxFile(null);
    setIsLightboxOpen(false);
  };

  const resetCredForm = () => {
    setCredName('');
    setCredCategory('Certification');
    setCredIssuer('');
    setCredIssueDate('');
    setCredExpiryDate('');
    setCredId('');
    setCredUrl('');
    setCredNotes('');
    setCredSkills('');
    setCredCeHours(0);
    setCredAttachment(null);
    setEditingCred(null);
  };

  const openAddCred = () => {
    resetCredForm();
    setIsCredFormOpen(true);
  };

  const openEditCred = (cred) => {
    setEditingCred(cred);
    setCredName(cred.name);
    setCredCategory(cred.category || 'Certification');
    setCredIssuer(cred.issuer || '');
    setCredIssueDate(cred.issueDate || '');
    setCredExpiryDate(cred.expiryDate || '');
    setCredId(cred.credentialId || '');
    setCredUrl(cred.verificationUrl || '');
    setCredNotes(cred.notes || '');
    setCredSkills(cred.skills || '');
    setCredCeHours(cred.ceHours || 0);
    setCredAttachment(cred.attachment || null);
    setIsCredFormOpen(true);
  };

  const handleSaveCred = (e) => {
    e.preventDefault();
    if (!credName || !credIssuer) {
      alert('Please enter a name and issuer.');
      return;
    }

    const payload = {
      id: editingCred ? editingCred.id : generateId('cred'),
      type: 'credential',
      name: credName,
      category: credCategory,
      issuer: credIssuer,
      issueDate: credIssueDate || null,
      expiryDate: credExpiryDate || null,
      credentialId: credId || '',
      verificationUrl: credUrl || '',
      notes: credNotes || '',
      skills: credSkills || '',
      ceHours: Number(credCeHours) || 0,
      attachment: credAttachment,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingCred) {
      setResources(prev => prev.map(r => r.id === editingCred.id ? payload : r));
    } else {
      setResources(prev => [payload, ...prev]);
    }
    setIsCredFormOpen(false);
    resetCredForm();
  };

  const handleDeleteItem = (id, label) => {
    if (confirm(`Are you sure you want to delete this ${label}? This action cannot be undone.`)) {
      setResources(prev => prev.filter(r => r.id !== id));
    }
  };

  // Base64 file reader
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processAttachedFile(file);
  };

  const processAttachedFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB safety limit. Please upload a smaller document/image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      setCredAttachment({
        name: file.name,
        type: file.type,
        size: file.size,
        data: evt.target.result // Base64 data URI
      });
    };
    reader.readAsDataURL(file);
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
      processAttachedFile(e.dataTransfer.files[0]);
    }
  };

  // Stats Calculations
  const totalCerts = credentials.length;
  const ceHoursSum = credentials.reduce((sum, c) => sum + (c.ceHours || 0), 0);
  const todayStr = new Date().toISOString().split('T')[0];
  
  const expiringCertsCount = credentials.filter(c => {
    if (!c.expiryDate) return false;
    const diff = (new Date(c.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 60; // Expiring in next 60 days
  }).length;

  const expiredCertsCount = credentials.filter(c => {
    if (!c.expiryDate) return false;
    return c.expiryDate < todayStr;
  }).length;

  // Helper to render credential status
  const getCredStatusBadge = (expiry) => {
    if (!expiry) return { label: 'Non-Expiring', class: 'active' };
    if (expiry < todayStr) return { label: 'Expired', class: 'expired' };
    const diff = (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24);
    if (diff <= 60) return { label: 'Expiring Soon', class: 'warning' };
    return { label: 'Active', class: 'active' };
  };

  // Download attachment helper
  const downloadAttachment = (attachment) => {
    if (!attachment || !attachment.data) return;
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // RESUME SNIPPET STATE & HANDLERS
  // ==========================================
  const [isSnippetFormOpen, setIsSnippetFormOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);

  // Form inputs
  const [snippetName, setSnippetName] = useState('');
  const [snippetCategory, setSnippetCategory] = useState('Work Experience');
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetOrg, setSnippetOrg] = useState('');
  const [snippetDateRange, setSnippetDateRange] = useState('');
  const [snippetContent, setSnippetContent] = useState('');
  const [snippetSkills, setSnippetSkills] = useState('');

  const resetSnippetForm = () => {
    setSnippetName('');
    setSnippetCategory('Work Experience');
    setSnippetTitle('');
    setSnippetOrg('');
    setSnippetDateRange('');
    setSnippetContent('');
    setSnippetSkills('');
    setEditingSnippet(null);
  };

  const openAddSnippet = () => {
    resetSnippetForm();
    setIsSnippetFormOpen(true);
  };

  const openEditSnippet = (snip) => {
    setEditingSnippet(snip);
    setSnippetName(snip.name);
    setSnippetCategory(snip.category || 'Work Experience');
    setSnippetTitle(snip.title || '');
    setSnippetOrg(snip.organization || '');
    setSnippetDateRange(snip.dateRange || '');
    setSnippetContent(snip.content || '');
    setSnippetSkills(snip.skills || '');
    setIsSnippetFormOpen(true);
  };

  const handleSaveSnippet = (e) => {
    e.preventDefault();
    if (!snippetName || !snippetContent) {
      alert('Please fill out the snippet name and text content.');
      return;
    }

    const payload = {
      id: editingSnippet ? editingSnippet.id : generateId('snip'),
      type: 'resume-snippet',
      name: snippetName,
      category: snippetCategory,
      title: snippetTitle || '',
      organization: snippetOrg || '',
      dateRange: snippetDateRange || '',
      content: snippetContent,
      skills: snippetSkills || '',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingSnippet) {
      setResources(prev => prev.map(r => r.id === editingSnippet.id ? payload : r));
    } else {
      setResources(prev => [payload, ...prev]);
    }
    setIsSnippetFormOpen(false);
    resetSnippetForm();
  };

  // ==========================================
  // RESUME TAILOR WORKSPACE STATE & ENGINE
  // ==========================================
  const [jobDescription, setJobDescription] = useState('');
  const [unselectedSnippetIds, setUnselectedSnippetIds] = useState([]);
  const [compilerMode, setCompilerMode] = useState('preview'); // preview | raw

  const toggleSnippetSelect = (id) => {
    setUnselectedSnippetIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  // A snippet is selected if it's not in the unselected list
  const selectedSnippetIds = snippets.filter(s => !unselectedSnippetIds.includes(s.id)).map(s => s.id);

  // Extract keywords from a text block
  const extractKeywords = (text) => {
    if (!text) return [];
    // Clean text by replacing slashes and backslashes with spaces, then punctuation
    const cleanText = text
      .replace(/\//g, ' ')
      .replace(/\\/g, ' ')
      .replace(/[.,#!$%^&*;:{}=_`~()?"'-]/g, ' ')
      .toLowerCase();
    const words = cleanText.split(/\s+/);
    
    const freqMap = {};
    words.forEach(word => {
      // Keep only alphabet-based words of length > 2 that aren't stop words
      if (word.length > 2 && !STOP_WORDS.has(word) && isNaN(Number(word))) {
        freqMap[word] = (freqMap[word] || 0) + 1;
      }
    });

    // Sort by frequency and pull top terms
    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 30); // Top 30 keywords
  };

  // Derived SEO Matching Metrics calculated on each render
  const targetKeywords = extractKeywords(jobDescription);
  const selectedSnippetsForSEO = snippets.filter(s => selectedSnippetIds.includes(s.id));
  const allSkillsString = selectedSnippetsForSEO.map(s => s.skills + ' ' + s.content).join(' ');
  const snippetKeywords = extractKeywords(allSkillsString);

  const matchScore = targetKeywords.length === 0 
    ? 0 
    : Math.round((targetKeywords.filter(term => snippetKeywords.includes(term)).length / targetKeywords.length) * 100);

  // Compile selected snippets into Markdown
  const compileResumeMarkdown = () => {
    const selectedSnippets = snippets.filter(s => selectedSnippetIds.includes(s.id));
    
    // Sort categories: Summary first, then Experience, then Projects, then education/others
    const categoryOrder = ['Professional Summary', 'Work Experience', 'Project', 'Education', 'Skills', 'Other'];
    
    const sortedSnippets = [...selectedSnippets].sort((a, b) => {
      const idxA = categoryOrder.indexOf(a.category);
      const idxB = categoryOrder.indexOf(b.category);
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });

    let markdown = `# Professional Portfolio\n\n`;

    let currentCat = '';
    sortedSnippets.forEach(snip => {
      if (snip.category !== currentCat) {
        currentCat = snip.category;
        markdown += `## ${currentCat}\n\n`;
      }

      if (snip.category === 'Professional Summary') {
        markdown += `${snip.content}\n\n`;
      } else {
        const titleRow = snip.title ? `### ${snip.title}` : '';
        const orgRow = snip.organization ? ` | ${snip.organization}` : '';
        const dateRow = snip.dateRange ? ` (${snip.dateRange})` : '';
        
        if (titleRow || orgRow || dateRow) {
          markdown += `${titleRow}${orgRow}${dateRow}\n\n`;
        }
        
        markdown += `${snip.content}\n\n`;
      }
    });

    return markdown;
  };

  const handleCopyCompiled = () => {
    const text = compileResumeMarkdown();
    navigator.clipboard.writeText(text);
    alert('Tailored resume Markdown copied to clipboard!');
  };

  const handleDownloadCompiled = () => {
    const text = compileResumeMarkdown();
    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(text);
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `tailored_resume_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to render Markdown preview as basic HTML
  const renderMarkdownHTML = (mdText) => {
    // Simple markdown renderer for preview box
    let html = mdText
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '<p></p>');

    // Wrap list items
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    return { __html: html };
  };

  // ==========================================
  // JOB APPLICATIONS STATE & HANDLERS
  // ==========================================
  const [isSaveAppModalOpen, setIsSaveAppModalOpen] = useState(false);
  const [isEditAppModalOpen, setIsEditAppModalOpen] = useState(false);
  const [isViewResumeModalOpen, setIsViewResumeModalOpen] = useState(false);
  
  const [viewingApp, setViewingApp] = useState(null);
  const [editingApp, setEditingApp] = useState(null);

  // Form inputs for Application
  const [appTitle, setAppTitle] = useState('');
  const [appCompany, setAppCompany] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [appStatus, setAppStatus] = useState('draft');
  const [appNotes, setAppNotes] = useState('');
  const [appDateApplied, setAppDateApplied] = useState('');

  const openSaveAppModal = () => {
    setAppTitle('');
    setAppCompany('');
    setAppUrl('');
    setAppStatus('draft');
    setAppNotes('');
    setAppDateApplied('');
    setIsSaveAppModalOpen(true);
  };

  const handleSaveNewApplication = (e) => {
    e.preventDefault();
    if (!appTitle || !appCompany) {
      alert('Please enter a job title and company.');
      return;
    }

    const payload = {
      id: generateId('app'),
      type: 'job-application',
      name: appTitle,
      company: appCompany,
      url: appUrl || '',
      status: appStatus,
      dateApplied: appStatus !== 'draft' ? (appDateApplied || new Date().toISOString().split('T')[0]) : '',
      jobDescription: jobDescription, // Store current active JD
      selectedSnippetIds: [...selectedSnippetIds], // Store copy of current active selections
      matchScore: matchScore,
      notes: appNotes || '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setResources(prev => [payload, ...prev]);
    setIsSaveAppModalOpen(false);
    alert('Job Application and tailored resume draft saved successfully!');
  };

  const openEditAppModal = (app) => {
    setEditingApp(app);
    setAppTitle(app.name);
    setAppCompany(app.company || '');
    setAppUrl(app.url || '');
    setAppStatus(app.status || 'draft');
    setAppNotes(app.notes || '');
    setAppDateApplied(app.dateApplied || '');
    setIsEditAppModalOpen(true);
  };

  const handleSaveEditedApplication = (e) => {
    e.preventDefault();
    if (!appTitle || !appCompany) {
      alert('Please enter a job title and company.');
      return;
    }

    const payload = {
      ...editingApp,
      name: appTitle,
      company: appCompany,
      url: appUrl || '',
      status: appStatus,
      dateApplied: appStatus !== 'draft' ? (appDateApplied || new Date().toISOString().split('T')[0]) : '',
      notes: appNotes || '',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setResources(prev => prev.map(r => r.id === editingApp.id ? payload : r));
    setIsEditAppModalOpen(false);
    setEditingApp(null);
  };

  const openViewResumeModal = (app) => {
    setViewingApp(app);
    setIsViewResumeModalOpen(true);
  };

  // Compile markdown for a SPECIFIC saved application
  const compileSavedAppMarkdown = (app) => {
    if (!app) return '';
    const selectedSnippets = snippets.filter(s => app.selectedSnippetIds?.includes(s.id));
    
    const categoryOrder = ['Professional Summary', 'Work Experience', 'Project', 'Education', 'Skills', 'Other'];
    
    const sortedSnippets = [...selectedSnippets].sort((a, b) => {
      const idxA = categoryOrder.indexOf(a.category);
      const idxB = categoryOrder.indexOf(b.category);
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });

    let markdown = `# Tailored Resume Draft: ${app.name} at ${app.company}\n\n`;

    let currentCat = '';
    sortedSnippets.forEach(snip => {
      if (snip.category !== currentCat) {
        currentCat = snip.category;
        markdown += `## ${currentCat}\n\n`;
      }

      if (snip.category === 'Professional Summary') {
        markdown += `${snip.content}\n\n`;
      } else {
        const titleRow = snip.title ? `### ${snip.title}` : '';
        const orgRow = snip.organization ? ` | ${snip.organization}` : '';
        const dateRow = snip.dateRange ? ` (${snip.dateRange})` : '';
        
        if (titleRow || orgRow || dateRow) {
          markdown += `${titleRow}${orgRow}${dateRow}\n\n`;
        }
        
        markdown += `${snip.content}\n\n`;
      }
    });

    return markdown;
  };

  const handleCopySavedAppCompiled = (app) => {
    const text = compileSavedAppMarkdown(app);
    navigator.clipboard.writeText(text);
    alert('Tailored resume Markdown copied to clipboard!');
  };

  const handleDownloadSavedAppCompiled = (app) => {
    const text = compileSavedAppMarkdown(app);
    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(text);
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `tailored_resume_${app.company}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="career-vault-container animate-fade-in">
      
      {/* Sub Navigation Bar */}
      <div className="career-subnav">
        <button 
          className={`career-subnav-btn ${subTab === 'credentials' ? 'active' : ''}`}
          onClick={() => setSubTab('credentials')}
        >
          <Award size={18} />
          Credentials Vault
        </button>
        <button 
          className={`career-subnav-btn ${subTab === 'snippets' ? 'active' : ''}`}
          onClick={() => setSubTab('snippets')}
        >
          <FileText size={18} />
          Snippet Bank
        </button>
        <button 
          className={`career-subnav-btn ${subTab === 'tailor' ? 'active' : ''}`}
          onClick={() => setSubTab('tailor')}
        >
          <Sparkles size={18} />
          Resume SEO Tailor
        </button>
        <button 
          className={`career-subnav-btn ${subTab === 'applications' ? 'active' : ''}`}
          onClick={() => setSubTab('applications')}
        >
          <Briefcase size={18} />
          Job Tracker
        </button>
      </div>

      {/* ==========================================
         SUB-TAB 1: CREDENTIALS VAULT
         ========================================== */}
      {subTab === 'credentials' && (
        <div className="career-tab-content">
          
          {/* Credentials stats dashboard row */}
          <div className="stats-grid">
            <div className="stat-card purple">
              <div className="stat-info">
                <span className="stat-label">Total Credentials</span>
                <span className="stat-value">{totalCerts}</span>
                <span className="stat-subtext">Certificates & Diplomas</span>
              </div>
              <div className="stat-icon"><Award size={22} /></div>
            </div>
            
            <div className="stat-card green">
              <div className="stat-info">
                <span className="stat-label">Education Hours</span>
                <span className="stat-value">{ceHoursSum} hrs</span>
                <span className="stat-subtext">Accumulated CE Hours</span>
              </div>
              <div className="stat-icon"><BookOpen size={22} /></div>
            </div>

            <div className="stat-card yellow">
              <div className="stat-info">
                <span className="stat-label">Expiring Soon</span>
                <span className="stat-value">{expiringCertsCount}</span>
                <span className="stat-subtext">Expiring within 60 days</span>
              </div>
              <div className="stat-icon"><Calendar size={22} /></div>
            </div>

            <div className="stat-card red">
              <div className="stat-info">
                <span className="stat-label">Expired</span>
                <span className="stat-value">{expiredCertsCount}</span>
                <span className="stat-subtext">Needs renewal / updates</span>
              </div>
              <div className="stat-icon"><AlertCircle size={22} /></div>
            </div>
          </div>

          {/* Heading actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Credential Records</h3>
            <button className="btn btn-primary" onClick={openAddCred}>
              <Plus size={16} />
              Add Credential
            </button>
          </div>

          {/* Credentials grid list */}
          {credentials.length > 0 ? (
            <div className="credentials-grid">
              {credentials.map(cred => {
                const status = getCredStatusBadge(cred.expiryDate);
                return (
                  <div key={cred.id} className={`credential-card ${cred.category?.toLowerCase() || 'certification'}`}>
                    <div className="credential-header">
                      <div className="credential-title-area">
                        <span className="credential-issuer">{cred.issuer}</span>
                        <h4 className="card-title" style={{ fontSize: '1.1rem' }}>{cred.name}</h4>
                      </div>
                      <div className="card-actions-menu" style={{ opacity: 1 }}>
                        <button className="card-action-btn" onClick={() => openEditCred(cred)} title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="card-action-btn delete" onClick={() => handleDeleteItem(cred.id, 'credential')} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Row */}
                    <div className="credential-meta-row">
                      <div className="meta-item">
                        <span className="meta-label">ID / Number</span>
                        <span className="meta-val">{cred.credentialId || <span className="text-muted">N/A</span>}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">CE Hours</span>
                        <span className="meta-val">{cred.ceHours ? `${cred.ceHours} hrs` : <span className="text-muted">None</span>}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Issue Date</span>
                        <span className="meta-val">{cred.issueDate || <span className="text-muted">N/A</span>}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Expiration</span>
                        <span className="meta-val">{cred.expiryDate || <span className="text-muted">Never</span>}</span>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    {cred.skills && (
                      <div className="skills-tags-wrap">
                        {cred.skills.split(',').map((skill, idx) => (
                          <span key={idx} className="skill-tag-badge">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes block */}
                    {cred.notes && (
                      <div className="notes-preview" style={{ maxHeight: '80px', overflowY: 'auto' }}>
                        {cred.notes}
                      </div>
                    )}

                    {/* File Attachment & URL Box */}
                    {(cred.attachment || cred.verificationUrl) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                        {cred.attachment && (
                          <div className="attachment-preview-box">
                            <div 
                              className="attachment-info" 
                              onClick={() => openLightbox(cred.attachment)} 
                              style={{ cursor: 'pointer' }}
                              title="Preview Document"
                            >
                              <FileText size={16} style={{ color: 'var(--accent-purple)' }} />
                              <span style={{ fontSize: '0.8rem' }}>{cred.attachment.name}</span>
                            </div>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}
                              onClick={() => downloadAttachment(cred.attachment)}
                              title="Download Document"
                            >
                              <Download size={12} />
                            </button>
                          </div>
                        )}
                        {cred.verificationUrl && (
                          <a 
                            href={cred.verificationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-secondary"
                            style={{ width: '100%', fontSize: '0.8rem', padding: '0.35rem' }}
                          >
                            <ExternalLink size={12} /> Verify Credential
                          </a>
                        )}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span className="credential-badge-type">{cred.category}</span>
                      <span className={`status-badge ${status.class}`}>
                        <span className="status-dot" />
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Award size={36} /></div>
              <h3>No Credentials Found</h3>
              <p>Store your professional certifications, degrees, or continuing education logs in a secure local vault.</p>
              <button className="btn btn-primary" onClick={openAddCred}>Add Your First Credential</button>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
         SUB-TAB 2: RESUME SNIPPET BANK
         ========================================== */}
      {subTab === 'snippets' && (
        <div className="career-tab-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3>Resume Snippet Bank</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Modular text blocks you can mix and match to tailor your resume for SEO keywords.
              </p>
            </div>
            <button className="btn btn-primary" onClick={openAddSnippet}>
              <Plus size={16} />
              Add Snippet
            </button>
          </div>

          {snippets.length > 0 ? (
            <div className="credentials-grid">
              {snippets.map(snip => (
                <div key={snip.id} className="credential-card" style={{ borderLeft: '4px solid var(--accent-purple)', padding: '1.25rem' }}>
                  <div className="credential-header">
                    <div className="credential-title-area">
                      <span className="snippet-card-category">{snip.category}</span>
                      <h4 className="card-title" style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{snip.name}</h4>
                    </div>
                    <div className="card-actions-menu" style={{ opacity: 1 }}>
                      <button className="card-action-btn" onClick={() => openEditSnippet(snip)} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="card-action-btn delete" onClick={() => handleDeleteItem(snip.id, 'snippet')} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Job details (title / company / date range) */}
                  {(snip.title || snip.organization || snip.dateRange) && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 500 }}>
                      {snip.title}{snip.organization && ` at ${snip.organization}`} {snip.dateRange && `| ${snip.dateRange}`}
                    </div>
                  )}

                  {/* Preview Text */}
                  <div className="notes-preview" style={{ maxHeight: '180px', overflowY: 'auto', background: 'rgba(0,0,0,0.15)' }}>
                    {snip.content}
                  </div>

                  {/* Associated Skills */}
                  {snip.skills && (
                    <div className="skills-tags-wrap" style={{ marginTop: 'auto' }}>
                      {snip.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="skill-tag-badge" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.15)' }}>
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><FileText size={36} /></div>
              <h3>Snippet Bank is Empty</h3>
              <p>Create snippets for work summaries, accomplishments, project bullets, and skill blocks.</p>
              <button className="btn btn-primary" onClick={openAddSnippet}>Add Your First Snippet</button>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
         SUB-TAB 3: RESUME SEO TAILOR
         ========================================== */}
      {subTab === 'tailor' && (
        <div className="career-tab-content">
          <div className="resume-bank-grid">
            
            {/* Left sidebar: Snippet selectors and matching keywords */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="tailor-panel">
                <h3>1. Select Snippets</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Choose which snippet blocks to compile into your targeted resume:
                </p>

                <div className="snippet-checklist-container">
                  {snippets.map(snip => {
                    const isChecked = selectedSnippetIds.includes(snip.id);
                    return (
                      <div 
                        key={snip.id}
                        className={`snippet-select-item ${isChecked ? 'checked' : ''}`}
                        onClick={() => toggleSnippetSelect(snip.id)}
                      >
                        <div className="checkbox-custom">
                          {isChecked && <Check size={12} />}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{snip.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{snip.category}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SEO Analysis Box */}
              <div className="tailor-panel">
                <h3>SEO Target Analysis</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Paste a job description on the right to compare target terms.
                </p>

                <div className="seo-metrics-wrap">
                  <div className="seo-match-circle-container">
                    <span className={`match-percentage-badge ${matchScore >= 75 ? 'green' : matchScore >= 45 ? 'warning' : 'danger'}`}>
                      {matchScore}%
                    </span>
                    <div className="match-details-text">
                      <h4>Keyword Match Rate</h4>
                      <p>
                        {matchScore >= 75 ? 'Great match! Resume is optimized.' : 
                         matchScore >= 45 ? 'Fair match. Consider adding more keywords.' : 
                         'Poor match. Align skills with the job listing.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Term Matching Badges */}
                {targetKeywords.length > 0 && (
                  <div className="seo-terms-comparison">
                    <span className="seo-terms-header">Extracted Target Keywords ({targetKeywords.length}):</span>
                    <div className="seo-terms-list">
                      {targetKeywords.map(term => {
                        const isMatched = snippetKeywords.includes(term);
                        return (
                          <span key={term} className={`seo-term-pill ${isMatched ? 'matched' : 'missing'}`}>
                            {isMatched ? <Check size={10} /> : <X size={10} />}
                            {term}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Target Job Description & Live Compiled Output */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Job Description Textarea */}
              <div className="tailor-panel">
                <h3>2. Paste Target Job Listing</h3>
                <textarea 
                  className="job-desc-textarea" 
                  placeholder="Paste the job advertisement or required qualifications/skills section here to extract SEO keywords and verify keyword match density..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              {/* Live Markdown Compiler Panel */}
              <div className="tailor-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>3. Compiled Tailored Resume</h3>
                  
                  {/* View Toggles */}
                  <div className="view-toggles" style={{ margin: 0 }}>
                    <button 
                      className={`view-toggle-btn ${compilerMode === 'preview' ? 'active' : ''}`}
                      onClick={() => setCompilerMode('preview')}
                      title="Rendered Document View"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className={`view-toggle-btn ${compilerMode === 'raw' ? 'active' : ''}`}
                      onClick={() => setCompilerMode('raw')}
                      title="Raw Markdown Code View"
                    >
                      <Code size={16} />
                    </button>
                  </div>
                </div>

                {/* Main Preview Box */}
                {selectedSnippetIds.length > 0 ? (
                  <>
                    {compilerMode === 'raw' ? (
                      <pre className="compiled-preview-box">
                        {compileResumeMarkdown()}
                      </pre>
                    ) : (
                      <div 
                        className="compiled-preview-rendered" 
                        dangerouslySetInnerHTML={renderMarkdownHTML(compileResumeMarkdown())} 
                      />
                    )}

                    {/* Copy / Export Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-secondary" onClick={handleCopyCompiled} style={{ flex: '1 1 150px' }}>
                        <Copy size={16} /> Copy to Clipboard
                      </button>
                      <button className="btn btn-secondary" onClick={handleDownloadCompiled} style={{ flex: '1 1 150px' }}>
                        <Download size={16} /> Download (.md)
                      </button>
                      <button className="btn btn-primary" onClick={openSaveAppModal} style={{ flex: '1 1 200px' }}>
                        <Plus size={16} /> Save to Job Tracker
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-state" style={{ height: '300px', border: '1px dashed var(--border-color)', margin: 0 }}>
                    <p>Select snippet blocks on the left to compile your tailored portfolio.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
         SUB-TAB 4: JOB APPLICATIONS TRACKER
         ========================================== */}
      {subTab === 'applications' && (
        <div className="career-tab-content animate-fade-in">
          
          {/* Job Applications Statistics dashboard */}
          <div className="stats-grid">
            <div className="stat-card purple">
              <div className="stat-info">
                <span className="stat-label">Total Applications</span>
                <span className="stat-value">{applications.length}</span>
                <span className="stat-subtext">Total tracked jobs</span>
              </div>
              <div className="stat-icon"><Briefcase size={22} /></div>
            </div>

            <div className="stat-card yellow">
              <div className="stat-info">
                <span className="stat-label">Draft Resumes</span>
                <span className="stat-value">{applications.filter(a => a.status === 'draft').length}</span>
                <span className="stat-subtext">Tailoring in progress</span>
              </div>
              <div className="stat-icon"><FileText size={22} /></div>
            </div>

            <div className="stat-card blue">
              <div className="stat-info">
                <span className="stat-label">Active Apps</span>
                <span className="stat-value">{applications.filter(a => a.status === 'applied' || a.status === 'interviewing').length}</span>
                <span className="stat-subtext">Submitted & interviewing</span>
              </div>
              <div className="stat-icon"><Sparkles size={22} /></div>
            </div>

            <div className="stat-card green">
              <div className="stat-info">
                <span className="stat-label">Offers Received</span>
                <span className="stat-value">{applications.filter(a => a.status === 'offer').length}</span>
                <span className="stat-subtext">Successful matches!</span>
              </div>
              <div className="stat-icon"><Award size={22} /></div>
            </div>
          </div>

          {/* Heading */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Job Application Pipeline</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              To track a new application, use the **Resume SEO Tailor** tab, compile your snippets, and click **Save to Job Tracker**.
            </span>
          </div>

          {/* List of Applications */}
          {applications.length > 0 ? (
            <div className="credentials-grid">
              {applications.map(app => (
                <div key={app.id} className={`job-card ${app.status}`}>
                  <div className="credential-header">
                    <div className="credential-title-area">
                      <span className="credential-issuer">{app.company}</span>
                      <h4 className="card-title" style={{ fontSize: '1.1rem' }}>{app.name}</h4>
                    </div>
                    <div className="card-actions-menu" style={{ opacity: 1 }}>
                      <button className="card-action-btn" onClick={() => openEditAppModal(app)} title="Edit Status/Notes">
                        <Edit2 size={14} />
                      </button>
                      <button className="card-action-btn delete" onClick={() => handleDeleteItem(app.id, 'job application')} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Date Applied & Match Info */}
                  <div className="credential-meta-row" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
                    <div className="meta-item">
                      <span className="meta-label">Status</span>
                      <span className={`status-badge ${app.status}`} style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <span className="status-dot" />
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">SEO Match Rate</span>
                      <span className="meta-val" style={{ color: app.matchScore >= 75 ? 'var(--accent-green)' : app.matchScore >= 45 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
                        {app.matchScore}%
                      </span>
                    </div>
                    {app.dateApplied && (
                      <div className="meta-item" style={{ gridColumn: '1 / -1', marginTop: '0.25rem' }}>
                        <span className="meta-label">Applied Date</span>
                        <span className="meta-val">{app.dateApplied}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes preview */}
                  {app.notes && (
                    <div className="notes-preview" style={{ maxHeight: '90px', overflowY: 'auto' }}>
                      <strong>Notes:</strong> {app.notes}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                    <button 
                      className="btn btn-primary"
                      style={{ width: '100%', fontSize: '0.85rem', padding: '0.45rem' }}
                      onClick={() => openViewResumeModal(app)}
                    >
                      <Eye size={14} /> View Tailored Resume Draft
                    </button>
                    {app.url && (
                      <a 
                        href={app.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-secondary"
                        style={{ width: '100%', fontSize: '0.8rem', padding: '0.45rem' }}
                      >
                        <ExternalLink size={12} /> View Job Listing
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Briefcase size={36} /></div>
              <h3>No Applications Tracked</h3>
              <p>Optimize your resume in the **Resume SEO Tailor** and click **Save to Job Tracker** to begin tracking applications.</p>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
         DRAWER MODAL: CREDENTIALS VAULT FORM
         ========================================== */}
      {isCredFormOpen && (
        <div className="drawer-backdrop" onClick={() => setIsCredFormOpen(false)}>
          <div className="drawer-content animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>{editingCred ? 'Edit Credential' : 'Add Credential'}</h3>
              <button className="onboarding-close-btn" onClick={() => setIsCredFormOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveCred} className="drawer-body">
              <div className="form-group">
                <label className="form-label">Name / Title *</label>
                <input 
                  type="text" 
                  value={credName} 
                  onChange={(e) => setCredName(e.target.value)} 
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Issuer *</label>
                  <input 
                    type="text" 
                    value={credIssuer} 
                    onChange={(e) => setCredIssuer(e.target.value)} 
                    placeholder="e.g. Amazon Web Services"
                    className="search-input"
                    style={{ paddingLeft: '1rem' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select 
                    value={credCategory} 
                    onChange={(e) => setCredCategory(e.target.value)} 
                    className="filter-select"
                    style={{ minWidth: 'auto', width: '100%' }}
                  >
                    <option value="Certification">Certification</option>
                    <option value="Diploma">Diploma / Degree</option>
                    <option value="Course">Continuing Education / Proof</option>
                    <option value="Accreditation">Accreditation / Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input 
                    type="date" 
                    value={credIssueDate} 
                    onChange={(e) => setCredIssueDate(e.target.value)} 
                    className="search-input"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiration Date</label>
                  <input 
                    type="date" 
                    value={credExpiryDate} 
                    onChange={(e) => setCredExpiryDate(e.target.value)} 
                    className="search-input"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Credential ID</label>
                  <input 
                    type="text" 
                    value={credId} 
                    onChange={(e) => setCredId(e.target.value)} 
                    placeholder="e.g. AWS-ASA-1234"
                    className="search-input"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CE Hours</label>
                  <input 
                    type="number" 
                    value={credCeHours} 
                    onChange={(e) => setCredCeHours(e.target.value)} 
                    placeholder="e.g. 15"
                    className="search-input"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Verification URL</label>
                <input 
                  type="url" 
                  value={credUrl} 
                  onChange={(e) => setCredUrl(e.target.value)} 
                  placeholder="https://..."
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Skills / Tags (comma-separated)</label>
                <input 
                  type="text" 
                  value={credSkills} 
                  onChange={(e) => setCredSkills(e.target.value)} 
                  placeholder="e.g. AWS, Cloud, Architecture, Networking"
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes & Description</label>
                <textarea 
                  value={credNotes} 
                  onChange={(e) => setCredNotes(e.target.value)} 
                  placeholder="Add notes about exam topics, syllabus, or learning outcomes..."
                  className="job-desc-textarea"
                  style={{ height: '100px' }}
                />
              </div>

              {/* Certificate file attachment drag-drop box */}
              <div className="form-group">
                <label className="form-label">Attach Certificate (Proof PDF/Image - Max 5MB)</label>
                
                {credAttachment ? (
                  <div className="file-preview-grid">
                    <div 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden', cursor: 'pointer' }}
                      onClick={() => openLightbox(credAttachment)}
                      title="Preview Attachment"
                    >
                      {credAttachment.type.startsWith('image/') ? (
                        <img src={credAttachment.data} className="attachment-image-thumbnail" alt="thumbnail" />
                      ) : (
                        <FileText size={32} style={{ color: 'var(--accent-purple)' }} />
                      )}
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{credAttachment.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {(credAttachment.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="card-action-btn delete" 
                      onClick={() => setCredAttachment(null)}
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className={`file-upload-dragzone ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden-file-input" 
                      onChange={handleFileChange}
                      accept=".pdf,image/*"
                      style={{ display: 'none' }}
                    />
                    <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Drag & drop file here or click to browse</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supports PDF, PNG, JPG (max 5MB)</span>
                  </div>
                )}
              </div>

              <div className="drawer-footer" style={{ padding: '1rem 0 0' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCredFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
         DRAWER MODAL: RESUME SNIPPET FORM
         ========================================== */}
      {isSnippetFormOpen && (
        <div className="drawer-backdrop" onClick={() => setIsSnippetFormOpen(false)}>
          <div className="drawer-content animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>{editingSnippet ? 'Edit Snippet' : 'Add Snippet'}</h3>
              <button className="onboarding-close-btn" onClick={() => setIsSnippetFormOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveSnippet} className="drawer-body">
              <div className="form-group">
                <label className="form-label">Snippet Name / Description *</label>
                <input 
                  type="text" 
                  value={snippetName} 
                  onChange={(e) => setSnippetName(e.target.value)} 
                  placeholder="e.g. Work Experience - Tech Lead at Netflix"
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select 
                  value={snippetCategory} 
                  onChange={(e) => setSnippetCategory(e.target.value)} 
                  className="filter-select"
                  style={{ minWidth: 'auto', width: '100%' }}
                >
                  <option value="Professional Summary">Professional Summary</option>
                  <option value="Work Experience">Work Experience</option>
                  <option value="Project">Project Details</option>
                  <option value="Education">Education & Diplomas</option>
                  <option value="Skills">Skills List</option>
                  <option value="Other">Other Section</option>
                </select>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Job Title / Role</label>
                  <input 
                    type="text" 
                    value={snippetTitle} 
                    onChange={(e) => setSnippetTitle(e.target.value)} 
                    placeholder="e.g. Senior Software Engineer"
                    className="search-input"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Organization / Company</label>
                  <input 
                    type="text" 
                    value={snippetOrg} 
                    onChange={(e) => setSnippetOrg(e.target.value)} 
                    placeholder="e.g. Netflix Inc."
                    className="search-input"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Date Range</label>
                <input 
                  type="text" 
                  value={snippetDateRange} 
                  onChange={(e) => setSnippetDateRange(e.target.value)} 
                  placeholder="e.g. 2024 - Present, or June 2025"
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Skills / Tags (comma-separated)</label>
                <input 
                  type="text" 
                  value={snippetSkills} 
                  onChange={(e) => setSnippetSkills(e.target.value)} 
                  placeholder="e.g. React, Node.js, Webpack, SEO, ATS"
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Text Content (Markdown lists supported) *</label>
                <textarea 
                  value={snippetContent} 
                  onChange={(e) => setSnippetContent(e.target.value)} 
                  placeholder="Paste your professional summary paragraph, or experience bullets (e.g. - Led development of React UI components...)"
                  className="job-desc-textarea"
                  style={{ height: '220px' }}
                  required
                />
              </div>

              <div className="drawer-footer" style={{ padding: '1rem 0 0' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsSnippetFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Snippet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
         DRAWER MODAL: SAVE JOB APPLICATION
         ========================================== */}
      {isSaveAppModalOpen && (
        <div className="drawer-backdrop" onClick={() => setIsSaveAppModalOpen(false)}>
          <div className="drawer-content animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Save to Job Tracker</h3>
              <button className="onboarding-close-btn" onClick={() => setIsSaveAppModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveNewApplication} className="drawer-body">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input 
                  type="text" 
                  value={appTitle} 
                  onChange={(e) => setAppTitle(e.target.value)} 
                  placeholder="e.g. Senior Frontend Architect"
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input 
                  type="text" 
                  value={appCompany} 
                  onChange={(e) => setAppCompany(e.target.value)} 
                  placeholder="e.g. Stripe"
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Listing URL</label>
                <input 
                  type="url" 
                  value={appUrl} 
                  onChange={(e) => setAppUrl(e.target.value)} 
                  placeholder="https://..."
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    value={appStatus} 
                    onChange={(e) => setAppStatus(e.target.value)} 
                    className="filter-select"
                    style={{ minWidth: 'auto', width: '100%' }}
                  >
                    <option value="draft">Draft (Tailoring)</option>
                    <option value="applied">Applied / Sent</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer Received</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date Applied</label>
                  <input 
                    type="date" 
                    value={appDateApplied} 
                    onChange={(e) => setAppDateApplied(e.target.value)} 
                    className="search-input"
                    disabled={appStatus === 'draft'}
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes & Interview Prep</label>
                <textarea 
                  value={appNotes} 
                  onChange={(e) => setAppNotes(e.target.value)} 
                  placeholder="Add reminders about interview dates, key contacts, or preparation tips..."
                  className="job-desc-textarea"
                  style={{ height: '120px' }}
                />
              </div>

              <div className="drawer-footer" style={{ padding: '1rem 0 0' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsSaveAppModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
         DRAWER MODAL: EDIT JOB APPLICATION
         ========================================== */}
      {isEditAppModalOpen && (
        <div className="drawer-backdrop" onClick={() => setIsEditAppModalOpen(false)}>
          <div className="drawer-content animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Edit Application Pipeline</h3>
              <button className="onboarding-close-btn" onClick={() => setIsEditAppModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEditedApplication} className="drawer-body">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input 
                  type="text" 
                  value={appTitle} 
                  onChange={(e) => setAppTitle(e.target.value)} 
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input 
                  type="text" 
                  value={appCompany} 
                  onChange={(e) => setAppCompany(e.target.value)} 
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Listing URL</label>
                <input 
                  type="url" 
                  value={appUrl} 
                  onChange={(e) => setAppUrl(e.target.value)} 
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    value={appStatus} 
                    onChange={(e) => setAppStatus(e.target.value)} 
                    className="filter-select"
                    style={{ minWidth: 'auto', width: '100%' }}
                  >
                    <option value="draft">Draft (Tailoring)</option>
                    <option value="applied">Applied / Sent</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer Received</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date Applied</label>
                  <input 
                    type="date" 
                    value={appDateApplied} 
                    onChange={(e) => setAppDateApplied(e.target.value)} 
                    className="search-input"
                    disabled={appStatus === 'draft'}
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes & Interview Prep</label>
                <textarea 
                  value={appNotes} 
                  onChange={(e) => setAppNotes(e.target.value)} 
                  className="job-desc-textarea"
                  style={{ height: '120px' }}
                />
              </div>

              <div className="drawer-footer" style={{ padding: '1rem 0 0' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditAppModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
         SPLIT MODAL: VIEW TAILORED RESUME & LISTING
         ========================================== */}
      {isViewResumeModalOpen && viewingApp && (
        <div className="drawer-backdrop" onClick={() => setIsViewResumeModalOpen(false)} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className="drawer-content animate-fade-in" style={{ width: '90%', maxWidth: '1000px', height: '90%', borderRadius: '16px' }} onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h3 style={{ margin: 0 }}>Tailored Resume: {viewingApp.name} at {viewingApp.company}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>SEO Match Score: {viewingApp.matchScore}%</span>
              </div>
              <button className="onboarding-close-btn" onClick={() => setIsViewResumeModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="drawer-body" style={{ padding: '1.5rem' }}>
              <div className="split-modal-layout">
                <div className="split-modal-pane">
                  <h4>Target Job Description</h4>
                  <div className="split-modal-pane-content">
                    {viewingApp.jobDescription || <span className="text-muted">No job description saved for this application.</span>}
                  </div>
                </div>
                
                <div className="split-modal-pane">
                  <h4>Compiled Tailored Resume</h4>
                  <div 
                    className="compiled-preview-rendered" 
                    style={{ border: 'none', padding: 0, height: 'auto', overflowY: 'visible', background: 'transparent' }}
                    dangerouslySetInnerHTML={renderMarkdownHTML(compileSavedAppMarkdown(viewingApp))} 
                  />
                </div>
              </div>
            </div>

            <div className="drawer-footer" style={{ borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => handleCopySavedAppCompiled(viewingApp)}>
                <Copy size={16} /> Copy Resume
              </button>
              <button className="btn btn-secondary" onClick={() => handleDownloadSavedAppCompiled(viewingApp)}>
                <Download size={16} /> Download Resume
              </button>
              <button className="btn btn-primary" onClick={() => setIsViewResumeModalOpen(false)}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
         DOCUMENT LIGHTBOX PREVIEWER
         ========================================== */}
      {isLightboxOpen && lightboxFile && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-header">
              <h3>{lightboxFile.name}</h3>
              <div className="lightbox-header-actions">
                <button 
                  type="button"
                  className="btn btn-secondary" 
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={() => downloadAttachment(lightboxFile)}
                  title="Download Document"
                >
                  <Download size={14} /> Download
                </button>
                <button 
                  type="button"
                  className="onboarding-close-btn" 
                  onClick={closeLightbox} 
                  style={{ margin: 0 }} 
                  title="Close Preview"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="lightbox-body">
              {lightboxFile.type?.startsWith('image/') ? (
                <img src={lightboxFile.data} className="lightbox-image" alt={lightboxFile.name} />
              ) : (
                <iframe src={lightboxFile.data} className="lightbox-pdf-frame" title={lightboxFile.name} />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
