export const PROFILE = {
  name: 'Ziad Emad',
  fullName: 'Ziad Emad Ahmed Metwally Salem',
  role: 'Computer vision & embedded AI',
  email: 'zemad1665@gmail.com',
  github: 'https://github.com/MIZOCR7',
  linkedin: 'https://www.linkedin.com/in/ziad-emad-470604400',
  school: 'STEM High School for Boys — 6th of October',
  location: '6th of October City, Egypt',
  updated: 'November 2026',
  portfolio: 'portfolio-2kkf.vercel.app',
}

export const LEDE =
  'Finalist at the Egypt Science & Engineering Fair 2026 with a pest-detection system for Egyptian farms, and the student behind a rover that finds corrosion inside pipes. I am 17, I study at STEM October, and the next four years belong to METU.'

export const FACTS = [
  { label: 'Based in', value: '6th of October City, Egypt' },
  { label: 'Honours', value: 'ISEF finalist 2026 · ICPC Teens, 31st' },
  { label: 'Next', value: 'Computer Engineering — METU, Ankara' },
]

export const MARQUEE = [
  'Computer vision',
  'PyTorch',
  'YOLO11',
  'Robotics',
  'RAG systems',
  'ISEF finalist',
  'NASA Space Apps',
  'ICPC',
  'Python',
  'Ankara, 2027',
]

export const BAND = ['ISEF finalist 2026', 'Ankara', 'Computer vision', 'STEM October', 'Egypt']

export type Spec = { k: string; v: string }

export const FEATURE = {
  id: '001',
  kicker: 'Grade 12 capstone · 2025—2026',
  title: 'Pipe Inspector',
  subtitle: 'A rover that finds corrosion inside pipes',
  description:
    'A six-wheeled rover that drives into water pipes, streams live video back to a laptop, and runs a YOLO11 segmentation model that outlines every patch of corrosion and every crack, frame by frame.',
  image: '/img/pipe-frame.jpg',
  alt: 'Inspection camera frame of the inside of a concrete pipe with a long crack running through it',
  specs: [
    { k: 'Role', v: 'Dataset, model, rover firmware' },
    { k: 'Hardware', v: '6 wheels · 14 V / 3 A pack' },
    { k: 'Model', v: 'YOLO11 instance segmentation' },
    { k: 'Runtime', v: '≈ 40 minutes per charge' },
  ] as Spec[],
  tags: ['Python', 'Ultralytics', 'OpenCV', 'C++', 'Arduino'],
  links: [
    { label: 'Source on GitHub', href: 'https://github.com/MIZOCR7/Pipe-Inspector' },
    { label: 'Read the case study', href: '#capstone' },
  ],
}

export const PROJECTS = [
  {
    id: '002',
    kicker: 'ISEF national · 2026',
    title: 'Pest Sentinel',
    description:
      'Egypt loses a serious share of its crops to pests that are spotted too late. This project pairs a deep-learning detector with a drone platform so a field can be scanned from above and treated only where it is needed. It reached the Egypt Science & Engineering Fair 2026 as a finalist.',
    image: '/img/certs/isef.jpg',
    alt: 'Egypt Science and Engineering Fair 2026 certificate of appreciation awarded to Ziad Emad Ahmed Metwally',
    tags: ['Deep learning', 'Drones', 'Agriculture'],
    links: [{ label: 'ISEF 2026', href: '#recognition' }],
  },
  {
    id: '003',
    kicker: 'Geology Club · 2026/27',
    title: 'Geology RAG',
    description:
      'A retrieval-augmented system that answers questions from the club’s geological references instead of guessing, wrapped in a chat interface members actually use. Built as AI modelling director of the October Geology Club.',
    image: null,
    tile: 'RAG',
    alt: '',
    tags: ['RAG', 'Python', 'Chat UI'],
    links: [{ label: 'Geology Club', href: '#recognition' }],
  },
]

export const MINOR = [
  {
    name: 'Sprout',
    stack: 'Arduino · greenhouse telemetry',
    href: 'https://github.com/MIZOCR7/GreenHouse-project',
  },
  { name: 'AI UI', stack: 'TypeScript · interface study', href: 'https://ai-ui-wine.vercel.app' },
  { name: 'Terminal-Craft', stack: 'Python · terminal game', href: 'https://github.com/MIZOCR7/Terminal-Craft' },
  { name: 'Study Timer', stack: 'HTML · focus timer', href: 'https://github.com/MIZOCR7/Study_Timer' },
]

export const STATS = [
  { value: '6', label: 'Wheels, one chassis' },
  { value: '2', label: 'Damage classes' },
  { value: '~40 min', label: 'Per charge' },
  { value: '14 V', label: 'Battery pack' },
]

export const CASE_COLUMNS = [
  {
    title: 'The problem',
    body: 'Steel and concrete pipes fail quietly. Inspecting them means draining the line, cutting an access hole, or sending a person into a space that is wet, dark and often unsafe. We wanted a cheap rover that could drive in on its own and point at the exact spot that is failing.',
  },
  {
    title: 'The build',
    body: 'A six-wheel chassis kept taller than 12 cm so spray from standing water never reaches the electronics. A 14 V / 3 A pack is stepped down to a stable rail for the motors, camera and sensors — about forty minutes of run time. An ultrasonic sensor watches the wall distance; the camera streams live to a laptop, which does the heavy inference.',
  },
  {
    title: 'The model',
    body: 'YOLO11 instance segmentation with two classes, corrosion and crack. I merged four public Roboflow sources, removed duplicates, re-checked the labels by hand and kept a separate validation set recorded during our own pipe runs. I read the mAP curves for overfitting instead of optimising one accuracy number.',
  },
]

