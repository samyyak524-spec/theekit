import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Award, 
  Star, 
  ArrowRight, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Tag,
  Gift,
  Flame,
  Percent,
  Zap,
  BadgePercent
} from 'lucide-react';
import { NAGPUR_LOCALITIES } from '../../utils/matching.ts';

interface PromoOffer {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  discount: string;
  description: string;
  couponCode: string;
  serviceId: string;
  serviceName: string;
  expiryText: string;
  gradientBg: string;
  accentText: string;
}

const PROMO_OFFERS: PromoOffer[] = [
  {
    id: 'promo-festive',
    badge: 'FESTIVE SEASON SPECIAL',
    badgeColor: 'bg-amber-300 text-amber-950',
    title: 'Gudi Padwa & Nagpur Festive Mahotsav',
    discount: 'FLAT 20% OFF',
    description: 'Festive savings across all AC, Refrigerator, Geyser & Washing Machine repair services in Nagpur.',
    couponCode: 'DIWALI20',
    serviceId: 'ac-repair',
    serviceName: 'AC Repair & Jet Servicing',
    expiryText: 'Valid on bookings above ₹399 • 30-Day Doorstep Guarantee',
    gradientBg: 'from-amber-600 via-orange-600 to-red-600',
    accentText: 'text-amber-100',
  },
  {
    id: 'promo-first-time',
    badge: 'FIRST TIME USER EXCLUSIVE',
    badgeColor: 'bg-emerald-300 text-slate-950',
    title: 'New to TheEkit? Welcome Gift ₹100 Flat Off',
    discount: '₹100 FLAT CASH OFF',
    description: 'Book your first doorstep appliance technician in Nagpur and get ₹100 flat instant deduction.',
    couponCode: 'THEEKITNEW',
    serviceId: 'washing-machine',
    serviceName: 'All Appliance Services',
    expiryText: 'Valid on your first verified Nagpur mobile booking',
    gradientBg: 'from-[#1A3C8F] via-blue-700 to-indigo-800',
    accentText: 'text-cyan-200',
  },
  {
    id: 'promo-summer-cool',
    badge: 'NAGPUR SUMMER BLAST',
    badgeColor: 'bg-cyan-300 text-slate-950',
    title: 'Nagpur AC Foam Jet Clean & Gas Inspection',
    discount: '₹50 OFF + FREE CHECK',
    description: 'Beat 44°C Nagpur heat! High-pressure foam spray wash with 20-point diagnostic inspection & ammeter test.',
    couponCode: 'NAGPUR50',
    serviceId: 'ac-repair',
    serviceName: 'AC Deep Servicing',
    expiryText: 'Priority same-day arrival across all 18 Nagpur wards',
    gradientBg: 'from-teal-700 via-cyan-800 to-blue-900',
    accentText: 'text-teal-200',
  },
  {
    id: 'promo-combo-saver',
    badge: 'MULTI-APPLIANCE COMBO',
    badgeColor: 'bg-purple-300 text-purple-950',
    title: 'Double Appliance Repair Super Saver',
    discount: 'FLAT 25% OFF',
    description: 'Combine AC + Fridge or Washing Machine repair in one technician visit and save 25% on total labor.',
    couponCode: 'FESTIVE25',
    serviceId: 'refrigerator',
    serviceName: 'Multi-Appliance Servicing',
    expiryText: 'Single doorstep visit • Maximum savings for homes',
    gradientBg: 'from-purple-800 via-violet-700 to-rose-700',
    accentText: 'text-pink-200',
  },
];

