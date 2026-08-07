import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES, CURRENCIES } from '../../data/mockData';

export default function ResourceForm({ isOpen, onClose, onSubmit, editingResource }) {
  const initialFormState = {
    name: '',
    type: 'subscription',
    category: 'Software/SaaS',
    cost: '',
    value: '',
    currency: 'USD',
    billingCycle: 'monthly',
    expiryDate: '',
    alertDays: '7',
    url: '',
    notes: '',
    used: false,
    autoRenew: true,
    isBusiness: false,
    isTaxWriteOff: false
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingResource) {
      setForm({
        ...editingResource,
        cost: editingResource.cost || '',
        value: editingResource.value || '',
        expiryDate: editingResource.expiryDate || '',
        alertDays: editingResource.alertDays || '7',
        isBusiness: editingResource.isBusiness || false,
        isTaxWriteOff: editingResource.isTaxWriteOff || false
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
  }, [editingResource, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clean error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (form.type === 'subscription' && !form.cost) {
      // cost is not strictly required but we should encourage it, or set to 0
    }
    if ((form.type === 'credit' || form.type === 'coupon') && !form.value) {
      newErrors.value = 'Value amount is required';
    }
    
    // validate date format if filled
    if (form.expiryDate) {
      const parsedDate = Date.parse(form.expiryDate);
      if (isNaN(parsedDate)) {
        newErrors.expiryDate = 'Please enter a valid date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submittedData = {
      ...form,
      cost: form.type === 'subscription' ? Number(form.cost) || 0 : 0,
      value: (form.type === 'credit' || form.type === 'coupon') ? Number(form.value) || 0 : 0,
      alertDays: Number(form.alertDays) || 7,
      expiryDate: form.expiryDate || null,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (!editingResource) {
      submittedData.id = `resource-${Date.now()}`;
      submittedData.createdAt = new Date().toISOString().split('T')[0];
    }

    onSubmit(submittedData);
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>{editingResource ? 'Edit Resource' : 'Add New Resource'}</h3>
          <button className="btn btn-secondary btn-icon-only" onClick={onClose} aria-label="Close form">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-body">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Resource Name *</label>
            <input 
              type="text" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="e.g. Delta Flight Credit, Netflix"
              className="form-input"
            />
            {errors.name && <span style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>{errors.name}</span>}
          </div>

          {/* Type & Category */}
          <div className="form-group-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="form-select">
                <option value="subscription">Subscription</option>
                <option value="credit">Credit / Voucher</option>
                <option value="coupon">Coupon / Promo</option>
                <option value="account">Account</option>
                <option value="other">Other Resource</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="form-select">
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Financial details - cost vs value */}
          <div className="form-group-row">
            {form.type === 'subscription' || form.type === 'account' ? (
              <div className="form-group">
                <label className="form-label">Cost / Price</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="cost" 
                  value={form.cost} 
                  onChange={handleChange} 
                  placeholder="0.00"
                  className="form-input"
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Value Amount *</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="value" 
                  value={form.value} 
                  onChange={handleChange} 
                  placeholder="0.00"
                  className="form-input"
                />
                {errors.value && <span style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>{errors.value}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className="form-select">
                {CURRENCIES.map(curr => (
                  <option key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Billing Cycle - Only Subscriptions */}
          {form.type === 'subscription' && (
            <div className="form-group">
              <label className="form-label">Billing Cycle</label>
              <select name="billingCycle" value={form.billingCycle} onChange={handleChange} className="form-select">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One-time / Other</option>
              </select>
            </div>
          )}

          {/* Expiry Date & Alert Days */}
          <div className="form-group-row">
            <div className="form-group">
              <label className="form-label">
                {form.type === 'subscription' ? 'Next Renewal Date' : 'Expiration Date'}
              </label>
              <input 
                type="date" 
                name="expiryDate" 
                value={form.expiryDate} 
                onChange={handleChange} 
                className="form-input"
              />
              {errors.expiryDate && <span style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>{errors.expiryDate}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Alert Days Before</label>
              <input 
                type="number" 
                name="alertDays" 
                value={form.alertDays} 
                onChange={handleChange} 
                placeholder="7"
                min="0"
                className="form-input"
              />
            </div>
          </div>

          {/* Target Website / URL */}
          <div className="form-group">
            <label className="form-label">Website / Log-in URL</label>
            <input 
              type="url" 
              name="url" 
              value={form.url} 
              onChange={handleChange} 
              placeholder="https://example.com"
              className="form-input"
            />
          </div>

          {/* Notes & Description */}
          <div className="form-group">
            <label className="form-label">Notes, Codes or Account Info</label>
            <textarea 
              name="notes" 
              value={form.notes} 
              onChange={handleChange} 
              placeholder="e.g. Login email, Promo codes, Coupon rules..."
              className="form-textarea"
            />
          </div>

          {/* Status Toggles */}
          <div className="form-group" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
            {form.type === 'subscription' && (
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="autoRenew" 
                  checked={form.autoRenew} 
                  onChange={handleChange}
                  className="checkbox-input"
                />
                Auto-Renews Automatically
              </label>
            )}

            {(form.type === 'credit' || form.type === 'coupon') && (
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="used" 
                  checked={form.used} 
                  onChange={handleChange}
                  className="checkbox-input"
                />
                Mark as Redeemed / Fully Spent
              </label>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0', width: '100%' }} />

            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="isBusiness" 
                checked={form.isBusiness} 
                onChange={handleChange}
                className="checkbox-input"
              />
              Business Expense
            </label>

            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="isTaxWriteOff" 
                checked={form.isTaxWriteOff} 
                onChange={handleChange}
                className="checkbox-input"
              />
              Tax Write-Off / Deductible
            </label>
          </div>
        </form>

        <div className="drawer-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            {editingResource ? 'Save Changes' : 'Create Resource'}
          </button>
        </div>
      </div>
    </div>
  );
}