/* ── the certificate wall ─────────────────────────────── */
export type Certificate = {
  image: string
  title: string
  org: string
  year: string
  note: string
  span?: boolean
}

export const CERTIFICATES: Certificate[] = [
  {
    image: '/img/certs/isef.jpg',
    title: 'Egypt Science & Engineering Fair',
    org: 'ISEF-affiliated national fair',
    year: '2026',
    note: 'Certificate of appreciation, presented by the Deputy Minister for Educational Technology.',
    span: true,
  },
  {
    image: '/img/certs/acpc.jpg',
    title: 'ICPC Egyptian Teens',
    org: 'International Collegiate Programming Contest',
    year: '2026',
    note: 'Thirty-first place in the online qualification, 14 August 2026.',
  },
  {
    image: '/img/certs/nasa.jpg',
    title: 'NASA Space Apps Challenge',
    org: 'NASA International Space Apps',
    year: '2025',
    note: '“Galactic Problem Solver” — outstanding participation, October 2025.',
  },
  {
    image: '/img/certs/earth.jpg',
    title: 'The Earth Prize',
    org: 'Global sustainability competition',
    year: '2026',
    note: 'Participant certificate for the 2026 edition.',
  },
  {
    image: '/img/certs/mal.jpg',
    title: 'STEM Model Arab League',
    org: 'Head of the IT department',
    year: '2026',
    note: 'Awarded for leadership of the IT department across the season.',
  },
  {
    image: '/img/certs/geo.jpg',
    title: 'October Geology Club',
    org: 'AI modelling director',
    year: '2026/27',
    note: 'Certificate of completion for the academic season.',
  },
  {
    image: '/img/certs/ibm.jpg',
    title: 'IBM Machine Learning',
    org: 'Professional certificate',
    year: '2025',
    note: 'Supervised learning, model evaluation and Python tooling.',
  },
]

/* ── METU chapter ─────────────────────────────────────── */
export const ANKARA = {
  coordinates: '39.93° N — 32.85° E',
  title: 'Ankara',
  lead: 'One university, one city, one plan.',
  body: [
    'I have never been to Ankara. Everything I know about METU I know from its work: a campus built around a forest, a computer engineering department that treats research as something you build with your hands, and graduates who go on to solve problems that are bigger than one country.',
    'That is the kind of engineer I am trying to become. Not the kind who stops at a notebook. The kind who builds a rover, drives it into a pipe, and comes back with the frame that proves the crack is there.',
    'Türkiye Bursları is how I get there. METU is why.',
  ],
}

/* ── timeline ─────────────────────────────────────────── */
export const TIMELINE = [
  {
    year: '2023—2026',
    what: 'STEM High School for Boys — 6th of October',
    sub: 'Admitted at 15: 98% on the entrance exam, ranked 245 of ~40,000 candidates',
    note: '6th of October City, Egypt',
  },
  {
    year: '2026',
    what: 'ISEF finalist — Egypt Science & Engineering Fair',
    sub: 'Pest detection for Egyptian farms, presented to national judges',
    note: 'National finalist',
  },
  {
    year: '2026',
    what: 'ICPC Egyptian Teens — 31st place',
    sub: 'Online qualification, 14 August 2026',
    note: 'ACPC / ICPC',
  },
  {
    year: '2026',
    what: 'STEM Model Arab League — Head of IT',
    sub: 'Leading the IT and machine-learning track',
    note: 'Leadership',
  },
  {
    year: '2026—',
    what: 'October Geology Club — AI modelling director',
    sub: 'Retrieval-augmented system over the club’s geological references',
    note: 'Research tooling',
  },
  {
    year: '2025—2026',
    what: 'Resala — STEM leader, Sadat City',
    sub: 'Mentoring local students in hands-on science and engineering',
    note: 'Volunteering',
  },
  {
    year: '2024—',
    what: 'Hack Club — software engineer',
    sub: 'Building projects that solve real problems, with the global Hack Club network',
    note: 'Community',
  },
]

export const TOOLKIT = [
  {
    title: 'Modelling',
    items: [
      { name: 'Python', note: 'daily' },
      { name: 'PyTorch', note: '' },
      { name: 'Ultralytics YOLO', note: '' },
      { name: 'OpenCV', note: '' },
      { name: 'NumPy · pandas', note: '' },
      { name: 'RAG · embeddings', note: '' },
    ],
  },
  {
    title: 'Robotics',
    items: [
      { name: 'C++', note: '' },
      { name: 'Arduino', note: '' },
      { name: 'ESP32', note: '' },
      { name: 'Motor drivers', note: '' },
      { name: 'Ultrasonic · analog sensors', note: '' },
      { name: 'Drone platforms', note: '' },
    ],
  },
  {
    title: 'Software',
    items: [
      { name: 'React', note: '' },
      { name: 'TypeScript', note: '' },
      { name: 'HTML / CSS', note: '' },
      { name: 'Node', note: '' },
      { name: 'Git · GitHub', note: '' },
      { name: 'Vercel', note: '' },
    ],
  },
  {
    title: 'Craft',
    items: [
      { name: 'LaTeX', note: '' },
      { name: 'Technical writing', note: '' },
      { name: 'Poster design', note: '' },
      { name: 'Mentoring', note: '' },
      { name: 'Arabic', note: 'native' },
      { name: 'English', note: 'fluent' },
    ],
  },
]
