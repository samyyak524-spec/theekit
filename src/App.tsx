/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingHero } from './components/Customer/LandingHero.tsx';
import { ServicesSection } from './components/Customer/ServicesSection.tsx';
import { ServiceDetailModal } from './components/Customer/ServiceDetailModal.tsx';
import { BookingFlowModal } from './components/Customer/BookingFlowModal.tsx';
import { BookingConfirmationModal } from './components/Customer/BookingConfirmationModal.tsx';
import { CustomerDashboard } from './components/Customer/CustomerDashboard.tsx';
import { SmartAIDiagnosticianModal } from './components/SmartAIDiagnosticianModal.tsx';
import { TrackByMobileModal } from './components/Customer/TrackByMobileModal.tsx';
import { MobileLoginModal } from './components/Auth/MobileLoginModal.tsx';
import { TechnicianApplicationForm } from './components/Technician/TechnicianApplicationForm.tsx';
import { ApplicationStatusView } from './components/Technician/ApplicationStatusView.tsx';
import { TechnicianDashboard } from './components/Technician/TechnicianDashboard.tsx';
import { TechnicianEarnings } from './components/Technician/TechnicianEarnings.tsx';
import { PublicTechnicianProfile } from './components/Technician/PublicTechnicianProfile.tsx';
import { AdminDashboard } from './components/Admin/AdminDashboard.tsx';
import { HowItWorksView } from './components/Public/HowItWorksView.tsx';
import { ContactView } from './components/Public/ContactView.tsx';
import { Home, Search, Sparkles, CalendarCheck, Phone } from 'lucide-react';

import { 
  UserRole, 
  ServiceCategory, 
  SubService, 
  Technician, 
  TechnicianApplication, 
  Booking, 
  Review, 
  NotificationAnnouncement 
} from './types/index.ts';

import { 
  INITIAL_SERVICES, 
  INITIAL_TECHNICIANS, 
  INITIAL_APPLICATIONS, 
  INITIAL_BOOKINGS, 
  INITIAL_REVIEWS, 
  INITIAL_ANNOUNCEMENTS 
} from './data/seedData.ts';

