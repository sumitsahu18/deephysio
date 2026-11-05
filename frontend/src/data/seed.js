// Starting content. Mock mode mein yahi data localStorage mein save hota hai,
// backend banne ke baad yahi MongoDB mein seed hoga.
//
// TEXT SOURCE: PDF (RFP) mein website ka copy nahi diya hai, isliye text clinic ki
// current site deephysio.co.uk se liya hai (CAP/ASA ke hisaab se "claims" hata ke).
// Team ke naam / HCPC numbers placeholder hain - client se lene hain.
import { IMAGES } from './images.js'

// Default glass theme (index.css ke @theme jaisa hi). Theme Settings mein "Reset" isi par le jata hai.
export const DEFAULT_THEME = {
  primary: '#0369a1', // links, small headings, icons
  secondary: '#e0f2fe', // Soft Sky - panels / gradients
  accent: '#fde047', // Light Yellow - yellow cards
  background: '#fafbfb', // Off-White
  button: '#fde047', // Light Yellow buttons
  buttonText: '#1e293b', // Deep Slate
  text: '#1e293b', // Deep Slate
}

// ---------------------------------------------------------------------------
// 1) SITE SETTINGS - sirf ADMIN badal sakta hai (PDF: editor "site-wide settings" nahi badlega)
// ---------------------------------------------------------------------------
export const seedSite = {
  clinicName: 'DeePhysio',
  legalName: 'DeePhysiotherapy Limited',
  companyNumber: '12086022',
  // Client ke order form se (PDF mein nahi): social icons + WhatsApp
  facebookUrl: 'https://facebook.com/',
  instagramUrl: 'https://instagram.com/',
  youtubeUrl: '',
  twitterUrl: '',
  whatsapp: '447737610615', // country code ke saath, bina + aur spaces ke. Khali = button hide
  footerText: 'Hands-on, HCPC-registered physiotherapy in Smethwick, Birmingham.',
  logoUrl: '', // Admin > General Settings > Logo. Khali = default logo
  // Admin > Theme Settings. Ye colours poori website (aur admin) par CSS variables ban ke lagte hain.
  theme: { ...DEFAULT_THEME },
}

// ---------------------------------------------------------------------------
// 2) CLINIC DETAILS - reception/editor badal sakta hai (PDF: "text, hours, and contact
//    information must be easily manageable by our reception")
// ---------------------------------------------------------------------------
export const seedClinic = {
  phone: '077 3761 0615',
  phoneHref: '+447737610615',
  email: 'deephysioclinic@gmail.com',
  address: '7 Frank Road, Smethwick, Birmingham, B67 7NR',
  mapEmbedUrl: 'https://www.google.com/maps?q=7+Frank+Road,+Smethwick,+Birmingham+B67+7NR&output=embed',
  languages: ['English', 'Hindi', 'Gujarati', 'Punjabi'],
  hours: [
    { day: 'Monday', time: '09:00 - 17:00' },
    { day: 'Tuesday', time: '09:00 - 17:00' },
    { day: 'Wednesday', time: '09:00 - 17:00' },
    { day: 'Thursday', time: '09:00 - 17:00' },
    { day: 'Friday', time: '09:00 - 17:00' },
    { day: 'Saturday', time: '09:00 - 15:00' },
    { day: 'Sunday', time: 'Closed' },
  ],
}

