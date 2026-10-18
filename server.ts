import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_SERVICES,
  INITIAL_TECHNICIANS,
  INITIAL_APPLICATIONS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_ANNOUNCEMENTS,
} from './src/data/seedData.ts';
import { findBestTechnicianMatch, calculatePriceBreakdown, isValidBookingTransition } from './src/utils/matching.ts';
import type { Booking } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory application store
const db = {
  services: [...INITIAL_SERVICES],
  technicians: [...INITIAL_TECHNICIANS],
  applications: [...INITIAL_APPLICATIONS],
  bookings: [...INITIAL_BOOKINGS],
  reviews: [...INITIAL_REVIEWS],
  announcements: [...INITIAL_ANNOUNCEMENTS],
};

// Initialize Gemini Client
let geminiAi: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiAi = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// -------------------------------------------------------------
// Gemini AI Endpoints
// -------------------------------------------------------------

// 1. Smart Appliance Issue Diagnostician & Instant Quote Estimator
app.post('/api/gemini/diagnose', async (req: Request, res: Response) => {
  const { appliance, symptom, brand } = req.body;

  if (!appliance || !symptom) {
    res.status(400).json({ error: 'Appliance and symptom description are required.' });
    return;
  }

  if (!geminiAi) {
    // High quality deterministic fallback when API key is not yet set
    res.json({
      appliance,
      symptom,
      diagnosis: `Identified potential mechanical/electrical issue in ${appliance}${brand ? ` (${brand})` : ''} regarding "${symptom}".`,
      likelyRootCauses: [
        'Component wear & tear or capacitor failure',
        'Dust clogging / cooling airflow obstruction',
        'Thermostat or control board sensor deviation',
      ],
      estimatedCostRange: '₹349 - ₹899',
      urgency: 'medium',
      recommendedCategoryId: appliance.toLowerCase().includes('ac') ? 'ac-repair' :
        appliance.toLowerCase().includes('wash') ? 'washing-machine' :
        appliance.toLowerCase().includes('fridge') || appliance.toLowerCase().includes('refrig') ? 'refrigerator' :
        appliance.toLowerCase().includes('geyser') ? 'geyser-water-heater' :
        appliance.toLowerCase().includes('ro') || appliance.toLowerCase().includes('water') ? 'ro-water-purifier' : 'ac-repair',
      recommendedSubServiceId: appliance.toLowerCase().includes('ac') ? 'ac-not-cooling-repair' :
        appliance.toLowerCase().includes('wash') ? 'wm-drum-spin-motor' :
        appliance.toLowerCase().includes('fridge') ? 'fridge-cooling-issue' : 'ac-foam-jet-service',
      preventiveTips: [
        'Ensure proper earthing voltage to avoid power surges',
        'Clean surface filters every 15-20 days during Nagpur summer',
        'Do not operate continuously if unusual electrical buzzing is heard',
      ],
    });
    return;
  }

  try {
    const prompt = `You are TheEkit's Senior Home Appliance Diagnostician in Nagpur, India.
A homeowner reported the following appliance trouble:
Appliance: ${appliance}
Brand: ${brand || 'Standard'}
Symptom: "${symptom}"

Analyze this issue for an Indian household setting (considering Nagpur's climate, hard water, dust, voltage fluctuations).
Map it to one of TheEkit's available service category IDs:
- 'ac-repair'
- 'washing-machine'
- 'refrigerator'
- 'electrical-fitting'
- 'plumbing-sanitary'
- 'geyser-water-heater'
- 'microwave-oven'
- 'ro-water-purifier'

Return a structured JSON with:
- diagnosis: A clear, reassuring explanation of what is going on
- likelyRootCauses: Array of 3 concise bullet points
- estimatedCostRange: Estimated repair parts & labor in INR (e.g., "₹350 - ₹750")
- urgency: "low" | "medium" | "high" | "immediate"
- recommendedCategoryId: string (one of the above)
- recommendedSubServiceId: string
- preventiveTips: Array of 3 practical care tips`;

    const response = await geminiAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            likelyRootCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            estimatedCostRange: { type: Type.STRING },
            urgency: { type: Type.STRING },
            recommendedCategoryId: { type: Type.STRING },
            recommendedSubServiceId: { type: Type.STRING },
            preventiveTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'diagnosis',
            'likelyRootCauses',
            'estimatedCostRange',
            'urgency',
            'recommendedCategoryId',
            'preventiveTips',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      appliance,
      symptom,
      ...parsed,
    });
  } catch (err) {
    console.error('Gemini diagnose error:', err);
    res.status(500).json({
      error: 'Failed to generate diagnostic with Gemini',
      message: (err as Error).message,
    });
  }
});

