import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Project {
  index: string
  title: string
  description: string
  stack: string[]
  tag: string
  imageUrl: string
}

const PROJECTS: Project[] = [
  {
    index: '001',
    title: 'Autonomous Vision Engine',
    tag: 'Computer Vision',
    description:
      'Real-time object detection and spatial reasoning system built on a custom architecture, optimized for edge deployment.',
    stack: ['Python', 'PyTorch', 'TensorRT', 'CUDA'],
    imageUrl: '/position1.png',
  },
  {
    index: '002',
    title: 'NeuralRAG Pipeline',
    tag: 'Language Models',
    description:
      'Production-grade system leveraging custom embedding models and semantic chunking to achieve 94% answer fidelity.',
    stack: ['LangChain', 'Pinecone', 'FastAPI'],
    imageUrl: '/position2.png',
  },
  {
    index: '003',
    title: 'Agentic Logic Framework',
    tag: 'Agentic AI',
    description:
      'Multi-agent orchestration system for self-correcting reasoning loops. Executes complex tasks autonomously.',
    stack: ['LangGraph', 'Redis', 'Docker'],
    imageUrl: '/position3.png',
  },
]

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+{}|<>?'

function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false)
  const [displayText, setDisplayText] = useState(project.description)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isHovered) {
      let iteration = 0
      interval = setInterval(() => {
        setDisplayText(() =>
          project.description
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return project.description[index]
              }
              if (letter === ' ') return ' '
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        )
        // Adjust iteration speed so it finishes in ~0.5s (500ms / 30ms = ~16 frames)
        iteration += project.description.length / 15
        if (iteration >= project.description.length) {
          clearInterval(interval)
          setDisplayText(project.description)
        }
      }, 30)
    } else {
      setDisplayText(project.description)
    }

    return () => clearInterval(interval)
  }, [isHovered, project.description])

  const containerVariants = {
    rest: { },
    hover: { },
  }

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.5, ease: 'easeOut' as const } },
  }

  const textVariants = {
    rest: { opacity: 0.7, y: 0 },
    hover: { opacity: 1, y: -4, transition: { duration: 0.3 } },
  }

  return (
    <motion.article
      variants={containerVariants}
      initial="rest"
      whileHover="hover"
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden"
      style={{
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        setIsHovered(true)
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 0 40px rgba(255,255,255,0.04), 0 0 0 1px rgba(255,255,255,0.15)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'
      }}
      onMouseLeave={e => {
        setIsHovered(false)
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 0 0 1px rgba(255,255,255,0.04)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
      }}
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <motion.img
          variants={imageVariants}
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Top Info */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <span className="font-mono text-[11px] text-white/50 tracking-widest drop-shadow-md">
            // {project.index}
          </span>
          <span className="text-[10px] tracking-[0.25em] text-white/80 uppercase border border-white/20 px-3 py-1 rounded-full font-mono bg-black/40 backdrop-blur-md">
            {project.tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-6 flex-1">
        <motion.h3
          variants={textVariants}
          className="text-[20px] sm:text-[24px] font-bold text-white leading-tight tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {project.title}
        </motion.h3>

        <motion.p
          variants={textVariants}
          className="text-[14px] text-white/50 leading-relaxed flex-1"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {displayText}
        </motion.p>

        {/* Stack pills */}
        <motion.div variants={textVariants} className="flex flex-wrap gap-2 pt-2">
          {project.stack.map(tech => (
            <span
              key={tech}
              className="text-[10px] tracking-widest text-white/40 uppercase font-mono border border-white/10 px-2.5 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative bg-black py-28 md:py-36 px-5 sm:px-8 md:px-10"
      style={{ zIndex: 2 }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[11px] tracking-[0.35em] text-white/30 uppercase mb-4 font-mono">
              // 002 — systems
            </p>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Live <span className="text-white/30">Models.</span>
            </h2>
          </div>
          <p
            className="text-white/40 text-[15px] max-w-sm leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            A curated selection of production architectures from neural vision pipelines to agentic orchestrators.
          </p>
        </div>

        {/* 3 Column CSS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map(project => (
            <ProjectCard key={project.index} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