// ---------------------------------------------------------------------------
// 3) PAGE CONTENT - har page ka headline / paragraph / image (Zero Hardcoding Policy)
// ---------------------------------------------------------------------------
export const seedPages = {
  home: {
    welcome: 'Welcome To',
    tagline: 'From Pain to Progress – One Step at a Time',
    intro:
      'Expert, hands-on physiotherapy in Smethwick, Birmingham, designed to help you move better, feel stronger and get back to what you love.',
    heroImage: IMAGES.hero,
    backgroundImage: IMAGES.clinic,
    conditionsTitle: 'Conditions we treat',
    conditions: [
      'Back & neck pain',
      'Sports injuries',
      'Joint pain & stiffness',
      'Post-operative rehabilitation',
      'Sprains & strains',
      'Posture-related problems',
    ],
    credentials: ['HCPC registered physiotherapists', 'Members of the Chartered Society of Physiotherapy'],
    noticeTitle: 'Please note',
    notice:
      'Appointments are arranged by phone or through our enquiry form. If you need urgent medical help, please call NHS 111, or 999 in an emergency.',
    bandTitle: 'Easy enquiries, available anytime',
    bandText: 'Send us a quick message and our reception team will contact you to arrange a time that suits you.',
    bandImage: IMAGES.band,
    servicesTitle: 'Our Services',
    testimonialsTitle: 'Patient Testimonials',
    servicesEyebrow: 'What we do',
    feature1: {
      eyebrow: 'About us',
      title: 'Personalised, hands-on care',
      text: 'At DeePhysiotherapy we take time to make sure you fully understand your diagnosis, your treatment options and your progress, so you can take an active role in your recovery.',
      image: IMAGES.about,
      cta: 'Meet Our Team',
    },
    feature2: {
      eyebrow: 'Home visits',
      title: 'Physiotherapy at Home',
      text: 'Can’t make it to the clinic? Our physiotherapists can visit you at home, locally within 10 miles and further afield.',
      image: IMAGES.homeVisits,
      cta: 'Enquire About a Home Visit',
    },
  },
  about: {
    title: 'About & Team',
    intro:
      'At DeePhysiotherapy, we’re committed to helping you move better, feel stronger, and recover faster.',
    headerImage: IMAGES.aboutHeader,
    bodyTitle: 'Our approach',
    body:
      'Based in Smethwick, Birmingham, our clinic provides expert, hands-on physiotherapy for pain, mobility and overall wellbeing. We offer manual therapy, exercise rehabilitation, electrotherapy, traction and biomechanical assessments.\n\nOur approach is rooted in clear communication and compassionate care. We make sure you fully understand your diagnosis, treatment options, and progress so you can take an active role in your recovery.',
    credentialsTitle: 'Registered & regulated',
    hcpcText:
      'Every physiotherapist at our clinic is registered with the Health & Care Professions Council (HCPC), the UK regulator for physiotherapists.',
    cspText:
      'Our physiotherapists are members of the Chartered Society of Physiotherapy (CSP), the professional body for physiotherapy in the UK.',
    teamTitle: 'Meet our physiotherapists',
  },
  services: {
    title: 'Services & Treatments',
    intro:
      'Every plan starts with a thorough assessment. Your physiotherapist will explain the options and agree a treatment plan with you.',
    headerImage: IMAGES.servicesHeader,
    disclaimer:
      'Treatment is tailored to each person and individual results vary. The information on this website is general and is not a substitute for an assessment by a qualified healthcare professional.',
    insuranceTitle: 'Private Medical Insurance',
    insuranceText:
      'DeePhysio works with major private medical insurance providers, including Bupa, AXA Health, Aviva and Vitality.',
    insurancePreAuth:
      'Patients must obtain pre-authorisation from their insurance provider before booking if they want direct clinic billing. Patients should confirm their individual policy coverage before treatment.',
    paymentTitle: 'Payment Information',
    paymentMethods: [
      'Cash accepted',
      'Bank transfer accepted',
      'Self-pay patients must pay after each session',
    ],
    paymentInstructions:
      'We accept cash and direct bank transfer. Self-pay patients must pay after each session. Invoices and receipts are provided for all treatments.',
    cancellationTitle: 'Cancellation & Rescheduling Policy',
    cancellationPolicy:
      "At least 24 hours' notice is required for cancellations or rescheduling. Late cancellations or changes may incur a fee.",
  },
  contact: {
    title: 'Contact & Booking Enquiry',
    intro: 'Send us an enquiry and our team will contact you to arrange your appointment. Prefer to talk? Give us a call.',
    headerImage: IMAGES.contactHeader,
    formTitle: 'Booking enquiry',
    messageHint: 'Briefly tell us how we can help. Please don’t include detailed medical information.',
    successTitle: 'Thank you, we have received your enquiry',
    successText: 'Our team will be in touch with you shortly.',
  },
  faq: {
    title: 'Frequently Asked Questions',
    intro: 'Quick answers about appointments, what to expect and how we work. Can’t find what you need? Give us a call.',
    headerImage: IMAGES.servicesHeader,
    ctaTitle: 'Still have a question?',
    ctaText: 'Our reception team is happy to help. Call us or send an enquiry and we will get back to you.',
  },
  privacy: {
    title: 'Privacy Policy',
    body:
      'This is placeholder text. DeePhysiotherapy Limited should supply its own privacy policy describing how enquiry details are collected, stored, used and deleted under UK GDPR.\n\nOur enquiry form only collects your name, contact details, preferred contact time and message. These are used only to respond to your enquiry.',
  },
}

