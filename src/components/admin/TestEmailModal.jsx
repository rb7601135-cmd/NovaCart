import React, { useState } from 'react';
import { X, Send, CheckCircle2, Mail, Loader2, Server } from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { useToast } from '../../hooks/useToast';

export const TestEmailModal = ({ isOpen, onClose }) => {
  const { settings } = useCms();
  const { addToast } = useToast();

  const [selectedTemplate, setSelectedTemplate] = useState('orderConfirmation');
  const [recipient, setRecipient] = useState('alex.morgan@example.com');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  if (!isOpen) return null;

  const currentTpl = settings.emailTemplates?.[selectedTemplate] || {
    subject: 'Notification from NovaCart',
    body: 'Sample message content'
  };

  const getRenderedContent = () => {
    let subject = currentTpl.subject || '';
    let body = currentTpl.body || '';

    const replacements = {
      '{{customer_name}}': 'Alex Morgan',
      '{{order_id}}': 'NC-98421',
      '{{store_name}}': settings.storeName || 'NovaCart',
      '{{total_price}}': `${settings.currencySymbol}339.22`,
      '{{tracking_number}}': 'TRK-981273948US',
      '{{carrier}}': 'FedEx Express Air'
    };

    Object.entries(replacements).forEach(([key, val]) => {
      subject = subject.replaceAll(key, val);
      body = body.replaceAll(key, val);
    });

    return { subject, body };
  };

  const rendered = getRenderedContent();

  const handleSend = () => {
    setIsSending(true);
    setSendSuccess(false);

    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      addToast(`Test email successfully sent to ${recipient}!`, 'success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900 tracking-tight">
                SMTP Test Email Simulator
              </h2>
              <p className="text-xs text-neutral-500">
                Verify server connection and inspect rendered notifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* SMTP Server status banner */}
          <div className="p-3.5 rounded-2xl bg-neutral-900 text-neutral-200 border border-neutral-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>
                Host: <strong className="text-white font-mono">{settings.smtp?.host || 'smtp.sendgrid.net'}</strong>
              </span>
            </div>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ready ({settings.smtp?.encryption || 'TLS'}:{settings.smtp?.port || 587})
            </span>
          </div>

          {/* Form selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Select Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  setSendSuccess(false);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="orderConfirmation">Order Confirmation</option>
                <option value="orderShipped">Order Shipped & Tracking</option>
                <option value="welcomeEmail">Welcome VIP Gift</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Send Test To
              </label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Rendered Email Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Live Rendered Preview
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                From: {settings.smtp?.senderEmail || 'concierge@novacart.store'}
              </span>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-3 text-xs">
              <div className="pb-2 border-b border-neutral-200">
                <span className="font-bold text-neutral-500">Subject: </span>
                <span className="font-extrabold text-neutral-900">{rendered.subject}</span>
              </div>
              <div className="text-neutral-700 whitespace-pre-wrap leading-relaxed font-sans bg-white p-3.5 rounded-xl border border-neutral-200/80 shadow-2xs">
                {rendered.body}
              </div>
            </div>
          </div>

          {/* Success confirmation */}
          {sendSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>SMTP Dispatched:</strong> Test email delivered successfully to{' '}
                <span className="underline font-mono">{recipient}</span>.
              </span>
            </div>
          )}

          {/* Footer action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              disabled={isSending}
              onClick={handleSend}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting SMTP...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transmit Test Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
