import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  MessageSquare,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

export const Contact = () => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: 'general'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    setTicketNumber(`TK-${Math.floor(10000 + Math.random() * 90000)}`);
    setIsSubmitted(true);
    addToast('Your inquiry has been received. Our concierge will reply within 4 hours.', 'success');
  };


  const faqs = [
    {
      q: 'How long does complimentary express shipping take?',
      a: 'All orders qualify for free express shipping above $100. Deliveries typically arrive within 2 to 4 business days in North America and Western Europe, with live tracking provided upon departure.'
    },
    {
      q: 'What is NovaCart&apos;s return policy?',
      a: 'We offer an unconditional 30-day return window. You can initiate a return directly in your Account or Contact support to receive a complimentary prepaid return shipping label.'
    },
    {
      q: 'Are all products authentic and under warranty?',
      a: 'Yes. Every timepiece, piece of acoustic audio, and luxury garment is 100% genuine with certificate tags and includes our minimum 2-year NovaCart replacement warranty.'
    },
    {
      q: 'How do I use my seasonal promo code?',
      a: 'Enter code NOVA20 during checkout or directly within the Shopping Bag to immediately deduct 20% from your order subtotal.'
    }
  ];

  return (
    <div className="bg-neutral-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Client Concierge</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight mb-4">
            We&apos;re Here to Assist You
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Have questions about product specifications, bespoke sizing, or order delivery? Reach out to our dedicated concierge.
          </p>
        </div>

        {/* Contact Grid: Form + Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          
          {/* Contact Form (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Send an Inquiry</h2>
            <p className="text-xs text-neutral-500 mb-6">
              Fill in the form below and our team will get back to you shortly.
            </p>

            {isSubmitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900">Message Delivered</h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Thank you, {formData.name}. We have logged your request under ticket #{ticketNumber}.
                </p>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '', department: 'general' });
                  }}
                  className="mt-3 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jordan Hayes"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="general">General Support</option>
                      <option value="orders">Orders & Delivery</option>
                      <option value="styling">Product Styling Guidance</option>
                      <option value="press">Press & Partnerships</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief topic of your inquiry"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How may our specialists help you today?"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-neutral-900 hover:bg-indigo-600 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Cards Info (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                  Email Concierge
                </h3>
                <p className="text-xs text-neutral-500 mb-2">Direct response within 4 hours</p>
                <a
                  href="mailto:support@novacart.com"
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  support@novacart.com
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                  Direct Telephone
                </h3>
                <p className="text-xs text-neutral-500 mb-2">Mon–Fri: 9:00 AM – 8:00 PM EST</p>
                <p className="text-xs font-bold text-neutral-900">+1 (800) 492-NOVA</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                  Flagship Showroom
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  540 Madison Avenue, 14th Floor<br />
                  New York, NY 10022, United States
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                  Operating Hours
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Online Atelier: 24/7 / 365<br />
                  Logistics Dispatch: Mon – Sat (Daily)
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive FAQ Section */}
        <div className="max-w-3xl mx-auto pt-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200/60 text-neutral-700 text-xs font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Answers to Frequent Questions</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-neutral-900 hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