// ---------------------------------------------------------------------------
// 4) SERVICES - live site ke 6 treatments (same URLs: /services/manipulation etc.)
//    Copy "describes care", koi guaranteed result / cure claim nahi (UK CAP Code / ASA)
// ---------------------------------------------------------------------------
export const seedServices = [
  {
    _id: 's1',
    slug: 'manipulation',
    title: 'Manipulation',
    icon: 'Hand',
    image: IMAGES.services.manipulation,
    summary: 'A skilled, hands-on approach to assessing and treating joints and soft tissues.',
    body: 'Manipulation, also known as manual therapy, is a hands-on approach used by physiotherapists to assess and treat a range of musculoskeletal conditions. It involves the skilled use of the therapist’s hands to apply controlled forces to joints and soft tissues, with the aim of improving movement and comfort.\n\nManipulation is usually used alongside other physiotherapy techniques and exercises as part of a wider treatment plan.',
    helpsWith: ['Stiff or restricted joints', 'Back and neck problems', 'Reduced range of movement'],
    order: 1,
  },
  {
    _id: 's2',
    slug: 'mobilisation',
    title: 'Mobilisation',
    icon: 'Move',
    image: IMAGES.services.mobilisation,
    summary: 'Gentle, graded movements of a joint within a comfortable range.',
    body: 'Mobilisation involves slow, repeated movements of a joint, performed by your physiotherapist within a range that feels comfortable for you. It is a gentle hands-on technique that can form part of a treatment plan when movement feels restricted.',
    helpsWith: ['Stiffness after injury', 'Shoulder and hip stiffness', 'Lower back tightness'],
    order: 2,
  },
  {
    _id: 's3',
    slug: 'electrotherapy',
    title: 'Electrotherapy',
    icon: 'Zap',
    image: IMAGES.services.electrotherapy,
    summary: 'Non-invasive electrical modalities used as part of a wider plan.',
    body: 'Electrotherapy is a common modality in physiotherapy that uses low-level electrical currents. It is non-invasive and, where appropriate, is used as one component of a comprehensive physiotherapy treatment plan. Different types of electrical modality serve different purposes, and your physiotherapist will explain which is being used and why.',
    helpsWith: ['Muscle activation', 'Supporting a wider treatment plan'],
    order: 3,
  },
  {
    _id: 's4',
    slug: 'exercise-therapy',
    title: 'Exercise Therapy',
    icon: 'Dumbbell',
    image: IMAGES.services['exercise-therapy'],
    summary: 'Specific exercises tailored to your needs and goals.',
    body: 'Exercise therapy, also known as therapeutic exercise, is a fundamental part of physiotherapy and rehabilitation. It uses specific exercises and physical activities tailored to your needs and goals, and is progressed as you improve. You will leave each session clear on what to do at home and why.',
    helpsWith: ['Recovery from injury', 'Rehabilitation after surgery', 'Building strength and balance'],
    order: 4,
  },
  {
    _id: 's5',
    slug: 'traction',
    title: 'Traction',
    icon: 'ArrowUpDown',
    image: IMAGES.services.traction,
    summary: 'A controlled, gentle stretch for the spine or a specific joint.',
    body: 'Traction is a physiotherapy modality that applies a controlled mechanical force to gently stretch and decompress the spine or a specific joint. Your physiotherapist will assess whether traction is suitable for you before it is offered, and it is usually part of a wider treatment plan.',
    helpsWith: ['Selected neck and back presentations'],
    order: 5,
  },
  {
    _id: 's6',
    slug: 'biomechanical-assessment',
    title: 'Biomechanical Assessment',
    icon: 'ScanLine',
    image: IMAGES.services['biomechanical-assessment'],
    summary: 'A detailed look at how you move, stand and walk.',
    body: 'A biomechanical assessment is a specialised evaluation of the mechanical aspects of your musculoskeletal system, including posture and movement. The findings help your physiotherapist understand how you move and shape a treatment plan that fits you.',
    helpsWith: ['Recurring injuries', 'Walking and running discomfort', 'Posture concerns'],
    order: 6,
  },
  {
    _id: 's7',
    slug: 'clinical-acupuncture-dry-needling',
    title: 'Clinical Acupuncture & Dry Needling',
    provider: 'Performed by an AACP-registered Chartered Physiotherapist.',
    icon: 'Zap',
    image: IMAGES.services.acupuncture,
    summary:
      'We integrate sterile, single-use clinical acupuncture into personalized rehabilitation plans to reduce localized inflammation, release tight myofascial bands, and trigger natural pain relief.',
    body:
      'We integrate sterile, single-use clinical acupuncture into personalized rehabilitation plans to reduce localized inflammation, release tight myofascial bands, and trigger natural pain relief.\n\nPerformed by an AACP-registered Chartered Physiotherapist, our evidence-informed clinical acupuncture and dry needling treatments target myofascial trigger points and neuromusculoskeletal tension.\n\nAll treatments use pre-sterilised, single-use disposable needles in accordance with strict UK clinical hygiene and safety guidelines.\n\nYour physiotherapist will conduct a comprehensive assessment beforehand to ensure suitability and integrate needling seamlessly into your overall recovery program.',
    helpsWith: [
      'Trigger point release',
      'Sciatica',
      'Tension headaches',
      'Neck/back stiffness',
      'Chronic joint pain',
      'Acute muscle spasms',
    ],
    order: 7,
  },
]

