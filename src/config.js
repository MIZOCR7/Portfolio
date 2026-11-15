/* ─────────────────────────────────────────────────────────────
   Every personal detail lives in this file.
   Change a string, image path or link here and the whole desktop,
   the dock, the windows, the resume and the metadata follow.
   ───────────────────────────────────────────────────────────── */

export const CONFIG = {
  site: {
    name: 'Ziad Emad',
    fullName: 'Ziad Emad Ahmed Metwally Salem',
    role: 'Computer vision & embedded AI',
    location: '6th of October City, Egypt',
    timezone: 'Africa/Cairo',
    email: 'zemad1665@gmail.com',
    github: 'https://github.com/MIZOCR7',
    linkedin: 'https://www.linkedin.com/in/ziad-emad-470604400',
    school: 'STEM High School for Boys — 6th of October',
    tagline: 'I build vision systems that leave the notebook.',
    status: 'ISEF finalist 2026',
    availability: 'Grade 12 · open to research conversations',
    menuName: 'Ziad’s Portfolio',
  },

  wallpapers: [
    { id: 'sonoma', label: 'Horizon', src: 'images/wallpaper.webp', tone: '#6b7d8f' },
    { id: 'sequoia', label: 'Sequoia', src: 'images/sequoia.webp', tone: '#5f8b6d' },
  ],
  defaultWallpaper: 'sonoma',

  desktop: {
    hint: 'Double-click a cover to open it. Drag it anywhere you like.',
    resetNote: 'Desktop icons restored to their original places.',
  },

  about: {
    lead: 'I am Ziad Emad, seventeen, from 6th of October City. I build computer vision that has to survive contact with a real environment.',
    portrait: 'media/portrait.jpg',
    portraitAlt: 'Ziad Emad Ahmed in a dark suit against green foliage',
    paragraphs: [
      'I joined STEM High School for Boys at fifteen — 98% on the entrance exam, 245th of roughly forty thousand — and have spent the three years since between the workshop after class and a laptop at midnight.',
      'Most of what I know arrived by breaking something first. A segmentation model that scored well and then saw nothing in a real pipe. A dataset stitched from four public sources that only became usable once I had re-checked the labels by hand. A greenhouse whose sensors were honest and whose wiring was not.',
      'That is why I keep drifting to the physical end of computer science: a camera inside a pipe, a drone over a field, a probe in soil. A model is easy to draw. Making one survive contact with a real environment is the part I want to spend my life on.',
    ],
    facts: [
      ['Based in', '6th of October City, Egypt'],
      ['School', 'STEM High School for Boys'],
      ['Recognition', 'ISEF finalist 2026 · ICPC Teens, 31st'],
      ['Focus', 'Computer vision · embedded AI'],
      ['Languages', 'Arabic (native) · English (fluent)'],
      ['Now', 'Grade 12 capstone — Pipe Inspector'],
    ],
    values: [
      { k: 'Build, then defend', v: 'Every claim here has a certificate, a repository or a photograph behind it. If it is not evidenced, it is not on the desk.' },
      { k: 'Read the failure', v: 'The useful part of a project is the run that did not work. That is where the next decision comes from.' },
      { k: 'Teach what you just learned', v: 'Python for primary students at the Egyptian Culture Palace, STEM mentoring with Resala, peer tutoring through Schoolhouse.' },
    ],
    timeline: [
      { year: '2023—2026', what: 'STEM High School for Boys', sub: 'Admitted at 15 — 98% on the entrance exam, ranked 245 of ~40,000', note: '6th of October City' },
      { year: '2025', what: 'NASA Space Apps Challenge', sub: '“Galactic Problem Solver” — outstanding participation', note: 'NASA International Space Apps' },
      { year: '2025—2026', what: 'Pipe Inspector', sub: 'A rover and a segmentation model for corrosion inside pipes', note: 'Grade 12 capstone' },
      { year: '2026', what: 'ISEF finalist', sub: 'Pest detection for Egyptian farms, presented to national judges', note: 'Egypt Science & Engineering Fair' },
      { year: '2026', what: 'ICPC Egyptian Teens', sub: '31st place in the online qualification, 14 August 2026', note: 'Team 3014' },
      { year: '2026', what: 'Programming instructor', sub: 'Designed and taught a Python course for primary school students', note: 'Egyptian Culture Palace' },
      { year: '2026—', what: 'October Geology Club', sub: 'Retrieval-augmented system over the club’s geological references', note: 'AI modelling director' },
    ],
  },

  projects: [
    {
      id: 'pipe',
      title: 'Pipe Inspector',
      kind: 'Grade 12 capstone',
      role: 'Dataset · model · rover firmware',
      year: '2025—26',
      status: 'Capstone',
      summary: 'A six-wheeled rover that drives into water pipes and marks corrosion before a line has to be opened.',
      body: [
        'Steel and concrete pipes fail quietly. Inspecting them means draining the line, cutting an access hole, or sending a person into a space that is wet, dark and often unsafe. The rover drives in on its own and points at the exact spot that is failing.',
        'A six-wheel chassis sits taller than 12 cm so spray never reaches the electronics; a 14 V pack is stepped down for the motors, camera and sensors. YOLO11 instance segmentation runs on a laptop receiving the live stream, trained on four merged public sets that I de-duplicated and re-checked by hand.',
      ],
      cover: 'media/pipe-frame.jpg',
      aspect: 'landscape',
      tags: ['Python', 'Ultralytics', 'OpenCV', 'C++', 'Arduino'],
      link: 'https://github.com/MIZOCR7/Pipe-Inspector',
      linkLabel: 'Source on GitHub',
      gallery: [
        { src: 'media/pipe-frame.jpg', alt: 'Inspection frame of a concrete pipe with a long crack', caption: 'Raw inspection frame — the model has to read this' },
        { src: 'media/pipe-detections.jpg', alt: 'Validation frames with predicted corrosion masks', caption: 'Predicted masks over the validation set' },
        { src: 'media/pipe-strip.jpg', alt: 'Four pipe inspection frames side by side', caption: 'Four sources, de-duplicated, labels re-checked' },
      ],
      video: { src: 'media/pipe-demo.mp4', poster: 'media/pipe-poster.jpg', caption: 'Demo run · bench rig' },
    },
    {
      id: 'pest',
      title: 'Pest Sentinel',
      kind: 'ISEF-affiliated national fair',
      role: 'Detection model · drone platform',
      year: '2026',
      status: 'Finalist',
      summary: 'A field scanned from above, treated only where it needs it. Finalist at the Egypt Science & Engineering Fair.',
      body: [
        'Egypt loses a serious share of its crops to pests that are spotted too late. The project pairs a deep-learning detector with a drone platform so a field can be scanned from above and treated only where it is needed.',
        'Most of the work was the dataset: synthetic field layouts modelled in Blender to test coverage before flying, then a detector trained on annotated frames. It reached the national fair as a finalist.',
      ],
      cover: 'media/pest-field.jpg',
      aspect: 'landscape',
      tags: ['Deep learning', 'Drones', 'Agriculture', 'Blender'],
      gallery: [
        { src: 'media/pest-field.jpg', alt: 'Blender viewport with rows of plants modelled in a field layout', caption: 'Field layout study in Blender' },
        { src: 'media/pest-row.jpg', alt: 'Detailed Blender render of a single planted row', caption: 'Row detail, plant instances' },
        { src: 'media/cert-isef.jpg', alt: 'Egypt Science and Engineering Fair certificate', caption: 'National finalist certificate, 2026' },
      ],
    },
    {
      id: 'sprout',
      title: 'Sprout',
      kind: 'Climate-control build',
      role: 'Arduino · sensors · web UI',
      year: '2025',
      status: 'Built',
      summary: 'A sealed greenhouse that reports on itself and answers with water, a fan, a lamp or heat.',
      body: [
        'Soil moisture, air temperature and light are measured continuously; a relay board answers with water, a fan, a lamp or heat. The companion interface puts the numbers and a conversation in the same window.',
        'The interesting part was never the sensors. It was the wiring revision that stopped a pump from switching the whole board off, and the night tests where the dome lit from inside like a small lab.',
      ],
      cover: 'media/sprout-lcd.jpg',
      aspect: 'portrait',
      tags: ['Arduino', 'Sensors', 'Relays', 'Web UI'],
      link: 'https://github.com/MIZOCR7/GreenHouse-project',
      linkLabel: 'Source on GitHub',
      gallery: [
        { src: 'media/sprout-lcd.jpg', alt: 'Greenhouse prototype showing temperature and humidity on an LCD', caption: 'Live telemetry on the LCD' },
        { src: 'media/sprout-wiring.jpg', alt: 'Close view of wiring, a fan and a sensor bundle', caption: 'Wiring, third revision' },
        { src: 'media/sprout-ui.jpg', alt: 'Laptop showing the Sprout companion interface', caption: 'Companion interface' },
        { src: 'media/sprout-night.jpg', alt: 'The greenhouse dome lit from inside at night', caption: 'Night test, lighting relay' },
      ],
    },
    {
      id: 'rag',
      title: 'Geology RAG',
      kind: 'October Geology Club',
      role: 'AI modelling director',
      year: '2026/27',
      status: 'In progress',
      summary: 'A retrieval system that answers from the club’s geological references instead of guessing.',
      body: [
        'A retrieval-augmented system over the club’s geological references, wrapped in a chat interface members actually use. It cites the passage it answered from, so a wrong answer can be argued with.',
        'Built as AI modelling director of the October Geology Club: chunking, embeddings, a small evaluation set of real member questions, and a great deal of time spent on documents that were scans of paper.',
      ],
      cover: null,
      tile: 'RAG',
      tileTone: 'from-[#0f766e] to-[#082f49]',
      aspect: 'square',
      tags: ['RAG', 'Python', 'Embeddings', 'Chat UI'],
      gallery: [],
    },
    {
      id: 'aiui',
      title: 'AI UI',
      kind: 'Interface study',
      role: 'Design · front-end',
      year: '2026',
      status: 'Study',
      summary: 'A small study of what an AI interface should feel like when it is not a chat box.',
      body: [
        'An interface study in TypeScript: states for thinking, waiting, refusing and returning sources, built so the model’s uncertainty is visible instead of hidden behind a typing indicator.',
        'It runs as a static app and is mostly a place for me to test type, motion and honesty in AI products.',
      ],
      cover: null,
      tile: 'AI',
      tileTone: 'from-[#7c3aed] to-[#1e1b4b]',
      aspect: 'portrait',
      tags: ['TypeScript', 'React', 'Motion'],
      link: 'https://ai-ui-wine.vercel.app',
      linkLabel: 'Open the study',
      gallery: [],
    },
    {
      id: 'terminal',
      title: 'Terminal-Craft',
      kind: 'Terminal game',
      role: 'Python · game logic',
      year: '2025',
      status: 'Built',
      summary: 'A small world that runs in a terminal, because constraints make better toys.',
      body: [
        'A Python terminal game: a grid world, inventories, and enough state to make a text interface feel physical. Written to practise clean state machines without a framework.',
        'The whole thing runs in a shell, which means every feature has to earn its keystrokes.',
      ],
      cover: null,
      tile: '>_',
      tileTone: 'from-[#334155] to-[#0b1120]',
      aspect: 'square',
      tags: ['Python', 'CLI', 'Game logic'],
      link: 'https://github.com/MIZOCR7/Terminal-Craft',
      linkLabel: 'Source on GitHub',
      gallery: [],
    },
    {
      id: 'team',
      title: 'Team 3014',
      kind: 'Programming contest',
      role: 'Contestant',
      year: '2026',
      status: '31st place',
      summary: 'A contest floor in Cairo, three people, one terminal, and a board that never stops moving.',
      body: [
        'ICPC Egyptian Teens, online qualification: thirty-first place, 14 August 2026. The useful part was not the rank — it was learning to read a problem as a team under a clock.',
        'These are the frames from the floor and the walk back afterwards. It is the only project here that is mostly about other people.',
      ],
      cover: 'media/contest-1.jpg',
      aspect: 'landscape',
      tags: ['Algorithms', 'Teamwork', 'ICPC'],
      gallery: [
        { src: 'media/contest-1.jpg', alt: 'Three contestants in maroon shirts at a terminal', caption: 'Team 3014 on the floor' },
        { src: 'media/contest-2.jpg', alt: 'Three students holding contestant badges at night', caption: 'After the floor' },
        { src: 'media/team.jpg', alt: 'Four students in front of their capstone poster', caption: 'The capstone team at school' },
      ],
    },
  ],

  /* initial desktop arrangement, as fractions of the usable area */
  iconSeeds: {
    pest: { x: 0.01, y: 0.06 },
    pipe: { x: 0.06, y: 0.49 },
    rag: { x: 0.65, y: 0.58 },
    aiui: { x: 0.3, y: 0.12 },
    sprout: { x: 0.36, y: 0.58 },
    team: { x: 0.56, y: 0.06 },
    terminal: { x: 0.81, y: 0.12 },
  },

  notes: [
    {
      id: 'hello',
      title: 'Hello',
      preview: 'Welcome to my desktop.',
      body: `Welcome to my desktop.

Drag the covers anywhere you like, open a project, or use the dock at the bottom. The bin on the right puts the covers back where they started.

This is not a theme pasted over a portfolio. Every window is a real part of the site: the projects, the certificates, the photographs and the résumé all open from here.`,
    },
    {
      id: 'now',
      title: 'Right now',
      preview: 'Pipe Inspector, YOLO and a rover.',
      body: `WHAT I AM BUILDING

• Pipe Inspector — a six-wheel rover and a YOLO11 segmentation model that finds corrosion inside water pipes. Grade 12 capstone.

• Pest Sentinel — deep-learning pest detection for Egyptian farms. Finalist at the Egypt Science & Engineering Fair 2026.

• Sprout — a sealed greenhouse that measures soil, air and light, then answers with water, a fan, a lamp or heat.

• Geology RAG — retrieval over the October Geology Club’s references, with citations.`,
    },
    {
      id: 'tools',
      title: 'Toolkit',
      preview: 'Python, PyTorch, YOLO, C++, React.',
      body: `MODELLING
Python · PyTorch · Ultralytics YOLO · OpenCV · NumPy · pandas · RAG and embeddings

ROBOTICS
C++ · Arduino · ESP32 · motor drivers · ultrasonic and analog sensors · drone platforms

SOFTWARE
React · TypeScript · HTML/CSS · Node · Git and GitHub · Vercel

CRAFT
LaTeX · technical writing · poster design · teaching
Arabic (native) · English (fluent)`,
    },
    {
      id: 'next',
      title: 'Where this goes',
      preview: 'Robotics, mechatronics, AGI.',
      body: `I want to spend my life at the physical end of computer science: cameras inside pipes, drones over fields, probes in soil.

The plan is to go deeper into machine learning and robotics — mechatronics, embedded intelligence, and eventually work on general systems that can act in the world instead of only describing it.

Until then: build the thing, measure it, break it, write down why.`,
    },
  ],

  photos: [
    { src: 'media/team.jpg', title: 'The team', meta: 'Capstone · STEM October', alt: 'Four students in front of their capstone poster' },
    { src: 'media/sprout-lcd.jpg', title: 'Live telemetry', meta: 'Sprout · temperature and humidity', alt: 'Greenhouse prototype with an LCD showing readings' },
    { src: 'media/contest-1.jpg', title: 'Team 3014', meta: 'ICPC · Cairo', alt: 'Three contestants at a terminal in a contest hall' },
    { src: 'media/pest-field.jpg', title: 'Field layout', meta: 'Pest Sentinel · Blender', alt: 'Blender viewport with modelled crop rows' },
    { src: 'media/sprout-night.jpg', title: 'Night test', meta: 'Sprout · lighting relay', alt: 'Greenhouse dome lit from inside at night' },
    { src: 'media/contest-2.jpg', title: 'After the floor', meta: 'Same three, same night', alt: 'Three students with contestant badges at night' },
    { src: 'media/sprout-wiring.jpg', title: 'Wiring, third revision', meta: 'Sprout · sensors and relays', alt: 'Close view of greenhouse wiring and sensors' },
    { src: 'media/pest-row.jpg', title: 'Row detail', meta: 'Pest Sentinel · plant instances', alt: 'Detailed render of a planted row' },
    { src: 'media/sprout-ui.jpg', title: 'Companion interface', meta: 'Sprout · chat and sensor panel', alt: 'Laptop showing the Sprout interface' },
  ],

  certificates: [
    { image: 'media/cert-isef.jpg', title: 'Egypt Science & Engineering Fair', org: 'ISEF-affiliated national fair', year: '2026', note: 'Certificate of appreciation for Pest Sentinel, presented by the Deputy Minister for Educational Technology.' },
    { image: 'media/cert-acpc.jpg', title: 'ICPC Egyptian Teens', org: 'International Collegiate Programming Contest', year: '2026', note: 'Thirty-first place in the online qualification, 14 August 2026.' },
    { image: 'media/cert-culture.jpg', title: 'Programming instructor', org: 'Egyptian Culture Palace', year: '2026', note: 'For designing and teaching a course in computer science fundamentals and Python to primary school students.' },
    { image: 'media/cert-nasa.jpg', title: 'NASA Space Apps Challenge', org: 'NASA International Space Apps', year: '2025', note: '“Galactic Problem Solver” — outstanding participation, October 2025.' },
    { image: 'media/cert-earth.jpg', title: 'The Earth Prize', org: 'Global sustainability competition', year: '2026', note: 'Participant certificate for the 2026 edition.' },
    { image: 'media/cert-mal.jpg', title: 'STEM Model Arab League', org: 'Head of the IT department', year: '2026', note: 'Awarded for leadership of the IT department across the season.' },
    { image: 'media/cert-geo.jpg', title: 'October Geology Club', org: 'AI modelling director', year: '2026/27', note: 'Certificate of completion for the academic season, signed by the club president and supervisor.' },
    { image: 'media/cert-physics.jpg', title: 'Physics Brawl Online', org: 'Charles University, Prague', year: '2024', note: 'Team place 324, category C. The diploma notes it is not a placement certificate.' },
    { image: 'media/cert-ibm.jpg', title: 'IBM Machine Learning', org: 'Professional certificate', year: '2025', note: 'Supervised learning, model evaluation and Python tooling.' },
  ],

  tech: [
    { category: 'Modelling', items: ['Python', 'PyTorch', 'Ultralytics YOLO', 'OpenCV', 'NumPy', 'RAG'] },
    { category: 'Robotics', items: ['C++', 'Arduino', 'ESP32', 'Motor drivers', 'Sensors', 'Drones'] },
    { category: 'Software', items: ['React', 'TypeScript', 'HTML/CSS', 'Node', 'Git', 'Vercel'] },
    { category: 'Craft', items: ['LaTeX', 'Technical writing', 'Poster design', 'Teaching'] },
  ],

  socials: [
    { label: 'GitHub', handle: '@MIZOCR7', href: 'https://github.com/MIZOCR7', icon: 'icons/github.svg', color: '#24292f' },
    { label: 'LinkedIn', handle: 'ziad-emad', href: 'https://www.linkedin.com/in/ziad-emad-470604400', icon: 'icons/linkedin.svg', color: '#0a66c2' },
    { label: 'Email', handle: 'zemad1665@gmail.com', href: 'mailto:zemad1665@gmail.com', icon: 'icons/mail.svg', color: '#0a84ff' },
  ],
}

