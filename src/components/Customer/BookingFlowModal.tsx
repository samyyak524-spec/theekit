import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Tag, 
  Smartphone,
  Banknote,
  AlertCircle,
  Camera,
  UploadCloud,
  Trash2,
  Image as ImageIcon,
  Info
} from 'lucide-react';
import { ServiceCategory, SubService, Booking } from '../../types/index.ts';
import { NAGPUR_LOCALITIES, calculatePriceBreakdown } from '../../utils/matching.ts';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceCategory | null;
  subService: SubService | null;
  preselectedLocality: string;
  onBookingSuccess: (booking: Booking) => void;
  initialNotes?: string;
  initialDiscountCode?: string;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  service,
  subService,
  preselectedLocality,
  onBookingSuccess,
  initialNotes = '',
  initialDiscountCode,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');

  // Address states
  const [customerName, setCustomerName] = useState('Samyak');
  const [customerPhone, setCustomerPhone] = useState('+91 80077 00446');
  const [houseNo, setHouseNo] = useState('Flat No. 402, Kaushalya Apartment');
  const [street, setStreet] = useState('Near Ring Road');
  const [locality, setLocality] = useState(preselectedLocality || 'Dighori');
  const [landmark, setLandmark] = useState('Kaushalya Apartment, Dighori');
  const [notes, setNotes] = useState(initialNotes);

  // Appliance model & photo states
  const [applianceBrand, setApplianceBrand] = useState('LG');
  const [applianceModelNo, setApplianceModelNo] = useState('MS-Q18ENZA');
  const [appliancePhotoUrl, setAppliancePhotoUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);

  // Payment states
  const [discountCode, setDiscountCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | undefined>(initialDiscountCode || 'NAGPUR50');
  const [paymentMethod, setPaymentMethod] = useState<'upi_razorpay' | 'cash_on_service'>('upi_razorpay');
  const [showRazorpaySim, setShowRazorpaySim] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !service || !subService) return null;

  const currentPincode = NAGPUR_LOCALITIES[locality]?.pincode || '440010';
  const priceBreakdown = calculatePriceBreakdown(subService.price, appliedCode);

  const handleApplyCoupon = () => {
    const code = discountCode.trim().toUpperCase();
    if (['NAGPUR50', 'THEEKITNEW', 'DIWALI20', 'FESTIVE25', 'FIRST150', 'SUMMER75'].includes(code)) {
      setAppliedCode(code);
      setError(null);
    } else {
      setError('Invalid coupon. Try "THEEKITNEW", "NAGPUR50", or "DIWALI20"!');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAppliancePhotoUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: 'samyak@theekit.in',
        serviceId: service.id,
        serviceName: service.name,
        subServiceId: subService.id,
        subServiceName: subService.name,
        baseAmount: subService.price,
        discountCode: appliedCode,
        date,
        timeSlot,
        address: {
          houseNo: houseNo.trim(),
          street: street.trim(),
          locality,
          pincode: currentPincode,
          landmark: landmark.trim() || undefined,
        },
        paymentMethod,
        notes: notes.trim() || undefined,
        applianceBrand: applianceBrand.trim() || undefined,
        applianceModelNo: applianceModelNo.trim() || undefined,
        appliancePhotoUrl: appliancePhotoUrl || undefined,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Booking could not be created');
      }

      const bookingData: Booking = await res.json();
      onBookingSuccess(bookingData);
    } catch (err) {
      console.error(err);
      setError('Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
      setShowRazorpaySim(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header & Steps Progress */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Nagpur Doorstep Appointment
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">Book {service.name}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors touch-manipulation cursor-pointer"
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Bar - Responsive on mobile */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center text-xs">
            {[
              { num: 1, label: 'Appliance' },
              { num: 2, label: 'Schedule' },
              { num: 3, label: 'Address' },
              { num: 4, label: 'Payment' },
            ].map((s) => (
              <div key={s.num} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    step >= s.num ? 'bg-[#F97316]' : 'bg-slate-700'
                  }`}
                />
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold block truncate ${
                    step >= s.num ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  <span className="hidden sm:inline">Step </span>{s.num}: {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Body content based on step */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: SERVICE & APPLIANCE CONFIRMATION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A3C8F] block mb-1">
                  Selected Package
                </span>
                <h4 className="text-base font-bold text-slate-900">{subService.name}</h4>
                <p className="text-xs text-slate-600 mt-1">{subService.description}</p>
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-blue-200/60">
                  <span className="text-xs text-slate-500 font-medium">Estimated Time: ~{subService.durationMinutes} mins</span>
                  <span className="text-base font-extrabold text-[#1A3C8F]">₹{subService.price}</span>
                </div>
              </div>

              {/* APPLIANCE MODEL NO. & PHOTO SECTION */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0 mt-0.5">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          Appliance Model & Photo
                        </h5>
                        <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full border border-amber-300">
                          Recommended
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-900/80 block mt-0.5">
                        Helps technician bring exact spares on arrival
                      </span>
                    </div>
                  </div>
                </div>

                {/* Brand selection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Brand / Make
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['LG', 'Samsung', 'Voltas', 'Daikin', 'Whirlpool', 'IFB', 'Godrej', 'Bosch', 'Other'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setApplianceBrand(b)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          applianceBrand === b
                            ? 'bg-[#1A3C8F] text-white shadow-2xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Appliance Model Number
                    </label>
                    <span className="text-[10px] text-slate-500 italic">
                      Check side sticker or invoice
                    </span>
                  </div>
                  <input
                    type="text"
                    value={applianceModelNo}
                    onChange={(e) => setApplianceModelNo(e.target.value)}
                    placeholder="e.g. MS-Q18ENZA or 183V Vectra Prism"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F] font-medium text-slate-900"
                  />
                </div>

                {/* Appliance Photo Upload */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Photo of Appliance / Nameplate / Fault
                  </label>

                  {/* Hidden file input for file picker */}
                  <input
                    type="file"
                    id="appliance-photo-input"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {/* Hidden camera input with capture attribute for mobile devices */}
                  <input
                    type="file"
                    id="appliance-camera-input"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {appliancePhotoUrl ? (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={appliancePhotoUrl}
                          alt="Uploaded Appliance"
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0 shadow-xs"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Photo Attached for Technician</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {photoFileName || 'appliance_photo.jpg'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <label
                          htmlFor="appliance-photo-input"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer touch-manipulation"
                        >
                          Change
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setAppliancePhotoUrl(null);
                            setPhotoFileName(null);
                          }}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer touch-manipulation"
                          title="Remove photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Mobile Camera Button */}
                        <label
                          htmlFor="appliance-camera-input"
                          className="border-2 border-dashed border-amber-300 hover:border-amber-400 bg-white/90 hover:bg-white rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group touch-manipulation text-center"
                        >
                          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                            <Camera className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-bold text-slate-800">
                              Take Photo
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Use phone camera
                            </div>
                          </div>
                        </label>

                        {/* File Upload Button */}
                        <label
                          htmlFor="appliance-photo-input"
                          className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white/90 hover:bg-white rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group touch-manipulation text-center"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#1A3C8F] shrink-0">
                            <UploadCloud className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-bold text-slate-800">
                              Upload File
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Select from gallery
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* Quick sample demo buttons for desktop & mobile convenience */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 pt-0.5">
                        <span className="font-semibold text-slate-700">Quick Test Samples:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAppliancePhotoUrl('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80');
                            setPhotoFileName('voltas_split_ac_unit.jpg');
                            setApplianceBrand('Voltas');
                            setApplianceModelNo('183V Vectra Prism');
                          }}
                          className="px-2 py-0.5 rounded-md bg-amber-100/80 hover:bg-amber-200 text-amber-900 font-medium transition-colors cursor-pointer touch-manipulation"
                        >
                          + AC Unit Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAppliancePhotoUrl('https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80');
                            setPhotoFileName('lg_front_load_washing.jpg');
                            setApplianceBrand('LG');
                            setApplianceModelNo('FHT1408ZWL (8kg)');
                          }}
                          className="px-2 py-0.5 rounded-md bg-amber-100/80 hover:bg-amber-200 text-amber-900 font-medium transition-colors cursor-pointer touch-manipulation"
                        >
                          + Washing Machine Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAppliancePhotoUrl('https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80');
                            setPhotoFileName('samsung_fridge_model.jpg');
                            setApplianceBrand('Samsung');
                            setApplianceModelNo('RT28T3022GS (Double Door)');
                          }}
                          className="px-2 py-0.5 rounded-md bg-amber-100/80 hover:bg-amber-200 text-amber-900 font-medium transition-colors cursor-pointer touch-manipulation"
                        >
                          + Fridge Photo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  What&apos;s Included in this Job
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {subService.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Job Specific Notes / Instructions for Technician
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Balcony 2nd floor, bring ladder, dog at home..."
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: SCHEDULE */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#1A3C8F]" />
                  <span>Choose Service Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#1A3C8F]" />
                  <span>Select Arrival Time Slot (Nagpur Local)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { label: 'Morning Slot', time: '10:00 AM - 12:00 PM' },
                    { label: 'Afternoon Slot', time: '02:00 PM - 04:00 PM' },
                    { label: 'Evening Slot', time: '04:00 PM - 06:00 PM' },
                    { label: 'Late Evening Slot', time: '06:00 PM - 08:00 PM' },
                  ].map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setTimeSlot(slot.time)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        timeSlot === slot.time
                          ? 'border-[#1A3C8F] bg-blue-50/80 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {slot.label}
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">
                        {slot.time}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: NAGPUR ADDRESS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone (for OTP & Technician call)
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nagpur Locality / Ward
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                >
                  {Object.keys(NAGPUR_LOCALITIES).map((loc) => (
                    <option key={loc} value={loc}>
                      {loc} (Pincode: {NAGPUR_LOCALITIES[loc].pincode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    House / Flat No & Building
                  </label>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    placeholder="e.g. Flat 301, Shiv Regency"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Street / Road / Colony
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. WHC Road, Dharampeth"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nearby Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Coffee House Square"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1A3C8F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={currentPincode}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-2.5 bg-slate-100 text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & PAYMENT */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-800">
                  <span className="font-semibold">Service:</span>
                  <span className="font-bold text-[#1A3C8F]">{subService.name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span className="font-semibold">Scheduled Date & Slot:</span>
                  <span>{date} • {timeSlot}</span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span className="font-semibold">Address:</span>
                  <span className="max-w-[260px] truncate text-right">
                    {houseNo}, {street}, {locality} ({currentPincode})
                  </span>
                </div>
                {(applianceModelNo || appliancePhotoUrl) && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                    {applianceModelNo && (
                      <div className="flex justify-between items-center text-slate-800">
                        <span className="font-semibold text-slate-500">Appliance Model:</span>
                        <span className="font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {applianceBrand} • {applianceModelNo}
                        </span>
                      </div>
                    )}
                    {appliancePhotoUrl && (
                      <div className="flex justify-between items-center text-slate-800">
                        <span className="font-semibold text-slate-500">Appliance Photo:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Attached
                          </span>
                          <img
                            src={appliancePhotoUrl}
                            alt="Appliance thumbnail"
                            className="w-8 h-8 rounded-lg object-cover border border-slate-300 shadow-2xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Coupon Code Section */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#F97316] shrink-0" />
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter coupon (e.g. NAGPUR50)"
                    className="flex-1 text-xs uppercase font-bold focus:outline-hidden text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {appliedCode && (
                  <div className="mt-1.5 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Coupon &apos;{appliedCode}&apos; applied! You saved ₹{priceBreakdown.discount}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-b border-slate-200 py-3">
                <div className="flex justify-between">
                  <span>Base Package Rate:</span>
                  <span className="font-semibold text-slate-900">₹{priceBreakdown.basePrice}</span>
                </div>
                {priceBreakdown.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Voucher Discount:</span>
                    <span>-₹{priceBreakdown.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Nagpur Safety & Platform Fee:</span>
                  <span>₹{priceBreakdown.platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{priceBreakdown.gstAmount}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount Payable:</span>
                  <span className="text-base text-[#1A3C8F]">₹{priceBreakdown.totalPayable}</span>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi_razorpay')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      paymentMethod === 'upi_razorpay'
                        ? 'border-[#1A3C8F] bg-blue-50/80 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Online UPI / Razorpay</div>
                      <div className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm, Cards</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_service')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      paymentMethod === 'cash_on_service'
                        ? 'border-[#F97316] bg-orange-50/80 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Pay on Doorstep</div>
                      <div className="text-[10px] text-slate-500">Cash or UPI after service completion</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Razorpay Simulation Modal */}
              {showRazorpaySim && (
                <div className="p-4 rounded-2xl bg-indigo-900 text-white space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-indigo-800 pb-2">
                    <span className="text-xs font-bold tracking-wider text-indigo-200">
                      RAZORPAY SECURE PAYMENT GATEWAY (TEST MODE)
                    </span>
                    <span className="text-xs font-extrabold text-amber-300">
                      ₹{priceBreakdown.totalPayable}
                    </span>
                  </div>
                  <div className="text-xs text-indigo-200">
                    Simulating instant UPI payment for {customerName} ({customerPhone})...
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={submitting}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? 'Confirming with Bank & Dispatching...' : 'Simulate Successful UPI Payment & Confirm'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions - Sticky & Mobile Touch Optimized */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer touch-manipulation"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 3 && (!houseNo.trim() || !street.trim())) {
                  setError('Please fill in your house/building and street address.');
                  return;
                }
                setError(null);
                setStep((step + 1) as 1 | 2 | 3 | 4);
              }}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-[#1A3C8F] hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                if (paymentMethod === 'upi_razorpay') {
                  setShowRazorpaySim(true);
                } else {
                  handleConfirmBooking();
                }
              }}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer touch-manipulation active:scale-95"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Matching Nearest Technician...</span>
                </>
              ) : (
                <>
                  <span>Confirm Booking (₹{priceBreakdown.totalPayable})</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
