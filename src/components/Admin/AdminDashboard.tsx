import React, { useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  IndianRupee, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Plus, 
  Send, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Filter,
  Award
} from 'lucide-react';
import { 
  Technician, 
  TechnicianApplication, 
  Booking, 
  Review, 
  NotificationAnnouncement, 
  ServiceCategory 
} from '../../types/index.ts';

interface AdminDashboardProps {
  technicians: Technician[];
  applications: TechnicianApplication[];
  bookings: Booking[];
  reviews: Review[];
  announcements: NotificationAnnouncement[];
  services: ServiceCategory[];
  onRefreshData: () => void;
  activeAdminTab?: string;
  onAdminTabChange?: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  technicians,
  applications,
  bookings,
  reviews,
  announcements,
  services,
  onRefreshData,
  activeAdminTab = 'overview',
  onAdminTabChange,
}) => {
  const [currentTab, setCurrentTab] = useState<'overview' | 'applications' | 'bookings' | 'services' | 'reviews' | 'announcements'>('overview');

  // Active review audit modal
  const [selectedApp, setSelectedApp] = useState<TechnicianApplication | null>(null);
  const [aiAuditing, setAiAuditing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Booking reassignment state
  const [selectedBookingToReassign, setSelectedBookingToReassign] = useState<Booking | null>(null);
  const [reassignTechId, setReassignTechId] = useState('');

  // Announcement composer
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annAudience, setAnnAudience] = useState<'all' | 'customers' | 'technicians'>('all');
  const [annSending, setAnnSending] = useState(false);

  // Price adjustment state
  const [editingSubServicePrice, setEditingSubServicePrice] = useState<{ catId: string; subId: string; price: number } | null>(null);

  // Search & Filters
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [searchAppQuery, setSearchAppQuery] = useState('');

  // Calculations for KPIs
  const totalRevenue = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const pendingApps = applications.filter((a) => a.status === 'submitted' || a.status === 'under_review');
  const activeBookingsCount = bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled').length;

  // Run AI Audit on Technician Application
  const handleRunAiAudit = async (appId: string) => {
    setAiAuditing(true);
    try {
      const res = await fetch('/api/gemini/audit-technician', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId }),
      });
      const data = await res.json();
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, aiAuditResult: data });
      }
      onRefreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setAiAuditing(false);
    }
  };

  // Approve and certify application
  const handleApproveApp = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          notes: 'Application approved by TheEkit Admin. Digital certification issued.',
        }),
      });
      if (res.ok) {
        setToastMessage('Technician application approved! Digital certification generated and profile added to Nagpur directory.');
        setSelectedApp(null);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reject application
  const handleRejectApp = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          notes: rejectReason || 'Documentation or background criteria did not meet standards.',
        }),
      });
      if (res.ok) {
        setSelectedApp(null);
        setShowRejectInput(false);
        setRejectReason('');
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reassign technician
  const handleConfirmReassign = async () => {
    if (!selectedBookingToReassign || !reassignTechId) return;

    try {
      const res = await fetch(`/api/bookings/${selectedBookingToReassign.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicianId: reassignTechId }),
      });
      if (res.ok) {
        setSelectedBookingToReassign(null);
        setReassignTechId('');
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Review Visibility
  const handleToggleReview = async (revId: string, currentStatus: 'visible' | 'hidden') => {
    const nextStatus = currentStatus === 'visible' ? 'hidden' : 'visible';
    try {
      await fetch(`/api/reviews/${revId}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Send Announcement
  const handleSendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;

    setAnnSending(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle.trim(),
          message: annMessage.trim(),
          targetAudience: annAudience,
          channel: 'push',
        }),
      });
      if (res.ok) {
        setAnnTitle('');
        setAnnMessage('');
        setToastMessage('Notification broadcasted to Nagpur users!');
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnnSending(false);
    }
  };

  const filteredBookings = bookingStatusFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === bookingStatusFilter);

  return (
    <div className="py-8 bg-[#F8FAFC] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                TheEkit Admin Command Center
              </span>
              <span className="text-[10px] text-slate-400">Nagpur Municipal Region</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Platform Operations & Quality Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review technician applications with Gemini AI, oversee bookings, manage service rates, and broadcast updates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('applications')}
              className="px-4 py-2.5 rounded-xl bg-[#1A3C8F] hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Review Applications ({pendingApps.length})</span>
            </button>
          </div>
        </div>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold px-2 py-0.5 rounded cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Pending Technician Approval Direct Action Banner */}
        {pendingApps.length > 0 && (
          <div className="p-4 rounded-2xl bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                <Award className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Action Needed ({pendingApps.length} Technician)
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {pendingApps[0].name} ({pendingApps[0].locality}, Nagpur)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Mobile: <strong>{pendingApps[0].phone}</strong> • Skills: {pendingApps[0].categories.join(', ')} • {pendingApps[0].experienceYears} yrs exp.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleApproveApp(pendingApps[0].id)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                title="1-Click Approve and Issue Certification Badge"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Approve & Certify {pendingApps[0].name.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedApp(pendingApps[0]);
                  setCurrentTab('applications');
                }}
                className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
              >
                Inspect
              </button>
            </div>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'overview', label: 'Overview & KPIs' },
            { id: 'applications', label: `Technician Applications (${pendingApps.length} Pending)` },
            { id: 'bookings', label: `All Bookings (${bookings.length})` },
            { id: 'services', label: 'Services & Pricing' },
            { id: 'reviews', label: `Reviews Moderation (${reviews.length})` },
            { id: 'announcements', label: 'Broadcast Announcements' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentTab === tab.id
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & KPIS */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Total Bookings
                </span>
                <div className="text-2xl font-extrabold text-slate-900">{bookings.length}</div>
                <div className="text-[11px] text-blue-600 font-semibold mt-1">
                  {activeBookingsCount} active right now
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Active Technicians
                </span>
                <div className="text-2xl font-extrabold text-slate-900">{technicians.length}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  100% Aadhaar Verified in Nagpur
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Pending Applications
                </span>
                <div className="text-2xl font-extrabold text-amber-600">{pendingApps.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Awaiting background & skill review
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Completed Revenue
                </span>
                <div className="text-2xl font-extrabold text-[#1A3C8F]">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Includes 15% platform commission
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Bookings Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 cols: Recent Bookings */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">Recent Nagpur Bookings</h3>
                  <button
                    onClick={() => setCurrentTab('bookings')}
                    className="text-xs text-[#1A3C8F] font-bold hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {bookings.slice(0, 4).map((b) => (
                    <div key={b.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{b.subServiceName}</div>
                        <div className="text-slate-500 text-[11px]">
                          {b.customerName} • {b.address.locality}, Nagpur
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#1A3C8F]">₹{b.totalAmount}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-[#1A3C8F]'
                          }`}
                        >
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right col: Pending Applications Quick Widget */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">Partner Applications</h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {pendingApps.length} Action Needed
                  </span>
                </div>

                {pendingApps.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No pending applications.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingApps.map((app) => (
                      <div key={app.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{app.name}</span>
                          <span className="text-[10px] text-slate-400">{app.locality}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {app.experienceYears} yrs • {app.categories.slice(0, 2).join(', ')}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setCurrentTab('applications');
                          }}
                          className="w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>AI Audit & Review</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TECHNICIAN APPLICATIONS & CERTIFICATION */}
        {currentTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Technician Applications & Certification Desk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review background documents and generate verified digital certification badges.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchAppQuery}
                      onChange={(e) => setSearchAppQuery(e.target.value)}
                      placeholder="Search name or locality..."
                      className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3">Applicant</th>
                      <th className="px-5 py-3">Nagpur Locality</th>
                      <th className="px-5 py-3">Experience & Skills</th>
                      <th className="px-5 py-3">Aadhaar Proof</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900">{app.name}</div>
                          <div className="text-[10px] text-slate-400">{app.phone} • {app.email}</div>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-700">
                          {app.locality}, Nagpur
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-slate-800">{app.experienceYears} Years</div>
                          <div className="text-[10px] text-blue-600 font-semibold">{app.categories.join(', ')}</div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-600">
                          {app.aadhaarNumber}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              app.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}
                          >
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 flex items-center gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-purple-600" />
                            <span>Audit & Review</span>
                          </button>
                          {app.status !== 'approved' && (
                            <button
                              onClick={() => handleApproveApp(app.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="Instantly approve and issue Nagpur digital certificate badge"
                            >
                              <Award className="w-3 h-3 text-amber-300" />
                              <span>Approve</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Application Detail & AI Audit Review Modal */}
            {selectedApp && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                        Application Review #{selectedApp.id}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                        {selectedApp.name} ({selectedApp.locality}, Nagpur)
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Summary Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-bold block">Contact</span>
                      <div className="font-semibold text-slate-800">{selectedApp.phone} • {selectedApp.email}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-bold block">Aadhaar Card</span>
                      <div className="font-mono font-bold text-slate-800">{selectedApp.aadhaarNumber}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-bold block">Years Experience</span>
                      <div className="font-semibold text-slate-800">{selectedApp.experienceYears} Years in Field</div>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-bold block">Trade Categories</span>
                      <div className="font-bold text-[#1A3C8F]">{selectedApp.categories.join(', ')}</div>
                    </div>
                  </div>

                  {/* Document previews */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                      Submitted Verification Documents
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
                        <img
                          src={selectedApp.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80'}
                          alt="Applicant"
                          className="w-20 h-20 rounded-xl object-cover mx-auto mb-2 border border-white shadow-xs"
                        />
                        <span className="text-[11px] font-semibold text-slate-700 block">Profile Badge Photo</span>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
                        <div className="w-20 h-20 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2 font-bold text-xs">
                          AADHAAR
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 block">Aadhaar Copy Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Audit Section (Powered by Gemini) */}
                  <div className="p-4 rounded-2xl bg-linear-to-r from-purple-50 to-indigo-50 border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                          Gemini 3.8 Application Vetting Intelligence
                        </span>
                      </div>
                      <button
                        onClick={() => handleRunAiAudit(selectedApp.id)}
                        disabled={aiAuditing}
                        className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        {aiAuditing ? 'Auditing...' : 'Run / Re-run AI Audit'}
                      </button>
                    </div>

                    {selectedApp.aiAuditResult ? (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-purple-100">
                          <span className="font-bold text-purple-900">
                            Verification Credibility Score:
                          </span>
                          <span className="font-extrabold text-sm text-purple-700">
                            {selectedApp.aiAuditResult.verificationScore} / 100
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {selectedApp.aiAuditResult.summary}
                        </p>
                        <div>
                          <span className="font-bold text-emerald-800 text-[11px] block">Verified Strengths:</span>
                          <ul className="list-disc pl-4 text-slate-600 text-[11px]">
                            {selectedApp.aiAuditResult.strengths?.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-purple-800">
                        Click &quot;Run AI Audit&quot; to evaluate applicant background, local Nagpur ward demand, and fraud risk score.
                      </p>
                    )}
                  </div>

                  {/* Reject reason input */}
                  {showRejectInput && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-red-700 uppercase">
                        Reason for Rejection (sent to applicant)
                      </label>
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g. Incomplete ID document or invalid trade license"
                        className="w-full text-xs p-2.5 rounded-xl border border-red-200 bg-red-50"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    {!showRejectInput ? (
                      <button
                        onClick={() => setShowRejectInput(true)}
                        className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                      >
                        Reject Application
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRejectApp(selectedApp.id)}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                      >
                        Confirm Rejection
                      </button>
                    )}

                    <button
                      onClick={() => handleApproveApp(selectedApp.id)}
                      className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Approve & Issue Nagpur Certification Badge</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOOKINGS MANAGEMENT */}
        {currentTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Nagpur Customer Bookings</h3>
                <p className="text-xs text-slate-500">Track job lifecycles and reassign technicians as needed.</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="text-xs rounded-xl border border-slate-200 px-3 py-1.5 bg-slate-50 font-semibold"
                >
                  <option value="all">All Statuses ({bookings.length})</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="assigned">Assigned</option>
                  <option value="en_route">En Route</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Booking ID</th>
                    <th className="px-5 py-3">Customer & Locality</th>
                    <th className="px-5 py-3">Service</th>
                    <th className="px-5 py-3">Assigned Tech</th>
                    <th className="px-5 py-3">Date/Time</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-mono font-bold text-[#1A3C8F]">{b.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{b.customerName}</div>
                        <div className="text-[10px] text-slate-500">{b.address.locality}, Nagpur</div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        <div>{b.subServiceName}</div>
                        {(b.applianceModelNo || b.appliancePhotoUrl) && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200 w-fit font-medium">
                            <span>{b.applianceBrand ? `${b.applianceBrand} ` : ''}{b.applianceModelNo || 'Appliance details'}</span>
                            {b.appliancePhotoUrl && (
                              <a
                                href={b.appliancePhotoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline font-bold"
                              >
                                [Photo]
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-700">
                        {b.technicianName || <span className="text-amber-600 font-bold">Unassigned</span>}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {b.date} • {b.timeSlot}
                      </td>
                      <td className="px-5 py-3.5 font-extrabold text-slate-900">₹{b.totalAmount}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-[#1A3C8F]'
                          }`}
                        >
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setSelectedBookingToReassign(b)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          Reassign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reassign Modal */}
            {selectedBookingToReassign && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-base text-slate-900">
                      Reassign Technician for {selectedBookingToReassign.id}
                    </h3>
                    <button
                      onClick={() => setSelectedBookingToReassign(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-600">
                    Customer is in <strong>{selectedBookingToReassign.address.locality}, Nagpur</strong> for <strong>{selectedBookingToReassign.subServiceName}</strong>.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Choose Available Certified Technician
                    </label>
                    <select
                      value={reassignTechId}
                      onChange={(e) => setReassignTechId(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50"
                    >
                      <option value="">Select Technician...</option>
                      {technicians.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} (Rating: {t.rating}★, Localities: {t.localities.slice(0, 2).join(', ')})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedBookingToReassign(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmReassign}
                      disabled={!reassignTechId}
                      className="px-5 py-2 rounded-xl bg-[#1A3C8F] text-white font-bold text-xs shadow-xs hover:bg-blue-800 disabled:opacity-50"
                    >
                      Confirm Reassignment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SERVICES & PRICING */}
        {currentTab === 'services' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Service Catalog & Nagpur Pricing Tiers
              </h3>
              <p className="text-xs text-slate-500">
                Manage service base rates and sub-services active across Nagpur.
              </p>
            </div>

            <div className="space-y-6">
              {services.map((svc) => (
                <div key={svc.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{svc.name}</h4>
                      <span className="text-[11px] text-slate-500">{svc.tagline}</span>
                    </div>
                    <span className="text-xs font-bold text-[#1A3C8F] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      Starts at ₹{svc.startingPrice}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                    {svc.subServices.map((sub) => (
                      <div key={sub.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-800">{sub.name}</div>
                          <div className="text-[10px] text-slate-400">~{sub.durationMinutes} mins</div>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-sm text-[#1A3C8F]">₹{sub.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS MODERATION */}
        {currentTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Nagpur Customer Reviews Moderation</h3>
              <p className="text-xs text-slate-500">Audit reviews for foul language or spam and toggle public visibility.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rev.customerName}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">Technician: <strong>{rev.technicianName}</strong></span>
                      <span className="text-amber-500 font-bold">({rev.rating}★)</span>
                    </div>
                    <p className="text-slate-700 italic">&quot;{rev.comment}&quot;</p>
                    <span className="text-[10px] text-slate-400">{rev.date} • Service: {rev.serviceName}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleReview(rev.id, rev.status)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors ${
                        rev.status === 'visible'
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {rev.status === 'visible' ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide Review</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Publish Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: BROADCAST ANNOUNCEMENTS */}
        {currentTab === 'announcements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Broadcast City Announcement</h3>
                <p className="text-xs text-slate-500">
                  Send push alerts, SMS, or emails to all customers or technicians in Nagpur.
                </p>
              </div>

              <form onSubmit={handleSendAnnouncement} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                    Target Audience
                  </label>
                  <select
                    value={annAudience}
                    onChange={(e) => setAnnAudience(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="all">All Nagpur Users (Customers & Technicians)</option>
                    <option value="customers">Nagpur Customers Only</option>
                    <option value="technicians">Nagpur Certified Technicians Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                    Notification Title
                  </label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Nagpur Summer AC Pre-Season Alert"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase text-[10px] mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={annMessage}
                    onChange={(e) => setAnnMessage(e.target.value)}
                    placeholder="e.g. Schedule your AC foam jet cleaning early before peak Nagpur heat. 20% off with code NAGPUR50!"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={annSending}
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{annSending ? 'Broadcasting...' : 'Send Broadcast Alert'}</span>
                </button>
              </form>
            </div>

            {/* Sent Announcements History */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h3 className="font-bold text-base text-slate-900">Sent Broadcasts</h3>
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{ann.title}</span>
                      <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        {ann.targetAudience}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{ann.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">{ann.sentAt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
