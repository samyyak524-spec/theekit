import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Award, 
  Download, 
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Booking } from '../../types/index.ts';

interface BookingConfirmationModalProps {
  booking: Booking | null;
  onClose: () => void;
  onViewDashboard: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  onClose,
  onViewDashboard,
}) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] sm:max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Animated Success Banner */}
        <div className="bg-linear-to-b from-emerald-600 to-emerald-700 text-white p-5 sm:p-6 text-center shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-emerald-200 block mb-0.5">
            Booking Confirmed in Nagpur
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Appointment Booked!
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Booking ID: <strong className="font-mono text-white text-xs sm:text-sm bg-black/20 px-2 py-0.5 rounded-sm">{booking.id}</strong>
          </p>
        </div>

        {/* Content details */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Matched Technician Card */}
          {booking.technicianName ? (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center gap-4">
              <img
                src={booking.technicianPhoto || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80'}
                alt={booking.technicianName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A3C8F] bg-blue-100 px-2 py-0.5 rounded-full">
                    Assigned Nearest Tech
                  </span>
                  <div className="flex items-center text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                    <span>{booking.technicianRating || 4.9}</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                  {booking.technicianName}
                </h4>
                <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <a href={`tel:${booking.technicianPhone}`} className="hover:underline font-medium">
                    {booking.technicianPhone}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0 text-amber-600" />
              <span>We are broadcasting to certified technicians near {booking.address.locality}. Assignment in ~5 minutes!</span>
            </div>
          )}

          {/* Service & Schedule Breakdown */}
          <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center text-slate-800">
              <span className="font-semibold text-slate-500">Service:</span>
              <span className="font-bold text-[#1A3C8F]">{booking.subServiceName}</span>
            </div>
            <div className="flex justify-between items-center text-slate-800">
              <span className="font-semibold text-slate-500">Schedule:</span>
              <span className="font-medium">{booking.date} • {booking.timeSlot}</span>
            </div>
            <div className="flex justify-between items-start text-slate-800">
              <span className="font-semibold text-slate-500 shrink-0 mr-2">Address:</span>
              <span className="text-right text-slate-700">
                {booking.address.houseNo}, {booking.address.street}, {booking.address.locality} ({booking.address.pincode})
              </span>
            </div>
            {(booking.applianceModelNo || booking.appliancePhotoUrl) && (
              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                {booking.applianceModelNo && (
                  <div className="flex justify-between items-center text-slate-800">
                    <span className="font-semibold text-slate-500">Appliance Model:</span>
                    <span className="font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {booking.applianceBrand ? `${booking.applianceBrand} • ` : ''}{booking.applianceModelNo}
                    </span>
                  </div>
                )}
                {booking.appliancePhotoUrl && (
                  <div className="flex justify-between items-center text-slate-800">
                    <span className="font-semibold text-slate-500">Appliance Photo:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-emerald-700 font-semibold">Shared with Technician</span>
                      <img
                        src={booking.appliancePhotoUrl}
                        alt="Appliance provided"
                        className="w-9 h-9 rounded-lg object-cover border border-slate-300 shadow-2xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between items-center text-slate-800 pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-500">Payment Status:</span>
              <span className="font-bold uppercase text-emerald-600">
                {booking.paymentStatus === 'paid' ? 'Paid Online via UPI' : 'Pay On Doorstep'}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-900 font-extrabold text-sm pt-1">
              <span>Total Amount:</span>
              <span className="text-[#1A3C8F] text-base">₹{booking.totalAmount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>30-Day Guarantee Activated: Free re-service if the same issue persists. SMS & WhatsApp confirmation sent.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Download Receipt</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onViewDashboard();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#1A3C8F] hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track Booking in Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