export const dockApps = [
  { id: 'work', label: 'Work', icon: 'images/icons/finder.png', app: 'work' },
  { id: 'about', label: 'About', icon: 'images/icons/contacts.png', app: 'about' },
  { id: 'notes', label: 'Notes', icon: 'images/icons/notes.png', app: 'notes' },
  { id: 'photos', label: 'Images', icon: 'images/icons/photos.png', app: 'photos' },
  { id: 'social', label: 'Social', icon: 'images/icons/safari.png', app: 'social' },
  { id: 'contact', label: 'Email', icon: 'images/icons/mail.png', app: 'contact' },
]

export const appWindows = {
  work: { title: 'Work', w: 960, h: 620 },
  project: { title: 'Project', w: 920, h: 660 },
  about: { title: 'About Ziad', w: 820, h: 680 },
  notes: { title: 'Notes', w: 860, h: 560 },
  photos: { title: 'Images', w: 920, h: 620 },
  social: { title: 'Social', w: 780, h: 560 },
  contact: { title: 'Mail', w: 720, h: 580 },
  resume: { title: 'Résumé', w: 780, h: 680 },
  viewer: { title: 'Preview', w: 900, h: 700 },
  terminal: { title: 'Terminal', w: 740, h: 470 },
  shortcuts: { title: 'Keyboard Shortcuts', w: 640, h: 560 },
}
