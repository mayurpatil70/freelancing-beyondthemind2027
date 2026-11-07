'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Registration,
  RegistrationStatus,
  PaymentVerificationStatus,
  SiteSettings,
  SacredExperience,
  RishikeshAttraction,
  WeatherClothingGuide,
  GalleryItem,
  FAQItem,
} from '@/types';
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
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  Calendar,
  Layers,
  MapPin,
  Sun,
  Shirt,
  Key,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminTab =
  | 'registrations'
  | 'sessions'
  | 'daily-meditation'
  | 'registration-settings'
  | 'attractions'
  | 'weather'
  | 'keywords'
  | 'gallery'
  | 'settings';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('registrations');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // CMS Content State
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [experiences, setExperiences] = useState<SacredExperience[]>([]);
  const [attractions, setAttractions] = useState<RishikeshAttraction[]>([]);
  const [weatherGuide, setWeatherGuide] = useState<WeatherClothingGuide | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [metaKeywords, setMetaKeywords] = useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

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

  // Fetch full CMS content
  const fetchAllContent = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (data?.settings) {
          setSettings(data.settings);
          setMetaKeywords(data.settings.meta_keywords || {});
        }
        if (data?.experiences) setExperiences(data.experiences);
        if (data?.attractions) setAttractions(data.attractions);
        if (data?.weatherClothing) setWeatherGuide(data.weatherClothing);
        if (data?.gallery) setGalleryItems(data.gallery);
      }
    } catch (e) {
      console.error('Fetch content error:', e);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchAllContent();
  }, [fetchRegistrations]);

  const showSaveSuccess = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  // Generic Save to /api/admin/content
  const saveContent = async (type: string, payload: unknown, successMsg: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload }),
      });
      if (res.ok) {
        showSaveSuccess(successMsg);
      } else {
        alert('Failed to save changes. Please try again.');
      }
    } catch (e) {
      console.error('Save error:', e);
      alert('Error connecting to server.');
    } finally {
      setSaving(false);
    }
  };

  // Status Change for Registrations
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

  // Add Admin Note
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
        }),
      });
      if (res.ok) {
        setNewNoteText('');
        setSelectedRegForNote(null);
        fetchRegistrations();
      }
    } catch (e) {
      console.error('Add note error:', e);
    } finally {
      setSubmittingNote(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Country',
      'City',
      'Programme',
      'Language',
      'Status',
      'Payment Status',
      'Created At',
      'Message',
    ];
    const rows = registrations.map((r) => [
      r.id,
      `"${r.full_name.replace(/"/g, '""')}"`,
      r.email,
      `"${r.country_code} ${r.phone}"`,
      `"${r.country}"`,
      `"${r.city}"`,
      `"${r.programme}"`,
      r.language_preference,
      r.status,
      r.payment_status,
      r.created_at,
      `"${(r.message || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `beyond-the-mind-registrations-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#02100d] text-[#FAF8F5]">
      {/* Top Bar */}
      <header className="border-b border-gold-500/20 bg-[#031713]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold-400/50">
              <Image src="/images/brand/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <span className="font-serif text-base text-gold-300 font-semibold tracking-wider block">
                Beyond the Mind 2027
              </span>
              <span className="text-[10px] tracking-widest uppercase text-stone-subtle/70 block">
                Sanctuary Management & CRM Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-200 transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/30 text-xs text-ivory-100 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-gold-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-2 border-t border-gold-500/10 text-xs">
          {[
            { id: 'registrations', label: 'Registrations CRM', icon: Users },
            { id: 'sessions', label: '7 Retreat Sessions', icon: Layers },
            { id: 'daily-meditation', label: 'Daily Meditation', icon: Clock },
            { id: 'registration-settings', label: 'Registration & Google Form', icon: Calendar },
            { id: 'attractions', label: 'Rishikesh Attractions', icon: MapPin },
            { id: 'weather', label: 'Weather & Clothing', icon: Shirt },
            { id: 'keywords', label: 'SEO & Keywords', icon: Key },
            { id: 'gallery', label: 'Photos & Gallery', icon: ImageIcon },
            { id: 'settings', label: 'General Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-bold shadow-sm'
                    : 'text-ivory-200/80 hover:text-gold-300 hover:bg-emerald-950/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-950' : 'text-gold-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Success Notification */}
        {saveSuccessMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-900/90 border border-gold-400 text-gold-100 text-xs flex items-center gap-3 shadow-lg animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-gold-300 shrink-0" />
            <span className="font-medium">{saveSuccessMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: REGISTRATIONS CRM */}
        {/* ========================================================================= */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-light">
                  Participant Registrations & Inquiries
                </h2>
                <p className="text-xs text-stone-subtle/80 mt-1">
                  Manage applications for The Divine Retreat 2027 and Daily Online Guided Meditation.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                disabled={registrations.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-950 border border-gold-400/40 text-gold-300 hover:bg-emerald-900 text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV ({registrations.length})</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#07261F]/60 border border-gold-500/20 flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search participants by name, email, phone, city, or programme..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-emerald-950/80 border border-gold-500/25 text-xs text-ivory-100 placeholder:text-stone-500 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-gold-400 shrink-0" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-emerald-950/80 border border-gold-500/25 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                >
                  <option value="All" className="bg-[#07261F] text-ivory-100">All Statuses</option>
                  <option value="New" className="bg-[#07261F] text-ivory-100">New</option>
                  <option value="Contacted" className="bg-[#07261F] text-ivory-100">Contacted</option>
                  <option value="Awaiting Payment" className="bg-[#07261F] text-ivory-100">Awaiting Payment</option>
                  <option value="Payment Verification" className="bg-[#07261F] text-ivory-100">Payment Verification</option>
                  <option value="Confirmed" className="bg-[#07261F] text-ivory-100">Confirmed</option>
                  <option value="Cancelled" className="bg-[#07261F] text-ivory-100">Cancelled</option>
                </select>
                <button
                  type="button"
                  onClick={fetchRegistrations}
                  className="p-2 rounded-xl bg-emerald-950 border border-gold-500/30 text-gold-400 hover:text-white"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="rounded-2xl border border-gold-500/20 bg-[#07261F]/70 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gold-500/20 bg-emerald-950/80 text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Participant Details</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Programme & Language</th>
                      <th className="py-3 px-4">Status & Verification</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-500/10">
                    {loadingRegs ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-stone-subtle/70">
                          Loading registrations...
                        </td>
                      </tr>
                    ) : registrations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-stone-subtle/70">
                          No registrations found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((r) => (
                        <tr key={r.id} className="hover:bg-emerald-950/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-ivory-50 block text-sm">{r.full_name}</span>
                            <span className="text-[10px] text-gold-400/80 block mt-0.5">ID: {r.id}</span>
                            <span className="text-[11px] text-stone-subtle/70 block">{r.city}, {r.country}</span>
                          </td>
                          <td className="py-3.5 px-4 space-y-1">
                            <a href={`mailto:${r.email}`} className="text-ivory-200/90 hover:text-gold-300 block truncate max-w-[200px]">
                              {r.email}
                            </a>
                            <div className="flex items-center gap-2">
                              <span className="text-stone-subtle/70">{r.country_code} {r.phone}</span>
                              <a
                                href={`https://wa.me/${(r.country_code + r.phone).replace(/[^0-9]/g, '')}?text=Namaste%20${encodeURIComponent(r.full_name)}%2C%20greetings%20from%20Beyond%20the%20Mind%20team.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-[10px] font-semibold hover:bg-[#25D366] hover:text-white transition-all"
                              >
                                WhatsApp
                              </a>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 space-y-1">
                            <span className="text-gold-300 font-medium block truncate max-w-[220px]">
                              {r.programme}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-ivory-200 inline-block">
                              {r.language_preference}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 space-y-1.5">
                            <select
                              value={r.status}
                              onChange={(e) => handleStatusChange(r.id, e.target.value as RegistrationStatus)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-gold-500/30 text-xs text-gold-300 focus:outline-none"
                            >
                              <option value="New" className="bg-[#07261F] text-ivory-100">New</option>
                              <option value="Contacted" className="bg-[#07261F] text-ivory-100">Contacted</option>
                              <option value="Awaiting Payment" className="bg-[#07261F] text-ivory-100">Awaiting Payment</option>
                              <option value="Payment Verification" className="bg-[#07261F] text-ivory-100">Payment Verification</option>
                              <option value="Confirmed" className="bg-[#07261F] text-ivory-100">Confirmed</option>
                              <option value="Cancelled" className="bg-[#07261F] text-ivory-100">Cancelled</option>
                            </select>

                            {r.payment_proof_url && (
                              <button
                                type="button"
                                onClick={() => setReceiptModalUrl(r.payment_proof_url!)}
                                className="inline-flex items-center gap-1 text-[11px] text-gold-300 hover:underline block"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Receipt</span>
                              </button>
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

        {/* ========================================================================= */}
        {/* TAB 2: SEVEN RETREAT SESSIONS MANAGER (Screenshot 1 Order) */}
        {/* ========================================================================= */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
              <div>
                <h3 className="font-serif text-2xl text-ivory-50 font-light">
                  Retreat Sessions CMS (Cards & Photos)
                </h3>
                <p className="text-xs text-stone-subtle/80 mt-1">
                  Edit titles, subtitles, photo URLs, order, and detailed descriptions for all 7 retreat sessions without touching code.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const newSession: SacredExperience = {
                      id: `exp-${Date.now()}`,
                      slug: `session-${experiences.length + 1}`,
                      title: 'NEW RETREAT SESSION',
                      subtitle: 'Session Subtitle & Dimension',
                      short_desc: 'Brief session summary displayed on cards.',
                      full_desc: 'Detailed experiential description of the practice.',
                      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
                      icon_name: 'CircleDot',
                      order: experiences.length + 1,
                      spiritual_dimension: 'Inner Stillness',
                      highlights: ['Practice highlight 1', 'Practice highlight 2'],
                    };
                    setExperiences([...experiences, newSession]);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 hover:bg-emerald-900 text-xs font-semibold uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Session</span>
                </button>

                <button
                  type="button"
                  onClick={() => saveContent('experiences', experiences, 'All retreat sessions updated successfully!')}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Sessions'}</span>
                </button>
              </div>
            </div>

            {/* Sessions Cards Edit List */}
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-gold-500/15 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-serif text-sm font-bold">
                        0{exp.order}
                      </span>
                      <h4 className="font-serif text-lg text-ivory-50 font-medium">
                        {exp.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove session "${exp.title}"?`)) {
                            setExperiences(experiences.filter((e) => e.id !== exp.id));
                          }
                        }}
                        className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 transition-colors"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    {/* Title */}
                    <div className="sm:col-span-6 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                        Session Title
                      </label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[index].title = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="sm:col-span-6 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={exp.subtitle}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[index].subtitle = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                      />
                    </div>

                    {/* Order & Spiritual Dimension */}
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                        Order Sequence
                      </label>
                      <input
                        type="number"
                        value={exp.order}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[index].order = parseInt(e.target.value) || 1;
                          setExperiences(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                      />
                    </div>

                    <div className="sm:col-span-9 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                        Spiritual Dimension Tag
                      </label>
                      <input
                        type="text"
                        value={exp.spiritual_dimension}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[index].spiritual_dimension = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                      />
                    </div>

                    {/* Photo / Image URL */}
                    <div className="sm:col-span-12 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold flex items-center justify-between">
                        <span>Photo / Image URL</span>
                        {exp.image && (
                          <a href={exp.image} target="_blank" rel="noopener noreferrer" className="text-gold-300 underline">
                            Preview Image
                          </a>
                        )}
                      </label>
                      <input
                        type="text"
                        value={exp.image}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[index].image = e.target.value;
                          setExperiences(updated);
                        }}
                        placeholder="https://images.unsplash.com/... or /images/..."
                        className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                      />
                    </div>

                    {/* Short Description */}
                    <div className="sm:col-span-12 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                        Card Summary (Short Description)
                      </label>
                      <textarea
                        rows={2}
                        value={exp.short_desc}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[index].short_desc = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 resize-none"
                      />
                    </div>

                    {/* Full Description */}
                    <div className="sm:col-span-12 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                        Full Practice Description
                      </label>
                      <textarea
                        rows={3}
                        value={exp.full_desc}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[index].full_desc = e.target.value;
                          setExperiences(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                      />
                    </div>

                    {/* Highlights (Comma separated or lines) */}
                    <div className="sm:col-span-12 space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                        Key Practice Highlights (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={exp.highlights.join('\n')}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[index].highlights = e.target.value
                            .split('\n')
                            .filter((line) => line.trim().length > 0);
                          setExperiences(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DAILY GUIDED MEDITATION SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'daily-meditation' && settings && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
              <div>
                <h3 className="font-serif text-2xl text-ivory-50 font-light">
                  Daily Guided Meditation CMS
                </h3>
                <p className="text-xs text-stone-subtle/80 mt-1">
                  Update timings, Zoom settings, session fee text, and spiritual description for weekday practice.
                </p>
              </div>

              <button
                type="button"
                onClick={() => saveContent('settings', settings, 'Daily meditation settings updated!')}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Meditation Settings'}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={settings.daily_meditation_headline || 'Daily Meditation - A Journey Within'}
                    onChange={(e) => setSettings({ ...settings, daily_meditation_headline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.daily_meditation_tagline || 'Pause. Observe. Transcend.'}
                    onChange={(e) => setSettings({ ...settings, daily_meditation_tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Timings
                  </label>
                  <input
                    type="text"
                    value={settings.daily_meditation_time || '7:30 PM IST'}
                    onChange={(e) => setSettings({ ...settings, daily_meditation_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Days of Session
                  </label>
                  <input
                    type="text"
                    value={settings.daily_meditation_days || 'Monday to Friday'}
                    onChange={(e) => setSettings({ ...settings, daily_meditation_days: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Platform
                  </label>
                  <input
                    type="text"
                    value={settings.daily_meditation_platform || 'Zoom (Live Interactive Guided Meditation)'}
                    onChange={(e) => setSettings({ ...settings, daily_meditation_platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Session Fee Text
                  </label>
                  <input
                    type="text"
                    value={settings.daily_meditation_fee || 'Paid sessions (shared on enquiry)'}
                    onChange={(e) => setSettings({ ...settings, daily_meditation_fee: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                  Main Practice Philosophy & Description
                </label>
                <textarea
                  rows={4}
                  value={settings.daily_meditation_description || ''}
                  onChange={(e) => setSettings({ ...settings, daily_meditation_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: REGISTRATION & GOOGLE FORM SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'registration-settings' && settings && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
              <div>
                <h3 className="font-serif text-2xl text-ivory-50 font-light">
                  Registration & Google Form Configuration
                </h3>
                <p className="text-xs text-stone-subtle/80 mt-1">
                  Configure the Google Form URL when ready, adjust retreat arrival times, and toggle payment options.
                </p>
              </div>

              <button
                type="button"
                onClick={() => saveContent('settings', settings, 'Registration settings updated successfully!')}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Registration Settings'}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-6">
              {/* Google Form Section */}
              <div className="p-5 rounded-xl bg-emerald-950/70 border border-gold-400/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base text-gold-300 font-semibold">
                      Google Form Integration
                    </h4>
                    <p className="text-xs text-stone-subtle/80">
                      Paste the Google Form link here. When enabled, the registration page offers instant access to your form.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.registration_google_form_enabled}
                      onChange={(e) => setSettings({ ...settings, registration_google_form_enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400 bg-emerald-950 border-gold-500/40"
                    />
                    <span className="text-xs text-ivory-100 font-medium">Enable Google Form Mode</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Google Form URL (View or Embed link)
                  </label>
                  <input
                    type="url"
                    value={settings.registration_google_form_url}
                    onChange={(e) => setSettings({ ...settings, registration_google_form_url: e.target.value })}
                    placeholder="https://docs.google.com/forms/d/e/.../viewform?embedded=true"
                    className="w-full px-3 py-2 rounded-xl bg-[#031713] border border-gold-500/30 text-xs text-ivory-100"
                  />
                </div>
              </div>

              {/* Arrival & Date Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Arrival Date (Whole Application)
                  </label>
                  <input
                    type="text"
                    value={settings.arrival_date || 'October 5, 2027'}
                    onChange={(e) => setSettings({ ...settings, arrival_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Arrival Time
                  </label>
                  <input
                    type="text"
                    value={settings.arrival_time || '2:45 PM IST'}
                    onChange={(e) => setSettings({ ...settings, arrival_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Retreat Sessions Dates
                  </label>
                  <input
                    type="text"
                    value={settings.retreat_dates || 'October 6–9, 2027'}
                    onChange={(e) => setSettings({ ...settings, retreat_dates: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Modes of Participation
                  </label>
                  <input
                    type="text"
                    value={settings.retreat_modes || 'Offline (In-Person Rishikesh) & Online Live'}
                    onChange={(e) => setSettings({ ...settings, retreat_modes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    value={settings.retreat_languages || 'English (Hindi translation available for participants who require it)'}
                    onChange={(e) => setSettings({ ...settings, retreat_languages: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: RISHIKESH ATTRACTIONS CMS */}
        {/* ========================================================================= */}
        {activeTab === 'attractions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
              <div>
                <h3 className="font-serif text-2xl text-ivory-50 font-light">
                  Rishikesh Attractions CMS (Things to Do)
                </h3>
                <p className="text-xs text-stone-subtle/80 mt-1">
                  Add and modify attractions (e.g., bungee jumping, white water river rafting, Beatles ashram, Ganga Aarti, caves).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const newAttr: RishikeshAttraction = {
                      id: `attr-${Date.now()}`,
                      title: 'New Rishikesh Attraction',
                      category: 'Adrenaline & Adventure',
                      description: 'Experience exciting adventures in Rishikesh...',
                      highlights: ['Certified safety gear', 'Experienced local guides'],
                      image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
                      location_tip: 'Rishikesh Valley',
                      duration: '2 - 3 Hours',
                    };
                    setAttractions([...attractions, newAttr]);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 hover:bg-emerald-900 text-xs font-semibold uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Attraction</span>
                </button>

                <button
                  type="button"
                  onClick={() => saveContent('attractions', attractions, 'Rishikesh attractions updated!')}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Attractions'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attractions.map((attr, index) => (
                <div
                  key={attr.id}
                  className="p-5 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-gold-500/15 pb-2">
                    <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                      Attraction #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove "${attr.title}"?`)) {
                          setAttractions(attractions.filter((a) => a.id !== attr.id));
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase text-gold-400 block font-semibold">Title</label>
                      <input
                        type="text"
                        value={attr.title}
                        onChange={(e) => {
                          const updated = [...attractions];
                          updated[index].title = e.target.value;
                          setAttractions(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase text-gold-400 block font-semibold">Category</label>
                        <select
                          value={attr.category}
                          onChange={(e) => {
                            const updated = [...attractions];
                            updated[index].category = e.target.value as any;
                            setAttractions(updated);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                        >
                          <option value="Adrenaline & Adventure" className="bg-[#07261F] text-ivory-100">Adrenaline & Adventure</option>
                          <option value="Sacred Heritage" className="bg-[#07261F] text-ivory-100">Sacred Heritage</option>
                          <option value="Nature & Scenic" className="bg-[#07261F] text-ivory-100">Nature & Scenic</option>
                          <option value="Wellness & Peace" className="bg-[#07261F] text-ivory-100">Wellness & Peace</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-gold-400 block font-semibold">Duration</label>
                        <input
                          type="text"
                          value={attr.duration}
                          onChange={(e) => {
                            const updated = [...attractions];
                            updated[index].duration = e.target.value;
                            setAttractions(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase text-gold-400 block font-semibold">Location / Tip</label>
                      <input
                        type="text"
                        value={attr.location_tip}
                        onChange={(e) => {
                          const updated = [...attractions];
                          updated[index].location_tip = e.target.value;
                          setAttractions(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase text-gold-400 block font-semibold">Photo Image URL</label>
                      <input
                        type="text"
                        value={attr.image_url}
                        onChange={(e) => {
                          const updated = [...attractions];
                          updated[index].image_url = e.target.value;
                          setAttractions(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase text-gold-400 block font-semibold">Description</label>
                      <textarea
                        rows={2}
                        value={attr.description}
                        onChange={(e) => {
                          const updated = [...attractions];
                          updated[index].description = e.target.value;
                          setAttractions(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase text-gold-400 block font-semibold">
                        Highlights (One per line)
                      </label>
                      <textarea
                        rows={2}
                        value={attr.highlights.join('\n')}
                        onChange={(e) => {
                          const updated = [...attractions];
                          updated[index].highlights = e.target.value.split('\n').filter((l) => l.trim().length > 0);
                          setAttractions(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: WEATHER & CLOTHING GUIDE CMS */}
        {/* ========================================================================= */}
        {activeTab === 'weather' && weatherGuide && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
              <div>
                <h3 className="font-serif text-2xl text-ivory-50 font-light">
                  Weather & Clothing Requirements Guide
                </h3>
                <p className="text-xs text-stone-subtle/80 mt-1">
                  Update temperature expectations, clothing tips, and packing guidelines for retreat participants.
                </p>
              </div>

              <button
                type="button"
                onClick={() => saveContent('weatherClothing', weatherGuide, 'Weather & clothing guide updated!')}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Weather Guide'}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Daytime Temperature
                  </label>
                  <input
                    type="text"
                    value={weatherGuide.day_temp}
                    onChange={(e) => setWeatherGuide({ ...weatherGuide, day_temp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Night / Morning Temperature
                  </label>
                  <input
                    type="text"
                    value={weatherGuide.night_temp}
                    onChange={(e) => setWeatherGuide({ ...weatherGuide, night_temp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                  Weather Summary
                </label>
                <textarea
                  rows={3}
                  value={weatherGuide.summary}
                  onChange={(e) => setWeatherGuide({ ...weatherGuide, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                  Clothing Tips & Etiquette (One per line)
                </label>
                <textarea
                  rows={4}
                  value={weatherGuide.clothing_tips.join('\n')}
                  onChange={(e) =>
                    setWeatherGuide({
                      ...weatherGuide,
                      clothing_tips: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                  Recommended Items Checklist (One per line)
                </label>
                <textarea
                  rows={4}
                  value={weatherGuide.recommended_items.join('\n')}
                  onChange={(e) =>
                    setWeatherGuide({
                      ...weatherGuide,
                      recommended_items: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SEO & KEYWORDS MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'keywords' && settings && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
              <div>
                <h3 className="font-serif text-2xl text-ivory-50 font-light">
                  Search Engine Keywords & Meta Tags
                </h3>
                <p className="text-xs text-stone-subtle/80 mt-1">
                  Modify the target keywords for any section whenever required to optimize search ranking.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const updatedSettings = { ...settings, meta_keywords: metaKeywords };
                  setSettings(updatedSettings);
                  saveContent('settings', updatedSettings, 'Meta keywords updated successfully!');
                }}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Meta Keywords'}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4">
              {[
                { key: 'home', label: 'Homepage Meta Keywords' },
                { key: 'sessions', label: '7 Retreat Sessions Page Keywords' },
                { key: 'daily', label: 'Daily Guided Meditation Keywords' },
                { key: 'rishikesh', label: 'Rishikesh Attractions & Destination Keywords' },
                { key: 'register', label: 'Registration & Inquiry Keywords' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                    {label}
                  </label>
                  <textarea
                    rows={2}
                    value={metaKeywords[key] || ''}
                    onChange={(e) => setMetaKeywords({ ...metaKeywords, [key]: e.target.value })}
                    placeholder="keyword 1, keyword 2, keyword 3..."
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: PHOTOS & GALLERY CMS */}
        {/* ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
              <div>
                <h3 className="font-serif text-2xl text-ivory-50 font-light">
                  Photo Gallery & Media Management
                </h3>
                <p className="text-xs text-stone-subtle/80 mt-1">
                  Add, update, or remove photos displayed in the visual gallery.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const newItem: GalleryItem = {
                      id: `gal-${Date.now()}`,
                      title: 'New Gallery Image',
                      category: 'Retreat Experience',
                      image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
                      caption: 'Photo caption and description...',
                      location: 'Rishikesh, Uttarakhand',
                    };
                    setGalleryItems([newItem, ...galleryItems]);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 hover:bg-emerald-900 text-xs font-semibold uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => saveContent('gallery', galleryItems, 'Gallery items updated!')}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Gallery'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-3"
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-gold-500/20 bg-black/40">
                    <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...galleryItems];
                        updated[index].title = e.target.value;
                        setGalleryItems(updated);
                      }}
                      placeholder="Title"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100 font-medium"
                    />

                    <input
                      type="text"
                      value={item.image_url}
                      onChange={(e) => {
                        const updated = [...galleryItems];
                        updated[index].image_url = e.target.value;
                        setGalleryItems(updated);
                      }}
                      placeholder="Image URL"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-950 border border-gold-500/20 text-[11px] text-stone-subtle/80"
                    />

                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) => {
                        const updated = [...galleryItems];
                        updated[index].caption = e.target.value;
                        setGalleryItems(updated);
                      }}
                      placeholder="Caption"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-gold-400 font-semibold">{item.category}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete "${item.title}"?`)) {
                            setGalleryItems(galleryItems.filter((g) => g.id !== item.id));
                          }
                        }}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: GENERAL SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
              <div>
                <h3 className="font-serif text-2xl text-ivory-50 font-light">
                  General Sanctuary Settings
                </h3>
                <p className="text-xs text-stone-subtle/80 mt-1">
                  Manage contact coordinates, WhatsApp numbers, email, and social links.
                </p>
              </div>

              <button
                type="button"
                onClick={() => saveContent('settings', settings, 'General settings updated!')}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    WhatsApp Number (International with +)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={settings.instagram_url}
                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    value={settings.facebook_url}
                    onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Admin Notes Modal */}
      {selectedRegForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#07261F] border border-gold-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
              <div>
                <h4 className="font-serif text-lg text-ivory-50 font-medium">
                  Notes for {selectedRegForNote.full_name}
                </h4>
                <span className="text-[11px] text-gold-400">ID: {selectedRegForNote.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRegForNote(null)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {selectedRegForNote.admin_notes && selectedRegForNote.admin_notes.length > 0 ? (
                selectedRegForNote.admin_notes.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-emerald-950/80 border border-gold-500/15 text-xs space-y-1">
                    <p className="text-ivory-100">{n.text}</p>
                    <span className="text-[10px] text-stone-subtle/70 block">
                      {n.author} • {formatDate(n.created_at)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-subtle/70 py-4 text-center">No notes added yet.</p>
              )}
            </div>

            <form onSubmit={handleAddNote} className="space-y-3 pt-2">
              <textarea
                rows={3}
                required
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write an internal admin note..."
                className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/20 text-xs text-ivory-100 placeholder:text-stone-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRegForNote(null)}
                  className="px-4 py-2 rounded-full border border-gold-500/30 text-xs text-stone-subtle hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingNote}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-semibold text-xs uppercase tracking-wider"
                >
                  {submittingNote ? 'Saving...' : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptModalUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setReceiptModalUrl(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-gold-500/40 bg-black">
            <button
              type="button"
              onClick={() => setReceiptModalUrl(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center"
            >
              ✕
            </button>
            <div className="relative w-full aspect-[3/4]">
              <Image src={receiptModalUrl} alt="Payment Receipt" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
