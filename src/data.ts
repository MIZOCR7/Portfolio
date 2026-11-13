/* Every word on the site lives in this file. Swap the strings here and the
   whole site changes language, tone or content — no component edits needed. */

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

/* ── 01 · about ───────────────────────────────────────── */

export const ABOUT = {
  kicker: '01 — About',
  title: ['I build things that', 'have to work', 'out there.'],
  lead: 'Nothing I have made so far was allowed to stay on a screen.',
  body: [
    'I am Ziad, seventeen, from 6th of October City. I joined STEM High School for Boys at fifteen — 98% on the entrance exam, 245th of roughly forty thousand — and have spent the three years since between the workshop after class and a laptop at midnight.',
    'Most of what I know arrived by breaking something first. A segmentation model that scored well and then saw nothing in a real pipe. A dataset stitched from four public sources that only became usable once I had re-checked the labels by hand. A greenhouse whose sensors were honest and whose wiring was not.',
    'That is why I keep drifting to the physical end of computer science: a camera inside a pipe, a drone over a field, a probe in soil. A model is easy to draw. Making one survive contact with a real environment is the part I want to spend my life on.',
  ],
  values: [
    {
      k: 'Build, then defend',
      v: 'Every claim I make here has a certificate, a repository or a photograph behind it. If it is not evidenced, it is not on the page.',
    },
    {
      k: 'Read the failure',
      v: 'The useful part of a project is the run that did not work. That is where the next decision comes from.',
    },
    {
      k: 'Teach what you just learned',
      v: 'Python for primary students at the Egyptian Culture Palace, STEM mentoring with Resala, peer tutoring through Schoolhouse.',
    },
  ],
  portraits: [
    { src: '/img/about.jpg', alt: 'Ziad Emad in a dark suit against green foliage', w: 400, h: 400 },
  ],
}

/* ── 02 · selected work ───────────────────────────────── */

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
  video: '/img/pipe-demo.mp4',
  poster: '/img/pipe-poster.jpg',
  videoNote: 'Demo run · 70 seconds · recorded on the bench rig',
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
    kicker: 'Capstone build · climate control',
    title: 'Sprout',
    description:
      'A sealed greenhouse that reports on itself: soil moisture, air temperature and light measured continuously, a relay board that answers with water, a fan, a lamp or heat, and a small companion interface that puts the numbers and a conversation in the same window.',
    image: '/img/archive/build-2.jpg',
    alt: 'The Sprout greenhouse prototype in a classroom, its LCD showing live temperature and humidity',
    tags: ['Arduino', 'Sensors', 'Relays', 'Web UI'],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/MIZOCR7/GreenHouse-project' }],
  },
  {
    id: '004',
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

/* ── 04 · the certificate wall ────────────────────────── */

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
    note: 'Certificate of appreciation for Pest Sentinel, presented by the Deputy Minister for Educational Technology.',
    span: true,
  },
  {
    image: '/img/certs/metu-ai.jpg',
    title: 'Herkes için Yapay Zeka I',
    org: 'Middle East Technical University',
    year: '2026',
    note: 'Artificial intelligence course completed 12 November 2026, signed by the Rector of METU.',
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
    image: '/img/certs/culture.jpg',
    title: 'Programming instructor',
    org: 'Egyptian Culture Palace',
    year: '2026',
    note: 'For designing and teaching a course in computer science fundamentals and Python to primary school students.',
    span: true,
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
    note: 'Certificate of completion for the academic season, signed by the club president and supervisor.',
  },
  {
    image: '/img/certs/metu-study.jpg',
    title: 'Logo similarity user study',
    org: 'QUT × Middle East Technical University',
    year: '2026',
    note: 'Fifty logo-pair judgements for a perception study run jointly by Queensland University of Technology and METU, 12 November 2026.',
    span: true,
  },
  {
    image: '/img/certs/physics.jpg',
    title: 'Physics Brawl Online',
    org: 'Charles University, Prague',
    year: '2024',
    note: 'Team place 324, category C, in the 14th international online competition. The diploma notes it is not a placement certificate.',
  },
  {
    image: '/img/certs/ibm.jpg',
    title: 'IBM Machine Learning',
    org: 'Professional certificate',
    year: '2025',
    note: 'Supervised learning, model evaluation and Python tooling.',
  },
]

export const ALSO_ON_FILE =
  'Also on file: Computer Network Fundamentals · AWS Scholars · Schoolhouse peer tutoring since December 2025 · Be My Eyes volunteer since December 2025'

/* ── 05 · visual archive ──────────────────────────────── */

export type Shot = {
  src: string
  alt: string
  title: string
  meta: string
  ratio: string
  span?: 'wide' | 'tall'
}