interface LandingHeroProps {
  selectedLocality: string;
  onLocalityChange: (locality: string) => void;
  onSelectService: (serviceId: string, promoCode?: string) => void;
  onOpenAIDiagnostics: () => void;
  onOpenTrackByMobile?: () => void;
  onApplyPromoCoupon?: (promoCode: string, categoryId?: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  selectedLocality,
  onLocalityChange,
  onSelectService,
  onOpenAIDiagnostics,
  onOpenTrackByMobile,
  onApplyPromoCoupon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Auto carousel rotation
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % PROMO_OFFERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Touch swipe gesture handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 40; // minimum 40px swipe
    if (distance > minSwipeDistance) {
      // Swiped left -> next slide
      setActiveSlide((prev) => (prev + 1) % PROMO_OFFERS.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev slide
      setActiveSlide((prev) => (prev - 1 + PROMO_OFFERS.length) % PROMO_OFFERS.length);
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleApplyOffer = (offer: PromoOffer) => {
    if (onApplyPromoCoupon) {
      onApplyPromoCoupon(offer.couponCode, offer.serviceId);
    } else {
      onSelectService(offer.serviceId, offer.couponCode);
    }
  };

  const popularPills = [
    { label: 'AC Jet Cleaning', serviceId: 'ac-repair' },
    { label: 'Washing Machine Spin Fix', serviceId: 'washing-machine' },
    { label: 'Fridge Gas Refill', serviceId: 'refrigerator' },
    { label: 'Ceiling Fan & Wiring', serviceId: 'electrical-fitting' },
    { label: 'Tap Leakage & Flush', serviceId: 'plumbing-sanitary' },
    { label: 'Geyser Coil Repair', serviceId: 'geyser-water-heater' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase();
    if (q.includes('ac') || q.includes('air') || q.includes('cool')) {
      onSelectService('ac-repair');
    } else if (q.includes('wash') || q.includes('drain') || q.includes('drum')) {
      onSelectService('washing-machine');
    } else if (q.includes('fridge') || q.includes('refrig') || q.includes('freez')) {
      onSelectService('refrigerator');
    } else if (q.includes('fan') || q.includes('switch') || q.includes('electric') || q.includes('mcb')) {
      onSelectService('electrical-fitting');
    } else if (q.includes('tap') || q.includes('plumb') || q.includes('pipe') || q.includes('leak')) {
      onSelectService('plumbing-sanitary');
    } else if (q.includes('geyser') || q.includes('water heat')) {
      onSelectService('geyser-water-heater');
    } else if (q.includes('microwave') || q.includes('oven')) {
      onSelectService('microwave-oven');
    } else if (q.includes('ro') || q.includes('purifier') || q.includes('tds')) {
      onSelectService('ro-water-purifier');
    } else {
      // Default fallback to AC repair
      onSelectService('ac-repair');
    }
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-blue-50/70 via-white to-[#F8FAFC] py-6 sm:py-12 md:py-14 border-b border-slate-200">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {/* Locality badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100/80 border border-blue-200 text-[#1A3C8F] text-[11px] sm:text-xs font-semibold shadow-2xs">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F97316] shrink-0" />
            <span>Serving {selectedLocality}, Nagpur & 18+ wards</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1E293B] tracking-tight leading-snug sm:leading-tight">
            Nagpur&apos;s Most Trusted Home <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#1A3C8F] via-blue-700 to-[#F97316]">
              Appliance Repair & Fitting
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect with verified, certified local technicians in Nagpur within minutes.
            Standardized pricing, genuine spare parts, and 30-day service warranty.
          </p>

          {/* Search bar & locality combo */}
          <div className="pt-1 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-1.5 sm:p-2 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 w-full sm:w-auto shrink-0">
                <MapPin className="w-4 h-4 text-[#F97316]" />
                <select
                  value={selectedLocality}
                  onChange={(e) => onLocalityChange(e.target.value)}
                  className="bg-transparent focus:outline-hidden text-slate-800 font-semibold cursor-pointer w-full sm:w-auto"
                  aria-label="Filter by Nagpur locality"
                >
                  {Object.keys(NAGPUR_LOCALITIES).map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex items-center gap-2 px-3 w-full">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 'AC cooling', 'Washing machine shake', 'Fridge'..."
                  className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden py-1.5"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0 cursor-pointer touch-manipulation"
              >
                Find Technician
              </button>
            </form>

            {/* Popular quick-click pills - horizontally swipeable on mobile */}
            <div className="pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center text-xs">
              <span className="text-slate-400 font-medium text-[11px] shrink-0">Popular:</span>
              {popularPills.map((pill, i) => (
                <button
                  key={i}
                  onClick={() => onSelectService(pill.serviceId)}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#1A3C8F] hover:border-blue-300 hover:bg-blue-50/50 transition-all text-[11px] font-medium shrink-0 shadow-2xs touch-manipulation cursor-pointer"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Promotional Offers & Festive Coupons Carousel */}
          <div 
            className="pt-4 max-w-2xl mx-auto text-left"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-linear-to-r from-slate-900 to-slate-800 text-white transition-all select-none">
              {/* Dynamic decorative backdrop gradients */}
              <div 
                className={`absolute inset-0 bg-linear-to-r ${PROMO_OFFERS[activeSlide].gradientBg} opacity-95 transition-all duration-700`}
              />
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/20 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 p-4 sm:p-6 space-y-3">
                {/* Header row: Badge, Counter, Navigation arrows */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs ${PROMO_OFFERS[activeSlide].badgeColor}`}>
                      {PROMO_OFFERS[activeSlide].badge}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-black text-white bg-black/35 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 rounded-full border border-white/20">
                      {PROMO_OFFERS[activeSlide].discount}
                    </span>
                  </div>

                  {/* Slide controls (Touch-friendly arrows) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveSlide((prev) => (prev - 1 + PROMO_OFFERS.length) % PROMO_OFFERS.length)}
                      className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer touch-manipulation"
                      aria-label="Previous promotional offer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-mono text-white/90 px-1 font-semibold">
                      {activeSlide + 1}/{PROMO_OFFERS.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveSlide((prev) => (prev + 1) % PROMO_OFFERS.length)}
                      className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer touch-manipulation"
                      aria-label="Next promotional offer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Offer Title & Description */}
                <div>
                  <h3 className="text-sm sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5 leading-snug">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>{PROMO_OFFERS[activeSlide].title}</span>
                  </h3>
                  <p className="text-xs sm:text-[13px] text-white/90 mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {PROMO_OFFERS[activeSlide].description}
                  </p>
                </div>

                {/* Action Row: Coupon code pill + Book with offer button */}
                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <div className="flex items-center justify-between sm:justify-start gap-2 bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/25">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span className="text-xs font-mono font-extrabold text-white tracking-wider">
                        {PROMO_OFFERS[activeSlide].couponCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(e, PROMO_OFFERS[activeSlide].couponCode)}
                      className="px-2.5 py-1 rounded-lg bg-white/25 hover:bg-white/35 active:scale-95 text-[11px] font-bold text-white transition-all flex items-center gap-1 cursor-pointer touch-manipulation"
                    >
                      {copiedCode === PROMO_OFFERS[activeSlide].couponCode ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-300" />
                          <span className="text-emerald-200">COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyOffer(PROMO_OFFERS[activeSlide])}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-amber-100 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer touch-manipulation"
                  >
                    <span>Book with this Offer</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#1A3C8F]" />
                  </button>
                </div>

                {/* Footer bar: terms text & interactive pagination dots */}
                <div className="pt-1 flex items-center justify-between text-[10px] text-white/80 border-t border-white/15">
                  <span className="truncate max-w-[210px] sm:max-w-none">{PROMO_OFFERS[activeSlide].expiryText}</span>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[9px] text-white/60 hidden sm:inline mr-1">Swipeable</span>
                    {PROMO_OFFERS.map((offer, idx) => (
                      <button
                        key={offer.id}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer touch-manipulation ${
                          activeSlide === idx ? 'w-5 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to offer slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Diagnostician & Mobile Tracking Dual Action Bar */}
          <div className="pt-4 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onOpenAIDiagnostics}
              className="p-3.5 rounded-2xl bg-linear-to-r from-blue-900 to-[#1A3C8F] text-white flex items-center justify-between gap-3 shadow-md hover:shadow-lg transition-all group border border-blue-700/50 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>AI Diagnostics</span>
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-extrabold px-1 rounded-xs">FREE</span>
                  </div>
                  <div className="text-[10px] text-blue-200 line-clamp-1">
                    Symptom root cause & quote
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>

            {onOpenTrackByMobile && (
              <button
                onClick={onOpenTrackByMobile}
                className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 flex items-center justify-between gap-3 shadow-md border border-slate-200 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4 text-[#F97316]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Track by Mobile No.
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">
                      Live status with 10-digit phone
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#F97316] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            )}
          </div>

          {/* 4 Trust Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-6 sm:pt-8 text-left max-w-4xl mx-auto">
            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-50 text-[#1A3C8F] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">100% Certified</div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">Aadhaar & Police Verified</div>
              </div>
            </div>

            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-50 text-[#F97316] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">45-Min Arrival</div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">Nearest Nagpur Tech</div>
              </div>
            </div>

            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">30-Day Guarantee</div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">Free Re-service</div>
              </div>
            </div>

            <div className="bg-white p-2.5 sm:p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-500 text-amber-500" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">4.8/5 Star Rated</div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">3,400+ Nagpur Homes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
