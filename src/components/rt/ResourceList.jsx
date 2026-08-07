import React, { useState } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Check, 
  RefreshCcw, 
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';
import { CATEGORIES, CURRENCIES } from '../../data/mockData';

export default function ResourceList({ 
  resources, 
  onEdit, 
  onDelete, 
  onToggleUsed,
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  businessFilter,
  setBusinessFilter
}) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('expiry-asc');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showInactive, setShowInactive] = useState(false);

  const today = new Date();

  // Helper to determine item status
  const getItemStatus = (item) => {
    if (item.isArchived) return 'archived';
    if (item.type === 'credit' || item.type === 'coupon') {
      if (item.used) return 'redeemed';
    }
    
    if (!item.expiryDate) return 'active';

    try {
      const expiry = parseISO(item.expiryDate);
      const daysLeft = differenceInDays(expiry, today);
      if (daysLeft < 0) return 'expired';
      if (daysLeft <= (Number(item.alertDays) || 7)) return 'expiring';
      return 'active';
    } catch (e) {
      return 'active';
    }
  };

  // Helper to get currency symbol
  const getCurrencySymbol = (code) => {
    const currency = CURRENCIES.find(c => c.code === code);
    return currency ? currency.symbol : '$';
  };

  // Filter items
  const filteredResources = resources.filter(item => {
    // Search filter
    const matchesSearch = 
      item.name.toLowerCase().includes(searchText.toLowerCase()) || 
      (item.notes && item.notes.toLowerCase().includes(searchText.toLowerCase()));

    // Type filter
    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    // Category filter
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    // Status filter
    const status = getItemStatus(item);
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = status === 'active' || status === 'expiring';
    } else if (statusFilter === 'expiring') {
      matchesStatus = status === 'expiring';
    } else if (statusFilter === 'expired') {
      matchesStatus = status === 'expired';
    } else if (statusFilter === 'redeemed') {
      matchesStatus = status === 'redeemed';
    } else if (statusFilter === 'archived') {
      matchesStatus = status === 'archived';
    }

    // Business / Tax filter
    let matchesBusiness = true;
    if (businessFilter === 'business') {
      matchesBusiness = !!item.isBusiness;
    } else if (businessFilter === 'tax') {
      matchesBusiness = !!item.isTaxWriteOff;
    } else if (businessFilter === 'personal') {
      matchesBusiness = !item.isBusiness;
    }

    return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesBusiness;
  });

  // Sort items
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    
    // Sort by cost/value
    if (sortBy === 'value-desc') {
      const valA = a.type === 'subscription' ? a.cost : a.value;
      const valB = b.type === 'subscription' ? b.cost : b.value;
      return valB - valA;
    }
    if (sortBy === 'value-asc') {
      const valA = a.type === 'subscription' ? a.cost : a.value;
      const valB = b.type === 'subscription' ? b.cost : b.value;
      return valA - valB;
    }

    // Sort by Expiration/Renewal Date
    if (sortBy === 'expiry-asc') {
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return a.expiryDate.localeCompare(b.expiryDate);
    }
    if (sortBy === 'expiry-desc') {
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return b.expiryDate.localeCompare(a.expiryDate);
    }

    return 0;
  });

  const activeGroup = sortedResources.filter(item => {
    const status = getItemStatus(item);
    return status === 'active' || status === 'expiring';
  });

  const inactiveGroup = sortedResources.filter(item => {
    const status = getItemStatus(item);
    return status === 'expired' || status === 'redeemed' || status === 'archived';
  });

  const renderResourceCard = (item) => {
    const itemStatus = getItemStatus(item);
    const currencySymbol = getCurrencySymbol(item.currency);
    const isInactiveItem = ['expired', 'redeemed', 'archived'].includes(itemStatus);
    
    // Format renewal message
    let expiryMsg = 'No Expiration';
    let dateDiffText = '';
    if (item.expiryDate) {
      try {
        const diff = differenceInDays(parseISO(item.expiryDate), today);
        expiryMsg = item.expiryDate;
        if (diff < 0) {
          dateDiffText = 'Expired';
        } else if (diff === 0) {
          dateDiffText = 'Today';
        } else if (diff === 1) {
          dateDiffText = 'Tomorrow';
        } else {
          dateDiffText = `${diff} days left`;
        }
      } catch (e) {
        expiryMsg = item.expiryDate;
      }
    }

    return (
      <div key={item.id} className={`resource-card ${itemStatus === 'archived' ? 'archived-card' : ''}`}>
        {/* Header */}
        <div className="card-header">
          <div className="card-title-section">
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span className={`type-badge ${item.type}`}>
                {item.type === 'credit' ? 'Credit' : item.type === 'coupon' ? 'Coupon' : item.type}
              </span>
              {item.isBusiness && (
                <span className="type-badge business" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                  Business
                </span>
              )}
              {item.isTaxWriteOff && (
                <span className="type-badge tax" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                  Tax Write-off
                </span>
              )}
            </div>
            <h4 className="card-title">{item.name}</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Category: {item.category}
            </span>
          </div>
          
          {/* Actions */}
          <div className="card-actions-menu">
            {item.url && (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="card-action-btn"
                title="Open login/website"
              >
                <ExternalLink size={15} />
              </a>
            )}
            <button 
              className="card-action-btn" 
              onClick={() => onEdit(item)}
              title="Edit"
            >
              <Edit2 size={15} />
            </button>
            <button 
              className="card-action-btn delete" 
              onClick={() => onDelete(item.id, isInactiveItem)}
              title={isInactiveItem ? "Permanently Delete" : "Remove"}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="card-body">
          {/* Cost or Value Box */}
          <div className="value-box">
            <span className="value-label">
              {item.type === 'subscription' 
                ? `Cost (${item.billingCycle === 'monthly' ? '/ mo' : item.billingCycle === 'yearly' ? '/ yr' : 'once'})`
                : 'Value Amount'
              }
            </span>
            <span className="value-amount">
              {currencySymbol}
              {item.type === 'subscription' ? item.cost.toFixed(2) : item.value.toFixed(2)}
            </span>
          </div>

          {/* Date details */}
          <div className="card-details">
            <div className="detail-row">
              <span className="detail-label">
                <Calendar size={14} />
                {item.type === 'subscription' ? 'Renewal Date' : 'Expiration'}
              </span>
              <span className="detail-value">
                {expiryMsg} {dateDiffText && `(${dateDiffText})`}
              </span>
            </div>

            {item.type === 'subscription' && (
              <div className="detail-row">
                <span className="detail-label">
                  <RefreshCcw size={14} />
                  Auto-renew
                </span>
                <span className="detail-value">
                  {item.autoRenew ? 'Yes' : 'No (Manual cancellation needed)'}
                </span>
              </div>
            )}
          </div>

          {/* Notes Preview */}
          {item.notes && (
            <div className="notes-preview">
              {item.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="card-footer">
          {/* Status Badge */}
          {itemStatus === 'archived' && (
            <span className="status-badge expired" style={{ opacity: 0.8 }}>
              <span className="status-dot" style={{ background: 'var(--text-muted)', boxShadow: 'none' }} />
              Removed
            </span>
          )}
          {itemStatus === 'redeemed' && (
            <span className="status-badge active" style={{ color: 'var(--text-muted)' }}>
              <span className="status-dot" style={{ background: 'var(--text-muted)', boxShadow: 'none' }} />
              Redeemed
            </span>
          )}
          {itemStatus === 'active' && (
            <span className="status-badge active">
              <span className="status-dot" />
              Active / Safe
            </span>
          )}
          {itemStatus === 'expiring' && (
            <span className="status-badge warning">
              <span className="status-dot" />
              Expiring Soon
            </span>
          )}
          {itemStatus === 'expired' && (
            <span className="status-badge expired">
              <span className="status-dot" />
              Expired (Unspent)
            </span>
          )}

          {/* Redeem Button for credits and coupons */}
          {(item.type === 'credit' || item.type === 'coupon') && (
            <button 
              className={`btn ${item.used ? 'btn-secondary' : 'btn-primary'}`} 
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
              onClick={() => onToggleUsed(item.id)}
            >
              {item.used ? 'Mark Unused' : 'Mark Redeemed'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="resources-tracker-container">
      {/* Filtering Control Panel */}
      <div className="controls-panel">
        <div className="controls-row-1">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search resource names, codes, notes..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>

          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)} 
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="subscription">Subscriptions</option>
            <option value="credit">Credits & Vouchers</option>
            <option value="coupon">Coupons & Promos</option>
            <option value="account">Accounts</option>
            <option value="other">Other Resources</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Unused/Valid)</option>
            <option value="expiring">Expiring / Renewing Soon</option>
            <option value="expired">Expired (Unused)</option>
            <option value="redeemed">Redeemed / Spent</option>
            <option value="archived">Manually Removed</option>
          </select>

          <select 
            value={businessFilter} 
            onChange={(e) => setBusinessFilter(e.target.value)} 
            className="filter-select"
          >
            <option value="all">All Expenses</option>
            <option value="personal">Personal Only</option>
            <option value="business">Business Only</option>
            <option value="tax">Tax Write-Offs Only</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="filter-select"
          >
            <option value="expiry-asc">Expiry: Soonest first</option>
            <option value="expiry-desc">Expiry: Furthest first</option>
            <option value="value-desc">Value/Cost: High to Low</option>
            <option value="value-asc">Value/Cost: Low to High</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>

          <div className="view-toggles">
            <button 
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Quick Category Tags */}
        <div className="category-tags">
          <button 
            className={`category-tag-btn ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              className={`category-tag-btn ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or List list wrapper */}
      {(activeGroup.length > 0 || inactiveGroup.length > 0) ? (
        <div className="resources-sections">
          {activeGroup.length > 0 && (
            <div className={viewMode === 'grid' ? 'resources-grid' : 'resources-list-layout'}>
              {activeGroup.map(item => renderResourceCard(item))}
            </div>
          )}
          
          {inactiveGroup.length > 0 && (
            <div className="inactive-section-toggle" style={{ marginTop: activeGroup.length > 0 ? '2rem' : '0', marginBottom: '1.5rem', borderTop: activeGroup.length > 0 ? '1px solid var(--border-color)' : 'none', paddingTop: activeGroup.length > 0 ? '1.5rem' : '0' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowInactive(!showInactive)}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)' }}
              >
                {showInactive ? 'Hide' : 'Show'} Used / Expired / Removed Resources ({inactiveGroup.length})
              </button>
            </div>
          )}

          {showInactive && inactiveGroup.length > 0 && (
            <div className={viewMode === 'grid' ? 'resources-grid inactive-grid' : 'resources-list-layout inactive-list'} style={{ opacity: 0.85 }}>
              {inactiveGroup.map(item => renderResourceCard(item))}
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FileText size={36} />
          </div>
          <h3>No matching resources found</h3>
          <p>
            Adjust your search query, or clear your filters (Type: {typeFilter}, Category: {categoryFilter}, Status: {statusFilter}) to find what you are looking for.
          </p>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setTypeFilter('all');
              setCategoryFilter('all');
              setStatusFilter('all');
              setSearchText('');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
