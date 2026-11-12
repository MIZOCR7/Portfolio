export const PROFILE = {
  name: 'Ziad Emad',
  fullName: 'Ziad Emad Ahmed',
  role: 'Computer vision & embedded AI',
  email: 'ziad.1024087@stemoctober.moe.edu.eg',
  github: 'https://github.com/MIZOCR7',
  linkedin: 'https://www.linkedin.com/in/ziad-emad-470604400',
  school: 'STEM High School for Boys — 6th of October',
  location: '6th of October City, Egypt',
  updated: 'November 2026',
}

export const LEDE =
  'I am a Grade 12 student at STEM High School in 6th of October, Egypt. Most of what I do sits at the edge of two things: a neural network that has to be right, and a machine that has to actually move. Right now I am finishing a small rover that drives inside water pipes and marks corrosion and cracks as it goes.'

export const FACTS = [
  { label: 'Based in', value: '6th of October City, Egypt' },
  { label: 'Focus', value: 'Computer vision · embedded AI' },
  { label: 'Now', value: 'Grade 12 · applying for Computer Engineering' },
]

export const MARQUEE = [
  'Python',
  'PyTorch',
  'Ultralytics YOLO11',
  'OpenCV',
  'C++',
  'Arduino',
  'ESP32',
  'React',
  'TypeScript',
  'Blender',
  'LaTeX',
  'Git',
]

export type Spec = { k: string; v: string }

export const FEATURE = {
  id: '001',
  kicker: 'Capstone · 2025—2026',
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
    kicker: 'Grade 11 capstone',
    title: 'Sprout',
    description:
      'A greenhouse companion built with our capstone team: live soil-moisture, temperature and light readings feed an animated plant that reacts in real time, and a voice button waters it hands-free.',
    image: '/img/sprout.jpg',
    alt: 'Laptop on a workbench running the Sprout plant dashboard with sensor readings',
    tags: ['Arduino', 'Python', 'HTML / JS'],
    links: [
      { label: 'Greenhouse repo', href: 'https://github.com/MIZOCR7/GreenHouse-project' },
      { label: '3D design', href: 'https://github.com/MIZOCR7/3D-design-for-the-greenhouse' },
    ],
  },
  {
    id: '003',
    kicker: 'Geo Club',
    title: 'Club platform',
    description:
      'Website and backend for our school geography club — event pages, member showcases and a small API behind them. My first project that other people actually had to use.',
    image: null,
    tile: 'GEO',
    alt: '',
    tags: ['HTML / CSS', 'JavaScript', 'Node', 'Vercel'],
    links: [
      { label: 'Live site', href: 'https://ui-geo-club.vercel.app' },
      { label: 'Backend', href: 'https://github.com/MIZOCR7/GEO_CLUB_BACKEND' },
    ],
  },
]

export const MINOR = [
  {
    name: 'Terminal-Craft',
    stack: 'Python · terminal game',
    href: 'https://github.com/MIZOCR7/Terminal-Craft',
  },
  {
    name: 'AI UI',
    stack: 'TypeScript · interface study',
    href: 'https://ai-ui-wine.vercel.app',
  },
  {
    name: 'Study Timer',
    stack: 'HTML · focus timer',
    href: 'https://github.com/MIZOCR7/Study_Timer',
  },
  {
    name: 'PIL Image Filters',
    stack: 'Python · batch image tooling',
    href: 'https://github.com/MIZOCR7/PIL-image-filter-',
  },
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

export const TOOLKIT = [
  {
    title: 'Modelling',
    items: [
      { name: 'Python', note: 'daily' },
      { name: 'PyTorch', note: '' },
      { name: 'Ultralytics YOLO', note: '' },
      { name: 'OpenCV', note: '' },
      { name: 'NumPy · pandas', note: '' },
      { name: 'Matplotlib', note: '' },
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
      { name: 'Blender', note: '3D' },
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
      { name: 'Video editing', note: '' },
      { name: 'Poster design', note: '' },
      { name: 'Technical writing', note: '' },
      { name: 'Arabic', note: 'native' },
      { name: 'English', note: 'fluent' },
    ],
  },
]

export const TIMELINE = [
  {
    year: '2023—2026',
    what: 'STEM High School for Boys — 6th of October',
    sub: 'Grade 12 · capstone track in AI and engineering',
    note: '6th of October City, Egypt',
  },
  {
    year: '2025—2026',
    what: 'Capstone — Pipe Inspector',
    sub: 'Dataset engineering, segmentation model, rover firmware',
    note: 'Team project · AI + embedded',
  },
  {
    year: '2026',
    what: 'International Science & Engineering Fair',
    sub: 'Presented a research poster to judges and visitors',
    note: 'School science fair',
  },
  {
    year: '—',
    what: 'ACPC — Arab Collegiate Programming Contest',
    sub: 'Contestant: algorithms and problem solving against the clock',
    note: 'School team',
  },
  {
    year: '2026',
    what: 'Geo Club — web platform',
    sub: 'Built and shipped the club site and its backend',
    note: 'ui-geo-club.vercel.app',
  },
]
