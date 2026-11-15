/* ─────────────────────────────────────────────────────────────
   Every personal detail lives in this file.
   Change a string, image path or link here and the whole desktop,
   the dock, the folders, the windows, the résumé and the AI
   terminal's knowledge base follow.
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
    instagram: 'https://www.instagram.com/zes79586/',
    instagramHandle: '@zes79586',
    school: 'STEM High School for Boys — 6th of October',
    tagline: 'I build vision systems that leave the notebook.',
    status: 'ISEF finalist 2026',
    availability: 'Grade 12 · open to research conversations',
    age: '17',
    languages: 'Arabic (native) · English (fluent)',
    updated: 'November 2026',
    menuName: 'Ziad’s Portfolio',
  },

  wallpapers: [
    { id: 'sonoma', label: 'Horizon', src: 'images/wallpaper.webp', tone: '#6b7d8f' },
    { id: 'sequoia', label: 'Sequoia', src: 'images/sequoia.webp', tone: '#5f8b6d' },
  ],
  defaultWallpaper: 'sonoma',

  desktop: {
    hint: 'Double-click a folder to look inside. The AI Terminal answers anything about me — type /live to talk to it out loud.',
    resetNote: 'Desktop icons restored to their original places.',
  },

  /* The three things that live on the desktop: two folders and the agent. */
  iconSeeds: {
    projects: { x: 0.02, y: 0.06 },
    'about-me': { x: 0.02, y: 0.36 },
    terminal: { x: 0.83, y: 0.06 },
  },

  desktopItems: [
    {
      id: 'projects',
      type: 'folder',
      folder: 'projects',
      label: 'Projects',
      icon: 'images/icons/folder.png',
      note: '7 builds',
    },
    {
      id: 'about-me',
      type: 'folder',
      folder: 'about-me',
      label: 'About Me',
      icon: 'images/icons/folder.png',
      note: 'CV · certificates',
    },
    {
      id: 'terminal',
      type: 'terminal',
      label: 'AI Terminal',
      icon: 'images/icons/terminal.png',
      note: 'Ask anything',
    },
  ],

  folders: {
    projects: {
      title: 'Projects',
      subtitle: 'Seven things I have built, broken and rebuilt — a rover, a field detector, a greenhouse, retrieval systems and a contest team.',
      items: [
        { kind: 'project', id: 'pipe' },
        { kind: 'project', id: 'pest' },
        { kind: 'project', id: 'sprout' },
        { kind: 'project', id: 'rag' },
        { kind: 'project', id: 'aiui' },
        { kind: 'project', id: 'terminal' },
        { kind: 'project', id: 'team' },
      ],
    },
    'about-me': {
      title: 'About Me',
      subtitle: 'The full picture: who I am, what I have earned, what I have taught, and how to reach me.',
      items: [
        {
          kind: 'app',
          id: 'about',
          label: 'About Me.txt',
          icon: 'images/icons/textedit.png',
          meta: 'The long version',
        },
        {
          kind: 'app',
          id: 'certifications',
          label: 'Certifications',
          icon: 'images/icons/preview.png',
          meta: '13 documents',
        },
        {
          kind: 'app',
          id: 'honors',
          label: 'Honors',
          icon: 'images/icons/apps.png',
          meta: 'Awards & recognition',
        },
        {
          kind: 'app',
          id: 'experience',
          label: 'Experience',
          icon: 'images/icons/notes.png',
          meta: 'Roles · teaching · service',
        },
        {
          kind: 'app',
          id: 'skills',
          label: 'Skills',
          icon: 'images/icons/terminal.png',
          meta: 'Toolkit',
        },
        {
          kind: 'app',
          id: 'notes',
          label: 'Notes',
          icon: 'images/icons/notes.png',
          meta: 'Writing about the work',
        },
        {
          kind: 'app',
          id: 'photos',
          label: 'Photos',
          icon: 'images/icons/photos.png',
          meta: 'Workshop & contest',
        },
        {
          kind: 'viewer',
          id: 'portrait',
          label: 'Portrait.jpg',
          icon: 'images/icons/photos.png',
          meta: 'Ziad, 2026',
          src: 'media/portrait.jpg',
        },
        {
          kind: 'app',
          id: 'resume',
          label: 'Résumé',
          icon: 'images/icons/preview.png',
          meta: 'One page · printable',
        },
        {
          kind: 'app',
          id: 'social',
          label: 'Social',
          icon: 'images/icons/safari.png',
          meta: 'GitHub · LinkedIn · Instagram',
        },
        {
          kind: 'app',
          id: 'contact',
          label: 'Contact',
          icon: 'images/icons/mail.png',
          meta: 'Email Ziad',
        },
        {
          kind: 'link',
          id: 'instagram',
          label: 'Instagram',
          icon: 'icons/instagram.svg',
          meta: '@zes79586',
          href: 'https://www.instagram.com/zes79586/',
        },
      ],
    },
  },

  about: {
    lead: 'I am Ziad Emad, seventeen, from 6th of October City. I build computer vision that has to survive contact with a real environment.',
    portrait: 'media/portrait.jpg',
    portraitAlt: 'Ziad Emad Ahmed in a dark suit against green foliage',
    paragraphs: [
      'I joined STEM High School for Boys at fifteen — 98% on the entrance exam, 245th of roughly forty thousand — and have spent the three years since between the workshop after class and a laptop at midnight.',
      'Most of what I know arrived by breaking something first. A segmentation model that scored well and then saw nothing in a real pipe. A dataset stitched from four public sources that only became usable once I had re-checked the labels by hand. A greenhouse whose sensors were honest and whose wiring was not.',
      'That is why I keep drifting to the physical end of computer science: a camera inside a pipe, a drone over a field, a probe in soil. A model is easy to draw. Making one survive contact with a real environment is the part I want to spend my life on.',
      'I care about evidence. Every claim on this desk has a certificate, a repository or a photograph behind it — not because I collect documents, but because a result you cannot show is only a story. When a run fails, I keep the failure: it is usually the most honest thing in the project.',
      'The other half of my life is teaching. I designed and taught a Python course for primary school students at the Egyptian Culture Palace, tutor through Schoolhouse, volunteer on Be My Eyes, and spend a lot of time explaining a model to someone who has never seen one. Teaching keeps me honest about what I actually understand.',
      'Outside the workshop I am usually reading about robotics, rewriting a dataset, or at a contest with a team. I am at my best when the problem has a camera, a motor and a deadline.',
    ],
    facts: [
      ['Based in', '6th of October City, Egypt'],
      ['Age', '17 · Grade 12'],
      ['School', 'STEM High School for Boys'],
      ['Recognition', 'ISEF finalist 2026 · ICPC Teens, 31st'],
      ['Focus', 'Computer vision · embedded AI'],
      ['Languages', 'Arabic (native) · English (fluent)'],
      ['Service', 'Be My Eyes · Schoolhouse peer tutor'],
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
      { year: '2025—', what: 'Be My Eyes volunteer', sub: 'Sighted assistance for blind and low-vision users, in English and Arabic', note: 'Member since December 2025' },
      { year: '2026', what: 'ISEF finalist', sub: 'Pest detection for Egyptian farms, presented to national judges', note: 'Egypt Science & Engineering Fair' },
      { year: '2026', what: 'ICPC Egyptian Teens', sub: '31st place in the online qualification, 14 August 2026', note: 'Team 3014' },
      { year: '2026', what: 'Programming instructor', sub: 'Designed and taught a Python course for primary school students', note: 'Egyptian Culture Palace' },
      { year: '2026—', what: 'October Geology Club', sub: 'Retrieval-augmented system over the club’s geological references', note: 'AI modelling director' },
      { year: '2026—', what: 'Schoolhouse peer tutor', sub: 'Free peer tutoring in mathematics and computer science', note: 'Member since January 2026' },
    ],
  },

  education: [
    {
      school: 'STEM High School for Boys — 6th of October',
      period: '2023—2026',
      detail: 'Admitted at 15 with 98% on the entrance exam, ranked 245th of roughly 40,000 candidates. Coursework in computer science, embedded systems, applied mathematics and research methods. Grade 12 capstone: Pipe Inspector.',
      tags: ['Computer science', 'Embedded systems', 'Research methods'],
    },
    {
      school: 'Self-directed — computer vision & robotics',
      period: '2024—present',
      detail: 'PyTorch and Ultralytics, OpenCV, dataset construction and evaluation, Arduino/ESP32 firmware, and enough failure logs to fill a notebook. Every project below started as something I did not yet know how to build.',
      tags: ['PyTorch', 'YOLO', 'Arduino', 'OpenCV'],
    },
  ],

  experience: [
    {
      role: 'AI Modelling Director',
      org: 'October Geology Club',
      period: '2026—present',
      detail: 'Leading a retrieval-augmented system over the club’s geological references. Chunking, embeddings, a small evaluation set of real member questions, and a chat interface that cites the passage it answered from.',
      tags: ['RAG', 'Embeddings', 'Evaluation', 'Leadership'],
    },
    {
      role: 'Programming Instructor',
      org: 'Egyptian Culture Palace',
      period: '2026',
      detail: 'Designed and taught a Python and computer-science fundamentals course for primary school students. Wrote the exercises, taught the sessions and marked the work.',
      tags: ['Teaching', 'Python', 'Curriculum'],
    },
    {
      role: 'Head of the IT Department',
      org: 'STEM Model Arab League',
      period: '2026',
      detail: 'Led the technology team across the season — delegate systems, live scoring and the technical running of the conference.',
      tags: ['Leadership', 'Operations'],
    },
    {
      role: 'Peer Tutor',
      org: 'Schoolhouse',
      period: '2026—present',
      detail: 'Free peer tutoring in mathematics and computer science through Schoolhouse’s volunteer platform. Member since January 2026.',
      tags: ['Teaching', 'Mathematics'],
    },
    {
      role: 'Volunteer',
      org: 'Be My Eyes',
      period: '2025—present',
      detail: 'Sighted assistance for blind and low-vision users over live video calls, in English and Arabic. Member since 31 December 2025.',
      tags: ['Service', 'Accessibility'],
    },
    {
      role: 'Capstone engineer',
      org: 'STEM High School for Boys',
      period: '2025—2026',
      detail: 'Built Pipe Inspector end to end: the six-wheel rover, the motor and sensor firmware, the merged and hand-checked dataset, and the YOLO11 segmentation model that reads corrosion in a live feed.',
      tags: ['Computer vision', 'Robotics', 'Dataset engineering'],
    },
  ],

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

  notes: [
    {
      id: 'hello',
      title: 'Hello',
      preview: 'Two folders, one terminal.',
      body: `Welcome to my desktop.

Everything is in two folders now. Projects holds the seven things I have built. About Me holds the long version of me: my story, certifications, honors, experience, skills, photos, notes and contact details.

The third icon is an AI terminal. It knows this entire portfolio because it reads the same file that builds it. Type /help to see the commands, or /live to talk to it properly. You can ask it anything about me and it will answer in a shell.

The bin on the right puts the desktop back where it started.`,
    },
    {
      id: 'story',
      title: 'The long version',
      preview: 'How a workshop kid ended up here.',
      body: `I am Ziad Emad Ahmed Metwally Salem. I am seventeen, I live in 6th of October City, and I am in my final year at STEM High School for Boys.

I got in at fifteen: 98% on the entrance exam, 245th out of roughly forty thousand. That number mattered to me for about a week. What mattered longer was the first time a model I trained did something I had not explicitly told it to do — and then the first time it failed in a way I could explain.

Most of my education has happened after class. A workshop bench, a laptop, a camera, a motor driver, and a problem that refuses to stay theoretical. I did not start with a grand plan about computer vision. I started because I wanted the thing to actually move, see, and be useful outside a notebook.

Now I build at the physical end of the field: a rover that goes inside pipes, a detector that looks down at a field, a greenhouse that measures itself. The pattern is always the same. Take a model that works on a clean benchmark, put it in a dirty environment, and find out what it is really made of.

I am not the person who knows the most. I am the person who will stay with the failure until it makes sense.`,
    },
    {
      id: 'now',
      title: 'Right now',
      preview: 'Pipe Inspector, YOLO and a rover.',
      body: `WHAT I AM BUILDING

• Pipe Inspector — a six-wheel rover and a YOLO11 segmentation model that finds corrosion inside water pipes. Grade 12 capstone.

• Pest Sentinel — deep-learning pest detection for Egyptian farms. Finalist at the Egypt Science & Engineering Fair 2026.

• Sprout — a sealed greenhouse that measures soil, air and light, then answers with water, a fan, a lamp or heat.

• Geology RAG — retrieval over the October Geology Club’s references, with citations.

WHAT I AM ALSO DOING

• Tutoring through Schoolhouse.
• Volunteering on Be My Eyes.
• Finishing Grade 12 without letting the capstone eat the rest of my life.`,
    },
    {
      id: 'process',
      title: 'How I build',
      preview: 'Break it, measure it, write down why.',
      body: `1. START WITH THE PHYSICAL CONSTRAINT
A pipe is 12 cm wide. A field is windy. A greenhouse pump cannot share a ground with the sensors. The environment writes the first requirement, not the model.

2. MAKE THE DATASET BORING
Most of the real work is labels: merging sources, removing duplicates, re-checking classes by hand. A clever model on a lazy dataset is a demo, not a system.

3. KEEP THE FAILURE
Every run gets saved. The frames where the mask collapses, the sensor that drifts, the wiring revision that browns out the board. The failure is the next design decision.

4. SHOW IT TO SOMEONE WHO DOES NOT CARE
If a teacher, a judge or a younger student cannot see what it does in ten seconds, the interface is not finished.

5. WRITE IT DOWN
A result I cannot explain is a result I do not own yet.`,
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
LaTeX · technical writing · poster design · teaching · explaining a model without jargon

LANGUAGES
Arabic (native) · English (fluent)`,
    },
    {
      id: 'recognition',
      title: 'Recognition',
      preview: 'Certificates and honors, in one place.',
      body: `The About Me folder now holds everything as documents, not a list on a page.

CERTIFICATIONS
ISEF-affiliated Egypt Science & Engineering Fair · ICPC Egyptian Teens (31st) · NASA Space Apps “Galactic Problem Solver” · IBM Machine Learning · The Earth Prize · Physics Brawl Online · Hack Club Axiom · Computer Network Fundamentals (ITI/Mahara-Tech) · October Geology Club · STEM Model Arab League · Egyptian Culture Palace teaching · Be My Eyes · Schoolhouse.

HONORS
National ISEF finalist 2026 · 31st at ICPC Egyptian Teens 2026 · NASA Galactic Problem Solver 2025 · STEM admission, 245th of ~40,000 · AI Modelling Director, October Geology Club · Head of IT, STEM Model Arab League · Programming instructor, Egyptian Culture Palace · Physics Brawl team place 324 · Be My Eyes volunteer · Schoolhouse peer tutor · AWS Scholars program.

Open Certifications to see the scans. Open Honors for the short list with the evidence behind each one.`,
    },
    {
      id: 'teaching',
      title: 'Teaching & service',
      preview: 'The part that is about other people.',
      body: `I taught a Python and computer-science fundamentals course to primary school students at the Egyptian Culture Palace. I wrote the exercises, stood in front of the room and marked the work. It taught me more about my own understanding than any exam.

I tutor through Schoolhouse, mostly mathematics and computer science, and I volunteer on Be My Eyes — live video calls helping blind and low-vision users with everyday tasks, in English and Arabic. Member since December 2025.

At school I was Head of the IT Department for the STEM Model Arab League, which mostly meant making the technology invisible so the conference could happen.

None of this is separate from the engineering. Explaining a model to a twelve-year-old is the fastest way to find out whether I actually know it.`,
    },
    {
      id: 'next',
      title: 'Where this goes',
      preview: 'Robotics, mechatronics, systems that act.',
      body: `I want to spend my life at the physical end of computer science: cameras inside pipes, drones over fields, probes in soil.

The plan is to go deeper into machine learning and robotics — mechatronics, embedded intelligence, and eventually systems that can act in the world instead of only describing it.

Until then: build the thing, measure it, break it, write down why.`,
    },
    {
      id: 'terminal',
      title: 'About the AI terminal',
      preview: 'Ask it anything. It reads this file.',
      body: `The third desktop icon is a terminal with an agent behind it.

It is given this entire portfolio as context — the story, every project, every certificate, every honor, every role and every link. You can ask in plain language:

  what is pipe inspector?
  which certificates do you have?
  what did ziad teach?
  how do i contact him?

Type /help for the shell commands. Type /live to start a real Gemini Live voice call: the agent listens through your microphone, answers out loud in a natural voice, and the terminal draws the live audio signal as a moving waveform. You can interrupt it just by speaking, or type instead.

The call runs on Gemini 3.8 Live through a short-lived, one-use token minted by a server-side endpoint. The API key never reaches the browser. Use headphones for the cleanest conversation.`,
    },
  ],

  photos: [
    { src: 'media/portrait.jpg', title: 'Ziad', meta: 'Portrait · 2026', alt: 'Ziad Emad in a dark suit against green foliage' },
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
    {
      image: 'media/cert-isef.jpg',
      title: 'Egypt Science & Engineering Fair',
      org: 'ISEF-affiliated national fair',
      year: '2026',
      category: 'Award',
      note: 'Certificate of appreciation for Pest Sentinel, presented by the Deputy Minister for Educational Technology. National finalist.',
    },
    {
      image: 'media/cert-acpc-place.jpg',
      title: 'ICPC Egyptian Teens — 31st place',
      org: 'International Collegiate Programming Contest',
      year: '2026',
      category: 'Award',
      note: 'Thirty-first place in the 2026 ICPC Egyptian Teens Online Qualification, 14 August 2026, with Team 3014.',
    },
    {
      image: 'media/cert-nasa.jpg',
      title: 'NASA Space Apps — Galactic Problem Solver',
      org: 'NASA International Space Apps Challenge',
      year: '2025',
      category: 'Award',
      note: '“Galactic Problem Solver” for outstanding participation, 4–5 October 2025.',
    },
    {
      image: 'media/cert-ibm.jpg',
      title: 'IBM Machine Learning',
      org: 'Professional certificate',
      year: '2025',
      category: 'Certification',
      note: 'Supervised learning, model evaluation and Python tooling.',
    },
    {
      image: 'media/cert-earth.jpg',
      title: 'The Earth Prize',
      org: 'Global sustainability competition',
      year: '2026',
      category: 'Certification',
      note: 'Participant certificate for the 2026 edition.',
    },
    {
      image: 'media/cert-physics.jpg',
      title: 'Physics Brawl Online',
      org: 'Charles University, Prague',
      year: '2024',
      category: 'Award',
      note: 'Team place 324, category C. The diploma notes it is not a placement certificate.',
    },
    {
      image: 'media/cert-hackclub.jpg',
      title: 'Hack Club Axiom',
      org: 'Hack Club',
      year: '2025',
      category: 'Certification',
      note: 'Certificate of completion for the Hack Club Axiom program, 19 November 2025.',
    },
    {
      image: 'media/cert-network.jpg',
      title: 'Computer Network Fundamentals',
      org: 'ITI Platform · Mahara-Tech',
      year: '2025',
      category: 'Certification',
      note: 'Certificate of completion, 11 October 2025. Verification code C1mCGLQq8x.',
    },
    {
      image: 'media/cert-geo.jpg',
      title: 'October Geology Club',
      org: 'AI modelling director',
      year: '2026/27',
      category: 'Certification',
      note: 'Certificate of completion for the academic season, signed by the club president and supervisor.',
    },
    {
      image: 'media/cert-mal.jpg',
      title: 'STEM Model Arab League',
      org: 'Head of the IT department',
      year: '2026',
      category: 'Award',
      note: 'Awarded for leadership of the IT department across the season.',
    },
    {
      image: 'media/cert-culture.jpg',
      title: 'Programming instructor',
      org: 'Egyptian Culture Palace',
      year: '2026',
      category: 'Service',
      note: 'For designing and teaching a course in computer science fundamentals and Python to primary school students.',
    },
    {
      image: 'media/cert-bemyeyes.jpg',
      title: 'Be My Eyes volunteer',
      org: 'Be My Eyes',
      year: '2025—',
      category: 'Service',
      note: 'Volunteer member since 31 December 2025, available in English and Arabic for blind and low-vision users.',
    },
    {
      image: 'media/cert-schoolhouse.jpg',
      title: 'Schoolhouse peer tutor',
      org: 'Schoolhouse',
      year: '2026—',
      category: 'Service',
      note: 'Certification portfolio for peer tutoring on Schoolhouse, member since January 2026.',
    },
  ],

  honors: [
    {
      title: 'ISEF-affiliated national finalist',
      org: 'Egypt Science & Engineering Fair',
      year: '2026',
      detail: 'Reached the national fair with Pest Sentinel, a drone-based pest detection system for Egyptian farms.',
      evidence: 'media/cert-isef.jpg',
    },
    {
      title: '31st place — ICPC Egyptian Teens',
      org: 'International Collegiate Programming Contest',
      year: '2026',
      detail: 'Online qualification, 14 August 2026, competing as Team 3014.',
      evidence: 'media/cert-acpc-place.jpg',
    },
    {
      title: 'Galactic Problem Solver',
      org: 'NASA International Space Apps Challenge',
      year: '2025',
      detail: 'Awarded for outstanding participation and efforts to address challenges on Earth and in space.',
      evidence: 'media/cert-nasa.jpg',
    },
    {
      title: 'STEM High School admission',
      org: 'STEM High School for Boys',
      year: '2023',
      detail: 'Admitted at 15 with 98% on the entrance exam, ranked 245th of roughly 40,000 candidates.',
      evidence: null,
    },
    {
      title: 'AI Modelling Director',
      org: 'October Geology Club',
      year: '2026/27',
      detail: 'Leading the retrieval-augmented system over the club’s geological references.',
      evidence: 'media/cert-geo.jpg',
    },
    {
      title: 'Head of the IT Department',
      org: 'STEM Model Arab League',
      year: '2026',
      detail: 'Led the technology team and the technical running of the conference across the season.',
      evidence: 'media/cert-mal.jpg',
    },
    {
      title: 'Programming instructor',
      org: 'Egyptian Culture Palace',
      year: '2026',
      detail: 'Designed and taught a Python and computer-science course for primary school students.',
      evidence: 'media/cert-culture.jpg',
    },
    {
      title: 'Physics Brawl — team place 324',
      org: 'Charles University, Prague',
      year: '2024',
      detail: 'Category C team competition. The diploma explicitly is not a placement certificate.',
      evidence: 'media/cert-physics.jpg',
    },
    {
      title: 'Be My Eyes volunteer',
      org: 'Be My Eyes',
      year: '2025—',
      detail: 'Live video assistance for blind and low-vision users, in English and Arabic. Member since December 2025.',
      evidence: 'media/cert-bemyeyes.jpg',
    },
    {
      title: 'Schoolhouse peer tutor',
      org: 'Schoolhouse',
      year: '2026—',
      detail: 'Free peer tutoring in mathematics and computer science. Member since January 2026.',
      evidence: 'media/cert-schoolhouse.jpg',
    },
    {
      title: 'AWS Scholars',
      org: 'Amazon Web Services',
      year: '2026',
      detail: 'Participant in the AWS Scholars program. Program screenshots are on file; no completion certificate was issued.',
      evidence: 'media/cert-aws-1.jpg',
    },
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
    { label: 'Instagram', handle: '@zes79586', href: 'https://www.instagram.com/zes79586/', icon: 'icons/instagram.svg', color: '#c13584' },
    { label: 'Email', handle: 'zemad1665@gmail.com', href: 'mailto:zemad1665@gmail.com', icon: 'icons/mail.svg', color: '#0a84ff' },
  ],

  agent: {
    name: 'Ziad AI',
    intro: 'I am the agent that lives in this desktop. I know Ziad’s projects, certificates, honors, experience and links because I read the same file that builds the site.',
    starters: [
      'What is Pipe Inspector?',
      'Which certificates do you have?',
      'What has Ziad taught?',
      'How do I contact him?',
    ],
  },
}

export const dockApps = [
  { id: 'projects', label: 'Projects', icon: 'images/icons/folder.png', app: 'folder', data: 'projects', windowKey: 'folder:projects' },
  { id: 'about-me', label: 'About Me', icon: 'images/icons/folder.png', app: 'folder', data: 'about-me', windowKey: 'folder:about-me' },
  { id: 'notes', label: 'Notes', icon: 'images/icons/notes.png', app: 'notes' },
  { id: 'photos', label: 'Photos', icon: 'images/icons/photos.png', app: 'photos' },
  { id: 'social', label: 'Social', icon: 'images/icons/safari.png', app: 'social' },
  { id: 'contact', label: 'Email', icon: 'images/icons/mail.png', app: 'contact' },
  { id: 'terminal', label: 'AI Terminal', icon: 'images/icons/terminal.png', app: 'terminal' },
]

export const appWindows = {
  folder: { title: 'Finder', w: 900, h: 620 },
  project: { title: 'Project', w: 920, h: 660 },
  about: { title: 'About Ziad', w: 820, h: 680 },
  certifications: { title: 'Certifications', w: 940, h: 680 },
  honors: { title: 'Honors', w: 880, h: 640 },
  experience: { title: 'Experience', w: 880, h: 660 },
  skills: { title: 'Skills', w: 820, h: 600 },
  notes: { title: 'Notes', w: 860, h: 560 },
  photos: { title: 'Photos', w: 920, h: 620 },
  social: { title: 'Social', w: 780, h: 560 },
  contact: { title: 'Mail', w: 720, h: 580 },
  resume: { title: 'Résumé', w: 780, h: 680 },
  viewer: { title: 'Preview', w: 900, h: 700 },
  terminal: { title: 'Terminal — Ziad AI', w: 780, h: 520 },
  shortcuts: { title: 'Keyboard Shortcuts', w: 640, h: 560 },
}
