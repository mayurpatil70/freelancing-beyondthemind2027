'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  FAQItem,
  CustomContactLink,
  MediaAsset,
  BlogPost,
} from '@/types';
import { IMAGE_ACCEPT, isVideoUrl } from '@/lib/media/rules';
import { uploadMediaFile } from '@/lib/media/upload-client';
import { broadcastCMSUpdate } from '@/contexts/CMSContext';
import { HealingSessionsAdmin } from '@/components/admin/HealingSessionsAdmin';
import { BlogAdmin } from '@/components/admin/BlogAdmin';
import { RichTextField } from '@/components/admin/RichTextField';
import { AdminPasswordPanel } from '@/components/admin/AdminPasswordPanel';
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
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Activity,
  Terminal,
  Film,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Tag,
  Hash,
  Heart,
  BookOpen,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminTab =
  | 'registrations'
  | 'sessions'
  | 'healing-sessions'
  | 'blog'
  | 'daily-meditation'
  | 'registration-settings'
  | 'attractions'
  | 'weather'
  | 'keywords'
  | 'media'
  | 'settings'
  | 'password';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('registrations');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // CMS Content State
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [experiences, setExperiences] = useState<SacredExperience[]>([]);
  const [healingSessions, setHealingSessions] = useState<SacredExperience[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [attractions, setAttractions] = useState<RishikeshAttraction[]>([]);
  const [weatherGuide, setWeatherGuide] = useState<WeatherClothingGuide | null>(null);
  const [metaKeywords, setMetaKeywords] = useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Note Modal state
  const [selectedRegForNote, setSelectedRegForNote] = useState<Registration | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Receipt Modal state
  const [receiptModalUrl, setReceiptModalUrl] = useState<string | null>(null);

  // New Session Creation Modal state
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [newSessionData, setNewSessionData] = useState<Partial<SacredExperience>>({
    title: '',
    subtitle: '',
    order: 1,
    spiritual_dimension: '',
    image: '',
    short_desc: '',
    full_desc: '',
    highlights: [],
    keywords: '',
  });

  // New Attraction Creation Modal state
  const [showAddAttractionModal, setShowAddAttractionModal] = useState(false);
  const [newAttractionData, setNewAttractionData] = useState<Partial<RishikeshAttraction>>({
    title: '',
    category: 'Adrenaline & Adventure',
    duration: '',
    location_tip: '',
    image_url: '',
    description: '',
    highlights: [],
  });

  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [setup, setSetup] = useState<{ database: boolean; storage: boolean; hosted: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/admin/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => json?.success && setSetup(json))
      .catch(() => {});
  }, []);

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
        if (data?.healingSessions) setHealingSessions(data.healingSessions);
        if (data?.blogPosts) setBlogPosts(data.blogPosts);
        if (data?.attractions) setAttractions(data.attractions);
        if (data?.weatherClothing) setWeatherGuide(data.weatherClothing);
      }
    } catch (e) {
      console.error('Fetch content error:', e);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchAllContent();
  }, [fetchRegistrations]);

  const [uploading, setUploading] = useState<string | null>(null);

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
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        showSaveSuccess(successMsg);
        broadcastCMSUpdate(type, data.data ?? payload);
      } else if (res.status === 401) {
        alert('Your admin session has expired. Please log in again, then save your changes.');
      } else {
        alert(data.message || `Failed to save changes (error ${res.status}). Please try again.`);
      }
    } catch (e) {
      console.error('Save error:', e);
      alert('Error connecting to server.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadMedia = async (
    file: File,
    onDone: (url: string, kind: 'image' | 'video') => void,
    uploadId: string
  ) => {
    setUploading(uploadId);
    setUploadProgress(0);
    try {
      const result = await uploadMediaFile(file, setUploadProgress);
      if (result.asset) setMediaAssets((prev) => [result.asset!, ...prev.filter((m) => m.id !== result.asset!.id)]);
      showSaveSuccess(`${result.kind === 'video' ? 'Video' : 'Photo'} uploaded successfully! Remember to click save.`);
      // onDone last: tabs that save straight after an upload show their own "saved" message instead.
      onDone(result.url, result.kind);
    } catch (err) {
      console.error('Upload error:', err);
      alert(err instanceof Error ? err.message : 'Upload failed. Please check your network connection.');
    } finally {
      setUploading(null);
      setUploadProgress(null);
    }
  };

  // Reorder retreat sessions and auto-save sequence
  const moveExperience = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= experiences.length) return;
    const updated = [...experiences];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    const reordered = updated.map((item, i) => ({ ...item, order: i + 1 }));
    setExperiences(reordered);
    saveContent('experiences', reordered, 'Retreat session sequence updated & saved!');
  };

  const fetchMedia = useCallback(async () => {
    setLoadingMedia(true);
    try {
      const res = await fetch('/api/admin/media');
      const json = await res.json();
      if (res.ok && json.success) setMediaAssets(json.data);
    } catch (e) {
      console.error('Media fetch error:', e);
    } finally {
      setLoadingMedia(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'media') fetchMedia();
  }, [activeTab, fetchMedia]);

  const handleDeleteMedia = async (asset: MediaAsset) => {
    if (!confirm(`Delete "${asset.original_name}" from storage? Pages still using this link will show a broken image.`)) return;
    const res = await fetch('/api/admin/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: asset.id }),
    });
    if (res.ok) {
      setMediaAssets((prev) => prev.filter((m) => m.id !== asset.id));
      showSaveSuccess('File deleted from storage.');
    } else {
      alert('Could not delete the file.');
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
            { id: 'healing-sessions', label: 'Healing Sessions', icon: Heart },
            { id: 'blog', label: 'Blog', icon: BookOpen },
            { id: 'daily-meditation', label: 'Daily Meditation', icon: Clock },
            { id: 'registration-settings', label: 'Registration & Google Form', icon: Calendar },
            { id: 'attractions', label: 'Rishikesh Attractions', icon: MapPin },
            { id: 'weather', label: 'Weather & Clothing', icon: Shirt },
            { id: 'keywords', label: 'SEO, GEO & Analytics', icon: Globe },
            { id: 'media', label: 'Media Library', icon: Film },
            { id: 'settings', label: 'General Settings', icon: Settings },
            { id: 'password', label: 'Change Password', icon: Key },
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
        {setup?.hosted && (!setup.database || !setup.storage) && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-400/60 text-red-100 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
            <span>
              {!setup.storage && 'Image uploads are disabled: the NEON_STORAGE_* variables are missing in Vercel. '}
              {!setup.database && 'Changes will not be saved permanently: DATABASE_URL is missing in Vercel. '}
              Add them in Vercel → Settings → Environment Variables, then redeploy.
            </span>
          </div>
        )}

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
                    setNewSessionData({
                      title: '',
                      subtitle: '',
                      order: experiences.length + 1,
                      spiritual_dimension: '',
                      image: '',
                      short_desc: '',
                      full_desc: '',
                      highlights: [],
                      keywords: '',
                    });
                    setShowAddSessionModal(true);
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

            {/* Top Quick Order Sequence Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#07261F] to-[#041a15] border border-gold-500/35 space-y-3 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-500/20 pb-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-gold-300 font-semibold flex items-center gap-1.5">
                    <ArrowUpDown className="w-4 h-4 text-gold-400" />
                    <span>Top Bar: Arrange Retreat Sessions Card Order Sequence</span>
                  </span>
                  <p className="text-[11px] text-stone-subtle/70 font-light mt-0.5">
                    Click ◀ or ▶ to reorder cards instantly. Position 1 appears first on the website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => saveContent('experiences', experiences, 'Session card sequence saved successfully!')}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-wider transition-all self-start sm:self-auto"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Sequence'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {experiences.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950 border border-gold-500/30 text-xs text-ivory-100 shadow-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-gold-500/30 text-gold-300 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-serif font-medium text-ivory-100 truncate max-w-[130px] sm:max-w-[180px]">
                      {exp.title}
                    </span>
                    <div className="flex items-center gap-0.5 border-l border-gold-500/20 pl-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveExperience(idx, idx - 1)}
                        title="Move Earlier in sequence"
                        className="p-1 rounded hover:bg-gold-500/20 text-gold-400 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === experiences.length - 1}
                        onClick={() => moveExperience(idx, idx + 1)}
                        title="Move Later in sequence"
                        className="p-1 rounded hover:bg-gold-500/20 text-gold-400 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
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

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveExperience(index, index - 1)}
                        className="px-2 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 disabled:opacity-30 text-xs flex items-center gap-1 transition-colors"
                        title="Move Card Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[10px]">Up</span>
                      </button>

                      <button
                        type="button"
                        disabled={index === experiences.length - 1}
                        onClick={() => moveExperience(index, index + 1)}
                        className="px-2 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 disabled:opacity-30 text-xs flex items-center gap-1 transition-colors"
                        title="Move Card Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[10px]">Down</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove session "${exp.title}"?`)) {
                            setExperiences(experiences.filter((e) => e.id !== exp.id));
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 transition-colors ml-1"
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

                    {/* Session Photo Upload */}
                    <div className="sm:col-span-12 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                          Session Photo
                        </label>
                        <span className="text-[11px] text-gold-400/90 font-mono bg-black/40 px-2 py-0.5 rounded border border-gold-500/20">
                          Exact Aspect Ratio: 16:10 (e.g. 1600 × 1000 px)
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 hover:text-white cursor-pointer text-xs shrink-0 whitespace-nowrap transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploading === `exp-${exp.id}` ? `Uploading ${uploadProgress ?? 0}%` : 'Upload Image'}</span>
                          <input
                            type="file"
                            accept={IMAGE_ACCEPT}
                            className="hidden"
                            disabled={uploading !== null}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadMedia(
                                  file,
                                  (url) => {
                                    const updated = [...experiences];
                                    updated[index].image = url;
                                    setExperiences(updated);
                                    saveContent('experiences', updated, `Photo for "${exp.title}" uploaded & saved instantly!`);
                                  },
                                  `exp-${exp.id}`
                                );
                              }
                            }}
                          />
                        </label>
                      </div>
                      {exp.image && (
                        <div className="relative w-full max-w-sm aspect-[16/10] rounded-xl overflow-hidden border border-gold-500/35 mt-2 bg-black/60 group/prev">
                          <img src={exp.image} alt={exp.title} className="w-full h-full object-cover object-top" />
                          <a
                            href={exp.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-2 z-20 px-2.5 py-1 rounded-md bg-black/75 border border-gold-400/40 text-[10px] text-gold-300 font-semibold tracking-wider uppercase hover:bg-black transition-colors flex items-center gap-1 shadow-md"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Open Full Photo</span>
                          </a>
                        </div>
                      )}
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
                      <RichTextField
                        rows={10}
                        value={exp.full_desc}
                        onChange={(v) => {
                          const updated = [...experiences];
                          updated[index].full_desc = v;
                          setExperiences(updated);
                        }}
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

                    {/* SEO Search Keywords for this Card */}
                    <div className="sm:col-span-12 space-y-3 p-4 rounded-xl bg-emerald-950/60 border border-gold-500/25">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold-500/15 pb-2.5">
                        <div>
                          <label className="text-[11px] uppercase tracking-wider text-gold-300 font-bold flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-gold-400" />
                            <span>Card SEO &amp; Discovery Keywords</span>
                          </label>
                          <p className="text-[10px] text-stone-subtle/70 font-light mt-0.5">
                            Search keywords and AI entity discovery terms for this session. (Not rendered on public cards to keep them clean, but indexed by Google &amp; AI bots).
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete all keywords for "${exp.title}"?`)) {
                                const updated = [...experiences];
                                updated[index].keywords = '';
                                setExperiences(updated);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-500/30 text-red-300 text-[10px] font-medium transition-colors"
                            title="Delete all keywords for this session card"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete All Keywords</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              saveContent('experiences', experiences, `Keywords for "${exp.title}" saved!`);
                            }}
                            disabled={saving}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/40 text-gold-300 text-[10px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save Keywords</span>
                          </button>
                        </div>
                      </div>

                      {/* Keyword Pills with Individual Delete (X) */}
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gold-400/80 font-semibold block mb-1.5">
                          Active Keywords ({exp.keywords ? exp.keywords.split(',').filter((k) => k.trim()).length : 0}):
                        </span>
                        {exp.keywords && exp.keywords.trim().length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {exp.keywords.split(',').map((kw, ki) => {
                              const trimmed = kw.trim();
                              if (!trimmed) return null;
                              return (
                                <span
                                  key={ki}
                                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-900/90 border border-gold-500/30 text-gold-200 shadow-sm"
                                >
                                  <span>#{trimmed}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const allKw = exp.keywords
                                        ? exp.keywords.split(',').map((k) => k.trim()).filter(Boolean)
                                        : [];
                                      const updatedKw = allKw.filter((_, i) => i !== ki).join(', ');
                                      const updated = [...experiences];
                                      updated[index].keywords = updatedKw;
                                      setExperiences(updated);
                                    }}
                                    className="w-4 h-4 rounded-full hover:bg-red-800 hover:text-white flex items-center justify-center text-gold-400 transition-colors font-bold text-xs"
                                    title={`Delete keyword "${trimmed}"`}
                                  >
                                    ×
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[11px] text-stone-subtle/60 italic">
                            No keywords currently set. Add keywords below.
                          </p>
                        )}
                      </div>

                      {/* Add Keyword & Edit Comma-separated Text */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                        <div className="sm:col-span-8 space-y-1">
                          <label className="text-[10px] uppercase text-gold-400/90 font-semibold">
                            Edit Keywords (Comma-Separated Text)
                          </label>
                          <input
                            type="text"
                            value={exp.keywords || ''}
                            placeholder="Stress Buster, Nervous System Reset, Himalayan Breathwork..."
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].keywords = e.target.value;
                              setExperiences(updated);
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 placeholder:text-stone-subtle/40"
                          />
                        </div>

                        <div className="sm:col-span-4 space-y-1">
                          <label className="text-[10px] uppercase text-gold-400/90 font-semibold">
                            Quick Add Keyword Chip
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              id={`add-kw-${exp.id}`}
                              placeholder="Type keyword &amp; click Add..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const input = e.currentTarget;
                                  const val = input.value.trim();
                                  if (val) {
                                    const current = exp.keywords ? exp.keywords.trim() : '';
                                    const updatedKw = current ? `${current}, ${val}` : val;
                                    const updated = [...experiences];
                                    updated[index].keywords = updatedKw;
                                    setExperiences(updated);
                                    input.value = '';
                                  }
                                }
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 placeholder:text-stone-subtle/40"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const el = document.getElementById(`add-kw-${exp.id}`) as HTMLInputElement;
                                if (el && el.value.trim()) {
                                  const val = el.value.trim();
                                  const current = exp.keywords ? exp.keywords.trim() : '';
                                  const updatedKw = current ? `${current}, ${val}` : val;
                                  const updated = [...experiences];
                                  updated[index].keywords = updatedKw;
                                  setExperiences(updated);
                                  el.value = '';
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 text-xs font-semibold shrink-0"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
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
        {activeTab === 'healing-sessions' && (
          <HealingSessionsAdmin
            sessions={healingSessions}
            setSessions={setHealingSessions}
            saving={saving}
            saveContent={saveContent}
            handleUploadMedia={handleUploadMedia}
            uploading={uploading}
            uploadProgress={uploadProgress}
          />
        )}

        {activeTab === 'blog' && (
          <BlogAdmin
            posts={blogPosts}
            setPosts={setBlogPosts}
            saving={saving}
            saveContent={saveContent}
            handleUploadMedia={handleUploadMedia}
            uploading={uploading}
            uploadProgress={uploadProgress}
          />
        )}

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
              <div className="p-6 rounded-2xl bg-emerald-950/80 border-2 border-gold-400/40 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-[10px] tracking-widest uppercase text-gold-300 font-semibold mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                      Website Registration Form URL
                    </div>
                    <h4 className="font-serif text-lg text-ivory-50 font-medium">
                      Google Form Link Management
                    </h4>
                    <p className="text-xs text-stone-subtle/80 mt-1 max-w-2xl leading-relaxed">
                      Update the official Google Form link anytime. When you click Save, this link updates immediately across the entire website for both on-click redirection and embedded registration.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer bg-[#031713] px-3.5 py-2 rounded-xl border border-gold-500/30 shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.registration_google_form_enabled}
                      onChange={(e) => setSettings({ ...settings, registration_google_form_enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400 bg-emerald-950 border-gold-500/40"
                    />
                    <span className="text-xs text-ivory-100 font-medium">Google Form Active</span>
                  </label>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                    Official Google Form Link (View, Edit, or Share URL)
                  </label>
                  <input
                    type="url"
                    value={settings.registration_google_form_url}
                    onChange={(e) => setSettings({ ...settings, registration_google_form_url: e.target.value })}
                    placeholder="https://docs.google.com/forms/d/..."
                    className="w-full px-4 py-3 rounded-xl bg-[#031713] border border-gold-500/40 text-xs text-ivory-100 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 font-mono"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => saveContent('settings', settings, 'Google Form link saved successfully and updated live across the website!')}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Google Form URL'}</span>
                  </button>

                  {settings.registration_google_form_url && (
                    <a
                      href={settings.registration_google_form_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      <span>Test Form Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
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
                    value={settings.retreat_languages || 'English and Malayalam. Hindi translation is available upon request.'}
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
                    setNewAttractionData({
                      title: '',
                      category: 'Adrenaline & Adventure',
                      duration: '',
                      location_tip: '',
                      image_url: '',
                      description: '',
                      highlights: [],
                    });
                    setShowAddAttractionModal(true);
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
                          const updated = attractions.filter((a) => a.id !== attr.id);
                          setAttractions(updated);
                          saveContent('attractions', updated, `Attraction "${attr.title}" removed!`);
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

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                          Attraction Photo
                        </label>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Photo Image URL (https://... or upload image)"
                          value={attr.image_url || ''}
                          onChange={(e) => {
                            const updated = [...attractions];
                            updated[index].image_url = e.target.value;
                            setAttractions(updated);
                          }}
                          className="flex-1 w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 placeholder:text-stone-subtle/50"
                        />
                        <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 hover:text-white cursor-pointer text-xs shrink-0 whitespace-nowrap transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploading === `attr-${attr.id}` ? `Uploading ${uploadProgress ?? 0}%` : 'Upload Image'}</span>
                          <input
                            type="file"
                            accept={IMAGE_ACCEPT}
                            className="hidden"
                            disabled={uploading !== null}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadMedia(
                                  file,
                                  (url) => {
                                    const updated = [...attractions];
                                    updated[index].image_url = url;
                                    setAttractions(updated);
                                    saveContent('attractions', updated, `Photo for "${attr.title}" uploaded & saved instantly!`);
                                  },
                                  `attr-${attr.id}`
                                );
                              }
                            }}
                          />
                        </label>
                      </div>
                      {attr.image_url && (
                        <div className="relative w-full max-w-sm aspect-[16/10] rounded-xl overflow-hidden border border-gold-500/35 mt-2 bg-black/60 group/prev">
                          <img src={attr.image_url} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-35" />
                          <img src={attr.image_url} alt={attr.title} className="relative z-10 w-full h-full object-contain" />
                          <a
                            href={attr.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-2 z-20 px-2.5 py-1 rounded-md bg-black/75 border border-gold-400/40 text-[10px] text-gold-300 font-semibold tracking-wider uppercase hover:bg-black transition-colors flex items-center gap-1 shadow-md"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Open Full Photo</span>
                          </a>
                        </div>
                      )}
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
        {/* TAB 7: SEO, GEO, AEO & GOOGLE CONSOLE ANALYTICS DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'keywords' && settings && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Action Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#07261F]/80 border border-gold-500/25">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-semibold block">
                  Search &amp; AI Discovery Management
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-light mt-0.5">
                  SEO, GEO, AEO &amp; Google Console Analytics
                </h3>
                <p className="text-xs text-stone-subtle/80 mt-1 max-w-2xl font-light">
                  Optimize your presence across traditional search engines (Google), Generative AI engines (ChatGPT, Gemini, Perplexity), and Answer Engine Featured Snippets with live security audit and crawler telemetry.
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  const updatedSettings = {
                    ...settings,
                    meta_keywords: metaKeywords,
                  };
                  setSettings(updatedSettings);
                  await saveContent(
                    'settings',
                    updatedSettings,
                    'SEO, Google Console & Analytics settings saved successfully!'
                  );
                  // Per-session keywords live on each session card (experiences), so save them too.
                  if (experiences.length > 0) {
                    await saveContent('experiences', experiences, 'SEO settings and per-session keywords saved!');
                  }
                }}
                disabled={saving}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50 shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save All SEO & Console Settings'}</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#07261F]/60 border border-gold-500/20 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-stone-subtle/70 block">
                  Sitemap Status
                </span>
                <span className="text-xl font-serif text-gold-300 font-bold">{15 + experiences.length + healingSessions.length + blogPosts.filter((p) => p.published).length} Routes</span>
                <span className="text-[10px] text-emerald-400 block font-mono">/sitemap.xml (Active)</span>
              </div>

              <div className="p-4 rounded-xl bg-[#07261F]/60 border border-gold-500/20 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-stone-subtle/70 block">
                  Robots &amp; AI Crawlers
                </span>
                <span className="text-xl font-serif text-gold-300 font-bold">5 Bots Enabled</span>
                <span className="text-[10px] text-emerald-400 block font-mono">GPTBot, Gemini, Perplexity</span>
              </div>

              <div className="p-4 rounded-xl bg-[#07261F]/60 border border-gold-500/20 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-stone-subtle/70 block">
                  Schema Knowledge Graph
                </span>
                <span className="text-xl font-serif text-gold-300 font-bold">5 Schemas</span>
                <span className="text-[10px] text-emerald-400 block font-mono">Event, Org, Course, FAQ</span>
              </div>

              <div className="p-4 rounded-xl bg-[#07261F]/60 border border-gold-500/20 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-stone-subtle/70 block">
                  Security Headers
                </span>
                <span className="text-xl font-serif text-gold-300 font-bold">Grade A+</span>
                <span className="text-[10px] text-emerald-400 block font-mono">CSP, HSTS, No-Sniff, X-Frame</span>
              </div>
            </div>

            {/* Section A: Google Search Console & Google Analytics Configuration */}
            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-5">
              <div className="flex items-center justify-between border-b border-gold-500/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-5 h-5 text-gold-400" />
                  <h4 className="font-serif text-lg text-ivory-50 font-medium">
                    Google Search Console &amp; Google Analytics 4 (GA4)
                  </h4>
                </div>
                <span className="text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-emerald-950 border border-gold-400/40 text-gold-300 font-medium">
                  Official Verification Keys
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium flex items-center justify-between">
                    <span>Google Search Console Token</span>
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-gold-300 hover:underline flex items-center gap-1"
                    >
                      <span>Open Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <input
                    type="text"
                    value={settings.google_search_console_token || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, google_search_console_token: e.target.value })
                    }
                    placeholder="e.g. google-site-verification=abc123xyz"
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400"
                  />
                  <p className="text-[10px] text-stone-subtle/70 font-light">
                    Injected into HTML <code className="text-gold-300">&lt;meta name=&quot;google-site-verification&quot;&gt;</code> automatically to verify site ownership in Google Search Console.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium flex items-center justify-between">
                    <span>Google Analytics 4 (GA4) Measurement ID</span>
                    <a
                      href="https://analytics.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-gold-300 hover:underline flex items-center gap-1"
                    >
                      <span>Open GA4</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  <input
                    type="text"
                    value={settings.google_analytics_id || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, google_analytics_id: e.target.value })
                    }
                    placeholder="e.g. G-BTM2027RETREAT"
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400"
                  />
                  <p className="text-[10px] text-stone-subtle/70 font-light">
                    Tracks participant sessions, retreat registration funnels, and traffic sources across web and mobile.
                  </p>
                </div>
              </div>
            </div>

            {/* Section B: Live Security Audit Telemetry */}
            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4">
              <div className="flex items-center justify-between border-b border-gold-500/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-serif text-lg text-ivory-50 font-medium">
                    Website Security Audit &amp; HTTP Security Headers
                  </h4>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-mono">
                  100% HARDENED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    header: 'Content-Security-Policy (CSP)',
                    status: 'Strict Whitelist Active',
                    desc: 'Restricts script execution, blocks cross-site scripting (XSS) and rogue script injection.',
                  },
                  {
                    header: 'Strict-Transport-Security (HSTS)',
                    status: 'max-age=63072000; preload',
                    desc: 'Forces 2-year HTTPS encryption across all subdomains; immune to SSL stripping attacks.',
                  },
                  {
                    header: 'X-Frame-Options',
                    status: 'DENY',
                    desc: 'Prevents clickjacking and prevents unauthorized framing inside external iframes.',
                  },
                  {
                    header: 'X-Content-Type-Options',
                    status: 'nosniff',
                    desc: 'Stops MIME-confusion attacks and malicious file execution disguised as images.',
                  },
                  {
                    header: 'Referrer-Policy',
                    status: 'strict-origin-when-cross-origin',
                    desc: 'Protects user privacy and reference IDs during external outbound navigation.',
                  },
                  {
                    header: 'Permissions-Policy',
                    status: 'camera=(), mic=(), geo=()',
                    desc: 'Explicitly disables device hardware sensors from unauthorized script access.',
                  },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-emerald-950/70 border border-gold-500/15 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-ivory-100">{item.header}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <span className="text-[10px] font-mono text-gold-300 block">{item.status}</span>
                    <p className="text-[10px] text-stone-subtle/70 font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section C: GEO & AEO AI Engine Readiness */}
            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4">
              <div className="flex items-center justify-between border-b border-gold-500/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-gold-400" />
                  <h4 className="font-serif text-lg text-ivory-50 font-medium">
                    GEO &amp; AEO (Generative &amp; Answer Engine Optimization)
                  </h4>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-300 border border-gold-400/40 font-medium">
                  AI Search Ready
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/70 border border-gold-500/20 space-y-2">
                  <span className="text-xs font-semibold text-gold-300 block uppercase tracking-wider">
                    AI Knowledge Graph Entities (Schema.org JSON-LD)
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-subtle/90 font-light">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                      <span><strong>Event:</strong> The Divine Retreat (Oct 5 arrival at 2:45 PM • Oct 6–9 sessions)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                      <span><strong>EducationalEvent:</strong> Daily Guided Meditation (Mon–Fri 7:30 PM Zoom)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                      <span><strong>Organization:</strong> Beyond the Mind (Verified phone, WhatsApp, socials)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                      <span><strong>FAQPage:</strong> Answer Engine Q&amp;As for featured snippets &amp; voice assistants</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/70 border border-gold-500/20 space-y-2">
                  <span className="text-xs font-semibold text-gold-300 block uppercase tracking-wider">
                    Sitemap &amp; Crawler Access Telemetry
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#041512] border border-gold-500/15">
                      <span className="font-mono text-ivory-100">/sitemap.xml</span>
                      <a
                        href="/sitemap.xml"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-400 hover:text-gold-300 text-[11px] underline flex items-center gap-1"
                      >
                        <span>Inspect XML</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#041512] border border-gold-500/15">
                      <span className="font-mono text-ivory-100">/robots.txt</span>
                      <a
                        href="/robots.txt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-400 hover:text-gold-300 text-[11px] underline flex items-center gap-1"
                      >
                        <span>Inspect Robots</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[10px] text-stone-subtle/70 font-light pt-1">
                      Explicit permissions configured for Google-Extended (Gemini), GPTBot (ChatGPT), PerplexityBot, and ClaudeBot to cite Beyond the Mind in AI answers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section D: Meta Keywords by Section */}
            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4">
              <div className="border-b border-gold-500/15 pb-3">
                <h4 className="font-serif text-lg text-ivory-50 font-medium">
                  Section-Specific Target Meta Keywords
                </h4>
                <p className="text-xs text-stone-subtle/70 font-light mt-0.5">
                  Update target search terms for each key page to continuously improve search engine rankings.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'home', label: 'Homepage Meta Keywords' },
                  { key: 'sessions', label: '7 Retreat Sessions Overview Page Keywords (all sessions)' },
                  { key: 'healing', label: 'Transformative Healing Sessions Page Keywords' },
                  { key: 'blog', label: 'Blog (Wisdom Beyond the Mind) Page Keywords' },
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
                      className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                ))}
              </div>

              {/* Per-session keywords: one field for each of the 7 retreat sessions */}
              <div className="pt-4 mt-2 border-t border-gold-500/15 space-y-4">
                <div>
                  <h5 className="font-serif text-base text-ivory-50 font-medium">
                    Individual Retreat Session Keywords
                  </h5>
                  <p className="text-xs text-stone-subtle/70 font-light mt-0.5">
                    Separate keywords for each session. They are never shown on the website; they are used only
                    in each session&apos;s own page meta tags and Google structured data, so a search for them leads
                    straight to that session card. Click &quot;Save All SEO &amp; Console Settings&quot; to publish.
                  </p>
                </div>

                {experiences.length === 0 ? (
                  <p className="text-xs text-stone-subtle/60 italic">No retreat sessions found.</p>
                ) : (
                  [...experiences]
                    .map((exp, index) => ({ exp, index }))
                    .sort((a, b) => a.exp.order - b.exp.order)
                    .map(({ exp, index }) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <label
                            htmlFor={`session-kw-${exp.id}`}
                            className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block"
                          >
                            Session {String(exp.order).padStart(2, '0')} · {exp.title} Keywords
                          </label>
                          <a
                            href={`/experiences/${exp.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-stone-subtle/60 hover:text-gold-300 break-all"
                          >
                            /experiences/{exp.slug}
                          </a>
                        </div>
                        <textarea
                          id={`session-kw-${exp.id}`}
                          rows={2}
                          value={exp.keywords || ''}
                          onChange={(e) => {
                            const updated = [...experiences];
                            updated[index] = { ...updated[index], keywords: e.target.value };
                            setExperiences(updated);
                          }}
                          placeholder={`e.g. ${exp.title}, ${exp.title} Rishikesh, ${exp.subtitle || 'guided meditation'}...`}
                          className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                        />
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MEDIA LIBRARY */}
        {/* ========================================================================= */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
              <div>
                <h3 className="font-serif text-2xl text-ivory-50 font-light">Media Library</h3>
                <p className="text-xs text-stone-subtle/80 mt-1">
                  Every image uploaded from the CMS. JPG, PNG, WEBP, GIF or AVIF, up to 15 MB.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={fetchMedia}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-950 border border-gold-500/30 text-gold-300 hover:bg-emerald-900 text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingMedia ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => mediaFileInputRef.current?.click()}
                  disabled={uploading !== null}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading?.startsWith('media-') ? `Uploading ${uploadProgress ?? 0}%` : 'Upload Images'}</span>
                </button>
                <input
                  ref={mediaFileInputRef}
                  type="file"
                  multiple
                  accept={IMAGE_ACCEPT}
                  className="hidden"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    e.target.value = '';
                    for (let i = 0; i < files.length; i++) {
                      await handleUploadMedia(files[i], () => {}, `media-${i}`);
                    }
                  }}
                />
              </div>
            </div>

            {mediaAssets.length === 0 ? (
              <div className="p-10 rounded-2xl border border-dashed border-gold-500/30 text-center text-xs text-stone-subtle/80">
                {loadingMedia ? 'Loading media...' : 'No uploads yet. Upload an image or video to get started.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {mediaAssets.map((asset) => (
                  <div key={asset.id} className="p-3 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-2.5">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gold-500/20 bg-black/40">
                      {asset.kind === 'video' ? (
                        <video src={asset.url} controls muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <img src={asset.url} alt={asset.original_name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-[9px] uppercase tracking-wider text-gold-300">
                        {asset.kind}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-ivory-100 font-medium truncate" title={asset.original_name}>
                        {asset.original_name}
                      </p>
                      <p className="text-[10px] text-stone-subtle/70">
                        {(asset.size_bytes / 1024 / 1024).toFixed(1)} MB • {formatDate(asset.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(asset)}
                        className="ml-auto text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: GENERAL SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'password' && <AdminPasswordPanel />}

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

            {/* Contact Coordinates */}
            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4">
              <h4 className="font-serif text-lg text-ivory-50 font-medium border-b border-gold-500/20 pb-2">
                Official Contact & Social Coordinates
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Primary WhatsApp / Phone (+91...)
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
                    Secondary / Alternate Phone
                  </label>
                  <input
                    type="text"
                    value={settings.secondary_phone || ''}
                    onChange={(e) => setSettings({ ...settings, secondary_phone: e.target.value })}
                    placeholder="e.g. +91 8075572018"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Primary Official Email
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
                    Secondary / Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.secondary_email || ''}
                    onChange={(e) => setSettings({ ...settings, secondary_email: e.target.value })}
                    placeholder="support@beyondthemindretreat.org"
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

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    YouTube Channel URL
                  </label>
                  <input
                    type="text"
                    value={settings.youtube_url || ''}
                    onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/@bodymindintellect"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Twitter / X URL
                  </label>
                  <input
                    type="text"
                    value={settings.twitter_url || ''}
                    onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                    placeholder="https://x.com/beyondthemind27"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>
              </div>

              {/* Customizable Contacts & Additional Links */}
              <div className="pt-4 border-t border-gold-500/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h5 className="font-serif text-sm text-gold-300 font-semibold uppercase tracking-wider">
                      Custom Contacts & Additional Links
                    </h5>
                    <p className="text-[11px] text-stone-subtle/70">
                      Add customizable phone numbers, email addresses, or external links with custom labels.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const list = settings.custom_contacts || [];
                      const newItem: CustomContactLink = {
                        id: `contact-${Date.now()}`,
                        label: 'New Contact / Link',
                        type: 'phone',
                        value: '',
                      };
                      setSettings({ ...settings, custom_contacts: [...list, newItem] });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950 border border-gold-500/30 text-gold-300 hover:bg-emerald-900 text-[11px] font-semibold uppercase tracking-wider shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Custom Link / Contact</span>
                  </button>
                </div>

                {(!settings.custom_contacts || settings.custom_contacts.length === 0) && (
                  <p className="text-xs text-stone-subtle/60 italic py-2">
                    No custom contacts added yet. Click &quot;Add Custom Link / Contact&quot; to create one.
                  </p>
                )}

                <div className="space-y-3">
                  {(settings.custom_contacts || []).map((c, cIdx) => (
                    <div
                      key={c.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-xl bg-emerald-950/70 border border-gold-500/20"
                    >
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[10px] uppercase text-gold-400 font-semibold block">Label</label>
                        <input
                          type="text"
                          value={c.label}
                          placeholder="e.g. Booking Desk, Telegram..."
                          onChange={(e) => {
                            const list = [...(settings.custom_contacts || [])];
                            list[cIdx].label = e.target.value;
                            setSettings({ ...settings, custom_contacts: list });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                        />
                      </div>

                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[10px] uppercase text-gold-400 font-semibold block">Type</label>
                        <select
                          value={c.type}
                          onChange={(e) => {
                            const list = [...(settings.custom_contacts || [])];
                            list[cIdx].type = e.target.value as 'phone' | 'email' | 'link';
                            setSettings({ ...settings, custom_contacts: list });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#041d17] border border-gold-500/30 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                        >
                          <option value="phone" className="bg-[#031713] text-ivory-100">Phone Number</option>
                          <option value="email" className="bg-[#031713] text-ivory-100">Email Address</option>
                          <option value="link" className="bg-[#031713] text-ivory-100">Web Link / URL</option>
                        </select>
                      </div>

                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[10px] uppercase text-gold-400 font-semibold block">Value</label>
                        <input
                          type="text"
                          value={c.value}
                          placeholder={
                            c.type === 'phone'
                              ? '+91 8075572018'
                              : c.type === 'email'
                              ? 'name@domain.com'
                              : 'https://...'
                          }
                          onChange={(e) => {
                            const list = [...(settings.custom_contacts || [])];
                            list[cIdx].value = e.target.value;
                            setSettings({ ...settings, custom_contacts: list });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end pt-2 sm:pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            const list = (settings.custom_contacts || []).filter((item) => item.id !== c.id);
                            setSettings({ ...settings, custom_contacts: list });
                          }}
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300"
                          title="Remove custom contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Spiritual Guide & Founder Bio CMS */}
            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4">
              <div className="border-b border-gold-500/20 pb-3">
                <h4 className="font-serif text-lg text-ivory-50 font-medium">
                  Spiritual Guide & Founder Profile (Pradeep Muthukulam)
                </h4>
                <p className="text-xs text-stone-subtle/80 mt-0.5">
                  Update the biography, headline, and philosophical vision of Pradeep Muthukulam displayed across the website.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Bio Headline
                  </label>
                  <input
                    type="text"
                    value={settings.guide_headline || 'Pradeep Muthukulam – A Journey Towards Inner Awakening'}
                    onChange={(e) => setSettings({ ...settings, guide_headline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Full Biography & Vision
                  </label>
                  <textarea
                    rows={6}
                    value={
                      settings.guide_bio ||
                      'Pradeep Muthukulam is a seeker and spiritual guide devoted to the timeless wisdom of spirituality, self-realisation and the awakening of inner consciousness. His vision is to inspire individuals to journey beyond the boundaries of the mind, reconnect with their true essence and discover the profound peace, wisdom and divinity that reside within.\n\nThrough spiritual insights, meditation and personal guidance, he encourages seekers to embrace a life of mindfulness, awareness, compassion and higher purpose. His philosophy rests on a simple yet profound truth: The Divine is not something to be found outside, but a truth to be awakened within.\n\nHis endeavour is to guide every seeker towards inner transformation, spiritual clarity and the ultimate experience of inner peace.'
                    }
                    onChange={(e) => setSettings({ ...settings, guide_bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 font-light leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Homepage Hero Floating Notice / Offer / Discount Card CMS */}
            <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4">
              <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
                <div>
                  <h4 className="font-serif text-lg text-ivory-50 font-medium">
                    Homepage Floating News Channel Marquee Ticker
                  </h4>
                  <p className="text-xs text-stone-subtle/80 mt-0.5">
                    Render live retreat announcements floating like a news channel ticker from left to right. When updated here, it immediately reflects across the live website.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.hero_notice_card?.enabled ?? true}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero_notice_card: {
                          ...(settings.hero_notice_card || {
                            title: 'Beyond the Mind 2028 – The Divine Retreat Dwaraka, Gujarat | 25–28 September 2028',
                            description: 'Beyond the Mind 2028 – The Divine Retreat Dwaraka, Gujarat | 25–28 September 2028',
                          }),
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-gold-500 focus:ring-gold-400 bg-emerald-950 border-gold-500/40"
                  />
                  <span className="text-xs text-ivory-100 font-medium">Marquee Ticker Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Notice Badge Tag
                  </label>
                  <input
                    type="text"
                    value={settings.hero_notice_card?.badge || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero_notice_card: {
                          ...(settings.hero_notice_card || { enabled: true, title: '', description: '' }),
                          badge: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Next Gathering Notice, Breaking Announcement"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Discount / Special Inclusions Tag
                  </label>
                  <input
                    type="text"
                    value={settings.hero_notice_card?.discount_text || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero_notice_card: {
                          ...(settings.hero_notice_card || { enabled: true, title: '', description: '' }),
                          discount_text: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Exclusive Sanctuary Inclusions"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Floating Announcement Ticker Headline (Rendered in Marquee)
                  </label>
                  <input
                    type="text"
                    value={settings.hero_notice_card?.title || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero_notice_card: {
                          ...(settings.hero_notice_card || { enabled: true, description: '' }),
                          title: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Beyond the Mind 2028 – The Divine Retreat Dwaraka, Gujarat | 25–28 September 2028"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    Notice Description / Sub-details
                  </label>
                  <textarea
                    rows={2}
                    value={settings.hero_notice_card?.description || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero_notice_card: {
                          ...(settings.hero_notice_card || { enabled: true, title: '' }),
                          description: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Enquire now for early reservation details, accommodation selection, and participation guidelines."
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.hero_notice_card?.cta_text || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero_notice_card: {
                          ...(settings.hero_notice_card || { enabled: true, title: '', description: '' }),
                          cta_text: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Enquire for Retreat"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">
                    CTA Action Link / Route
                  </label>
                  <input
                    type="text"
                    value={settings.hero_notice_card?.cta_link || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero_notice_card: {
                          ...(settings.hero_notice_card || { enabled: true, title: '', description: '' }),
                          cta_link: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. /register or /contact or whatsapp"
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>
              </div>

              {/* Dedicated Save Button directly on the Floating Notice Card */}
              <div className="pt-3 border-t border-gold-500/20 flex items-center justify-between">
                <span className="text-[11px] text-stone-subtle">
                  Changes save directly and update live on the homepage without rebuild.
                </span>
                <button
                  type="button"
                  onClick={() => saveContent('settings', settings, 'Floating gathering notice updated and published live!')}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Publishing...' : 'Save & Publish Notice Live'}</span>
                </button>
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
              {/\.pdf(\?|$)/i.test(decodeURIComponent(receiptModalUrl)) ? (
                <a
                  href={receiptModalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center text-gold-300 underline text-sm"
                >
                  Open PDF receipt
                </a>
              ) : (
                <Image src={receiptModalUrl} alt="Payment Receipt" fill unoptimized className="object-contain" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Session Creation Popup Modal */}
      {showAddSessionModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-br from-[#07261F] to-[#031713] border-2 border-gold-400/50 p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                  New Retreat Session Card
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-ivory-50 font-medium">
                  Add New Session
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSessionModal(false)}
                className="w-8 h-8 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/30 text-stone-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                    Session Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSessionData.title || ''}
                    placeholder="e.g. STRESS BUSTER SESSION"
                    onChange={(e) => setNewSessionData({ ...newSessionData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                    Order Sequence
                  </label>
                  <input
                    type="number"
                    value={newSessionData.order || experiences.length + 1}
                    onChange={(e) => setNewSessionData({ ...newSessionData, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={newSessionData.subtitle || ''}
                  placeholder="e.g. Nervous System Calm & Inner Lightness"
                  onChange={(e) => setNewSessionData({ ...newSessionData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  Spiritual Dimension Tag
                </label>
                <input
                  type="text"
                  value={newSessionData.spiritual_dimension || ''}
                  placeholder="e.g. Deep Relaxation & Somatic Calm"
                  onChange={(e) => setNewSessionData({ ...newSessionData, spiritual_dimension: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                />
              </div>

              {/* Session Photo Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  Session Photo
                </label>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 hover:text-white cursor-pointer text-xs shrink-0 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading === 'new-session-img' ? `Uploading ${uploadProgress ?? 0}%` : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept={IMAGE_ACCEPT}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadMedia(file, (url) => setNewSessionData((prev) => ({ ...prev, image: url })), 'new-session-img');
                        }
                      }}
                    />
                  </label>
                </div>
                {newSessionData.image && (
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-gold-500/30 mt-1">
                    <img src={newSessionData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  Card Summary (Short Description)
                </label>
                <textarea
                  rows={2}
                  value={newSessionData.short_desc || ''}
                  placeholder="Brief 1-2 sentence overview shown on retreat cards..."
                  onChange={(e) => setNewSessionData({ ...newSessionData, short_desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  Full Practice Description
                </label>
                <RichTextField
                  rows={6}
                  value={newSessionData.full_desc || ''}
                  placeholder="Detailed experiential explanation of what seekers practice..."
                  onChange={(v) => setNewSessionData({ ...newSessionData, full_desc: v })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  Key Practice Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={(newSessionData.highlights || []).join('\n')}
                  placeholder="Highlight point 1&#10;Highlight point 2"
                  onChange={(e) =>
                    setNewSessionData({
                      ...newSessionData,
                      highlights: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  SEO Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newSessionData.keywords || ''}
                  placeholder="e.g. Stress Buster, Somatic Release, Himalayan Breathwork..."
                  onChange={(e) => setNewSessionData({ ...newSessionData, keywords: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gold-500/20">
              <button
                type="button"
                onClick={() => setShowAddSessionModal(false)}
                className="px-5 py-2 rounded-full border border-gold-500/30 text-xs text-stone-subtle hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newSessionData.title}
                onClick={async () => {
                  if (!newSessionData.title) return;
                  const newSession: SacredExperience = {
                    id: `exp-${Date.now()}`,
                    slug: `session-${experiences.length + 1}`,
                    title: newSessionData.title.trim().toUpperCase(),
                    subtitle: newSessionData.subtitle?.trim() || '',
                    short_desc: newSessionData.short_desc?.trim() || '',
                    full_desc: newSessionData.full_desc?.trim() || '',
                    image:
                      newSessionData.image?.trim() ||
                      '/images/rishikesh/stillness-ganges.jpg',
                    icon_name: 'CircleDot',
                    order: Number(newSessionData.order) || experiences.length + 1,
                    spiritual_dimension: newSessionData.spiritual_dimension?.trim() || 'Inner Awakening',
                    highlights:
                      newSessionData.highlights && newSessionData.highlights.length > 0
                        ? newSessionData.highlights
                        : ['Sacred energy alignment', 'Experiential inner stillness'],
                    keywords: newSessionData.keywords?.trim() || '',
                  };
                  const updated = [...experiences, newSession];
                  setExperiences(updated);
                  setShowAddSessionModal(false);
                  await saveContent('experiences', updated, `Session "${newSession.title}" added and saved live!`);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Add Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Attraction Creation Popup Modal */}
      {showAddAttractionModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
        >
          <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-br from-[#07261F] to-[#031713] border-2 border-gold-400/50 p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                  New Rishikesh Attraction Card
                </span>
                <h4 className="font-serif text-xl sm:text-2xl text-ivory-50 font-medium">
                  Add Attraction
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAttractionModal(false)}
                className="w-8 h-8 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/30 text-stone-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  Attraction Title *
                </label>
                <input
                  type="text"
                  required
                  value={newAttractionData.title || ''}
                  placeholder="e.g. Ganga Aarti at Triveni Ghat"
                  onChange={(e) => setNewAttractionData({ ...newAttractionData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                    Category
                  </label>
                  <select
                    value={newAttractionData.category || 'Adrenaline & Adventure'}
                    onChange={(e) =>
                      setNewAttractionData({
                        ...newAttractionData,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#041d17] border border-gold-500/30 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                  >
                    <option value="Adrenaline & Adventure" className="bg-[#031713] text-ivory-100">Adrenaline & Adventure</option>
                    <option value="Sacred Heritage" className="bg-[#031713] text-ivory-100">Sacred Heritage</option>
                    <option value="Nature & Scenic" className="bg-[#031713] text-ivory-100">Nature & Scenic</option>
                    <option value="Wellness & Peace" className="bg-[#031713] text-ivory-100">Wellness & Peace</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newAttractionData.duration || ''}
                    placeholder="e.g. 2 - 3 Hours"
                    onChange={(e) => setNewAttractionData({ ...newAttractionData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  Location / Tip
                </label>
                <input
                  type="text"
                  value={newAttractionData.location_tip || ''}
                  placeholder="e.g. Triveni Ghat, Rishikesh"
                  onChange={(e) => setNewAttractionData({ ...newAttractionData, location_tip: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                />
              </div>

              {/* Attraction Photo Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  Photo Image
                </label>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Photo Image URL (https://... or upload image)"
                    value={newAttractionData.image_url || ''}
                    onChange={(e) => setNewAttractionData((prev) => ({ ...prev, image_url: e.target.value }))}
                    className="flex-1 w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 placeholder:text-stone-subtle/50"
                  />
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 hover:text-white cursor-pointer text-xs shrink-0 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading === 'new-attr-img' ? `Uploading ${uploadProgress ?? 0}%` : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept={IMAGE_ACCEPT}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadMedia(file, (url) => setNewAttractionData((prev) => ({ ...prev, image_url: url })), 'new-attr-img');
                        }
                      }}
                    />
                  </label>
                </div>
                {newAttractionData.image_url && (
                  <div className="relative w-full max-w-sm aspect-[16/10] rounded-xl overflow-hidden border border-gold-500/30 mt-2 bg-black/60">
                    <img src={newAttractionData.image_url} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-35" />
                    <img src={newAttractionData.image_url} alt="Preview" className="relative z-10 w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newAttractionData.description || ''}
                  placeholder="Experience details, background, what seekers do..."
                  onChange={(e) => setNewAttractionData({ ...newAttractionData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gold-400 font-semibold block">
                  Highlights (One per line)
                </label>
                <textarea
                  rows={2}
                  value={(newAttractionData.highlights || []).join('\n')}
                  placeholder="Certified guides&#10;Evening sunset timings"
                  onChange={(e) =>
                    setNewAttractionData({
                      ...newAttractionData,
                      highlights: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gold-500/20">
              <button
                type="button"
                onClick={() => setShowAddAttractionModal(false)}
                className="px-5 py-2 rounded-full border border-gold-500/30 text-xs text-stone-subtle hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newAttractionData.title}
                onClick={async () => {
                  if (!newAttractionData.title) return;
                  const newAttr: RishikeshAttraction = {
                    id: `attr-${Date.now()}`,
                    title: newAttractionData.title.trim(),
                    category: newAttractionData.category || 'Adrenaline & Adventure',
                    duration: newAttractionData.duration?.trim() || '2 - 3 Hours',
                    location_tip: newAttractionData.location_tip?.trim() || 'Rishikesh Valley',
                    image_url:
                      newAttractionData.image_url?.trim() ||
                      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
                    description: newAttractionData.description?.trim() || '',
                    highlights:
                      newAttractionData.highlights && newAttractionData.highlights.length > 0
                        ? newAttractionData.highlights
                        : ['Experienced local guides', 'Serene Himalayan setting'],
                  };
                  const updated = [...attractions, newAttr];
                  setAttractions(updated);
                  setShowAddAttractionModal(false);
                  await saveContent('attractions', updated, `Attraction "${newAttr.title}" added and saved live!`);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Add Attraction</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
