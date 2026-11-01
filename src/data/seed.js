// Starting data. Mock mode mein yahi data localStorage mein save hota hai.
// Backend banne ke baad yahi data MongoDB mein seed kar dena.
// NOTE: Team ke naam / HCPC numbers placeholder hain - client se asli details lena.

export const seedSettings = {
  clinicName: 'DeePhysio',
  legalName: 'DeePhysiotherapy Limited',
  tagline: 'From pain to progress, one step at a time',
  heroTitle: 'Hands-on physiotherapy to help you move with confidence again',
  heroSubtitle:
    'Personalised assessment and treatment for back and neck pain, sports injuries, joint stiffness and post-operative rehabilitation in Smethwick, Birmingham.',
  phone: '07737 610615',
  phoneHref: '+447737610615',
  email: 'deephysioclinic@gmail.com',
  address: '7 Frank Road, Smethwick, Birmingham, B67 7NR',
  mapEmbedUrl:
    'https://www.google.com/maps?q=7+Frank+Road,+Smethwick,+Birmingham+B67+7NR&output=embed',
  bookingUrl: 'https://openemr.deephysio.co.uk/',
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
  pricing: [
    { name: 'Initial assessment', duration: '45 mins', price: '£50' },
    { name: 'Follow-up appointment', duration: '30 mins', price: '£45' },
    { name: 'Local home visit (up to 10 miles)', duration: '45 mins', price: '£80' },
    { name: 'Home visit (over 10 miles)', duration: '45 mins', price: '£130' },
  ],
  conditions: [
    'Back & neck pain',
    'Sports injuries',
    'Joint stiffness',
    'Post-operative rehab',
    'Sprains & strains',
    'Posture-related pain',
  ],
  companyNumber: '12086022',
}

export const seedServices = [
  {
    _id: 's1',
    slug: 'manual-therapy',
    title: 'Manual Therapy',
    icon: 'Hand',
    summary: 'Skilled hands-on techniques for joints and soft tissues.',
    body: 'Manual therapy uses controlled, hands-on techniques applied to joints and soft tissues. Your physiotherapist will explain each technique before using it, and it is usually combined with exercise as part of a wider treatment plan.',
    helpsWith: ['Stiff joints', 'Back and neck discomfort', 'Reduced range of movement'],
    order: 1,
  },
  {
    _id: 's2',
    slug: 'mobilisation',
    title: 'Mobilisation',
    icon: 'Move',
    summary: 'Gentle, graded movements to ease stiffness.',
    body: 'Mobilisation involves slow, repeated movements of a joint within a comfortable range. It is a gentle option that can form part of care for people whose movement feels restricted.',
    helpsWith: ['Stiffness after injury', 'Frozen-feeling shoulders', 'Lower back tightness'],
    order: 2,
  },
  {
    _id: 's3',
    slug: 'exercise-therapy',
    title: 'Exercise Rehabilitation',
    icon: 'Dumbbell',
    summary: 'A tailored programme you can continue at home.',
    body: 'We design an exercise programme around your goals and current ability, then progress it as you improve. You will leave each session clear on what to do and why.',
    helpsWith: ['Returning to sport', 'Recovery after surgery', 'Building strength and balance'],
    order: 3,
  },
  {
    _id: 's4',
    slug: 'electrotherapy',
    title: 'Electrotherapy',
    icon: 'Zap',
    summary: 'Non-invasive electrical modalities used alongside other care.',
    body: 'Electrotherapy uses low-level electrical currents and is non-invasive. Where appropriate, it is used alongside manual therapy and exercise rather than on its own.',
    helpsWith: ['Muscle activation', 'Supporting a wider treatment plan'],
    order: 4,
  },
  {
    _id: 's5',
    slug: 'traction',
    title: 'Traction',
    icon: 'ArrowUpDown',
    summary: 'Controlled gentle stretch for the spine or a joint.',
    body: 'Traction applies a gentle, controlled stretch to the spine or a specific joint. Your physiotherapist will assess whether it is suitable for you before it is offered.',
    helpsWith: ['Selected neck and back presentations'],
    order: 5,
  },
  {
    _id: 's6',
    slug: 'biomechanical-assessment',
    title: 'Biomechanical Assessment',
    icon: 'ScanLine',
    summary: 'A detailed look at how you move, stand and walk.',
    body: 'A biomechanical assessment looks at posture, movement patterns and how forces travel through your body. The findings help shape a treatment plan that fits you.',
    helpsWith: ['Recurring injuries', 'Running and walking discomfort', 'Posture concerns'],
    order: 6,
  },
]

export const seedTeam = [
  {
    _id: 't1',
    name: 'Practitioner Name',
    role: 'Lead Physiotherapist & Clinic Director',
    qualifications: 'BSc (Hons) Physiotherapy',
    hcpc: 'PH000000',
    csp: true,
    bio: 'Placeholder bio - replace with the practitioner’s real background, areas of interest and years of experience.',
  },
  {
    _id: 't2',
    name: 'Practitioner Name',
    role: 'Physiotherapist',
    qualifications: 'MSc Physiotherapy',
    hcpc: 'PH000000',
    csp: true,
    bio: 'Placeholder bio - replace with the practitioner’s real background, areas of interest and years of experience.',
  },
]

export const seedFaqs = [
  {
    _id: 'f1',
    q: 'Do I need a GP referral?',
    a: 'No. You can book directly with us without a referral.',
  },
  {
    _id: 'f2',
    q: 'What should I wear to my appointment?',
    a: 'Comfortable, loose clothing that lets us see and move the area being treated.',
  },
  {
    _id: 'f3',
    q: 'How many sessions will I need?',
    a: 'It varies from person to person. After your initial assessment we will talk you through a suggested plan.',
  },
  {
    _id: 'f4',
    q: 'Do you offer home visits?',
    a: 'Yes. Local home visits are available within 10 miles, and further afield at a different rate.',
  },
]

export const seedEnquiries = [
  {
    _id: 'e1',
    name: 'Sample Patient',
    contact: 'sample@example.com',
    preferredTime: 'Morning',
    message: 'Hi, I would like to book an initial assessment for knee pain.',
    status: 'new',
    createdAt: new Date().toISOString(),
  },
]

// Demo login (sirf mock mode ke liye). Backend mein bcrypt hashed password hoga.
export const seedUsers = [
  { _id: 'u1', name: 'Site Admin', email: 'admin@deephysio.co.uk', password: 'admin123', role: 'admin' },
  { _id: 'u2', name: 'Reception', email: 'editor@deephysio.co.uk', password: 'editor123', role: 'editor' },
]
