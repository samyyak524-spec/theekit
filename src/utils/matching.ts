/**
 * Nagpur Geographic Clusters & Matching Utility
 */

export interface NagpurLocalityCoords {
  name: string;
  lat: number;
  lng: number;
  pincode: string;
  zone: 'Central' | 'West' | 'South' | 'East' | 'North';
}

export const NAGPUR_LOCALITIES: Record<string, NagpurLocalityCoords> = {
  'Dharampeth': { name: 'Dharampeth', lat: 21.1432, lng: 79.0667, pincode: '440010', zone: 'West' },
  'Ramdaspeth': { name: 'Ramdaspeth', lat: 21.1354, lng: 79.0742, pincode: '440010', zone: 'West' },
  'Sitabuldi': { name: 'Sitabuldi', lat: 21.1458, lng: 79.0882, pincode: '440012', zone: 'Central' },
  'Sadar': { name: 'Sadar', lat: 21.1592, lng: 79.0825, pincode: '440001', zone: 'Central' },
  'Civil Lines': { name: 'Civil Lines', lat: 21.1550, lng: 79.0680, pincode: '440001', zone: 'Central' },
  'Pratap Nagar': { name: 'Pratap Nagar', lat: 21.1189, lng: 79.0601, pincode: '440022', zone: 'South' },
  'Manish Nagar': { name: 'Manish Nagar', lat: 21.0856, lng: 79.0782, pincode: '440015', zone: 'South' },
  'Besa': { name: 'Besa', lat: 21.0762, lng: 79.0911, pincode: '440037', zone: 'South' },
  'Wardha Road': { name: 'Wardha Road', lat: 21.0945, lng: 79.0723, pincode: '440015', zone: 'South' },
  'Trimurti Nagar': { name: 'Trimurti Nagar', lat: 21.1123, lng: 79.0498, pincode: '440022', zone: 'South' },
  'Bajaj Nagar': { name: 'Bajaj Nagar', lat: 21.1278, lng: 79.0634, pincode: '440010', zone: 'West' },
  'Shankar Nagar': { name: 'Shankar Nagar', lat: 21.1378, lng: 79.0589, pincode: '440010', zone: 'West' },
  'Mahal': { name: 'Mahal', lat: 21.1441, lng: 79.1121, pincode: '440032', zone: 'East' },
  'Nandanvan': { name: 'Nandanvan', lat: 21.1298, lng: 79.1302, pincode: '440009', zone: 'East' },
  'Jaripatka': { name: 'Jaripatka', lat: 21.1824, lng: 79.0987, pincode: '440014', zone: 'North' },
  'Khamla': { name: 'Khamla', lat: 21.1105, lng: 79.0689, pincode: '440025', zone: 'South' },
  'Hingna': { name: 'Hingna', lat: 21.0912, lng: 78.9812, pincode: '441110', zone: 'West' },
  'IT Park': { name: 'IT Park', lat: 21.1154, lng: 79.0521, pincode: '440022', zone: 'South' },
  'Dighori': { name: 'Dighori', lat: 21.1118, lng: 79.1415, pincode: '440034', zone: 'East' },
};

/**
 * Haversine formula to calculate distance between two coordinates in kilometers
 */