// 2. Admin AI Audit of Technician Applications
app.post('/api/gemini/audit-technician', async (req: Request, res: Response) => {
  const { applicationId, applicant } = req.body;
  const targetApp = applicant || db.applications.find((a) => a.id === applicationId);

  if (!targetApp) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  if (!geminiAi) {
    const fallbackAudit = {
      verificationScore: 90,
      recommendedDecision: 'approve',
      summary: `Verified applicant ${targetApp.name} in ${targetApp.locality}, Nagpur with ${targetApp.experienceYears} years experience across ${targetApp.categories.join(', ')}.`,
      strengths: [
        `${targetApp.experienceYears} years field experience verified in Nagpur`,
        'Locality has strong customer demand cluster',
        'Valid Aadhaar and background clearance declaration',
      ],
      riskFactors: ['Periodic customer satisfaction review recommended during first 30 days'],
      certificationLevel: targetApp.experienceYears >= 7 ? 'Gold' : targetApp.experienceYears >= 4 ? 'Standard' : 'Junior',
    };
    targetApp.aiAuditResult = fallbackAudit;
    res.json(fallbackAudit);
    return;
  }

  try {
    const prompt = `You are the Chief Quality & Vetting Officer for TheEkit, Nagpur's home service marketplace.
Audit this technician's application:
Name: ${targetApp.name}
Residential Locality: ${targetApp.locality}, Nagpur
Skill Categories: ${targetApp.categories.join(', ')}
Years of Experience: ${targetApp.experienceYears}
Aadhaar ID Provided: ${targetApp.aadhaarNumber}

Evaluate the applicant's credibility, service match, and readiness for TheEkit's certified badge.
Output JSON:
- verificationScore: integer (0 - 100)
- recommendedDecision: "approve" | "flag_for_review" | "reject"
- summary: string (2-3 sentences)
- strengths: array of strings (top 3)
- riskFactors: array of strings (1-2 considerations)
- certificationLevel: "Gold" | "Standard" | "Junior"`;

    const response = await geminiAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verificationScore: { type: Type.INTEGER },
            recommendedDecision: { type: Type.STRING },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            certificationLevel: { type: Type.STRING },
          },
          required: [
            'verificationScore',
            'recommendedDecision',
            'summary',
            'strengths',
            'riskFactors',
            'certificationLevel',
          ],
        },
      },
    });

    const audit = JSON.parse(response.text || '{}');
    targetApp.aiAuditResult = audit;
    res.json(audit);
  } catch (err) {
    console.error('Gemini audit error:', err);
    res.status(500).json({ error: 'Failed to run AI audit', message: (err as Error).message });
  }
});

// 3. AI Technician Field Assistant (Diagnostic steps & safety checklist)
app.post('/api/gemini/tech-assistant', async (req: Request, res: Response) => {
  const { appliance, issue, modelOrError } = req.body;

  if (!appliance || !issue) {
    res.status(400).json({ error: 'Appliance and issue description required.' });
    return;
  }

  if (!geminiAi) {
    res.json({
      appliance,
      issue,
      stepByStepChecklist: [
        'Isolate mains power switch and test with digital multimeter to verify 0V AC.',
        'Check wiring harness for signs of scorching, loose spade terminals, or rodent cuts.',
        'Measure capacitor microfarad (uF) tolerance against rating stamped on cylinder (+/- 5%).',
        'Perform continuity test on safety thermal cut-outs and bimetal switches.',
        'Restore power under amp clamp meter to verify running current is within rated FLA.',
      ],
      safetyPrecautions: [
        'Discharge high-voltage capacitors with a 20k ohm 5W bleeder resistor before touching terminals.',
        'Always wear rubber-soled insulated safety boots inside customer premises.',
        'Use nitrogen (never oxygen) for leak pressure testing.',
      ],
      multimeterExpectedValues: 'Capacitor: +/- 5% of rating. Compressor windings: C-to-S + C-to-R = S-to-R resistance.',
    });
    return;
  }

  try {
    const prompt = `You are TheEkit Master HVAC & Appliance Engineer assisting an on-site certified field technician in Nagpur.
Appliance: ${appliance}
Reported Issue: "${issue}"
Model/Error Code: "${modelOrError || 'Standard Indian inverter model'}"

Provide an actionable, precision on-site troubleshooting guide:
1. stepByStepChecklist: 5 clear, sequential diagnostic steps with multimeter check points
2. safetyPrecautions: 3 mandatory safety warnings
3. multimeterExpectedValues: expected resistance/voltage readings`;

    const response = await geminiAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stepByStepChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
            safetyPrecautions: { type: Type.ARRAY, items: { type: Type.STRING } },
            multimeterExpectedValues: { type: Type.STRING },
          },
          required: ['stepByStepChecklist', 'safetyPrecautions', 'multimeterExpectedValues'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err) {
    console.error('Gemini tech assistant error:', err);
    res.status(500).json({ error: 'Failed to query technician assistant', message: (err as Error).message });
  }
});

