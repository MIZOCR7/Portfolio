import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface ProjectCard {
  index: number
  title: string
  description: string
  imageUrl: string
  tags: string[]
}

function SystemCard({ index, title, description, imageUrl, tags }: ProjectCard) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    // Normalize: -0.5 to 0.5
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="relative group flex flex-col border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden"
      whileHover={{ borderColor: 'rgba(255,255,255,0.3)', scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <span className="absolute top-4 left-4 text-[10px] tracking-[0.3em] text-gray-500 uppercase font-inter">
          // System {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <h3 className="text-lg font-bold tracking-tight text-white leading-snug">
          {title}
        </h3>
        <p className="text-sm text-gray-400 font-inter font-light leading-relaxed flex-1">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {tags.map(tag => (
            <span key={tag} className="text-[10px] tracking-widest text-gray-500 uppercase font-inter px-2 py-1 border border-white/10">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] tracking-widest text-gray-600 uppercase font-inter">View Deployment</span>
          <span className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">→</span>
        </div>
      </div>
    </motion.div>
  )
}

// Tech Stack Card
function TechCard() {
  const techStack = [
    { name: 'PyTorch', icon: '🔥' },
    { name: 'LangChain', icon: '⛓️' },
    { name: 'Transformers', icon: '🤗' },
    { name: 'CUDA', icon: '⚡' },
    { name: 'TensorRT', icon: '🚀' },
    { name: 'Pinecone', icon: '🌲' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="hidden md:flex flex-col border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 justify-between"
    >
      <div>
        <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-inter">// Tech Arsenal</span>
        <h3 className="text-lg font-bold tracking-tight text-white leading-snug mt-3 mb-6">
          Stack Infrastructure
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {techStack.map(({ name, icon }) => (
          <div
            key={name}
            className="flex items-center gap-2 px-3 py-2 border border-white/5 bg-white/[0.02] hover:border-white/20 transition-colors duration-300"
          >
            <span className="text-base">{icon}</span>
            <span className="text-xs text-gray-300 font-inter tracking-wide">{name}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-600 font-inter mt-6 leading-relaxed">
        Production-grade MLOps infrastructure built for scale and reliability.
      </p>
    </motion.div>
  )
}

const PROJECTS: Omit<ProjectCard, 'index'>[] = [
  {
    title: 'Large Language Infrastructure',
    description: 'Finetuned generative models optimized for operational automation with context-preservation pipelines at scale.',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=900&auto=format&fit=crop',
    tags: ['Python', 'Transformers', 'vLLM'],
  },
  {
    title: 'Autonomous Vision Pipelines',
    description: 'Edge compute systems handling native spatial tracking data with hardware-accelerated inference.',
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=900&auto=format&fit=crop',
    tags: ['CUDA', 'TensorRT', 'C++'],
  },
  {
    title: 'Agentic Logic Frameworks',
    description: 'Self-correcting neural loops executing complex multi-step operational tasks with minimal human oversight.',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=900&auto=format&fit=crop',
    tags: ['LangGraph', 'FastAPI', 'Redis'],
  },
]

export default function SystemsGrid() {
  return (
    <section id="systems" className="relative bg-black py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-12 pb-4 border-b border-white/10"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Selected <span className="text-gray-600">Systems</span>
          </h2>
          <span className="hidden md:block text-[11px] text-gray-600 tracking-widest uppercase font-inter">
            {PROJECTS.length} active deployments
          </span>
        </motion.div>

        {/* Grid: 1-col mobile, 2-col md, 3-col lg (+ 1 tech card) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <SystemCard index={i} {...project} />
            </motion.div>
          ))}
          <TechCard />
        </div>
      </div>
    </section>
  )
}
