import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNagpurDistance,
  estimateTravelTimeMinutes,
  calculatePriceBreakdown,
  findBestTechnicianMatch,
  isValidBookingTransition,
} from './matching.ts';

test('Nagpur distance calculations between known localities', () => {
  // Same locality should have 0 or minimal distance
  const dSame = calculateNagpurDistance('Dharampeth', 'Dharampeth');
  assert.equal(dSame, 0);

  // Dharampeth to Ramdaspeth (adjacent West Nagpur) should be ~1-2 km
  const dDharamRam = calculateNagpurDistance('Dharampeth', 'Ramdaspeth');
  assert.ok(dDharamRam > 0.5 && dDharamRam < 3.0, `Expected 0.5-3km, got ${dDharamRam}`);

  // Dharampeth to Besa (West to far South) should be larger (~8-12 km)
  const dDharamBesa = calculateNagpurDistance('Dharampeth', 'Besa');
  assert.ok(dDharamBesa > 6 && dDharamBesa < 15, `Expected 6-15km, got ${dDharamBesa}`);
});

test('Nagpur travel time estimation', () => {
  const etaShort = estimateTravelTimeMinutes(2);
  assert.ok(etaShort >= 10 && etaShort <= 15, `Expected 10-15 mins, got ${etaShort}`);

  const etaLong = estimateTravelTimeMinutes(10);
  assert.ok(etaLong >= 25 && etaLong <= 45, `Expected 25-45 mins, got ${etaLong}`);
});

test('Price breakdown calculation and discount vouchers', () => {
  // Standard calculation
  const res = calculatePriceBreakdown(499);
  assert.equal(res.basePrice, 499);
  assert.equal(res.discount, 0);
  assert.equal(res.subtotal, 499);
  assert.equal(res.platformFee, 29);
  // Total payable includes 18% GST on (499 + 29) = 528 * 0.18 = ~95 -> Total 623
  assert.equal(res.totalPayable, 499 + 29 + Math.round((499 + 29) * 0.18));
  // Platform commission (15%) and tech payout (85%)
  assert.equal(res.platformCommission + res.technicianPayout, res.subtotal);

  // With discount code
  const discounted = calculatePriceBreakdown(499, 'NAGPUR50');
  assert.equal(discounted.discount, 50);
  assert.equal(discounted.subtotal, 449);
});

test('Technician candidate matching in Nagpur', () => {
  const mockTechs = [
    {
      id: 'tech-1',
      name: 'Ramesh Sharma',
      categories: ['ac-repair', 'refrigerator'],
      localities: ['Dharampeth', 'Ramdaspeth'],
      rating: 4.9,
      isAvailable: true,
      isCertified: true,
      completedJobsCount: 120,
    },
    {
      id: 'tech-2',
      name: 'Sunil Patil',
      categories: ['ac-repair'],
      localities: ['Jaripatka'],
      rating: 4.5,
      isAvailable: true,
      isCertified: true,
      completedJobsCount: 40,
    },
    {
      id: 'tech-3',
      name: 'Vikram Deshmukh',
      categories: ['ac-repair'],
      localities: ['Dharampeth'],
      rating: 4.8,
      isAvailable: false, // unavailable
      isCertified: true,
      completedJobsCount: 90,
    },
  ];

  // For a customer in Dharampeth needing AC repair, tech-1 should win (tech-3 unavailable, tech-2 far in Jaripatka)
  const match = findBestTechnicianMatch(mockTechs, 'ac-repair', 'Dharampeth');
  assert.ok(match.technician !== null);
  assert.equal(match.technician?.id, 'tech-1');
  assert.ok(match.distanceKm <= 2);

  // For an unserviced category, returns null
  const noMatch = findBestTechnicianMatch(mockTechs, 'microwave', 'Dharampeth');
  assert.equal(noMatch.technician, null);
});

test('Booking state machine transitions', () => {
  assert.equal(isValidBookingTransition('pending', 'confirmed'), true);
  assert.equal(isValidBookingTransition('confirmed', 'assigned'), true);
  assert.equal(isValidBookingTransition('assigned', 'en_route'), true);
  assert.equal(isValidBookingTransition('en_route', 'in_progress'), true);
  assert.equal(isValidBookingTransition('in_progress', 'completed'), true);
  assert.equal(isValidBookingTransition('in_progress', 'cancelled'), true);

  // Illegal transitions
  assert.equal(isValidBookingTransition('completed', 'pending'), false);
  assert.equal(isValidBookingTransition('completed', 'in_progress'), false);
  assert.equal(isValidBookingTransition('cancelled', 'en_route'), false);
});