// ---------------------------------------------------------------------------
// 5) TEAM - "named practitioners" + HCPC / CSP badges (PLACEHOLDER - client se lena)
// ---------------------------------------------------------------------------
export const seedTeam = [
  {
    _id: 't1',
    name: 'Practitioner Name',
    role: 'Lead Physiotherapist & Clinic Director',
    qualifications: 'BSc (Hons) Physiotherapy',
    hcpc: 'PH000000',
    csp: true,
    photo: '',
    bio: 'Placeholder bio. Replace with the practitioner’s real background, qualifications and areas of interest.',
    order: 1,
  },
  {
    _id: 't2',
    name: 'Practitioner Name',
    role: 'Physiotherapist',
    qualifications: 'MSc Physiotherapy',
    hcpc: 'PH000000',
    csp: true,
    photo: '',
    bio: 'Placeholder bio. Replace with the practitioner’s real background, qualifications and areas of interest.',
    order: 2,
  },
]

// ---------------------------------------------------------------------------
// FAQs - Admin > FAQs se add / edit / delete (editor bhi add/edit kar sakta hai)
// ---------------------------------------------------------------------------
export const seedFaqs = [
  { _id: 'f1', order: 1, q: 'Do I need a GP referral?', a: 'No. You can book directly with us without a referral.' },
  { _id: 'f2', order: 2, q: 'What should I wear to my appointment?', a: 'Comfortable, loose clothing that lets us see and move the area being treated.' },
  { _id: 'f3', order: 3, q: 'What happens at my first appointment?', a: 'Your physiotherapist will ask about your symptoms and history, carry out an assessment and talk you through the options before agreeing a treatment plan with you.' },
  { _id: 'f4', order: 4, q: 'How many sessions will I need?', a: 'It varies from person to person. After your initial assessment we will talk you through a suggested plan.' },
  { _id: 'f5', order: 5, q: 'Do you offer home visits?', a: 'Yes. Local home visits are available. Please call us to check availability for your area.' },
  { _id: 'f6', order: 6, q: 'Which languages do you speak?', a: 'Our team can help you in English, Hindi, Gujarati and Punjabi.' },
]

// ---------------------------------------------------------------------------
// TESTIMONIALS - Admin > Testimonials. SIRF asli patient reviews daalna (Google reviews se,
// patient ki permission ke saath) - UK CAP Code / ASA. Ye ek SAMPLE hai, client ke reviews aate hi delete karo.
// Koi testimonial na ho to Home par section apne aap chhup jata hai.
// ---------------------------------------------------------------------------
export const seedTestimonials = [
  {
    _id: 't1',
    order: 1,
    name: 'Sample review',
    text: 'This is a sample card to show the layout. Replace it with a real patient review (for example from Google) in Admin → Testimonials.',
    rating: 5,
    source: 'Placeholder',
  },
]

// Media library (Admin > Media / Images). Upload ki hui images yahan list hoti hain.
export const seedMedia = []