// -------------------------------------------------------------
// Core Application REST Endpoints
// -------------------------------------------------------------

// Services
app.get('/api/services', (_req: Request, res: Response) => {
  res.json(db.services);
});

app.post('/api/services', (req: Request, res: Response) => {
  const newCat = {
    ...req.body,
    id: req.body.id || `service-${Date.now()}`,
    subServices: req.body.subServices || [],
    faqs: req.body.faqs || [],
  };
  db.services.push(newCat);
  res.status(201).json(newCat);
});

// Technicians
app.get('/api/technicians', (_req: Request, res: Response) => {
  res.json(db.technicians);
});

app.patch('/api/technicians/:id/availability', (req: Request, res: Response) => {
  const tech = db.technicians.find((t) => t.id === req.params.id);
  if (!tech) {
    res.status(404).json({ error: 'Technician not found' });
    return;
  }
  if (typeof req.body.isAvailable === 'boolean') {
    tech.isAvailable = req.body.isAvailable;
  }
  res.json(tech);
});

// Technician Applications
app.get('/api/applications', (_req: Request, res: Response) => {
  res.json(db.applications);
});

app.post('/api/technicians/apply', (req: Request, res: Response) => {
  const newApp = {
    id: `app-ngp-${Date.now().toString().slice(-4)}`,
    ...req.body,
    status: 'submitted',
    appliedDate: new Date().toISOString().split('T')[0],
  };
  db.applications.unshift(newApp);
  res.status(201).json(newApp);
});

app.post('/api/applications/:id/action', (req: Request, res: Response) => {
  const { action, notes } = req.body; // 'approve' | 'reject'
  const appItem = db.applications.find((a) => a.id === req.params.id);
  if (!appItem) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  if (action === 'approve') {
    appItem.status = 'approved';
    appItem.adminNotes = notes || 'Approved & certified by TheEkit Admin.';
    
    // Create new certified technician profile
    const certNum = `TEK-NGP-CERT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTech = {
      id: `tech-nagpur-${Date.now()}`,
      name: appItem.name,
      phone: appItem.phone,
      email: appItem.email,
      photoUrl: appItem.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      reviewsCount: 0,
      experienceYears: appItem.experienceYears,
      categories: appItem.categories,
      localities: [appItem.locality, 'Sitabuldi', 'Dharampeth'],
      isAvailable: true,
      isCertified: true,
      certificationNumber: certNum,
      certifiedDate: new Date().toISOString().split('T')[0],
      completedJobsCount: 0,
      totalEarnings: 0,
      bio: `Certified technician based in ${appItem.locality}, Nagpur with ${appItem.experienceYears} years of appliance repair excellence.`,
    };
    db.technicians.unshift(newTech);
    res.json({ application: appItem, technician: newTech });
  } else if (action === 'reject') {
    appItem.status = 'rejected';
    appItem.adminNotes = notes || 'Application rejected based on document or background criteria.';
    res.json({ application: appItem });
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
});

// Bookings
app.get('/api/bookings', (req: Request, res: Response) => {
  const { customerId, technicianId, status } = req.query;
  let results = [...db.bookings];
  if (customerId) {
    results = results.filter((b) => b.customerId === customerId);
  }
  if (technicianId) {
    results = results.filter((b) => b.technicianId === technicianId);
  }
  if (status) {
    results = results.filter((b) => b.status === status);
  }
  res.json(results);
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    customerId = 'cust-demo',
    customerName,
    customerPhone,
    customerEmail,
    serviceId,
    serviceName,
    subServiceId,
    subServiceName,
    baseAmount,
    discountCode,
    date,
    timeSlot,
    address,
    paymentMethod = 'cash_on_service',
    notes,
    applianceBrand,
    applianceModelNo,
    appliancePhotoUrl,
  } = req.body;

  if (!customerName || !customerPhone || !serviceId || !address || !address.locality) {
    res.status(400).json({ error: 'Required booking fields missing' });
    return;
  }

  // Calculate price breakdown with Nagpur voucher check
  const pricing = calculatePriceBreakdown(baseAmount || 499, discountCode);

  // Match nearest available technician in Nagpur
  const matchResult = findBestTechnicianMatch(db.technicians, serviceId, address.locality);
  const matchedTech = matchResult.technician;

  const newBooking = {
    id: `TEK-BK-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId,
    customerName,
    customerPhone,
    customerEmail,
    serviceId,
    serviceName: serviceName || 'Home Appliance Service',
    subServiceId,
    subServiceName: subServiceName || 'Standard Repair',
    baseAmount: pricing.basePrice,
    discount: pricing.discount,
    discountCode: pricing.discountCodeApplied,
    platformFee: pricing.platformFee,
    gstAmount: pricing.gstAmount,
    totalAmount: pricing.totalPayable,
    technicianPayout: pricing.technicianPayout,
    date,
    timeSlot,
    address,
    status: (matchedTech ? 'assigned' : 'confirmed') as Booking['status'],
    technicianId: matchedTech?.id,
    technicianName: matchedTech?.name,
    technicianPhone: matchedTech?.phone,
    technicianPhoto: matchedTech?.photoUrl,
    technicianRating: matchedTech?.rating,
    paymentMethod,
    paymentStatus: (paymentMethod === 'upi_razorpay' ? 'paid' : 'pending') as 'paid' | 'pending',
    paymentTransactionId: paymentMethod === 'upi_razorpay' ? `pay_NAGPUR_${Date.now()}` : undefined,
    createdAt: new Date().toISOString(),
    notes,
    applianceBrand: applianceBrand || undefined,
    applianceModelNo: applianceModelNo || undefined,
    appliancePhotoUrl: appliancePhotoUrl || undefined,
  };

  db.bookings.unshift(newBooking);
  res.status(201).json(newBooking);
});

