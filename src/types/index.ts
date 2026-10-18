export type UserRole = 'customer' | 'technician' | 'admin';

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  startingPrice: number;
  tagline: string;
  subServices: SubService[];
  faqs: { question: string; answer: string }[];
}

export interface SubService {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  inclusions: string[];
  exclusions: string[];
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  photoUrl: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  categories: string[];
  localities: string[];
  isAvailable: boolean;
  isCertified: boolean;
  certificationNumber: string;
  certifiedDate: string;
  completedJobsCount: number;
  totalEarnings: number;
  bio: string;
}

export interface TechnicianApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  locality: string;
  categories: string[];
  experienceYears: number;
  aadhaarNumber: string;
  aadhaarPhotoUrl?: string;
  photoUrl?: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  appliedDate: string;
  adminNotes?: string;
  aiAuditResult?: {
    verificationScore: number;
    recommendedDecision: 'approve' | 'flag_for_review' | 'reject';
    summary: string;
    strengths: string[];
    riskFactors: string[];
    certificationLevel: 'Gold' | 'Standard' | 'Junior';
  };
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface BookingAddress {
  houseNo: string;
  street: string;
  locality: string;
  pincode: string;
  landmark?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  subServiceId: string;
  subServiceName: string;
  baseAmount: number;
  discount: number;
  discountCode?: string;
  platformFee: number;
  gstAmount: number;
  totalAmount: number;
  technicianPayout: number;
  date: string;
  timeSlot: string;
  address: BookingAddress;
  status: BookingStatus;
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  technicianPhoto?: string;
  technicianRating?: number;
  paymentMethod: 'upi_razorpay' | 'cash_on_service';
  paymentStatus: 'paid' | 'pending';
  paymentTransactionId?: string;
  createdAt: string;
  notes?: string;
  applianceBrand?: string;
  applianceModelNo?: string;
  appliancePhotoUrl?: string;
  rating?: number;
  reviewText?: string;
  ratedAt?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerName: string;
  technicianId: string;
  technicianName: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'visible' | 'hidden';
}

export interface NotificationAnnouncement {
  id: string;
  title: string;
  message: string;
  targetAudience: 'all' | 'customers' | 'technicians';
  channel: 'push' | 'sms' | 'email';
  sentAt: string;
}

export interface DiagnosticResult {
  appliance: string;
  symptom: string;
  diagnosis: string;
  likelyRootCauses: string[];
  estimatedCostRange: string;
  urgency: 'low' | 'medium' | 'high' | 'immediate';
  recommendedCategoryId: string;
  recommendedSubServiceId: string;
  preventiveTips: string[];
}
