import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Camera
} from 'lucide-react';
import { Booking, TechnicianApplication } from '../../types/index.ts';

interface TrackByMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  applications: TechnicianApplication[];
  onOpenBookingDetail?: (booking: Booking) => void;
}

const STATUS_STEPS = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'assigned', label: 'Tech Assigned' },
  { key: 'en_route', label: 'En Route' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

export const TrackByMobileModal: React.FC<TrackByMobileModalProps> = ({
  isOpen,
  onClose,
  bookings,
  applications,
}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'customer_booking' | 'technician_status'>('customer_booking');

  if (!isOpen) return null;

  // Clean phone input for comparison
  const cleanInput = mobileNumber.replace(/\D/g, '').slice(-10);

  const matchedBookings = bookings.filter((b) => {
    if (!cleanInput) return false;
    const bPhone = (b.customerPhone || '').replace(/\D/g, '').slice(-10);
    return bPhone.includes(cleanInput);
  });

  const matchedApplications = applications.filter((a) => {
    if (!cleanInput) return false;
    const aPhone = (a.phone || '').replace(/\D/g, '').slice(-10);
    return aPhone.includes(cleanInput);
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanInput || cleanInput.length < 5) return;
    setSearched(true);
  };

  const getStepProgressIndex = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'assigned': return 2;
      case 'en_route': return 3;
      case 'in_progress': return 4;
      case 'completed': return 5;
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-[#1A3C8F] to-indigo-800 text-white p-4 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer touch-manipulation"
            aria-label="Close track modal"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block mb-1">
            Instant Nagpur Status Finder
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            Track by Mobile Number
          </h2>
          <p className="text-xs text-blue-100 max-w-md mt-0.5">
            Enter your 10-digit phone number to track active doorstep bookings or technician partner approval.
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Tab Selection */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => { setActiveTab('customer_booking'); setSearched(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'customer_booking'
                  ? 'bg-[#1A3C8F] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Customer Doorstep Bookings
            </button>
            <button
              onClick={() => { setActiveTab('technician_status'); setSearched(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'technician_status'
                  ? 'bg-[#F97316] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Technician Partner Approval
            </button>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {activeTab === 'customer_booking' ? 'Customer Mobile Number' : 'Technician Registered Mobile'}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-xs font-bold text-slate-400">+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    setSearched(false);
                  }}
                  placeholder="Enter 10-digit mobile (e.g. 9822231456 or 8007700446)"
                  className="w-full pl-12 pr-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Track Live</span>
              </button>
            </div>

            {/* Quick Demo phone numbers */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Quick Track:</span>
              <button
                type="button"
                onClick={() => {
                  setMobileNumber('8007700446');
                  setSearched(true);
                }}
                className="px-2.5 py-1 rounded-md bg-blue-50 text-[#1A3C8F] font-bold border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                8007700446 (Flat 402, Kaushalya Apt, Dighori)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileNumber('9822231456');
                  setSearched(true);
                }}
                className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors cursor-pointer"
              >
                9822231456 (Dharampeth)
              </button>
            </div>
          </form>

          {/* Results: CUSTOMER BOOKINGS */}
          {activeTab === 'customer_booking' && searched && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {matchedBookings.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-slate-800">No active bookings found for +91 {cleanInput}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Check if you entered the phone number used during checkout, or book a new service.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Found {matchedBookings.length} booking(s) in Nagpur
                  </span>

                  {matchedBookings.map((b) => {
                    const stepIdx = getStepProgressIndex(b.status);

                    return (
                      <div
                        key={b.id}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
                      >
                        {/* Top Info */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#1A3C8F]">
                                {b.id}
                              </span>
                              <span className="text-[10px] text-slate-400">•</span>
                              <span className="text-[11px] text-slate-500">
                                {b.date} • {b.timeSlot}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-slate-900 mt-0.5">
                              {b.subServiceName}
                            </h4>
                            <p className="text-xs text-slate-500">{b.serviceName}</p>
                          </div>

                          <div className="text-right">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase block ${
                                b.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.status === 'en_route'
                                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                                  : 'bg-blue-100 text-[#1A3C8F]'
                              }`}
                            >
                              {b.status.replace('_', ' ')}
                            </span>
                            <span className="text-sm font-extrabold text-[#1A3C8F] mt-1 block">
                              ₹{b.totalAmount}
                            </span>
                          </div>
                        </div>

                        {/* Status timeline */}
                        <div className="py-1">
                          <div className="grid grid-cols-5 gap-1.5 text-center">
                            {STATUS_STEPS.map((s, idx) => (
                              <div key={s.key} className="space-y-1">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    stepIdx >= idx + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                                  }`}
                                />
                                <span className={`text-[9px] block truncate font-semibold ${
                                  stepIdx >= idx + 1 ? 'text-emerald-700' : 'text-slate-400'
                                }`}>
                                  {s.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Assigned Tech card & Locality */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Technician</span>
                            <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                              <span>{b.technicianName || 'Assigning nearest pro...'}</span>
                              {b.technicianRating && (
                                <span className="text-amber-500 font-bold text-[11px] flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>{b.technicianRating}</span>
                                </span>
                              )}
                            </div>
                            {b.technicianPhone && (
                              <a href={`tel:${b.technicianPhone}`} className="text-[11px] text-blue-600 font-semibold hover:underline mt-0.5 block">
                                📞 {b.technicianPhone}
                              </a>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Address</span>
                            <div className="font-semibold text-slate-800 mt-0.5">
                              {b.address.locality}, Nagpur ({b.address.pincode})
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">
                              {b.address.houseNo}, {b.address.street}
                            </div>
                          </div>
                        </div>

                        {/* Appliance Model & Photo Section */}
                        {(b.applianceModelNo || b.appliancePhotoUrl) && (
                          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                                <Camera className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                                  Appliance Specified
                                </span>
                                <div className="font-bold text-slate-900 text-xs">
                                  {b.applianceBrand ? `${b.applianceBrand} ` : ''}
                                  {b.applianceModelNo ? `(Model: ${b.applianceModelNo})` : ''}
                                </div>
                              </div>
                            </div>

                            {b.appliancePhotoUrl && (
                              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-amber-200 shadow-2xs">
                                <img
                                  src={b.appliancePhotoUrl}
                                  alt="Appliance attachment"
                                  className="w-8 h-8 rounded-md object-cover border border-slate-200"
                                />
                                <span className="text-[10px] font-bold text-emerald-700">Photo Verified</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Results: TECHNICIAN APPLICATION STATUS */}
          {activeTab === 'technician_status' && searched && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {matchedApplications.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-slate-800">No partner application for +91 {cleanInput}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Haven&apos;t joined yet? Submit an application to get your official TheEkit certification badge.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchedApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-purple-700">
                              App #{app.id}
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-xs text-slate-500">
                              Applied on {app.appliedDate}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5">
                            {app.name} ({app.locality}, Nagpur)
                          </h4>
                          <p className="text-xs text-blue-600 font-semibold mt-0.5">
                            Skills: {app.categories.join(', ')} • {app.experienceYears} Years Exp
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Admin feedback */}
                      {app.adminNotes && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <span className="font-bold text-slate-700 text-[10px] uppercase block mb-0.5">
                            Admin Status Notes:
                          </span>
                          <p className="text-slate-600">{app.adminNotes}</p>
                        </div>
                      )}

                      {/* If approved */}
                      {app.status === 'approved' && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between gap-3 text-emerald-950 font-medium">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span>
                              Congratulations! You are an approved TheEkit Technician in Nagpur.
                            </span>
                          </div>
                          <button
                            onClick={onClose}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 cursor-pointer"
                          >
                            Go to Dashboard
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
