import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Calendar, 
  Database, 
  AlertTriangle, 
  TrendingUp, 
  Info,
  ExternalLink,
  BookOpen,
  ShieldAlert,
  Sparkles,
  Lock,
  Server,
  Key
} from 'lucide-react';

export default function UserGuide({ onLaunchOnboarding }) {
  const [activeGuideTab, setActiveGuideTab] = useState('getting-started');

  return (
    <div className="user-guide-container">
      {/* Sidebar Navigation */}
      <aside className="guide-sidebar">
        <div className="guide-title-section">
          <BookOpen className="guide-title-icon" size={20} />
          <h4>User & Usage Guide</h4>
        </div>
        <nav className="guide-nav">
          <button 
            className={`guide-nav-item ${activeGuideTab === 'getting-started' ? 'active' : ''}`}
            onClick={() => setActiveGuideTab('getting-started')}
          >
            Getting Started
          </button>
          <button 
            className={`guide-nav-item ${activeGuideTab === 'creating-logs' ? 'active' : ''}`}
            onClick={() => setActiveGuideTab('creating-logs')}
          >
            Creating Logs & Blocks
          </button>
          <button 
            className={`guide-nav-item ${activeGuideTab === 'deleting-archiving' ? 'active' : ''}`}
            onClick={() => setActiveGuideTab('deleting-archiving')}
          >
            Deleting & Archiving
          </button>
          <button 
            className={`guide-nav-item ${activeGuideTab === 'alerts-colors' ? 'active' : ''}`}
            onClick={() => setActiveGuideTab('alerts-colors')}
          >
            Alerts & Thresholds
          </button>
          <button 
            className={`guide-nav-item ${activeGuideTab === 'backups-obsidian' ? 'active' : ''}`}
            onClick={() => setActiveGuideTab('backups-obsidian')}
          >
            Backups & Obsidian
          </button>
          <button 
            className={`guide-nav-item ${activeGuideTab === 'security-onboarding' ? 'active' : ''}`}
            onClick={() => setActiveGuideTab('security-onboarding')}
          >
            Security & Onboarding
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <section className="guide-content-area glass-panel">
        {activeGuideTab === 'getting-started' && (
          <div className="guide-tab-content">
            <h2 className="neon-text-blue">Welcome to Resource Tracker</h2>
            <p className="lead-text">
              Keep track of your open accounts, software subscriptions, travel credits, promo vouchers, and coupons in one persistent, beautiful dashboard.
            </p>

            <div className="guide-grid">
              <div className="guide-info-card">
                <div className="guide-card-icon-wrapper" style={{ color: 'var(--accent-indigo)' }}>
                  <TrendingUp size={24} />
                </div>
                <h3>Visual Dashboard</h3>
                <p>
                  Get real-time insights into your total monthly/annual spend, available voucher credits, and active coupon counts.
                </p>
              </div>

              <div className="guide-info-card">
                <div className="guide-card-icon-wrapper" style={{ color: 'var(--accent-blue)' }}>
                  <Calendar size={24} />
                </div>
                <h3>Calendar Integration</h3>
                <p>
                  See exactly which days of the month have subscriptions renewing or coupons expiring, helping you avoid unexpected renewals or wasted vouchers.
                </p>
              </div>

              <div className="guide-info-card" style={{ gridColumn: '1 / -1' }}>
                <div className="guide-card-icon-wrapper" style={{ color: 'var(--accent-green)' }}>
                  <Database size={24} />
                </div>
                <h3>Fully Private & Local</h3>
                <p>
                  Your data never leaves your device. It is synchronized locally within the application engine and runs securely offline.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeGuideTab === 'creating-logs' && (
          <div className="guide-tab-content">
            <h2 className="neon-text-indigo">Creating Resource Logs (Blocks)</h2>
            <p>
              Logs are the core building blocks of your tracker. You can log different categories of resources with specific details.
            </p>

            <div className="steps-timeline">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-body">
                  <h4>Launch the Form Drawer</h4>
                  <p>
                    Click the neon-accented <strong>+ Add Resource</strong> button in the top right header of the application. A slide-over form will draw open on the right side of the screen.
                  </p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-body">
                  <h4>Choose Resource Type</h4>
                  <p>
                    Select the type of resource from the dropdown:
                  </p>
                  <ul className="guide-list">
                    <li><strong>Subscription</strong>: Recurring expenses (Netflix, Adobe Creative Cloud, Gym). Expects a price, billing cycle (monthly/yearly), and next renewal date.</li>
                    <li><strong>Credit / Voucher</strong>: Prepaid balances (Delta flight credit, Uber cash, hotel vouchers). Expects a total value amount and expiration date.</li>
                    <li><strong>Coupon / Promo</strong>: Discounts and promotional offers (Free coffee code, UberEats 20% off). Expects a value amount and expiration date.</li>
                    <li><strong>Account</strong>: Login and username tracking (bank accounts, membership tiers).</li>
                  </ul>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-body">
                  <h4>Fill out Key Properties</h4>
                  <ul className="guide-list">
                    <li><strong>Cost vs Value</strong>: Subscriptions show cost; Credits/Coupons prompt for redeemable value.</li>
                    <li><strong>Website / Log-in URL</strong>: Paste the service login page. You can jump directly to it from your list with one click.</li>
                    <li><strong>Alert Days Before</strong>: Choose how many days in advance you want a neon alert badge to flag the resource.</li>
                  </ul>
                </div>
              </div>

              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-body">
                  <h4>Save</h4>
                  <p>
                    Click <strong>Create Resource</strong>. The new resource block will immediately appear in your tracker list and recalculate your dashboard stats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeGuideTab === 'deleting-archiving' && (
          <div className="guide-tab-content">
            <h2 className="neon-text-red">Deleting, Editing & Redeeming Logs</h2>
            <p>
              Keep your list clean and tidy by editing properties, permanently deleting blocks, or archiving vouchers when they are used.
            </p>

            <div className="guide-action-table">
              <div className="action-row">
                <div className="action-col-header"><Edit3 size={16} /> Editing Logs</div>
                <div className="action-col-desc">
                  To modify a resource, click the edit icon (pencil) in the grid list card. The drawer will slide open preloaded with the current values. Modify the fields and click <strong>Save Changes</strong>.
                </div>
              </div>

              <div className="action-row">
                <div className="action-col-header"><Trash2 size={16} /> Deleting Logs</div>
                <div className="action-col-desc">
                  To permanently remove a block from your database, click the trash icon. You will be prompted with a confirmation dialog. Confirm to delete the item permanently.
                </div>
              </div>

              <div className="action-row">
                <div className="action-col-header"><CheckCircle2 size={16} /> Redeeming & Spending</div>
                <div className="action-col-desc">
                  Instead of deleting coupons or credits, toggle the <strong>Used / Redeemed</strong> checkbox in the list view (or in the edit form). This archives the resource, marks it as spent, and stops active expiration alerts while preserving history.
                </div>
              </div>
            </div>

            <div className="guide-note" style={{ marginTop: '1.5rem' }}>
              <Info size={18} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
              <p>
                <strong>Pro-Tip:</strong> Use the "Used" filter in the main Tracker list tab to toggle between active resources, spent resources, or all items in your history.
              </p>
            </div>
          </div>
        )}

        {activeGuideTab === 'alerts-colors' && (
          <div className="guide-tab-content">
            <h2 className="neon-text-green">Alert Badges & Color Thresholds</h2>
            <p>
              The application automatically parses dates and applies neon status pills so you can scan upcoming milestones instantly.
            </p>

            <div className="badges-showcase">
              <div className="badge-row">
                <span className="status-badge active">Active</span>
                <p>The resource is active and has plenty of time remaining before renewal or expiration.</p>
              </div>

              <div className="badge-row">
                <span className="status-badge warning">Warning</span>
                <p>The resource is within its alert window (e.g., 7 days prior to expiration). A neon alert box will also display at the top of your Dashboard.</p>
              </div>

              <div className="badge-row">
                <span className="status-badge expired">Expired / Due</span>
                <p>The expiration date has passed, or a subscription is due for renewal today. Take action immediately to avoid lost value or billing.</p>
              </div>

              <div className="badge-row">
                <span className="status-badge archived">Used</span>
                <p>The credit or coupon has been marked as fully redeemed. Expiration timers are disabled for this item.</p>
              </div>
            </div>

            <div className="guide-note alert-note">
              <AlertTriangle size={18} style={{ color: 'var(--accent-orange)', flexShrink: 0 }} />
              <p>
                <strong>Dashboard Warnings:</strong> Any active resource flagged with a <span className="text-warning">Warning</span> or <span className="text-danger">Expired</span> status will dynamically float to the "Critical Attention Needed" card at the top of your dashboard.
              </p>
            </div>
          </div>
        )}

        {activeGuideTab === 'backups-obsidian' && (
          <div className="guide-tab-content">
            <h2 className="neon-text-indigo">Persistence, Backups & Obsidian Integration</h2>
            <p>
              Because this application runs fully locally in your browser frame, backup management is simple and secure.
            </p>

            <div className="guide-box">
              <h4>1. How Data is Stored</h4>
              <p>
                All resource blocks you create are saved to your browser's <code>localStorage</code> database under the origin <code>http://127.0.0.1:5173</code>. When you access the app via Obsidian, Obsidian loads this address inside a secure web pane, sharing the exact same dataset.
              </p>
            </div>

            <div className="guide-box">
              <h4>2. Downloading Backups</h4>
              <p>
                Go to the <strong>Config & Backups</strong> tab inside the application header:
              </p>
              <ul className="guide-list">
                <li>Click <strong>Download Backup File</strong>.</li>
                <li>This will download a single, formatted <code>.json</code> backup containing all your resources.</li>
                <li><strong>Recommendation:</strong> Save this backup file inside your Obsidian vault folder for version control and safe storage.</li>
              </ul>
            </div>

            <div className="guide-box">
              <h4>3. Restoring Backups</h4>
              <p>
                If you clear your cache or change computer setups, go to <strong>Config & Backups</strong>, click <strong>Choose Backup File</strong>, pick your saved JSON file, and confirm the import. All items will be restored instantly.
              </p>
            </div>

            <div className="guide-box">
              <h4>4. Reset / Danger Zone</h4>
              <p>
                If you ever want to clear all data or reload the sample template logs to practice, you can do so in the danger zone at the bottom of the Backups panel.
              </p>
            </div>
          </div>
        )}

        {activeGuideTab === 'security-onboarding' && (
          <div className="guide-tab-content animate-fade-in">
            <h2 className="neon-text-purple">Security Protocols & Onboarding Portal</h2>
            <p className="lead-text">
              Establishing a custom resource tracker requires balancing Frictionless Migration with strict Security Policies.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.8rem 1.8rem', gap: '0.75rem', boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}
                onClick={onLaunchOnboarding}
              >
                <Sparkles size={18} />
                Launch Security Onboarding Wizard
              </button>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '2rem' }}>
              I. Essential Security Disclaimers (Read First)
            </h3>

            <div className="guide-action-table" style={{ marginTop: '1rem' }}>
              <div className="action-row">
                <div className="action-col-header" style={{ color: 'var(--accent-yellow)' }}>
                  <ShieldAlert size={16} /> The "Burn the Bridge" CSV Rule
                </div>
                <div className="action-col-desc">
                  Password exports from Chrome, LastPass, or 1Password are completely <strong>unencrypted plain text CSV files</strong>. 
                  Always securely delete (not just send to the trash bin) the export file the exact second the import is verified.
                </div>
              </div>

              <div className="action-row">
                <div className="action-col-header" style={{ color: 'var(--accent-blue)' }}>
                  <Server size={16} /> Air-Gapped Processing
                </div>
                <div className="action-col-desc">
                  Any CSV data parsing or validation runs entirely client-side on your local machine. 
                  Unencrypted credentials are never sent to external servers or clean-up APIs.
                </div>
              </div>

              <div className="action-row">
                <div className="action-col-header" style={{ color: 'var(--accent-red)' }}>
                  <Lock size={16} /> Password Irretrievability
                </div>
                <div className="action-col-desc">
                  This tracker uses a zero-knowledge local architecture. We cannot restore your master key or sync configuration if lost. 
                  If you lose it, your data remains cryptographically locked forever.
                </div>
              </div>

              <div className="action-row">
                <div className="action-col-header" style={{ color: 'var(--accent-green)' }}>
                  <Key size={16} /> Isolate Developer Secrets
                </div>
                <div className="action-col-desc">
                  Keep production keys, API tokens, SSH credentials, and environment variables separate from consumer credentials, 
                  ideally in specialized fields or specialized developer vaults.
                </div>
              </div>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '2.5rem' }}>
              II. Population Efficiency Recommendations
            </h3>

            <div className="guide-box" style={{ marginTop: '1.25rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)' }}>
                <Sparkles size={16} /> 1. Pre-Mapped CSV Templates
              </h4>
              <p>
                Instead of mapping columns manually, download our standardized template containing all schema properties. 
                Copy and paste your data rows directly into this template for a flawless bulk-import.
              </p>
            </div>

            <div className="guide-box">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)' }}>
                <TrendingUp size={16} /> 2. The 80/20 "Ad-Hoc" Import Strategy
              </h4>
              <p>
                Avoid weekend-long audits that lead to churn. Import only your <strong>top 20%</strong> vital credentials 
                (financial cards, primary email, core tools). For the remaining 80%, log them into the tracker incrementally 
                as you naturally sign in over the next few months.
              </p>
            </div>

            <div className="guide-box">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)' }}>
                <Database size={16} /> 3. Automated Receipt Pipelines
              </h4>
              <p>
                Set up filters in your email inbox to auto-forward subscription bills or renewal receipts to a dedicated folder. 
                Once a month, audit this folder to capture costs and renewal dates without manual tracker updates.
              </p>
            </div>

            <div className="guide-box">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-yellow)' }}>
                <Info size={16} /> 4. Virtual Credit Card Sandbox
              </h4>
              <p>
                Isolate SaaS spending by signing up for new services using single-use virtual credit cards (like Privacy.com). 
                If a subscription charges hidden fees, you can delete or freeze the virtual card with one click, preserving your real card details.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
