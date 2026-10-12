import React, { useState } from 'react';
import {
  Settings,
  ShoppingBag,
  Mail,
  Server,
  Globe,
  Save,
  Send,
  Building,
  ShieldCheck,
  KeyRound,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useToast } from '../../hooks/useToast';
import { TestEmailModal } from '../../components/admin/TestEmailModal';

const LOGO_PRESETS = [
  { name: 'Default Gradient Icon', url: '' },
  {
    name: 'Modern Minimalist',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Luxury Crest',
    url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=200&q=80'
  }
];

export const AdminSettings = () => {
  const { settings, updateSettings } = useCms();
  const { currentCredentials, updateCredentials } = useAdminAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('branding'); // branding, contact, localization, emails, security
  const [formData, setFormData] = useState({ ...settings });
  const [isTestEmailOpen, setIsTestEmailOpen] = useState(false);

  // Security Credentials state
  const [adminUsernameInput, setAdminUsernameInput] = useState(currentCredentials?.username || 'admin');
  const [adminPasswordInput, setAdminPasswordInput] = useState(currentCredentials?.password || 'admin123');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const handleUpdateAdminCredentials = (e) => {
    e.preventDefault();
    if (!adminUsernameInput.trim() || !adminPasswordInput.trim()) {
      addToast('Username and password cannot be empty.', 'error');
      return;
    }
    if (adminPasswordInput.length < 6) {
      addToast('Password should be at least 6 characters.', 'error');
      return;
    }
    updateCredentials(adminUsernameInput, adminPasswordInput);
    addToast('Admin master credentials updated successfully!', 'success');
  };

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleEmailTemplateChange = (templateKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        [templateKey]: {
          ...prev.emailTemplates[templateKey],
          [field]: value
        }
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
    addToast('Store settings updated successfully! Changes reflected across the store.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <span>Store & System Settings</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure store branding, logo, transactional emails, SMTP, and currency rules.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'branding', label: 'Branding & Identity', icon: ShoppingBag },
          { id: 'contact', label: 'Contact & Support', icon: Building },
          { id: 'localization', label: 'Currency & Tax', icon: Globe },
          { id: 'emails', label: 'Emails & SMTP Engine', icon: Mail },
          { id: 'security', label: 'Security & Login', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 border border-neutral-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs p-6 sm:p-8">
        
        {/* --- TAB 1: BRANDING & IDENTITY --- */}
        {activeTab === 'branding' && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <h3 className="text-base font-black text-neutral-900 tracking-tight">
                Store Identity & Visual Branding
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                These settings update your storefront navbar, footer, invoices, and email templates automatically.
              </p>
            </div>

            {/* Store Name & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Store Brand Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleTextChange}
                  placeholder="e.g. NovaCart"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Tagline / Slogan
                </label>
                <input
                  type="text"
                  name="storeTagline"
                  value={formData.storeTagline}
                  onChange={handleTextChange}
                  placeholder="e.g. Luxury Essentials"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Store Logo Management */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Brand Logo (Image URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-1 space-y-3 w-full">
                  <input
                    type="url"
                    name="storeLogo"
                    value={formData.storeLogo}
                    onChange={handleTextChange}
                    placeholder="Leave empty for default gradient logo, or paste image URL"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />

                  {/* Logo Presets */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-500 font-medium">Presets:</span>
                    {LOGO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, storeLogo: preset.url }))}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                          formData.storeLogo === preset.url
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logo Live Preview */}
                <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-900 text-white flex items-center gap-3 shrink-0">
                  <div className="text-[10px] text-neutral-400 uppercase font-bold pr-2 border-r border-neutral-700">
                    Live Navbar<br />Preview
                  </div>
                  {formData.storeLogo ? (
                    <img
                      src={formData.storeLogo}
                      alt="Brand Logo"
                      className="w-10 h-10 object-contain rounded-xl bg-white/10 p-1"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex flex-col pr-2">
                    <span className="text-sm font-extrabold text-white tracking-tight">
                      {formData.storeName || 'NovaCart'}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold -mt-0.5">
                      {formData.storeTagline || 'Luxury Essentials'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Announcement Banner Configuration */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Top Announcement Bar
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Display an alert or promotional discount coupon across the top of every storefront page.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAnnouncementActive"
                    checked={formData.isAnnouncementActive}
                    onChange={handleTextChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {formData.isAnnouncementActive && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      name="announcementBadge"
                      value={formData.announcementBadge}
                      onChange={handleTextChange}
                      placeholder="e.g. Autumn Season Release:"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-medium bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                      Promotion Text / Coupon Code
                    </label>
                    <input
                      type="text"
                      name="announcementText"
                      value={formData.announcementText}
                      onChange={handleTextChange}
                      placeholder="e.g. Use code NOVA20 for 20% off all orders"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-medium bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* --- TAB 2: CONTACT & SUPPORT --- */}
        {activeTab === 'contact' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-neutral-900 tracking-tight">
                Company & Support Details
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Official contact info displayed on order invoices, customer receipts, and footer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Support Email Address
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Business Phone
                </label>
                <input
                  type="text"
                  name="supportPhone"
                  value={formData.supportPhone}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Headquarters / Postal Address (Printed on Invoices)
              </label>
              <textarea
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleTextChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* --- TAB 3: CURRENCY & LOCALIZATION --- */}
        {activeTab === 'localization' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-neutral-900 tracking-tight">
                Localization & Financial Rules
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Set store currency, regional tax rate, and free shipping conditions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Store Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={(e) => {
                    const symbols = {
                      USD: '$',
                      EUR: '€',
                      GBP: '£',
                      AED: 'AED ',
                      SAR: 'SAR ',
                      PKR: '₨',
                      CAD: '$'
                    };
                    setFormData((prev) => ({
                      ...prev,
                      currency: e.target.value,
                      currencySymbol: symbols[e.target.value] || '$'
                    }));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="AED">AED (AED) - UAE Dirham</option>
                  <option value="SAR">SAR (SAR) - Saudi Riyal</option>
                  <option value="PKR">PKR (₨) - Pakistani Rupee</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  name="currencySymbol"
                  value={formData.currencySymbol}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Free Shipping Threshold ({formData.currencySymbol})
                </label>
                <input
                  type="number"
                  name="freeShippingThreshold"
                  value={formData.freeShippingThreshold}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: EMAILS & SMTP ENGINE --- */}
        {activeTab === 'emails' && (
          <div className="space-y-8 max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-neutral-900 tracking-tight">
                  Transactional Emails & SMTP Server
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Customize automated email copy and configure your outgoing SMTP credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTestEmailOpen(true)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Email Simulator</span>
              </button>
            </div>

            {/* SMTP Server Configuration */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                <Server className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  SMTP Mail Server Settings
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={formData.smtp?.host}
                    onChange={(e) => handleNestedChange('smtp', 'host', e.target.value)}
                    placeholder="smtp.sendgrid.net"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    Port
                  </label>
                  <input
                    type="text"
                    value={formData.smtp?.port}
                    onChange={(e) => handleNestedChange('smtp', 'port', e.target.value)}
                    placeholder="587"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    Encryption
                  </label>
                  <select
                    value={formData.smtp?.encryption}
                    onChange={(e) => handleNestedChange('smtp', 'encryption', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold bg-white"
                  >
                    <option value="TLS">TLS (Recommended)</option>
                    <option value="SSL">SSL</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    value={formData.smtp?.senderEmail}
                    onChange={(e) => handleNestedChange('smtp', 'senderEmail', e.target.value)}
                    placeholder="notifications@novacart.store"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    value={formData.smtp?.senderName}
                    onChange={(e) => handleNestedChange('smtp', 'senderName', e.target.value)}
                    placeholder="NovaCart Concierge"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Email Templates Editor */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Email Notification Templates
              </h4>

              {/* Order Confirmation */}
              <div className="p-4 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    1. Order Confirmation Template
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">Trigger: On Checkout</span>
                </div>
                <input
                  type="text"
                  value={formData.emailTemplates?.orderConfirmation?.subject}
                  onChange={(e) =>
                    handleEmailTemplateChange('orderConfirmation', 'subject', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
                  placeholder="Subject Line"
                />
                <textarea
                  rows={3}
                  value={formData.emailTemplates?.orderConfirmation?.body}
                  onChange={(e) =>
                    handleEmailTemplateChange('orderConfirmation', 'body', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
                  placeholder="Template Body"
                />
              </div>

              {/* Order Shipped */}
              <div className="p-4 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    2. Order Dispatched & Tracking Template
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">Trigger: Status = Shipped</span>
                </div>
                <input
                  type="text"
                  value={formData.emailTemplates?.orderShipped?.subject}
                  onChange={(e) =>
                    handleEmailTemplateChange('orderShipped', 'subject', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-bold"
                  placeholder="Subject Line"
                />
                <textarea
                  rows={3}
                  value={formData.emailTemplates?.orderShipped?.body}
                  onChange={(e) =>
                    handleEmailTemplateChange('orderShipped', 'body', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
                  placeholder="Template Body"
                />
              </div>

              {/* Variables helper legend */}
              <div className="p-3.5 rounded-xl bg-neutral-50 text-[11px] text-neutral-600 flex flex-wrap gap-2 items-center">
                <strong className="text-neutral-800">Dynamic Variables:</strong>
                <code className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 font-mono">
                  {'{{customer_name}}'}
                </code>
                <code className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 font-mono">
                  {'{{order_id}}'}
                </code>
                <code className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 font-mono">
                  {'{{store_name}}'}
                </code>
                <code className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 font-mono">
                  {'{{total_price}}'}
                </code>
                <code className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 font-mono">
                  {'{{carrier}}'}
                </code>
                <code className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 font-mono">
                  {'{{tracking_number}}'}
                </code>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 5: SECURITY & MASTER LOGIN --- */}
        {activeTab === 'security' && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h3 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Admin Master Authentication Credentials</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Customize the username and master password required to access your /admin portal.
              </p>
            </div>

            {/* Active Security Safeguards Banner */}
            <div className="p-4 rounded-2xl bg-neutral-900 text-white border border-neutral-800 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="font-bold flex items-center gap-1.5 text-indigo-400">
                  <KeyRound className="w-4 h-4" />
                  Active Security Policies
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  Protected
                </span>
              </div>
              <ul className="space-y-1 text-neutral-300 text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <strong>Route Guard:</strong> Direct access to /admin/* is blocked without a valid token.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <strong>Brute Force Throttling:</strong> 5 consecutive failed attempts lock the login screen for 60 seconds.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <strong>Stealth Mode:</strong> All public links to the admin panel are removed from the storefront.
                </li>
              </ul>
            </div>

            {/* Change Credentials Form */}
            <form onSubmit={handleUpdateAdminCredentials} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Update Master Credentials
              </h4>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Admin Username
                </label>
                <input
                  type="text"
                  value={adminUsernameInput}
                  onChange={(e) => setAdminUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  New Master Password
                </label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Enter new master password"
                    className="w-full px-4 pr-11 py-2.5 rounded-xl border border-neutral-200 text-sm font-mono bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Minimum 6 characters. You will need to use these credentials on your next login.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Update Admin Credentials</span>
                </button>
              </div>
            </form>

          </div>
        )}

        {/* Global Save Button at bottom of panel */}
        <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>

      </div>

      {/* Test Email Modal */}
      <TestEmailModal
        isOpen={isTestEmailOpen}
        onClose={() => setIsTestEmailOpen(false)}
      />

    </div>
  );
};