export const ARCHIVE: Shot[] = [
  {
    src: '/img/archive/team.jpg',
    alt: 'Four students of the capstone team standing in front of their project poster at school',
    title: 'The team',
    meta: 'Capstone · STEM October',
    ratio: '4 / 3',
    span: 'wide',
  },
  {
    src: '/img/archive/build-2.jpg',
    alt: 'The greenhouse prototype under a clear plastic dome, with an LCD showing live temperature and humidity',
    title: 'Live telemetry',
    meta: 'Sprout · temperature, humidity, light',
    ratio: '4 / 3',
  },
  {
    src: '/img/archive/contest-1.jpg',
    alt: 'Three contestants in maroon ACPC shirts seated at a terminal in a crowded contest hall',
    title: 'Team 3014',
    meta: 'Programming contest, Cairo',
    ratio: '3 / 2',
  },
  {
    src: '/img/archive/model-1.jpg',
    alt: 'Blender viewport showing rows of plants modelled in a field layout',
    title: 'Field layout study',
    meta: 'Pest Sentinel · Blender',
    ratio: '16 / 9',
  },
  {
    src: '/img/archive/build-4.jpg',
    alt: 'The greenhouse dome lit from inside by a bulb during a night test',
    title: 'Night test',
    meta: 'Sprout · lighting relay',
    ratio: '4 / 3',
    span: 'tall',
  },
  {
    src: '/img/archive/contest-2.jpg',
    alt: 'Three students holding their contestant badges on a lawn at night, city lights behind them',
    title: 'After the floor',
    meta: 'Same three, same night',
    ratio: '4 / 3',
  },
  {
    src: '/img/archive/build-1.jpg',
    alt: 'Close view of the greenhouse interior with wiring, a fan and a sensor bundle',
    title: 'Wiring, third revision',
    meta: 'Sprout · sensors and relays',
    ratio: '4 / 3',
  },
  {
    src: '/img/archive/model-2.jpg',
    alt: 'Detailed Blender render of a single planted row with modelled leaves',
    title: 'Row detail',
    meta: 'Pest Sentinel · plant instances',
    ratio: '4 / 3',
  },
  {
    src: '/img/metu-stadium.jpg',
    alt: 'The letters ODTÜ spelled across the concrete steps of the METU stadium under a blue sky',
    title: 'ODTÜ',
    meta: 'Stadium, Ankara',
    ratio: '3 / 4',
    span: 'tall',
  },
  {
    src: '/img/archive/build-3.jpg',
    alt: 'A laptop showing the Sprout interface: a cartoon plant, a chat field and sensor readings',
    title: 'Companion interface',
    meta: 'Sprout · chat and sensor panel',
    ratio: '16 / 9',
    span: 'wide',
  },
]

/* ── 06 · METU ────────────────────────────────────────── */

export const METU = {
  coordinates: '39.93° N — 32.85° E',
  title: 'Ankara',
  year: '2027.',
  lead: 'Two certificates, no campus visit, one plan.',
  body: [
    'The only things METU has sent me so far are certificates: a course in artificial intelligence that I finished in November, and fifty logo-pair judgements for a perception study it runs with Queensland University of Technology. Both are small. Both are why I stopped treating METU as a ranking and started treating it as a place.',
    'What I want from a university is a lab where the work leaves the screen. A computer engineering department whose systems end up inside machines. A campus that is a forest with a university in it. Graduates who solve problems that do not stop at a border. That is the shape of engineer I am trying to become — not the kind who stops at a notebook, the kind who drives a rover into a pipe and comes back with the frame that proves the crack.',
    'Türkiye Bursları is the route. METU is the destination. If I am given four years, I will spend them the way I spent the last three: build the thing, then prove it works.',
  ],
  evidence: [
    {
      image: '/img/certs/metu-ai.jpg',
      alt: 'METU certificate of completion for the Herkes için Yapay Zeka I course',
      title: 'Herkes için Yapay Zeka I',
      org: 'METU · Bilgeİş',
      date: '12 November 2026',
      note: 'A METU online course in artificial intelligence, completed and signed by the rector.',
    },
    {
      image: '/img/certs/metu-study.jpg',
      alt: 'Certificate of participation in the logo similarity user study by QUT and METU',
      title: 'Logo similarity study',
      org: 'QUT × METU',
      date: '12 November 2026',
      note: 'Fifty logo-pair judgements for a joint perception study — small, but the kind of work I want four years of.',
    },
  ],
}

/* ── 08 · journey ─────────────────────────────────────── */

export const TIMELINE = [
  {
    year: '2023—2026',
    what: 'STEM High School for Boys — 6th of October',
    sub: 'Admitted at 15: 98% on the entrance exam, ranked 245 of ~40,000 candidates',
    note: '6th of October City, Egypt',
  },
  {
    year: '2023—2026',
    what: 'Resala — STEM leader, Sadat City',
    sub: 'Mentoring local students in hands-on science and engineering',
    note: 'Volunteering',
  },
  {
    year: '2024',
    what: 'Physics Brawl Online — team place 324',
    sub: 'Category C, 14th international online competition, Charles University',
    note: 'Team “The Incredibles”',
  },
  {
    year: '2024—',
    what: 'Hack Club — software engineer',
    sub: 'Building projects that solve real problems, with the global Hack Club network',
    note: 'Community',
  },
  {
    year: '2025',
    what: 'NASA Space Apps Challenge',
    sub: '“Galactic Problem Solver” — outstanding participation',
    note: 'NASA International Space Apps',
  },
  {
    year: '2025—2026',
    what: 'Pipe Inspector — grade 12 capstone',
    sub: 'A rover and a segmentation model for corrosion inside pipes',
    note: 'Year-long build',
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
    what: 'Programming instructor, Egyptian Culture Palace',
    sub: 'Designed and taught a Python and computer science course for primary school students',
    note: 'Volunteering',
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
    year: '2026',
    what: 'METU · Herkes için Yapay Zeka I',
    sub: 'Artificial intelligence course completed through METU’s Bilgeİş programme',
    note: 'Middle East Technical University',
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
      { name: 'Teaching', note: '' },
      { name: 'Arabic', note: 'native' },
      { name: 'English', note: 'fluent' },
    ],
  },
]