export function calculateNagpurDistance(loc1Name: string, loc2Name: string): number {
  const loc1 = NAGPUR_LOCALITIES[loc1Name];
  const loc2 = NAGPUR_LOCALITIES[loc2Name];

  if (!loc1 || !loc2) {
    return 4.5; // fallback median distance in Nagpur
  }

  const R = 6371; // Earth's radius in km
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Estimate travel time in Nagpur traffic given km
 */
export function estimateTravelTimeMinutes(distanceKm: number): number {
  // Average Nagpur urban speed: 20-25 km/h + 5 min dispatch buffer
  const minutes = Math.round((distanceKm / 22) * 60) + 5;
  return Math.max(10, Math.min(60, minutes));
}

/**
 * Price & Commission Breakdown
 */
export interface PriceBreakdown {
  basePrice: number;
  discount: number;
  discountCodeApplied?: string;
  subtotal: number;
  platformFee: number;
  gstAmount: number;
  totalPayable: number;
  technicianPayout: number;
  platformCommission: number;
}

export function calculatePriceBreakdown(
  basePrice: number,
  discountCode?: string
): PriceBreakdown {
  const validCodes: Record<string, number> = {
    'NAGPUR50': 50,
    'DIWALI20': Math.round(basePrice * 0.20),
    'THEEKITNEW': 100,
    'FESTIVE25': Math.round(basePrice * 0.25),
    'FIRST150': 150,
    'SUMMER75': 75,
  };

  const discount = discountCode && validCodes[discountCode.toUpperCase()] 
    ? Math.min(basePrice - 99, validCodes[discountCode.toUpperCase()]) 
    : 0;

  const subtotal = Math.max(0, basePrice - discount);
  const platformFee = 29; // ₹29 nominal booking & safety fee
  const gstAmount = Math.round((subtotal + platformFee) * 0.18);
  const totalPayable = subtotal + platformFee + gstAmount;

  // Platform takes 15% commission of subtotal, technician earns 85%
  const platformCommission = Math.round(subtotal * 0.15);
  const technicianPayout = subtotal - platformCommission;

  return {
    basePrice,
    discount,
    discountCodeApplied: discount > 0 ? discountCode?.toUpperCase() : undefined,
    subtotal,
    platformFee,
    gstAmount,
    totalPayable,
    technicianPayout,
    platformCommission,
  };
}

/**
 * Technician candidate matching evaluation
 */
export interface TechMatchCandidate {
  id: string;
  name: string;
  categories: string[];
  localities: string[];
  rating: number;
  isAvailable: boolean;
  isCertified: boolean;
  completedJobsCount: number;
}

export function findBestTechnicianMatch<T extends TechMatchCandidate>(
  technicians: T[],
  serviceCategoryId: string,
  customerLocality: string
): { technician: T | null; distanceKm: number; matchScore: number; reason: string } {
  const eligible = technicians.filter(
    (t) => t.isAvailable && t.isCertified && t.categories.includes(serviceCategoryId)
  );

  if (eligible.length === 0) {
    return {
      technician: null,
      distanceKm: 0,
      matchScore: 0,
      reason: 'No available certified technician for this category in Nagpur right now',
    };
  }

  let bestTech: T | null = null;
  let highestScore = -Infinity;
  let bestDistance = 999;

  for (const tech of eligible) {
    // Primary locality is first in list or matching locality
    const techLocality = tech.localities.includes(customerLocality)
      ? customerLocality
      : (tech.localities[0] || 'Sitabuldi');

    const distance = calculateNagpurDistance(customerLocality, techLocality);

    // Scoring formula:
    // Distance penalty: -10 points per km
    // Rating boost: +25 points per star
    // Experience/jobs boost: +0.5 points per completed job (up to 20 pts)
    // Same locality bonus: +30 points
    let score = (tech.rating * 25) - (distance * 10) + Math.min(20, tech.completedJobsCount * 0.5);
    if (tech.localities.includes(customerLocality)) {
      score += 30;
    }

    if (score > highestScore) {
      highestScore = score;
      bestTech = tech;
      bestDistance = distance;
    }
  }

  return {
    technician: bestTech,
    distanceKm: bestDistance,
    matchScore: Math.round(highestScore),
    reason: `Optimal match in Nagpur (${bestDistance} km away, rated ${bestTech?.rating}★)`,
  };
}

/**
 * Booking Lifecycle State Transition Guard
 */
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'assigned', 'cancelled'],
  confirmed: ['assigned', 'en_route', 'cancelled'],
  assigned: ['en_route', 'in_progress', 'cancelled'],
  en_route: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export function isValidBookingTransition(from: BookingStatus, to: BookingStatus): boolean {
  if (from === to) return true;
  const nextStates = ALLOWED_TRANSITIONS[from] || [];
  return nextStates.includes(to);
}