export default function App() {
  const [role, setRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedLocality, setSelectedLocality] = useState<string>('Dighori');
  const [loggedInPhone, setLoggedInPhone] = useState<string | null>('8007700446');

  // Application Data States
  const [services, setServices] = useState<ServiceCategory[]>(INITIAL_SERVICES);
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [applications, setApplications] = useState<TechnicianApplication[]>(INITIAL_APPLICATIONS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [announcements, setAnnouncements] = useState<NotificationAnnouncement[]>(INITIAL_ANNOUNCEMENTS);

  // Active technician (demo session)
  const currentTechnician = technicians[0] || INITIAL_TECHNICIANS[0];

  // Most recent submitted application for tracking
  const [trackedAppId, setTrackedAppId] = useState<string>(INITIAL_APPLICATIONS[0]?.id || '');

  // Modals
  const [isAIDiagnosticsOpen, setIsAIDiagnosticsOpen] = useState(false);
  const [isTrackByMobileOpen, setIsTrackByMobileOpen] = useState(false);
  const [isMobileLoginOpen, setIsMobileLoginOpen] = useState(false);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceCategory | null>(null);
  const [bookingFlowState, setBookingFlowState] = useState<{
    isOpen: boolean;
    service: ServiceCategory | null;
    subService: SubService | null;
    initialNotes?: string;
    initialDiscountCode?: string;
  }>({
    isOpen: false,
    service: null,
    subService: null,
  });
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Fetch / Sync Data from Backend
  const refreshAllData = useCallback(async () => {
    try {
      const [svcRes, techRes, appRes, bkRes, revRes, annRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/technicians'),
        fetch('/api/applications'),
        fetch('/api/bookings'),
        fetch('/api/reviews'),
        fetch('/api/announcements'),
      ]);

      if (svcRes.ok) setServices(await svcRes.json());
      if (techRes.ok) setTechnicians(await techRes.json());
      if (appRes.ok) setApplications(await appRes.json());
      if (bkRes.ok) setBookings(await bkRes.json());
      if (revRes.ok) setReviews(await revRes.json());
      if (annRes.ok) setAnnouncements(await annRes.json());
    } catch (err) {
      console.warn('Backend sync failed, using loaded in-memory state', err);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Handle Role Change
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'customer') {
      setActiveTab('home');
    } else if (newRole === 'technician') {
      setActiveTab('technician-dashboard');
    } else if (newRole === 'admin') {
      setActiveTab('admin-dashboard');
    }
  };

  // Handle Mobile Login Success
  const handleLoginSuccess = (userRole: UserRole, phone: string, userData?: any) => {
    setLoggedInPhone(phone);
    setRole(userRole);
    if (userRole === 'customer') {
      setActiveTab('customer-bookings');
    } else if (userRole === 'technician') {
      setActiveTab('technician-dashboard');
    } else if (userRole === 'admin') {
      setActiveTab('admin-dashboard');
    }
  };

  // Open direct booking from hero or AI
  const handleOpenBooking = (
    serviceCategory: ServiceCategory,
    subService?: SubService,
    initialNotes?: string,
    initialDiscountCode?: string
  ) => {
    const sub = subService || serviceCategory.subServices[0];
    setBookingFlowState({
      isOpen: true,
      service: serviceCategory,
      subService: sub,
      initialNotes,
      initialDiscountCode,
    });
  };

  const handleBookFromAi = (categoryId: string, subServiceId?: string, notes?: string) => {
    const cat = services.find((s) => s.id === categoryId) || services[0];
    const sub = cat.subServices.find((ss) => ss.id === subServiceId) || cat.subServices[0];
    handleOpenBooking(cat, sub, notes);
  };

  // Handle successful booking creation
  const handleBookingSuccess = (newBooking: Booking) => {
    setConfirmedBooking(newBooking);
    setBookingFlowState({ isOpen: false, service: null, subService: null });
    refreshAllData();
  };

  // Count active customer bookings
  const activeCustomerBookingsCount = bookings.filter(
    (b) => b.status !== 'completed' && b.status !== 'cancelled'
  ).length;

  const currentTrackedApplication = applications.find((a) => a.id === trackedAppId) || applications[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Universal Top Navigation */}
      <Navbar
        currentRole={role}
        onRoleChange={handleRoleChange}
        selectedLocality={selectedLocality}
        onLocalityChange={setSelectedLocality}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAIDiagnostics={() => setIsAIDiagnosticsOpen(true)}
        activeBookingsCount={activeCustomerBookingsCount}
        onOpenTrackByMobile={() => setIsTrackByMobileOpen(true)}
        onOpenMobileLogin={() => setIsMobileLoginOpen(true)}
        loggedInPhone={loggedInPhone}
        onLogout={() => setLoggedInPhone(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 lg:pb-0">
        {/* ============================================================== */}
        {/* CUSTOMER VIEWS */}
        {/* ============================================================== */}
        {role === 'customer' && (
          <>
            {activeTab === 'home' && (
              <>
                <LandingHero
                  selectedLocality={selectedLocality}
                  onLocalityChange={setSelectedLocality}
                  onSelectService={(serviceId, promoCode) => {
                    const found = services.find((s) => s.id === serviceId);
                    if (found) {
                      if (promoCode) {
                        handleOpenBooking(found, found.subServices[0], undefined, promoCode);
                      } else {
                        setSelectedServiceForDetail(found);
                      }
                    }
                  }}
                  onApplyPromoCoupon={(code, serviceId) => {
                    const cat = services.find((s) => s.id === serviceId) || services[0];
                    handleOpenBooking(cat, cat.subServices[0], undefined, code);
                  }}
                  onOpenAIDiagnostics={() => setIsAIDiagnosticsOpen(true)}
                  onOpenTrackByMobile={() => setIsTrackByMobileOpen(true)}
                />
                <ServicesSection
                  services={services}
                  onSelectService={(svc) => setSelectedServiceForDetail(svc)}
                  onBookDirect={(svc) => handleOpenBooking(svc)}
                />
              </>
            )}

            {activeTab === 'customer-bookings' && (
              <CustomerDashboard
                bookings={bookings}
                onRefreshBookings={refreshAllData}
                onBookNewService={() => setActiveTab('home')}
                onOpenAIDiagnostics={() => setIsAIDiagnosticsOpen(true)}
              />
            )}

            {activeTab === 'how-it-works' && (
              <HowItWorksView
                onBookNow={() => setActiveTab('home')}
                onJoinAsTech={() => setActiveTab('tech-apply')}
                onOpenAIDiagnostics={() => setIsAIDiagnosticsOpen(true)}
              />
            )}

            {activeTab === 'tech-apply' && (
              <TechnicianApplicationForm
                services={services}
                onSubmitSuccess={(newAppId) => {
                  setTrackedAppId(newAppId);
                  setActiveTab('tech-status');
                  refreshAllData();
                }}
                onViewStatus={() => setActiveTab('tech-status')}
              />
            )}

            {activeTab === 'tech-status' && (
              <ApplicationStatusView
                application={currentTrackedApplication}
                onEnterDashboard={() => {
                  setRole('technician');
                  setActiveTab('technician-dashboard');
                }}
                onReapply={() => setActiveTab('tech-apply')}
              />
            )}

            {activeTab === 'contact' && <ContactView />}
          </>
        )}

        {/* ============================================================== */}
        {/* TECHNICIAN VIEWS */}
        {/* ============================================================== */}
        {role === 'technician' && (
          <>
            {activeTab === 'technician-dashboard' && (
              <TechnicianDashboard
                technician={currentTechnician}
                bookings={bookings}
                onRefreshBookings={refreshAllData}
                onViewEarnings={() => setActiveTab('technician-earnings')}
                onViewPublicProfile={() => setActiveTab('technician-public-profile')}
              />
            )}

            {activeTab === 'technician-earnings' && (
              <TechnicianEarnings
                technician={currentTechnician}
                bookings={bookings}
                onBack={() => setActiveTab('technician-dashboard')}
              />
            )}

            {activeTab === 'technician-public-profile' && (
              <PublicTechnicianProfile
                technician={currentTechnician}
                reviews={reviews}
                onBack={() => setActiveTab('technician-dashboard')}
                onBookThisTechnician={() => {
                  setRole('customer');
                  setActiveTab('home');
                }}
              />
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* ADMIN VIEWS */}
        {/* ============================================================== */}
        {role === 'admin' && (
          <AdminDashboard
            technicians={technicians}
            applications={applications}
            bookings={bookings}
            reviews={reviews}
            announcements={announcements}
            services={services}
            onRefreshData={refreshAllData}
            activeAdminTab={
              activeTab === 'admin-technicians'
                ? 'applications'
                : activeTab === 'admin-bookings'
                ? 'bookings'
                : 'overview'
            }
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer
        onTabChange={(tab) => {
          setRole('customer');
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAIDiagnostics={() => setIsAIDiagnosticsOpen(true)}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <button
          onClick={() => {
            setRole('customer');
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-colors cursor-pointer touch-manipulation ${
            role === 'customer' && activeTab === 'home'
              ? 'text-[#1A3C8F]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Services</span>
        </button>

        <button
          onClick={() => setIsTrackByMobileOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer touch-manipulation"
        >
          <Search className="w-4 h-4 text-[#F97316]" />
          <span>Track</span>
        </button>

        <button
          onClick={() => setIsAIDiagnosticsOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-0.5 rounded-xl text-[10px] font-bold text-blue-600 transition-colors cursor-pointer touch-manipulation"
        >
          <div className="w-6 h-6 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span className="text-[9px]">AI Doctor</span>
        </button>

        <button
          onClick={() => {
            setRole('customer');
            setActiveTab('customer-bookings');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-colors cursor-pointer touch-manipulation relative ${
            role === 'customer' && activeTab === 'customer-bookings'
              ? 'text-[#1A3C8F]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <CalendarCheck className="w-4 h-4" />
            {activeCustomerBookingsCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#F97316] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {activeCustomerBookingsCount}
              </span>
            )}
          </div>
          <span>Bookings</span>
        </button>

        <a
          href="tel:8007700446"
          className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer touch-manipulation"
        >
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>Call Desk</span>
        </a>
      </nav>

      {/* ============================================================== */}
      {/* MODALS */}
      {/* ============================================================== */}

      {/* 1. Track by Mobile Number Modal */}
      <TrackByMobileModal
        isOpen={isTrackByMobileOpen}
        onClose={() => setIsTrackByMobileOpen(false)}
        bookings={bookings}
        applications={applications}
      />

      {/* 2. Mobile Login & OTP Authentication Modal */}
      <MobileLoginModal
        isOpen={isMobileLoginOpen}
        onClose={() => setIsMobileLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        technicians={technicians}
        applications={applications}
      />

      {/* 3. TheEkit Smart AI Diagnostician Modal */}
      <SmartAIDiagnosticianModal
        isOpen={isAIDiagnosticsOpen}
        onClose={() => setIsAIDiagnosticsOpen(false)}
        services={services}
        onBookRecommended={handleBookFromAi}
      />

      {/* 4. Service Category Detail Modal */}
      <ServiceDetailModal
        service={selectedServiceForDetail}
        onClose={() => setSelectedServiceForDetail(null)}
        onSelectSubServiceToBook={(svc, sub) => handleOpenBooking(svc, sub)}
      />

      {/* 5. 4-Step Guided Booking Flow Modal */}
      <BookingFlowModal
        isOpen={bookingFlowState.isOpen}
        onClose={() => setBookingFlowState({ isOpen: false, service: null, subService: null })}
        service={bookingFlowState.service}
        subService={bookingFlowState.subService}
        preselectedLocality={selectedLocality}
        initialNotes={bookingFlowState.initialNotes}
        initialDiscountCode={bookingFlowState.initialDiscountCode}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* 6. Booking Confirmation Modal with Certificate and Invoice */}
      <BookingConfirmationModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        onViewDashboard={() => {
          setConfirmedBooking(null);
          setRole('customer');
          setActiveTab('customer-bookings');
        }}
      />
    </div>
  );
}