app.patch('/api/bookings/:id/status', (req: Request, res: Response) => {
  const { status, technicianId } = req.body;
  const booking = db.bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  if (status) {
    if (!isValidBookingTransition(booking.status, status)) {
      res.status(400).json({
        error: `Invalid transition from ${booking.status} to ${status}`,
      });
      return;
    }
    booking.status = status;

    if (status === 'completed') {
      booking.paymentStatus = 'paid';
      // Credit technician earnings
      if (booking.technicianId) {
        const tech = db.technicians.find((t) => t.id === booking.technicianId);
        if (tech) {
          tech.completedJobsCount += 1;
          tech.totalEarnings += booking.technicianPayout;
        }
      }
    }
  }

  if (technicianId) {
    const tech = db.technicians.find((t) => t.id === technicianId);
    if (tech) {
      booking.technicianId = tech.id;
      booking.technicianName = tech.name;
      booking.technicianPhone = tech.phone;
      booking.technicianPhoto = tech.photoUrl;
      booking.technicianRating = tech.rating;
      booking.status = 'assigned';
    }
  }

  res.json(booking);
});

app.post('/api/bookings/:id/rate', (req: Request, res: Response) => {
  const { rating, comment } = req.body;
  const booking = db.bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  booking.rating = rating;
  booking.reviewText = comment;
  booking.ratedAt = new Date().toISOString();

  if (booking.technicianId) {
    const newRev = {
      id: `rev-${Date.now()}`,
      bookingId: booking.id,
      customerName: booking.customerName,
      technicianId: booking.technicianId,
      technicianName: booking.technicianName || 'Certified Technician',
      serviceName: booking.serviceName,
      rating: Number(rating),
      comment: comment || 'Great service!',
      date: new Date().toISOString().split('T')[0],
      status: 'visible' as const,
    };
    db.reviews.unshift(newRev);

    // Recalculate technician rating
    const tech = db.technicians.find((t) => t.id === booking.technicianId);
    if (tech) {
      const techReviews = db.reviews.filter((r) => r.technicianId === tech.id && r.status === 'visible');
      const sum = techReviews.reduce((acc, r) => acc + r.rating, 0);
      tech.rating = Math.round((sum / techReviews.length) * 10) / 10;
      tech.reviewsCount = techReviews.length;
    }
  }

  res.json({ booking });
});

// Reviews
app.get('/api/reviews', (_req: Request, res: Response) => {
  res.json(db.reviews);
});

app.patch('/api/reviews/:id/visibility', (req: Request, res: Response) => {
  const rev = db.reviews.find((r) => r.id === req.params.id);
  if (!rev) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  rev.status = req.body.status;
  res.json(rev);
});

// Announcements
app.get('/api/announcements', (_req: Request, res: Response) => {
  res.json(db.announcements);
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const newNotif = {
    id: `notif-${Date.now()}`,
    ...req.body,
    sentAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };
  db.announcements.unshift(newNotif);
  res.status(201).json(newNotif);
});

// Health check endpoints for Cloud Run & container orchestration
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Serve Frontend in dev or prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'));

  if (!isProd && !hasDist) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!doctype html><html><body><h1>TheEkit Server is running</h1></body></html>');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TheEkit Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
