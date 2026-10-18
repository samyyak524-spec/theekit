import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Plus, 
  PlusCircle, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Camera
} from 'lucide-react';
import { Booking } from '../../types/index.ts';
import { RateReviewModal } from './RateReviewModal.tsx';

interface CustomerDashboardProps {
  bookings: Booking[];
  onRefreshBookings: () => void;
  onBookNewService: () => void;
  onOpenAIDiagnostics: () => void;
}

const STATUS_STEPS = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'assigned', label: 'Technician Assigned' },
  { key: 'en_route', label: 'En Route' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  bookings,
  onRefreshBookings,
  onBookNewService,
  onOpenAIDiagnostics,
}) => {
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('active');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  // Cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (res.ok) {
        setConfirmCancelId(null);
        onRefreshBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeBookings = bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const displayedBookings = filterTab === 'active' 
    ? activeBookings 
    : filterTab === 'completed' 
    ? completedBookings 
    : bookings;

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
    <div className="py-8 bg-[#F8FAFC] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">
                Nagpur Customer Hub
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Active Account (+91 80077 00446)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
              Welcome back, Samyak
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Flat No. 402, Kaushalya Apartment, Dighori, Nagpur • Track live doorstep technician arrival & 30-day warranty.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAIDiagnostics}
              className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1A3C8F] text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-200 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Symptom Checker</span>
            </button>
            <button
              onClick={onBookNewService}
              className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Service</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setFilterTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              filterTab === 'active'
                ? 'bg-[#1A3C8F] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Active Bookings</span>
            {activeBookings.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#F97316] text-white text-[10px]">
                {activeBookings.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              filterTab === 'completed'
                ? 'bg-[#1A3C8F] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Completed & Warranty</span>
            <span className="text-[10px] text-slate-400">({completedBookings.length})</span>
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'all'
                ? 'bg-[#1A3C8F] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All ({bookings.length})
          </button>
        </div>

        {/* Bookings List */}
        {displayedBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No {filterTab} bookings found
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Need AC jet service, washing machine repair or electrical fitting in Nagpur?
            </p>
            <button
              onClick={onBookNewService}
              className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedBookings.map((booking) => {
              const currentStepIdx = getStepProgressIndex(booking.status);

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6"
                >
                  {/* Top Bar: Service title, ID & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          {booking.id}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium">
                          Booked for {booking.date} ({booking.timeSlot})
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                        {booking.subServiceName}
                      </h3>
                      <p className="text-xs text-slate-500">{booking.serviceName}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          booking.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : booking.status === 'en_route'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : booking.status === 'assigned'
                            ? 'bg-indigo-100 text-indigo-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {booking.status.replace('_', ' ')}
                      </span>
                      <span className="text-base font-extrabold text-[#1A3C8F]">
                        ₹{booking.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Real-time Timeline Stepper (for active / non-cancelled bookings) */}
                  {booking.status !== 'cancelled' && (
                    <div className="py-2">
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {STATUS_STEPS.map((s, idx) => {
                          const isDone = currentStepIdx >= idx + 1;
                          const isCurrent = currentStepIdx === idx + 1;

                          return (
                            <div key={s.key} className="space-y-1.5">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isDone
                                    ? 'bg-emerald-500'
                                    : isCurrent
                                    ? 'bg-[#F97316] animate-pulse'
                                    : 'bg-slate-200'
                                }`}
                              />
                              <span
                                className={`text-[10px] block font-bold truncate ${
                                  isDone
                                    ? 'text-emerald-700'
                                    : isCurrent
                                    ? 'text-[#F97316]'
                                    : 'text-slate-400'
                                }`}
                              >
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Technician Card & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Assigned Tech */}
                    {booking.technicianName ? (
                      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.technicianPhoto || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80'}
                            alt={booking.technicianName}
                            className="w-12 h-12 rounded-xl object-cover border border-white shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">
                                {booking.technicianName}
                              </span>
                              <div className="flex items-center text-amber-500 text-[11px] font-bold">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>{booking.technicianRating || 4.9}</span>
                              </div>
                            </div>
                            <span className="text-[11px] text-blue-800 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                              TheEkit Certified Pro
                            </span>
                          </div>
                        </div>

                        <a
                          href={`tel:${booking.technicianPhone}`}
                          className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 shadow-2xs transition-colors"
                          title="Call Technician"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Matching nearest Nagpur technician in {booking.address.locality}...</span>
                      </div>
                    )}

                    {/* Service Address & Notes */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>{booking.address.locality}, Nagpur ({booking.address.pincode})</span>
                      </div>
                      <p className="text-slate-500 pl-5 text-[11px]">
                        {booking.address.houseNo}, {booking.address.street}
                        {booking.address.landmark && ` • Landmark: ${booking.address.landmark}`}
                      </p>
                      {booking.notes && (
                        <p className="text-slate-500 pl-5 text-[11px] italic">
                          Note: &quot;{booking.notes}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Appliance Details & Photo if provided */}
                  {(booking.applianceModelNo || booking.appliancePhotoUrl) && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                            Appliance Identified for Technician
                          </span>
                          <div className="text-xs font-bold text-slate-900 mt-0.5">
                            {booking.applianceBrand ? `${booking.applianceBrand} ` : ''}
                            {booking.applianceModelNo ? `(Model: ${booking.applianceModelNo})` : ''}
                          </div>
                        </div>
                      </div>

                      {booking.appliancePhotoUrl && (
                        <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
                          <img
                            src={booking.appliancePhotoUrl}
                            alt="Appliance"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 block">Photo Attached</span>
                            <span className="text-[10px] text-slate-500">Shared with technician</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Payment Mode: <strong className="text-slate-800 uppercase">{booking.paymentMethod.replace('_', ' ')}</strong>
                      {' • '}
                      Status: <strong className="text-emerald-700 uppercase">{booking.paymentStatus}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Cancel allowed if pending/confirmed */}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        confirmCancelId === booking.id ? (
                          <div className="flex items-center gap-1.5 p-1 bg-red-50 rounded-xl border border-red-200 animate-in fade-in">
                            <span className="text-[11px] font-bold text-red-700 px-1">Cancel booking?</span>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px] hover:bg-red-700 transition-colors"
                            >
                              Yes, Cancel
                            </button>
                            <button
                              onClick={() => setConfirmCancelId(null)}
                              className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-semibold text-[11px] hover:bg-slate-50 transition-colors"
                            >
                              Keep
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmCancelId(booking.id)}
                            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Cancel Booking
                          </button>
                        )
                      )}

                      {/* Review allowed if completed */}
                      {booking.status === 'completed' && !booking.rating && (
                        <button
                          onClick={() => setSelectedBookingForReview(booking)}
                          className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>Rate Technician</span>
                        </button>
                      )}

                      {booking.rating && (
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>You rated: {booking.rating}★</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rate Review Modal */}
      <RateReviewModal
        booking={selectedBookingForReview}
        onClose={() => setSelectedBookingForReview(null)}
        onSubmitSuccess={onRefreshBookings}
      />
    </div>
  );
};