// Accreditations & Professional Registrations (HCPC, CSP, AACP)
export const seedAccreditations = [
  {
    _id: 'acc1',
    name: 'HCPC',
    fullName: 'Health & Care Professions Council',
    description: 'UK statutory regulator protecting the public by regulating health and care professionals.',
    logoUrl: '',
    active: true,
    order: 1,
  },
  {
    _id: 'acc2',
    name: 'CSP',
    fullName: 'Chartered Society of Physiotherapy',
    description: 'The professional, educational and trade union body for chartered physiotherapists in the UK.',
    logoUrl: '',
    active: true,
    order: 2,
  },
  {
    _id: 'acc3',
    name: 'AACP',
    fullName: 'Acupuncture Association of Chartered Physiotherapists',
    description: 'UK professional association representing chartered physiotherapists practicing acupuncture.',
    logoUrl: '',
    active: true,
    order: 3,
  },
]

// Micro-Trust Badges / USPs (24h appointments, self-referral, free parking)
export const seedTrustBadges = [
  {
    _id: 'tb1',
    message: 'Appointments available within 24 hours',
    icon: 'Clock',
    active: true,
    order: 1,
  },
  {
    _id: 'tb2',
    message: 'No GP referral necessary (self-referral welcome)',
    icon: 'UserCheck',
    active: true,
    order: 2,
  },
  {
    _id: 'tb3',
    message: 'Free on-site / street parking',
    icon: 'Car',
    active: true,
    order: 3,
  },
]

// Dedicated Pricing & Session Breakdown (Exact client figures and travel radius)
export const seedPricing = [
  {
    _id: 'p1',
    name: 'Initial Assessment & Treatment',
    duration: '45 minutes',
    price: 50,
    category: 'clinic',
    notes: 'Full history, physical assessment, and first treatment plan.',
    active: true,
    order: 1,
  },
  {
    _id: 'p2',
    name: 'Follow-up Appointment',
    duration: '30 minutes',
    price: 45,
    category: 'clinic',
    notes: 'Progress review and hands-on therapy.',
    active: true,
    order: 2,
  },
  {
    _id: 'p3',
    name: 'Local Home Visit',
    duration: '45 minutes',
    price: 80,
    category: 'home_visit',
    notes: 'Up to a 10-mile radius from clinic.',
    active: true,
    order: 3,
  },
  {
    _id: 'p4',
    name: 'Extended Home Visit',
    duration: '45 minutes',
    price: 130,
    category: 'home_visit',
    notes: 'Over a 10-mile radius from clinic.',
    active: true,
    order: 4,
  },
]

// Private Medical Insurance Providers (Bupa, AXA Health, Aviva, Vitality)
export const seedInsurers = [
  {
    _id: 'ins1',
    name: 'Bupa',
    logoUrl: '',
    notes: 'Direct billing available with pre-authorisation number.',
    active: true,
    order: 1,
  },
  {
    _id: 'ins2',
    name: 'AXA Health',
    logoUrl: '',
    notes: 'Pre-authorisation code required prior to treatment.',
    active: true,
    order: 2,
  },
  {
    _id: 'ins3',
    name: 'Aviva',
    logoUrl: '',
    notes: 'Direct settlement subject to policy excess & pre-authorisation.',
    active: true,
    order: 3,
  },
  {
    _id: 'ins4',
    name: 'Vitality',
    logoUrl: '',
    notes: 'Pre-approved physiotherapy treatments accepted.',
    active: true,
    order: 4,
  },
]

export const seedLocations = [
  {
    _id: 'loc1',
    name: 'DeePhysio Smethwick',
    address: '7 Frank Road, Smethwick, Birmingham',
    postcode: 'B67 7NR',
    phone: '077 3761 0615',
    email: 'deephysioclinic@gmail.com',
    hours: 'Monday–Friday: 09:00–17:00\nSaturday: 09:00–15:00\nSunday: Closed',
    mapUrl: 'https://www.google.com/maps?q=7+Frank+Road,+Smethwick,+Birmingham+B67+7NR&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=7+Frank+Road,+Smethwick,+Birmingham+B67+7NR',
    active: true,
    order: 1,
  },
]

export const seedEnquiries = []

// Demo login (sirf mock mode). Backend mein bcrypt-hashed password hoga.
export const seedUsers = [
  { _id: 'u1', name: 'Site Admin', email: 'admin@deephysio.co.uk', password: 'admin123', role: 'admin' },
  { _id: 'u2', name: 'Reception', email: 'editor@deephysio.co.uk', password: 'editor123', role: 'editor' },
]
