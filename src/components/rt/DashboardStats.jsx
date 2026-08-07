import React from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Tag, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck,
  Calendar,
  Briefcase,
  Receipt
} from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

export default function DashboardStats({ resources, onSelectTab, setSearchText, setStatusFilter, setBusinessFilter }) {
  const today = new Date();

  // Filters for active items that are not used, archived, or expired
  const activeResources = resources.filter(r => {
    if (r.used || r.isArchived) return false;
    if (r.expiryDate) {
      try {
        const daysLeft = differenceInDays(parseISO(r.expiryDate), today);
        if (daysLeft < 0) return false;
      } catch (e) {}
    }
    return true;
  });
  
  // Calculate subscription expenses
  const subscriptions = activeResources.filter(r => r.type === 'subscription');
  const monthlyCost = subscriptions.reduce((sum, r) => {
    const cost = Number(r.cost) || 0;
    if (r.billingCycle === 'monthly') return sum + cost;
    if (r.billingCycle === 'yearly') return sum + (cost / 12);
    return sum; // one-time / other
  }, 0);

  const annualCost = monthlyCost * 12;

  // Calculate available credits
  const credits = activeResources.filter(r => r.type === 'credit');
  const totalCredits = credits.reduce((sum, r) => sum + (Number(r.value) || 0), 0);

  // Active coupons count
  const coupons = activeResources.filter(r => r.type === 'coupon');
  const activeCouponsCount = coupons.length;

  // Track accounts count
  const accountsCount = activeResources.filter(r => r.type === 'account').length;

  // Calculate business expenses
  const businessResources = activeResources.filter(r => r.isBusiness);
  const businessSubs = businessResources.filter(r => r.type === 'subscription');
  const businessMonthlyCost = businessSubs.reduce((sum, r) => {
    const cost = Number(r.cost) || 0;
    if (r.billingCycle === 'monthly') return sum + cost;
    if (r.billingCycle === 'yearly') return sum + (cost / 12);
    return sum;
  }, 0);
  const businessAnnualCost = businessMonthlyCost * 12;
  const businessCredits = businessResources.filter(r => r.type === 'credit');
  const totalBusinessCredits = businessCredits.reduce((sum, r) => sum + (Number(r.value) || 0), 0);

  // Calculate tax write-off deductions
  const taxResources = activeResources.filter(r => r.isTaxWriteOff);
  const taxSubs = taxResources.filter(r => r.type === 'subscription');
  const taxAnnualWriteOff = taxSubs.reduce((sum, r) => {
    const cost = Number(r.cost) || 0;
    if (r.billingCycle === 'monthly') return sum + (cost * 12);
    if (r.billingCycle === 'yearly') return sum + cost;
    return sum;
  }, 0);
  const taxOneTime = taxResources.filter(r => r.type === 'credit' || r.type === 'coupon');
  const taxOneTimeWriteOff = taxOneTime.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
  const totalAnnualDeductions = taxAnnualWriteOff + taxOneTimeWriteOff;

  // Expiring soon calculation
  const expiringSoonItems = activeResources.filter(r => {
    if (!r.expiryDate) return false;
    try {
      const expiry = parseISO(r.expiryDate);
      const daysLeft = differenceInDays(expiry, today);
      const alertThreshold = Number(r.alertDays) || 7;
      return daysLeft >= 0 && daysLeft <= alertThreshold;
    } catch (e) {
      return false;
    }
  });

  const expiredItems = resources.filter(r => {
    if (r.used || r.isArchived) return false;
    if (!r.expiryDate) return false;
    try {
      const expiry = parseISO(r.expiryDate);
      const daysLeft = differenceInDays(expiry, today);
      return daysLeft < 0;
    } catch (e) {
      return false;
    }
  });

  // Handle clicking on stat cards to quickly search/filter
  const viewSubDetails = () => {
    setStatusFilter('all');
    setBusinessFilter('all');
    setSearchText('');
    onSelectTab('tracker');
  };

  const viewExpiringSoon = () => {
    setStatusFilter('expiring');
    setBusinessFilter('all');
    setSearchText('');
    onSelectTab('tracker');
  };

  const viewExpired = () => {
    setStatusFilter('expired');
    setBusinessFilter('all');
    setSearchText('');
    onSelectTab('tracker');
  };

  const viewBusinessExpenses = () => {
    setStatusFilter('all');
    setBusinessFilter('business');
    setSearchText('');
    onSelectTab('tracker');
  };

  const viewTaxWriteOffs = () => {
    setStatusFilter('all');
    setBusinessFilter('tax');
    setSearchText('');
    onSelectTab('tracker');
  };

  return (
    <div className="dashboard-stats-wrapper">
      {/* Expiration Alerts Banner */}
      {expiringSoonItems.length > 0 && (
        <div className="alerts-section">
          <div className="alerts-header">
            <AlertTriangle size={20} />
            <h3>Action Required: Expirations / Renewals Imminent ({expiringSoonItems.length})</h3>
          </div>
          <div className="alerts-list">
            {expiringSoonItems.map(item => {
              const daysLeft = differenceInDays(parseISO(item.expiryDate), today);
              return (
                <div key={item.id} className="alert-item" onClick={viewExpiringSoon} style={{ cursor: 'pointer' }}>
                  <div>
                    <div className="alert-info-title">{item.name}</div>
                    <div className="alert-info-desc">
                      Type: <span style={{ textTransform: 'capitalize' }}>{item.type}</span> | 
                      {item.type === 'subscription' ? ' Renews' : ' Expires'}: {item.expiryDate}
                    </div>
                  </div>
                  <div className="alert-countdown">
                    {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days left`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expired items warning */}
      {expiredItems.length > 0 && (
        <div className="alerts-section" style={{ background: 'rgba(239, 68, 68, 0.02)', borderColor: 'rgba(239, 68, 68, 0.1)', marginTop: '-1.5rem', marginBottom: '2.5rem' }}>
          <div className="alerts-header" style={{ color: 'var(--text-secondary)' }}>
            <AlertTriangle size={20} style={{ color: 'var(--accent-yellow)' }} />
            <h3 style={{ color: 'var(--text-primary)' }}>Expired / Unutilized Resources ({expiredItems.length})</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            These resources have passed their expiration date but are still marked as active (unused). 
          </p>
          <button className="btn btn-secondary" onClick={viewExpired} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            Review Expired Items
          </button>
        </div>
      )}

      {/* Grid Stats */}
      <div className="stats-grid">
        <div className="stat-card purple" onClick={viewSubDetails} style={{ cursor: 'pointer' }}>
          <div className="stat-info">
            <span className="stat-label">Monthly Subscriptions</span>
            <span className="stat-value">${monthlyCost.toFixed(2)}</span>
            <span className="stat-subtext">Annual run rate: ${annualCost.toFixed(2)}</span>
          </div>
          <div className="stat-icon">
            <CreditCard size={24} />
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-info">
            <span className="stat-label">Available Credits</span>
            <span className="stat-value">${totalCredits.toFixed(2)}</span>
            <span className="stat-subtext">Travel & flight credits available</span>
          </div>
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-info">
            <span className="stat-label">Active Coupons</span>
            <span className="stat-value">{activeCouponsCount}</span>
            <span className="stat-subtext">Active offers & promo codes</span>
          </div>
          <div className="stat-icon">
            <Tag size={24} />
          </div>
        </div>

        <div className="stat-card yellow">
          <div className="stat-info">
            <span className="stat-label">Linked Accounts</span>
            <span className="stat-value">{accountsCount}</span>
            <span className="stat-subtext">Monitored credentials & links</span>
          </div>
          <div className="stat-icon">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* Business & Tax Deductions Summary Panel */}
      <div className="business-tax-panel" style={{
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.75rem',
        marginTop: '1.5rem',
        backgroundImage: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.75rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.25rem', color: '#ffffff' }}>
            <Briefcase size={22} style={{ color: 'var(--accent-purple)' }} />
            Business & Tax Deductions Summary
          </h3>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: '600' }}>
            Tax Year 2026
          </span>
        </div>

        <div className="business-tax-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {/* Business Expenses Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-purple)', boxShadow: '0 0 8px var(--accent-purple)' }}></span>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Business Expenses</h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Monthly Cost</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>${businessMonthlyCost.toFixed(2)}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Annual Run Rate</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>${businessAnnualCost.toFixed(2)}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Business Credits Available</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vouchers & flight credits</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-purple)' }}>${totalBusinessCredits.toFixed(2)}</div>
            </div>

            <button 
              className="btn btn-secondary" 
              onClick={viewBusinessExpenses}
              style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem', marginTop: '0.5rem', borderColor: 'rgba(139, 92, 246, 0.3)' }}
            >
              Filter Business Expenses
            </button>
          </div>

          {/* Tax Write-Offs Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }}></span>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Tax Deductions</h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Sub Deductions</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>${taxAnnualWriteOff.toFixed(2)}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Annualized run rate</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>One-Time Value</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>${taxOneTimeWriteOff.toFixed(2)}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Credits & coupons</div>
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: '600' }}>Est. Annual Write-offs</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total deduction pool</div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-green)', textShadow: '0 0 10px rgba(16, 185, 129, 0.2)' }}>
                ${totalAnnualDeductions.toFixed(2)}
              </div>
            </div>

            <button 
              className="btn btn-secondary" 
              onClick={viewTaxWriteOffs}
              style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem', marginTop: '0.5rem', borderColor: 'rgba(16, 185, 129, 0.3)' }}
            >
              Filter Tax Write-offs
            </button>
          </div>
        </div>
      </div>

      {/* Informative tips panel */}
      <div style={{
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginTop: '1rem',
        backgroundImage: 'linear-gradient(to right, rgba(139, 92, 246, 0.05), rgba(6, 182, 212, 0.02))'
      }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <TrendingUp size={18} style={{ color: 'var(--accent-purple)' }} />
          Resource Utilization Optimization Tip
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          {expiringSoonItems.length > 0 
            ? `You have ${expiringSoonItems.length} resources coming up for expiration/renewal. To maximize your value, check the "Tracker" tab to view specific links, codes, or instructions to redeem them, or disable auto-renewal on subscriptions you aren't using.`
            : `All tracked credits, subscriptions, and coupons are currently in a healthy state. Make sure to record any new airline vouchers, shopping credits, or credit card benefit coupons as soon as you receive them to ensure they don't expire unnoticed!`
          }
        </p>
      </div>
    </div>
  );
}
