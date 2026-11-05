'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Registration, RegistrationStatus, PaymentVerificationStatus, SiteSettings } from '@/types';
import {
  Users,
  Settings,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  FileText,
  LogOut,
  ExternalLink,
  Save,
  Sparkles,
  Eye,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'registrations' | 'cms'>('registrations');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Note Modal state
  const [selectedRegForNote, setSelectedRegForNote] = useState<Registration | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Receipt Modal state
  const [receiptModalUrl, setReceiptModalUrl] = useState<string | null>(null);

  // Fetch registrations
  const fetchRegistrations = useCallback(async () => {
    setLoadingRegs(true);
    try {
      const url = new URL('/api/admin/registrations', window.location.origin);
      if (selectedStatus !== 'All') url.searchParams.set('status', selectedStatus);
      if (searchQuery.trim()) url.searchParams.set('search', searchQuery.trim());

      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        setRegistrations(json.data || []);
      }
    } catch (e) {
      console.error('Fetch registrations error:', e);
    } finally {
      setLoadingRegs(false);
    }
  }, [selectedStatus, searchQuery]);

  // Fetch CMS settings
  const fetchContentSettings = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const json = await res.json();
        setSettings(json.data?.settings || null);
      }
    } catch (e) {
      console.error('Fetch settings error:', e);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchContentSettings();
  }, [fetchRegistrations]);

  // Handle status update
  const handleStatusChange = async (
    id: string,
    newStatus: RegistrationStatus,
    newPaymentStatus?: PaymentVerificationStatus
  ) => {
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, payment_status: newPaymentStatus }),
      });
      if (res.ok) {
        fetchRegistrations();
      }
    } catch (e) {
      console.error('Update status error:', e);
    }
  };

  // Handle note submission
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegForNote || !newNoteText.trim()) return;
    setSubmittingNote(true);

    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_id: selectedRegForNote.id,
          text: newNoteText.trim(),
          author: 'Admin Concierge',
        }),
      });

      if (res.ok) {
        setNewNoteText('');
        fetchRegistrations();
        // Update local selectedReg notes
        setSelectedRegForNote((prev) =>
          prev
            ? {
                ...prev,
                admin_notes: [
                  ...(prev.admin_notes || []),
                  {
                    id: `note-${Date.now()}`,
                    text: newNoteText.trim(),
                    author: 'Admin Concierge',
                    created_at: new Date().toISOString(),
                  },
                ],
              }
            : null
        );
      }
    } catch (e) {
      console.error('Add note error:', e);
    } finally {
      setSubmittingNote(false);
    }
  };

  // Handle CMS Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings', payload: settings }),
      });
      if (res.ok) {
        setSettingsSavedMessage(true);
        setTimeout(() => setSettingsSavedMessage(false), 3000);
      }
    } catch (e) {
      console.error('Save settings error:', e);
    } finally {
      setSavingSettings(false);
    }
  };

  // Metric stats
  const totalCount = registrations.length;
  const newCount = registrations.filter((r) => r.status === 'New').length;
  const verificationCount = registrations.filter((r) => r.status === 'Payment Verification').length;
  const confirmedCount = registrations.filter((r) => r.status === 'Confirmed').length;
  const waitlistCount = registrations.filter((r) => r.status === 'Waitlisted').length;

  return (
    <div className="min-h-screen bg-[#02100d] text-ivory-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#07261F]/90 border-b border-gold-500/25 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-400/50 shadow-gold-sm">
            <Image
              src="/images/brand/logo.jpg"
              alt="Beyond the Mind Logo"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-serif text-lg tracking-wider text-ivory-50 font-semibold">
              BEYOND THE MIND 2027
            </h1>
            <span className="text-[10px] tracking-widest uppercase text-gold-400 block font-medium">
              Administrative Sanctuary Console
            </span>
          </div>
        </div>

        {/* Tabs & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full bg-emerald-950/80 border border-gold-500/25 p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('registrations')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all uppercase tracking-wider font-medium ${
                activeTab === 'registrations'
                  ? 'bg-gold-500 text-emerald-950 font-semibold shadow-gold-sm'
                  : 'text-ivory-200/80 hover:text-gold-300'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Participant CRM</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cms')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all uppercase tracking-wider font-medium ${
                activeTab === 'cms'
                  ? 'bg-gold-500 text-emerald-950 font-semibold shadow-gold-sm'
                  : 'text-ivory-200/80 hover:text-gold-300'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Website CMS</span>
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-stone-subtle hover:text-gold-300 border border-gold-500/20 hover:bg-emerald-900/40 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Sanctuary</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-red-300 hover:text-red-200 border border-red-500/30 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-[#07261F]/60 border border-gold-500/20">
            <span className="text-[11px] uppercase tracking-wider text-stone-subtle/70 block font-medium">
              Total Enquiries
            </span>
            <span className="font-serif text-3xl text-ivory-50 font-semibold mt-1 block">
              {totalCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-blue-500/30">
            <span className="text-[11px] uppercase tracking-wider text-blue-300 block font-medium">
              New Leads
            </span>
            <span className="font-serif text-3xl text-blue-200 font-semibold mt-1 block">{newCount}</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-amber-500/30">
            <span className="text-[11px] uppercase tracking-wider text-amber-300 block font-medium">
              Verification Needed
            </span>
            <span className="font-serif text-3xl text-amber-200 font-semibold mt-1 block">
              {verificationCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30">
            <span className="text-[11px] uppercase tracking-wider text-emerald-300 block font-medium">
              Confirmed Guests
            </span>
            <span className="font-serif text-3xl text-emerald-200 font-semibold mt-1 block">
              {confirmedCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-purple-500/30">
            <span className="text-[11px] uppercase tracking-wider text-purple-300 block font-medium">
              Waitlisted
            </span>
            <span className="font-serif text-3xl text-purple-200 font-semibold mt-1 block">
              {waitlistCount}
            </span>
          </div>
        </div>

        {/* Tab 1: Participant CRM */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, city, ID..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-emerald-950/80 border border-gold-500/20 text-xs text-ivory-100 placeholder-stone-subtle/50 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-emerald-950/80 border border-gold-500/20 text-xs text-gold-300 focus:outline-none focus:border-gold-400"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Awaiting Payment">Awaiting Payment</option>
                  <option value="Payment Verification">Payment Verification</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Waitlisted">Waitlisted</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={fetchRegistrations}
                  className="p-2 rounded-xl bg-emerald-950/80 border border-gold-500/20 text-gold-300 hover:text-gold-200"
                  title="Refresh Registrations"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* CSV Export Action */}
              <a
                href="/api/admin/registrations?format=csv"
                download
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500/20 hover:bg-gold-500 hover:text-emerald-950 border border-gold-400/40 text-gold-300 text-xs font-semibold tracking-wider uppercase transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Registrations to CSV</span>
              </a>
            </div>

            {/* Registrations Table */}
            <div className="rounded-2xl bg-[#07261F]/60 border border-gold-500/20 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-emerald-950/80 border-b border-gold-500/20 text-gold-300 uppercase tracking-wider font-medium">
                      <th className="py-3 px-4">Ref ID</th>
                      <th className="py-3 px-4">Participant Details</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Programme & Lang</th>
                      <th className="py-3 px-4">Enquiry Status</th>
                      <th className="py-3 px-4">Payment Proof</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/40">
                    {loadingRegs ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-stone-subtle/70">
                          Loading sanctuary participant records...
                        </td>
                      </tr>
                    ) : registrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-stone-subtle/70">
                          No registration records match the criteria.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((r) => (
                        <tr key={r.id} className="hover:bg-emerald-900/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-gold-300">
                            {r.id}
                            <span className="block text-[10px] text-stone-subtle/60 font-sans mt-0.5">
                              {formatDate(r.created_at)}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-ivory-50 block">{r.full_name}</span>
                            <span className="text-stone-subtle/80 block">{r.email}</span>
                            <a
                              href={`https://wa.me/${r.country_code.replace(/[^0-9]/g, '')}${r.phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gold-400/90 hover:underline text-[11px] inline-flex items-center gap-1 mt-0.5"
                            >
                              <span>{r.country_code} {r.phone}</span>
                            </a>
                          </td>

                          <td className="py-3.5 px-4 text-stone-subtle">
                            <span>{r.city}, {r.country}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-ivory-100 block font-medium">{r.programme}</span>
                            <span className="text-gold-400 text-[10px] uppercase tracking-wider">
                              Lang: {r.language_preference}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={r.status}
                              onChange={(e) =>
                                handleStatusChange(r.id, e.target.value as RegistrationStatus)
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-gold-500/30 text-[11px] font-medium text-ivory-100 focus:outline-none focus:border-gold-400"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Awaiting Payment">Awaiting Payment</option>
                              <option value="Payment Verification">Payment Verification</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Waitlisted">Waitlisted</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4">
                            {r.payment_proof_url ? (
                              <button
                                type="button"
                                onClick={() => setReceiptModalUrl(r.payment_proof_url!)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 hover:bg-gold-500 hover:text-emerald-950 transition-colors text-[10px] font-medium"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Inspect Receipt</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-stone-subtle/50 italic">None Uploaded</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRegForNote(r)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/25 text-gold-300 text-[11px]"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Notes ({r.admin_notes?.length || 0})</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Website CMS Content Manager */}
        {activeTab === 'cms' && settings && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
              <div>
                <h3 className="font-serif text-xl text-ivory-50 font-medium">
                  Website Content Management
                </h3>
                <p className="text-xs text-stone-subtle/80 mt-0.5">
                  Update public retreat details dynamically without redeploying code.
                </p>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-sm hover:shadow-gold-md transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSettings ? 'Saving Updates...' : 'Publish Content Updates'}</span>
              </button>
            </div>

            {settingsSavedMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-900/80 border border-gold-400 text-gold-200 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold-300" />
                <span>Sanctuary content settings have been saved and applied to public pages!</span>
              </div>
            )}

            {/* General & Hero Fields */}
            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/20 space-y-4">
              <h4 className="font-serif text-base text-gold-300 uppercase tracking-wider font-semibold">
                Homepage Hero & Identity
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">Hero Title</label>
                  <input
                    type="text"
                    value={settings.hero_title}
                    onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">Hero Subtitle</label>
                  <input
                    type="text"
                    value={settings.hero_subtitle}
                    onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase text-stone-subtle/90">Hero Tagline</label>
                <input
                  type="text"
                  value={settings.hero_tagline}
                  onChange={(e) => setSettings({ ...settings, hero_tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">
                    Master Video Stream / Direct MP4 URL (Mux / CDN)
                  </label>
                  <input
                    type="text"
                    value={settings.video_url}
                    onChange={(e) => setSettings({ ...settings, video_url: e.target.value })}
                    placeholder="https://stream.mux.com/YOUR_STREAM_KEY.m3u8 or mp4 url"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                  <span className="text-[10px] text-stone-subtle/60 block">
                    Leave blank to seamlessly display the high-res Himalayan Ganges sanctuary poster.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">Poster Image URL</label>
                  <input
                    type="text"
                    value={settings.poster_url}
                    onChange={(e) => setSettings({ ...settings, poster_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                </div>
              </div>
            </div>

            {/* Dates & Location */}
            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/20 space-y-4">
              <h4 className="font-serif text-base text-gold-300 uppercase tracking-wider font-semibold">
                Dates, Location & Inquiries
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">Retreat Dates</label>
                  <input
                    type="text"
                    value={settings.retreat_dates}
                    onChange={(e) => setSettings({ ...settings, retreat_dates: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">Location</label>
                  <input
                    type="text"
                    value={settings.retreat_location}
                    onChange={(e) => setSettings({ ...settings, retreat_location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">State / Country</label>
                  <input
                    type="text"
                    value={settings.retreat_state}
                    onChange={(e) => setSettings({ ...settings, retreat_state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">WhatsApp / Phone</label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                </div>
              </div>
            </div>

            {/* Daily Meditation Configuration */}
            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/20 space-y-4">
              <h4 className="font-serif text-base text-gold-300 uppercase tracking-wider font-semibold">
                Daily Guided Meditation Program
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">Timing</label>
                  <input
                    type="text"
                    value={settings.daily_meditation_time}
                    onChange={(e) =>
                      setSettings({ ...settings, daily_meditation_time: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">Schedule Days</label>
                  <input
                    type="text"
                    value={settings.daily_meditation_days}
                    onChange={(e) =>
                      setSettings({ ...settings, daily_meditation_days: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase text-stone-subtle/90">Platform</label>
                  <input
                    type="text"
                    value={settings.daily_meditation_platform}
                    onChange={(e) =>
                      setSettings({ ...settings, daily_meditation_platform: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                  />
                </div>
              </div>
            </div>

            {/* Features Toggles */}
            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-medium text-xs uppercase tracking-wider text-ivory-100 block">
                  Optional Payment-Proof Upload
                </span>
                <p className="text-xs text-stone-subtle/70 mt-0.5">
                  Allow seekers to attach UPI or bank transfer screenshots upon registration.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.payment_proof_upload_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, payment_proof_upload_enabled: e.target.checked })
                }
                className="w-5 h-5 rounded border-gold-500/40 bg-emerald-950 text-gold-500 focus:ring-gold-400"
              />
            </div>
          </form>
        )}
      </main>

      {/* Private Admin Note Modal */}
      {selectedRegForNote && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedRegForNote(null)}
        >
          <div
            className="w-full max-w-lg p-6 rounded-3xl bg-[#07261F] border border-gold-500/30 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gold-500/20">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                  Private Concierge Log
                </span>
                <h4 className="font-serif text-lg text-ivory-50">
                  {selectedRegForNote.full_name} ({selectedRegForNote.id})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRegForNote(null)}
                className="text-stone-subtle hover:text-ivory-100"
              >
                ✕
              </button>
            </div>

            {/* Existing notes */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {!selectedRegForNote.admin_notes || selectedRegForNote.admin_notes.length === 0 ? (
                <p className="text-xs text-stone-subtle/60 italic py-2">
                  No private notes logged for this participant yet.
                </p>
              ) : (
                selectedRegForNote.admin_notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-emerald-950/70 border border-gold-500/15 text-xs">
                    <p className="text-ivory-100">{note.text}</p>
                    <span className="text-[10px] text-gold-400/80 block mt-1">
                      {note.author} • {formatDate(note.created_at)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Add note form */}
            <form onSubmit={handleAddNote} className="space-y-3 pt-2 border-t border-gold-500/20">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add private coordinator note (e.g. Call scheduled, room preference verified)..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 focus:outline-none focus:border-gold-400 resize-none"
              />
              <button
                type="submit"
                disabled={submittingNote || !newNoteText.trim()}
                className="w-full py-2 rounded-full bg-gold-500 text-emerald-950 font-semibold text-xs tracking-wider uppercase hover:bg-gold-400 transition-colors disabled:opacity-50"
              >
                {submittingNote ? 'Saving Note...' : 'Add Private Coordinator Note'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Payment Receipt Modal */}
      {receiptModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setReceiptModalUrl(null)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-emerald-950 p-6 rounded-3xl border border-gold-500/30 flex flex-col items-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-gold-500/20 mb-4">
              <span className="text-xs uppercase tracking-wider text-gold-300 font-medium">
                Participant Transaction Proof
              </span>
              <button
                type="button"
                onClick={() => setReceiptModalUrl(null)}
                className="text-stone-subtle hover:text-ivory-100"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full h-[65vh] flex items-center justify-center">
              <Image
                src={receiptModalUrl}
                alt="Payment proof screenshot"
                fill
                className="object-contain"
              />
            </div>

            <div className="pt-4 flex items-center gap-3">
              <a
                href={receiptModalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs uppercase tracking-wider font-medium hover:bg-gold-500 hover:text-emerald-950 transition-colors"
              >
                Open Full File
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

