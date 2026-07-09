'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Globe,
  Smartphone,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Star,
  Briefcase,
  Code2,
  MapPin,
  ExternalLink,
  Layout,
  Server,
  Database,
  Cloud,
  FileText,
  ShoppingBag,
  Search,
  Cpu,
  Zap,
  CreditCard,
  Truck,
  Mail,
  Phone,
  Linkedin,
  Github,
  Laptop,
  Monitor,
} from 'lucide-react'
import type { Media, Portfolio as PortfolioType } from '@/payload-types'

// ─── Types ───────────────────────────────────────────────────────────────────
export interface PersonalPortfolioBlockProps {
  blockType: 'personalPortfolio'
  hero?: {
    badgeText?: string | null
    titlePreHighlight?: string | null
    titleHighlight?: string | null
    description?: string | null
    experienceYears?: string | null
    experienceLabel?: string | null
    certificationTitle?: string | null
    certificationLabel?: string | null
    stat3Number?: string | null
    stat3Label?: string | null
    stat4Number?: string | null
    stat4Label?: string | null
    sayHiLabel?: string | null
    sayHiLink?: string | null
    downloadCvLabel?: string | null
    downloadCvFile?: number | Media | null
    heroImage: number | Media
    introduction?: string | null
    location?: string | null
    email?: string | null
    phone?: string | null
    linkedinLabel?: string | null
    linkedinLink?: string | null
    githubLabel?: string | null
    githubLink?: string | null
  } | null
  skillsCategories?: {
    title: string
    iconName?: 'layout' | 'server' | 'database' | 'smartphone' | 'cloud' | 'file-text' | 'shopping-bag' | 'search' | 'cpu' | 'zap' | 'credit-card' | 'truck' | null
    skills?: {
      skillName: string
      id?: string | null
    }[] | null
    id?: string | null
  }[] | null
  skillsTitle?: string | null
  skillsDescription?: string | null
  expertise?: {
    title?: string | null
    description?: string | null
    stats?: {
      number: string
      label: string
      color?: 'primary' | 'secondary' | 'tertiary' | null
      id?: string | null
    }[] | null
    cards?: {
      title: string
      description?: string | null
      projectsCountText?: string | null
      icon?: string | null
      color?: 'primary' | 'secondary' | 'tertiary' | null
      id?: string | null
    }[] | null
  } | null
  workExperience?: {
    title?: string | null
    timeline?: {
      company: string
      duration?: string | null
      role: string
      description: string
      color?: 'primary' | 'secondary' | 'tertiary' | null
      id?: string | null
    }[] | null
  } | null
  latestWorks?: {
    title?: string | null
    subtitle?: string | null
    exploreMoreLabel?: string | null
    exploreMoreLink?: string | null
    selectedWorks: (number | PortfolioType)[]
  } | null
  projectsSection?: {
    title?: string | null
    subtitle?: string | null
    selectedProjects: (number | PortfolioType)[]
  } | null
  testimonialsSection?: {
    title?: string | null
    subtitle?: string | null
    testimonialsList?: {
      avatar: number | Media
      quote: string
      name: string
      role: string
      color?: 'primary' | 'secondary' | 'tertiary' | null
      isFeatured?: boolean | null
      id?: string | null
    }[] | null
  } | null
  cta?: {
    title?: string | null
    preEmailText?: string | null
    email?: string | null
    addressTitle?: string | null
    address?: string | null
    links?: {
      label: string
      url: string
      id?: string | null
    }[] | null
  } | null
  sectionVisibility?: {
    hero?: boolean | null
    skills?: boolean | null
    services?: boolean | null
    experience?: boolean | null
    projects?: boolean | null
    latestWorks?: boolean | null
    testimonials?: boolean | null
    cta?: boolean | null
  } | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getYouTubeId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : url
}

const isYouTube = (url: string) =>
  url && (url.includes('youtu.be') || url.includes('youtube.com'))

// ─── Skill Icon Map (devicon class → icon) ───────────────────────────────────
// Maps every skill name to its devicon CSS class. Falls back to a plain Code2 icon.
const SKILL_ICONS: Record<string, string> = {
  // Frontend
  'HTML5': 'devicon-html5-plain colored',
  'CSS3': 'devicon-css3-plain colored',
  'JavaScript': 'devicon-javascript-plain colored',
  'TypeScript': 'devicon-typescript-plain colored',
  'React 19': 'devicon-react-original colored',
  'Redux Toolkit': 'devicon-redux-original colored',
  'Next.js 15': 'devicon-nextjs-plain',
  'Vue.js': 'devicon-vuejs-plain colored',
  'Tailwind': 'devicon-tailwindcss-plain colored',
  'Material UI': 'devicon-materialui-plain colored',
  'Shadcn': '', // handled via custom SVG in renderSkillIcon
  // Backend
  'Node.js': 'devicon-nodejs-plain colored',
  'Express': 'devicon-express-original',
  'GraphQL': 'devicon-graphql-plain colored',
  'REST APIs': 'devicon-fastapi-plain colored',
  'WebSockets': 'devicon-socketio-original',
  'Microservices': 'devicon-docker-plain colored',
  // Mobile
  'React Native': 'devicon-react-original colored',
  'Flutter': 'devicon-flutter-plain colored',
  // Databases
  'PostgreSQL': 'devicon-postgresql-plain colored',
  'MongoDB': 'devicon-mongodb-plain colored',
  'Supabase': 'devicon-supabase-plain colored',
  'Redis': 'devicon-redis-plain colored',
  'MySQL': 'devicon-mysql-plain colored',
  'Meilisearch': 'devicon-algolia-plain colored',
  // DevOps & QA
  'Docker': 'devicon-docker-plain colored',
  'Vercel': 'devicon-vercel-original',
  'AWS': 'devicon-amazonwebservices-plain-wordmark colored',
  'GCP': 'devicon-googlecloud-plain colored',
  'CI/CD': 'devicon-githubactions-plain colored',
  'Git': 'devicon-git-plain colored',
  'Jest': 'devicon-jest-plain colored',
  'React Testing Library': 'devicon-react-original colored',
  // Search
  'Algolia': 'devicon-algolia-plain colored',
  'Elastic Search': 'devicon-elasticsearch-plain colored',
  // CMS
  'Strapi': 'devicon-strapi-plain colored',
  'Sanity': 'devicon-sanity-plain colored',
  'Payload CMS': 'devicon-nodejs-plain colored',
  // E-Commerce
  'WooCommerce': 'devicon-wordpress-plain colored',
  'Big Commerce': 'devicon-javascript-plain colored',
  'Medusa.js': 'devicon-nodejs-plain colored',
  'Shopify': 'devicon-shopify-plain colored',
  'Lovable': 'devicon-react-original colored',
  // AI
  'N8N': 'devicon-nodejs-plain colored',
  'Agentic AI': 'devicon-python-plain colored',
  'MCP Implementation': 'devicon-typescript-plain colored',
  'Prompt Engineering': 'devicon-python-plain colored',
  // No-Code
  'Builder.io': 'devicon-react-original colored',
  'Framer': 'devicon-figma-plain colored',
  'Webflow': 'devicon-css3-plain colored',
  // Payments & Logistics (plain fallbacks)
  'Stripe': 'devicon-stripe-original colored',
}

// ─── Render Skill Icon Helper ───────────────────────────────────────────────
const renderSkillIcon = (skill: string) => {
  // Custom SVG icons for skills without devicon support
  if (skill === 'Shadcn') {
    return (
      <svg
        viewBox="0 0 256 256"
        className="w-5 h-5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="256" height="256" rx="32" fill="#18181B" />
        <path
          d="M136 80L200 184H72L136 80Z"
          stroke="white"
          strokeWidth="16"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="136" cy="176" r="20" fill="white" />
      </svg>
    )
  }
  const iconClass = SKILL_ICONS[skill]
  if (iconClass) {
    return <i className={`${iconClass} text-xl leading-none`} style={{ fontSize: '1.2rem' }} />
  }

  const lowerSkill = skill.toLowerCase()
  if (
    lowerSkill.includes('pay') ||
    lowerSkill.includes('mips') ||
    lowerSkill.includes('pagseguro') ||
    lowerSkill.includes('stripe')
  ) {
    return <CreditCard className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
  }
  if (
    lowerSkill.includes('shipping') ||
    lowerSkill.includes('delhivery') ||
    lowerSkill.includes('fedex') ||
    lowerSkill.includes('shippo') ||
    lowerSkill.includes('logistics')
  ) {
    return <Truck className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
  }
  if (
    lowerSkill.includes('ai') ||
    lowerSkill.includes('agentic') ||
    lowerSkill.includes('prompt') ||
    lowerSkill.includes('n8n') ||
    lowerSkill.includes('mcp')
  ) {
    return <Cpu className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
  }
  if (lowerSkill.includes('amazon') || lowerSkill.includes('aws')) {
    return <Cloud className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" />
  }

  return <Code2 className="w-5 h-5 text-[#4a6080]" />
}

// ─── Tech Categories Data ────────────────────────────────────────────────────
const TECH_CATEGORIES = [
  {
    id: 'frontend',
    title: 'Frontend',
    iconName: 'layout',
    color: 'from-blue-500/20 to-cyan-500/20',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React 19', 'Redux Toolkit', 'Next.js 15', 'Vue.js', 'Tailwind', 'Material UI', 'Shadcn'],
  },
  {
    id: 'backend',
    title: 'Backend',
    iconName: 'server',
    color: 'from-emerald-500/20 to-teal-500/20',
    skills: ['Node.js', 'Express', 'GraphQL', 'REST APIs', 'WebSockets', 'Microservices'],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    iconName: 'smartphone',
    color: 'from-purple-500/20 to-indigo-500/20',
    skills: ['React Native', 'Flutter'],
  },
  {
    id: 'databases',
    title: 'Databases',
    iconName: 'database',
    color: 'from-amber-500/20 to-orange-500/20',
    skills: ['PostgreSQL', 'MongoDB', 'Supabase', 'Redis', 'MySQL', 'Meilisearch'],
  },
  {
    id: 'devops',
    title: 'DevOps & QA',
    iconName: 'cloud',
    color: 'from-rose-500/20 to-pink-500/20',
    skills: ['Docker', 'Vercel', 'AWS', 'GCP', 'CI/CD', 'Git', 'Jest', 'React Testing Library'],
  },
  {
    id: 'cms',
    title: 'CMS',
    iconName: 'file-text',
    color: 'from-indigo-500/20 to-purple-500/20',
    skills: ['Strapi', 'Sanity', 'Payload CMS'],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce',
    iconName: 'shopping-bag',
    color: 'from-sky-500/20 to-indigo-500/20',
    skills: ['WooCommerce', 'Big Commerce', 'Medusa.js', 'Shopify', 'Lovable'],
  },
  {
    id: 'ai',
    title: 'AI & Automation',
    iconName: 'cpu',
    color: 'from-fuchsia-500/20 to-pink-500/20',
    skills: ['N8N', 'Agentic AI', 'MCP Implementation', 'Prompt Engineering'],
  },
  {
    id: 'nocode',
    title: 'No-Code',
    iconName: 'zap',
    color: 'from-orange-500/20 to-yellow-500/20',
    skills: ['Builder.io', 'Framer', 'Webflow'],
  },
  {
    id: 'payments',
    title: 'Payments',
    iconName: 'credit-card',
    color: 'from-red-500/20 to-rose-500/20',
    skills: ['MIPS', 'PagSeguro', 'RazorPay', 'PhonePe', 'Stripe'],
  },
  {
    id: 'fulfillment',
    title: 'Logistics',
    iconName: 'truck',
    color: 'from-teal-500/20 to-emerald-500/20',
    skills: ['Shippo', 'Amazon Shipping', 'Delhivery', 'FedEx'],
  },
]

const getCategoryIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName) {
    case 'layout': return <Layout className={className} />
    case 'server': return <Server className={className} />
    case 'database': return <Database className={className} />
    case 'smartphone': return <Smartphone className={className} />
    case 'cloud': return <Cloud className={className} />
    case 'file-text': return <FileText className={className} />
    case 'shopping-bag': return <ShoppingBag className={className} />
    case 'search': return <Search className={className} />
    case 'cpu': return <Cpu className={className} />
    case 'zap': return <Zap className={className} />
    case 'credit-card': return <CreditCard className={className} />
    case 'truck': return <Truck className={className} />
    default: return <Code2 className={className} />
  }
}

const getServiceIcon = (iconName: string | null | undefined, className = "w-6 h-6") => {
  if (!iconName) return <Sparkles className={className} />
  switch (iconName.toLowerCase()) {
    case 'globe':
      return <Globe className={className} />
    case 'dns':
    case 'server':
      return <Server className={className} />
    case 'smartphone':
    case 'mobile':
      return <Smartphone className={className} />
    case 'code':
    case 'devops':
      return <Code2 className={className} />
    case 'laptop_mac':
    case 'computer':
    case 'consulting':
    case 'monitor':
      return <Laptop className={className} />
    default:
      return <Sparkles className={className} />
  }
}


// ─── Floating Particles Background ───────────────────────────────────────────────────────────
const FloatingParticles: React.FC = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const particles = useMemo(() => {
    if (!mounted) return []
    return Array.from({ length: 30 }, (_, i) => {
      const opacity = Math.random() * 0.5 + 0.1
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 8,
        opacity,
        driftX: Math.random() * 20 - 10,
      }
    })
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(59,130,246,${p.opacity}), rgba(20,200,212,${p.opacity * 0.6}))`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.driftX, 0],
            opacity: [p.opacity, p.opacity * 1.8, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Animated Section Title ───────────────────────────────────────────────────
interface SectionTitleProps {
  badge?: string
  title: React.ReactNode
  subtitle?: string
  centered?: boolean
  theme?: 'light' | 'dark'
}

const SectionTitle: React.FC<SectionTitleProps> = ({ badge, title, subtitle, centered = true, theme = 'dark' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const titleColor = 'text-foreground'
  const subtitleColor = 'text-muted-foreground'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-16 ${centered ? 'text-center' : ''}`}
    >
      {badge && (
        <div className={`mb-4 ${centered ? 'flex justify-center' : ''}`}>
          <span className="section-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse inline-block" />
            {badge}
          </span>
        </div>
      )}
      <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${titleColor}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base mt-4 max-w-2xl mx-auto leading-relaxed ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: centered ? '80px' : '60px' } : {}}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        className={`h-1 rounded-full bg-foreground mt-6 ${centered ? 'mx-auto' : ''}`}
      />
    </motion.div>
  )
}

// ─── Animated Stat Counter ────────────────────────────────────────────────────
const StatCard: React.FC<{ number: string; label: string; delay?: number }> = ({ number, label, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="premium-card p-5 rounded-2xl text-center cursor-default w-full"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="text-4xl font-black text-gradient"
      >
        {number}
      </motion.p>
      <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-wider leading-snug">
        {label}
      </p>
    </motion.div>
  )
}

// Full Apple logo SVG
const AppleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 814 1000" fill="currentColor" {...props}>
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49.1 190.5-49.1zM642 110.2c32.1-38.2 54.3-91.2 54.3-144.2 0-7.7-.6-15.4-1.9-22.5-51.6 1.9-112.8 34.5-149.1 78-28.2 32.7-54.9 85.8-54.9 139.5 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.4 1.3 13.5 1.3 46.4 0 103.1-30.8 136.2-71.3z"/>
  </svg>
)

// ─── Project Card ─────────────────────────────────────────────────────────────
interface TextProjectCardProps {
  project: PortfolioType
  index: number
  backUrl?: string
}

const TextProjectCard: React.FC<TextProjectCardProps> = ({ project, index, backUrl }) => {
  const displayTitle = project.title || ''
  const href = `/portfolio/${project.slug}`

  // Bullets/key features
  const features = project.keyFeatures || []

  // Tech stack names
  const techNames = [
    ...(project.techStack || []).filter((t) => t !== 'Other'),
    ...(project.customTechStack || []).map((t) => t.tech).filter(Boolean),
  ]

  const liveUrl = project.liveProjectUrl
  const githubUrl = (project as any).githubProjectUrl
  const androidUrl = project.androidProjectUrl
  const iosUrl = project.iosProjectUrl
  const customLinks = (project as any).projectLinks || []

  const formattedIndex = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      key={project.id || index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200/80 dark:border-blue-950/40 relative shadow-sm hover:shadow-md hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 min-h-[320px] bg-white/80 dark:bg-slate-950/40 backdrop-blur-md"
    >
      <div className="flex flex-col">
        {/* Top: Index */}
        <span className="text-[11px] font-black text-slate-300 dark:text-slate-700 tracking-wider select-none mb-3">
          {formattedIndex}
        </span>

        {/* Title */}
        <h4 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors line-clamp-2">
          <Link
            href={href}
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('portfolio_back_url', backUrl ?? window.location.pathname)
              }
            }}
          >
            {displayTitle}
          </Link>
        </h4>

        {/* Short Description */}
        {project.shortDescription && (
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
            {project.shortDescription}
          </p>
        )}

        {/* Key Features (Bullets) */}
        {features.length > 0 && (
          <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
            {features.map((f, fi) => (
              <li key={fi} className="flex items-start gap-1.5">
                <span className="text-blue-500 shrink-0">•</span>
                <span>{f.feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col space-y-4 mt-6">
        {/* Tech Stack Tags */}
        {techNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techNames.map((tech, ti) => (
              <span
                key={ti}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/80"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links row */}
        {(liveUrl || androidUrl || iosUrl || githubUrl || customLinks.length > 0) && (
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-900/50">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors uppercase tracking-wider flex items-center gap-1 shrink-0"
              >
                <Globe className="w-3 h-3" /> Live Demo
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors uppercase tracking-wider flex items-center gap-1 shrink-0"
              >
                <Code2 className="w-3 h-3" /> GitHub
              </a>
            )}
            {iosUrl && (
              <a
                href={iosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors uppercase tracking-wider flex items-center gap-1 shrink-0"
              >
                <AppleIcon className="w-3.5 h-3.5 mt-[-2px]" /> App Store
              </a>
            )}
            {androidUrl && (
              <a
                href={androidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors uppercase tracking-wider flex items-center gap-1 shrink-0"
              >
                <Smartphone className="w-3 h-3" /> Play Store
              </a>
            )}
            {customLinks.map((link: any, li: number) => (
              <a
                key={li}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors uppercase tracking-wider flex items-center gap-1 shrink-0"
              >
                <ExternalLink className="w-3 h-3" /> {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Mapping of project slugs to their real screenshots on thespecialcharacter.com/portfolio
const TSC_PROJECT_IMAGES: Record<string, string> = {
  'in-house-furniture': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-26 115701.png',
  'aptouring': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-24 164043.png',
  'hermes-ai-agents-for-seo-optimization': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-24 120136-1.png',
  'plai-sport-club': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-24 115200.png',
  'vendelligent': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-24 111019.png',
  'auco': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-24 110455.png',
  'skillmatics-': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-24 105433.png',
  'skillmatics-educational-products-ecommerce': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-24 105433.png',
  'jupiter-money': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-24 104509.png',
  'hire-ai': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 185446-1.png',
  'ai-powered-lead-generation-automation': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 184845.png',
  'dolgin': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 182406.png',
  'the-chosen-tv': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 181458.png',
  'idfc-first-bank': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 180937.png',
  'foodboss-e-grocery--food-delivery-platform': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 180011.png',
  'foodboss-web-mobile-application': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 180011.png',
  'jove': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 174911.png',
  'treadommand': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-24 113336.png',
  'learning-dino': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 171618.png',
  'demo-videp': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 183211.png',
  '55redefined': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 163618.png',
  'synechron-55-redefined': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 163618.png',
  'bharat-rojgaar---government-linked-employment--job-portal': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 162122.png',
  'bharat-rojgaar-government-employment-job-portal': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 162122.png',
  'medusajobs': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 155926.png',
  'strinex': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 151452.png',
  'strainex-clean-tech-smart-grid-solutions': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 151452.png',
  'yogateria-well-being-ecommerce': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 144105.png',
  'yogateria': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 144105.png',
  'lisco': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 150021.png',
  'lisco-systems': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/Screenshot 2026-06-23 150021.png',
  'wraprr-sustainable-packaging-ecommerce': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/wraprr.png',
  'wraprr': 'https://minio-w0wsw4k40co8c8c88sw8s0o8.62.72.13.4.sslip.io/tsc-payload/wraprr.png',
}

const getTscProjectImage = (slug?: string | null): string | null => {
  if (!slug) return null
  const slugLower = slug.toLowerCase().trim()
  if (TSC_PROJECT_IMAGES[slugLower]) {
    return TSC_PROJECT_IMAGES[slugLower]
  }
  // Try substring fallback matches (e.g. "skillmatics" matches "skillmatics-")
  for (const [key, value] of Object.entries(TSC_PROJECT_IMAGES)) {
    if (slugLower.includes(key) || key.includes(slugLower)) {
      return value
    }
  }
  return null
}

interface CustomProjectCardProps {
  project: PortfolioType
  types: ('web' | 'mobile' | 'ai')[]
  index: number
  backUrl?: string
}

const CustomProjectCard: React.FC<CustomProjectCardProps> = ({ project, types, index, backUrl }) => {
  const coverImage = (project.videoThumbnail || project.screenshots?.[0]?.image) as Media
  const displayTitle = project.title || ''
  const href = `/portfolio/${project.slug}`

  const youtubeVideoId = project.youtubeVideoUrl && isYouTube(project.youtubeVideoUrl)
    ? getYouTubeId(project.youtubeVideoUrl)
    : null
  const fallbackThumbnailUrl = youtubeVideoId
    ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`
    : null

  const tscImg = getTscProjectImage(project.slug)
  const isPlaceholder = !coverImage?.url || coverImage.url.includes('pruthvish')
  const imageUrl = (isPlaceholder && tscImg) ? tscImg : (coverImage?.url || fallbackThumbnailUrl || tscImg || '')
  const hasImage = !!imageUrl

  const domains = Array.isArray(project.domain) ? project.domain : project.domain ? [project.domain] : []
  const categories = domains.map((d) => (d === 'Other' && project.customDomain ? project.customDomain : d)).filter(Boolean)
  const categoryText = categories.join(' • ') || (types.includes('mobile') ? 'APP DESIGN' : types.includes('ai') ? 'AI SOLUTIONS' : 'WEB DESIGN')

  return (
    <motion.div
      key={project.id || index}
      className="group flex flex-col gap-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        href={href}
        className="relative overflow-hidden rounded-2xl premium-card aspect-[4/3] flex items-center justify-center p-2"
        onClick={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('portfolio_back_url', backUrl ?? window.location.pathname)
          }
        }}
      >
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={coverImage?.alt || displayTitle}
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="text-foreground/20 text-xs">No Cover Image</div>
        )}
        {/* Blue overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070d1c]/90 via-[#0d2050]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <button className="btn-dark text-white px-6 py-2 rounded-full text-[10px] font-bold tracking-wider hover:scale-105 transition-transform uppercase">
            VIEW CASE STUDY →
          </button>
        </div>
        {/* Glow border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(59,130,246,0.4)' }} />
      </Link>
      <div className="px-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse"></span>
          <p className="text-[10px] font-bold text-foreground/80 uppercase tracking-widest">{categoryText}</p>
        </div>
        <h4 className="text-xl font-bold text-foreground group-hover:text-gradient transition-colors line-clamp-2">
          {displayTitle}
        </h4>
      </div>
    </motion.div>
  )
}

const getTimelineColor = (color?: string | null) => {
  // Always return the standard brand blue theme to avoid colorful dots
  return {
    text: 'text-foreground',
    dot: 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] border-blue-400 ring-blue-500/30',
    border: 'border-blue-500/20',
    glow: 'rgba(59, 130, 246, 0.15)',
  }
}

interface TimelineProject {
  title?: string
  description?: string
  stack?: string[]
}

const parseTimelineDescription = (text: string): TimelineProject[] => {
  if (!text) return []

  const projectBlocks = text.split('\n\n').filter(Boolean)
  const projects: TimelineProject[] = []

  projectBlocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    let title = ''
    let description = ''
    let stack: string[] = []

    lines.forEach(line => {
      if (line.startsWith('Stack:')) {
        stack = line.replace('Stack:', '').split(',').map(t => t.trim()).filter(Boolean)
      } else if (line.startsWith('•') || line.startsWith('-')) {
        const content = line.substring(1).trim()
        const colonIndex = content.indexOf(':')
        if (colonIndex !== -1) {
          title = content.substring(0, colonIndex).trim()
          description = content.substring(colonIndex + 1).trim()
        } else {
          description = content
        }
      } else {
        if (!description) {
          description = line
        } else {
          description += ' ' + line
        }
      }
    })

    if (title || description || stack.length > 0) {
      projects.push({ title, description, stack })
    }
  })

  return projects
}

const renderTimelineDescription = (text: string) => {
  const projects = parseTimelineDescription(text)
  
  if (projects.length === 0) return null

  return (
    <div className="space-y-8">
      {projects.map((project, idx) => (
        <div key={idx} className="flex flex-col space-y-3">
          <div className="text-left space-y-2">
            {project.title && (
              <div className="space-y-1">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground/60 block">
                  Key Project
                </span>
                <h5 className="font-bold text-foreground text-lg md:text-xl tracking-tight">
                  {project.title}
                </h5>
              </div>
            )}
            {project.description && (
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-2">
                {project.description}
              </p>
            )}
          </div>
          
          {project.stack && project.stack.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              {project.stack.map((tech, techIdx) => (
                <span
                  key={techIdx}
                  className="px-3 py-1.5 rounded text-xs md:text-sm font-semibold bg-zinc-100 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const getSocialIcon = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes('linkedin')) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  }
  if (normalized.includes('twitter') || normalized === 'x') {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  }
  if (normalized.includes('skype')) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M23.176 14.502c.07-.375.106-.757.106-1.14 0-4.636-3.77-8.406-8.406-8.406-.383 0-.765.035-1.14.106C12.632 2.378 9.948.749 6.84.749c-4.42 0-8.026 3.606-8.026 8.026 0 3.108 1.63 5.792 4.313 6.9 0 .375-.035.757-.035 1.14 0 4.636 3.77 8.406 8.406 8.406.383 0 .765-.035 1.14-.106 1.104 2.684 3.788 4.313 6.896 4.313 4.42 0 8.026-3.606 8.026-8.026 0-3.108-1.63-5.792-4.313-6.906zm-9.356 5.86c-4.004 0-6.177-2.028-6.177-4.148 0-1.077.874-1.89 1.89-1.89.92 0 1.547.53 1.848 1.148.512 1.05 1.484 1.528 2.476 1.528 1.467 0 2.298-.778 2.298-1.626 0-.892-.61-1.396-2.58-1.874l-1.503-.362c-2.88-.707-4.084-2.112-4.084-4.137 0-2.616 2.28-4.438 5.79-4.438 3.518 0 5.63 1.768 5.63 3.766 0 .972-.733 1.732-1.74 1.732-.93 0-1.424-.46-1.733-1.043-.45-.85-1.193-1.28-2.148-1.28-1.122 0-1.892.574-1.892 1.396 0 .787.592 1.22 2.14 1.59l1.502.363c3.084.743 4.5 2.112 4.5 4.322 0 2.873-2.316 4.933-6.233 4.933z"/>
      </svg>
    )
  }
  if (normalized.includes('github')) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  }
  return <span>{label}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const PersonalPortfolioComponent: React.FC<PersonalPortfolioBlockProps> = (props) => {
  const {
    hero,
    skillsTitle,
    skillsDescription,
    skillsCategories,
    expertise,
    workExperience,
    latestWorks,
    projectsSection,
    testimonialsSection,
    cta,
    sectionVisibility,
  } = props

  // ─── Section Visibility Flags ─────────────────────────────────────────────
  // Default to true (visible) when the flag is null/undefined so existing
  // records that pre-date this feature still show all sections normally.
  const showHero        = sectionVisibility?.hero        !== false
  const showSkills      = sectionVisibility?.skills      !== false
  const showServices    = sectionVisibility?.services    !== false
  const showExperience  = sectionVisibility?.experience  !== false
  const showProjects    = sectionVisibility?.projects    !== false
  const showLatestWorks = sectionVisibility?.latestWorks !== false
  const showTestimonials = sectionVisibility?.testimonials !== false
  const showCta         = sectionVisibility?.cta         !== false

  const [showAllProjects, setShowAllProjects] = useState(false)

  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)

  const renderedCategories = useMemo(() => {
    if (skillsCategories && skillsCategories.length > 0) {
      return skillsCategories.map((cat) => ({
        id: cat.title.toLowerCase().replace(/\s+/g, '-'),
        title: cat.title,
        iconName: cat.iconName || 'layout',
        skills: cat.skills?.map((s) => s.skillName) || [],
      }))
    }
    return TECH_CATEGORIES
  }, [skillsCategories])

  const [activeCategory, setActiveCategory] = useState<string>('')

  useEffect(() => {
    if (renderedCategories.length > 0 && !activeCategory) {
      setActiveCategory(renderedCategories[0].id)
    }
  }, [renderedCategories, activeCategory])

  const currentCategoryData = useMemo(() => {
    return renderedCategories.find((c) => c.id === activeCategory) || renderedCategories[0]
  }, [activeCategory, renderedCategories])

  // Track active section on scroll
  useEffect(() => {
    const handleScrollActive = () => {
      const scrollPosition = window.scrollY + 120
      setScrolled(window.scrollY > 20)

      if (window.scrollY < 50) {
        setActiveSection('home')
        return
      }

      const sectionIds = ['home', 'skills', 'services', 'experience', 'projects', 'portfolio', 'contact']
      let currentSection = 'home'

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          if (scrollPosition >= top) {
            currentSection = id
          }
        }
      }
      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScrollActive, { passive: true })
    handleScrollActive()
    return () => window.removeEventListener('scroll', handleScrollActive)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault()
    
    // First scroll to the section
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.pushState(null, '', '#home')
    } else {
      const element = document.getElementById(id)
      if (element) {
        const yOffset = -80
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
        window.history.pushState(null, '', `#${id}`)
      }
    }
    
    // Then close the mobile menu after a short delay so that touch/click event completes
    setTimeout(() => {
      setMobileMenuOpen(false)
    }, 10)
  }

  // Hero image
  const heroImageObj = hero?.heroImage as Media
  const heroImageUrl = heroImageObj?.url || ''
  const heroImageAlt = heroImageObj?.alt || 'Profile Image'

  // CV File
  const cvFileObj = hero?.downloadCvFile as Media
  const cvFileUrl = cvFileObj?.url || '/media/Pruthvish_Modi_CV.pdf'

  // Scroll parallax
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Testimonials
  const testimonials = testimonialsSection?.testimonialsList || []
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0)

  // Portfolio filtering
  const ITEMS_PER_PAGE = 6
  const [activeTab, setActiveTab] = useState<'all' | 'web' | 'mobile' | 'ai'>('all')
  const [selectedDomain, setSelectedDomain] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let initialTab: 'all' | 'web' | 'mobile' | 'ai' | null = null
    let initialDomain: string | null = null
    let initialPage: number | null = null

    const searchParams = new URLSearchParams(window.location.search)
    const urlTab = searchParams.get('tab')
    if (urlTab === 'all' || urlTab === 'web' || urlTab === 'mobile' || urlTab === 'ai') {
      initialTab = urlTab
    }

    const fromDetail = sessionStorage.getItem('portfolio_from_detail')
    if (fromDetail === 'true') {
      const savedTab = sessionStorage.getItem('portfolio_activeTab')
      const savedDomain = sessionStorage.getItem('portfolio_selectedDomain')
      const savedPage = sessionStorage.getItem('portfolio_currentPage')

      if (!initialTab && savedTab) initialTab = savedTab as 'all' | 'web' | 'mobile' | 'ai'
      if (savedDomain) initialDomain = savedDomain
      if (savedPage) {
        const pageNum = parseInt(savedPage, 10)
        if (!isNaN(pageNum)) initialPage = pageNum
      }
      setTimeout(() => sessionStorage.removeItem('portfolio_from_detail'), 100)
    } else {
      sessionStorage.removeItem('portfolio_activeTab')
      sessionStorage.removeItem('portfolio_selectedDomain')
      sessionStorage.removeItem('portfolio_currentPage')
    }

    if (initialTab) setActiveTab(initialTab)
    if (initialDomain) setSelectedDomain(initialDomain)
    if (initialPage) setCurrentPage(initialPage)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    sessionStorage.setItem('portfolio_activeTab', activeTab)
    sessionStorage.setItem('portfolio_selectedDomain', selectedDomain)
    sessionStorage.setItem('portfolio_currentPage', String(currentPage))
  }, [activeTab, selectedDomain, currentPage, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    const url = new URL(window.location.href)
    if (activeTab === 'all') {
      url.searchParams.delete('tab')
    } else {
      url.searchParams.set('tab', activeTab)
    }
    window.history.replaceState(null, '', url.pathname + url.search)
  }, [activeTab, isInitialized])

  const populatedWorks = (latestWorks?.selectedWorks || [])
    .filter((w): w is PortfolioType => w !== null && typeof w === 'object')

  const populatedProjectsSectionWorks = (projectsSection?.selectedProjects || [])
    .filter((w): w is PortfolioType => w !== null && typeof w === 'object')

  const processedProjects = useMemo(() => {
    return populatedWorks.map((project) => {
      const types: ('web' | 'mobile' | 'ai')[] = []
      if (project.techStack?.includes('React Native') || project.techStack?.includes('Flutter')) {
        types.push('mobile')
      }
      if (project.techStack?.includes('AI') || project.domain?.includes('AI')) {
        types.push('ai')
      }
      if (types.length === 0) types.push('web')
      return { project, types }
    })
  }, [populatedWorks])

  const projectTypesMap = useMemo(() => {
    const map: Record<string, ('web' | 'mobile' | 'ai')[]> = {}
    processedProjects.forEach((item) => {
      if (item.project.id) map[item.project.id] = item.types
    })
    return map
  }, [processedProjects])

  const webItems = useMemo(() => processedProjects.filter((item) => item.types.includes('web')), [processedProjects])
  const mobileItems = useMemo(() => processedProjects.filter((item) => item.types.includes('mobile')), [processedProjects])
  const aiItems = useMemo(() => processedProjects.filter((item) => item.types.includes('ai')), [processedProjects])

  const activeTabItems = useMemo(() => {
    if (activeTab === 'all') return processedProjects
    if (activeTab === 'web') return webItems
    if (activeTab === 'mobile') return mobileItems
    if (activeTab === 'ai') return aiItems
    return []
  }, [activeTab, processedProjects, webItems, mobileItems, aiItems])

  const uniqueDomains = useMemo(() => {
    const domainsSet = new Set<string>()
    const caseMapping: Record<string, string> = {}
    activeTabItems.forEach((item) => {
      const proj = item.project
      const domains = Array.isArray(proj.domain) ? proj.domain : proj.domain ? [proj.domain] : []
      domains.forEach((d) => {
        const domainLabel = d === 'Other' && proj.customDomain ? proj.customDomain : d
        if (domainLabel) {
          const trimmed = domainLabel.trim()
          if (trimmed) {
            const lower = trimmed.toLowerCase()
            if (!caseMapping[lower]) caseMapping[lower] = trimmed
            domainsSet.add(lower)
          }
        }
      })
    })
    return Array.from(domainsSet).map((lower) => caseMapping[lower])
  }, [activeTabItems])

  const filteredItems = useMemo(() => {
    if (selectedDomain === 'All') return activeTabItems
    return activeTabItems.filter((item) => {
      const proj = item.project
      const domains = Array.isArray(proj.domain) ? proj.domain : proj.domain ? [proj.domain] : []
      return domains.some((d) => {
        const domainLabel = d === 'Other' && proj.customDomain ? proj.customDomain : d
        return domainLabel?.trim().toLowerCase() === selectedDomain.toLowerCase()
      })
    })
  }, [activeTabItems, selectedDomain])

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredItems.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredItems, currentPage])

  const totalPages = useMemo(() => Math.ceil(filteredItems.length / ITEMS_PER_PAGE), [filteredItems.length])

  const tabs: { key: 'all' | 'web' | 'mobile' | 'ai'; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <LayoutGrid className="w-4 h-4" /> },
    { key: 'web', label: 'Web Development', icon: <Globe className="w-4 h-4" /> },
    { key: 'mobile', label: 'Mobile Apps', icon: <Smartphone className="w-4 h-4" /> },
    { key: 'ai', label: 'AI Solutions', icon: <Sparkles className="w-4 h-4" /> },
  ]

  const navItems = [
    { label: 'HOME', id: 'home' },
    { label: 'ABOUT', id: 'skills' },
    { label: 'SERVICES', id: 'services' },
    { label: 'EXPERIENCE', id: 'experience' },
    { label: 'PROJECTS', id: 'projects' },
    { label: 'PORTFOLIO', id: 'portfolio' },
    { label: 'CONTACT', id: 'contact' },
  ]

  return (
    <div className="bg-background text-foreground font-sans selection:bg-blue-500/30 selection:text-blue-300 min-h-screen pt-20 relative">

      {/* ─── Top Navigation Bar ─── */}
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b backdrop-blur-xl"
        style={{
          background: scrolled
            ? 'rgba(255, 255, 255, 0.85)'
            : 'rgba(255, 255, 255, 0.5)',
          borderColor: scrolled ? 'rgba(59, 130, 246, 0.16)' : 'rgba(59, 130, 246, 0.08)',
          boxShadow: scrolled ? '0 10px 30px rgba(59, 130, 246, 0.04)' : 'none',
        }}
      >
        <div className="flex justify-between items-center py-4 px-container h-20 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <span className="text-[22px] font-extrabold tracking-tight text-foreground select-none">
              {hero?.titleHighlight ? hero.titleHighlight.split(' ')[0] : 'Pruthvish'}<span className="text-gradient font-black">.</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:flex items-center gap-8"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`relative text-[11px] font-bold tracking-[0.2em] transition-colors py-1 cursor-pointer ${
                  activeSection === item.id
                    ? 'text-blue-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-[-6px] left-0 w-full h-[2px] rounded-full"
                    style={{ background: 'linear-gradient(90deg, #3b82f6, #14c8d4)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </motion.div>

          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground hover:text-blue-400 transition-colors md:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl"
            >
              <div className="flex flex-col p-6 gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className={`text-left py-3.5 text-sm font-bold tracking-widest border-b border-slate-100 transition-colors uppercase ${
                      activeSection === item.id ? 'text-blue-400' : 'text-muted-foreground hover:text-blue-500'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Hero Section ─── */}
      {showHero && (
      <section className="relative min-h-[100vh] flex items-center overflow-hidden py-20 bg-grid" id="home">
        {/* Radial glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-background to-transparent" />
        </div>

        <FloatingParticles />

        <div className="w-full px-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Text */}
          <div className="flex flex-col gap-6">
            {hero?.badgeText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="section-badge">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                  {hero.badgeText}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black leading-tight tracking-tight"
            >
              {hero?.titlePreHighlight || "I'm"}<br />
              <span className="text-gradient">{hero?.titleHighlight || 'Pruthvish Modi'}</span>
            </motion.h1>

            {hero?.introduction && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1"
              >
                {hero.introduction}
              </motion.h2>
            )}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg"
            >
              {hero?.description}
            </motion.p>

            {/* Stats Row — only Years of Experience + Completed Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-8 mt-2"
            >
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-black text-gradient">
                  {(() => {
                    const exp = hero?.experienceYears || '10'
                    return /^\d+$/.test(exp) ? `${exp}+` : exp
                  })()}
                </span>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                  {hero?.experienceLabel || 'YEARS EXPERIENCE'}
                </span>
              </div>
              <div className="h-16 w-[1px] bg-blue-800/50" />
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold text-foreground">
                  {(() => {
                    const cert = hero?.certificationTitle || '15'
                    return /^\d+$/.test(cert) ? `${cert}+` : cert
                  })()}
                </span>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  {hero?.certificationLabel || 'COMPLETED PROJECTS'}
                </span>
              </div>
            </motion.div>

            {(hero?.location || hero?.email || hero?.phone) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-sm text-slate-600 dark:text-slate-400 font-semibold"
              >
                {hero?.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>{hero.location}</span>
                  </div>
                )}
                {hero?.email && (
                  <a href={`mailto:${hero.email}`} className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>{hero.email}</span>
                  </a>
                )}
                {hero?.phone && (
                  <a href={`tel:${hero.phone}`} className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>{hero.phone}</span>
                  </a>
                )}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4 mt-4 flex-wrap"
            >
              {hero?.downloadCvLabel && (
                <a
                  href={cvFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30 px-8 py-3.5 rounded-lg text-base font-bold transition-all inline-flex items-center gap-2"
                >
                  {hero.downloadCvLabel}
                  <ExternalLink className="w-4 h-4 opacity-60" />
                </a>
              )}
              {hero?.linkedinLink && (
                <a
                  href={hero.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30 px-8 py-3.5 rounded-lg text-base font-bold transition-all inline-flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  {hero.linkedinLabel || 'LinkedIn'}
                </a>
              )}
              {hero?.githubLink && (
                <a
                  href={hero.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30 px-8 py-3.5 rounded-lg text-base font-bold transition-all inline-flex items-center gap-2"
                >
                  <Github className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  {hero.githubLabel || 'GitHub'}
                </a>
              )}
            </motion.div>
          </div>

          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] aspect-[3/4]">
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full bg-blue-600/15 blur-[80px] animate-pulse" />
              <div
                className="absolute inset-[-20px] rounded-full border border-blue-500/10 animate-pulse"
                style={{ animationDuration: '3s' }}
              />
              <div
                className="absolute inset-[-40px] rounded-full border border-blue-500/5 animate-pulse"
                style={{ animationDuration: '4s', animationDelay: '1s' }}
              />

              <motion.div
                className="relative z-10 w-full h-full rounded-full overflow-hidden glass-panel border border-blue-600/20 p-2"
                style={{
                  transform: `translateY(${scrollY * 0.05}px)`,
                  transition: 'transform 0.1s ease-out',
                  boxShadow: '0 0 60px rgba(59,130,246,0.15), 0 0 100px rgba(59,130,246,0.05)',
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {heroImageUrl && (
                  <Image
                    src={heroImageUrl}
                    alt={heroImageAlt}
                    fill
                    className="w-full h-full object-cover rounded-full"
                    sizes="(max-width: 768px) 100vw, 340px"
                    priority
                    unoptimized
                  />
                )}
                {/* Blue tint overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent rounded-full pointer-events-none" />
              </motion.div>

              {/* Floating badge: Experience */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-4 -left-4 glass-panel px-4 py-3 rounded-2xl border border-blue-500/20 z-20 glow-blue"
              >
                <p className="text-xs font-bold text-blue-400">
                  {hero?.stat3Label
                    ? (hero.stat3Number ? `${hero.stat3Number} ${hero.stat3Label}` : hero.stat3Label)
                    : '✦ AVAILABLE FOR WORK'}
                </p>
              </motion.div>

              {/* Floating badge: Projects */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-4 -right-4 glass-panel px-4 py-3 rounded-2xl border border-cyan-500/20 z-20"
              >
                <p className="text-xs font-bold text-cyan-400">
                  {hero?.stat4Label
                    ? (hero.stat4Number ? `${hero.stat4Number} ${hero.stat4Label}` : hero.stat4Label)
                    : 'Full Stack Developer'}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] font-bold tracking-widest uppercase">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-blue-700/40 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-blue-400" />
          </motion.div>
        </motion.div>
      </section>
      )}

      {/* ─── Tech Skills Section ─── */}
      {showSkills && (
      <section
        className="py-28 relative overflow-hidden"
        id="skills"
        style={{ background: 'linear-gradient(180deg, #f0f6ff 0%, #e8f0fe 100%)' }}
      >
        {/* Subtle dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #1e3a8a 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Top-center glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.10) 0%, transparent 70%)' }} />

        <div className="w-full px-container relative z-10">
          {/* Section heading */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-black text-[#0d1f3d] tracking-tight"
            >
              {skillsTitle || 'Technical Skills'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 text-[#4a6080] text-base"
            >
              {skillsDescription || 'My expertise across various technologies and tools'}
            </motion.p>
          </div>

          {/* Tab Bar */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {renderedCategories.map((category) => {
                const isActive = activeCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap select-none ${
                      isActive
                        ? 'btn-dark text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/30 border border-transparent'
                    }`}
                  >
                    {category.title}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Skills Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-[rgba(191,213,245,0.9)] overflow-hidden"
              style={{ background: '#ffffff', boxShadow: '0 4px 24px rgba(30,60,120,0.07)' }}
            >
              <div className="p-6 md:p-8 flex flex-wrap gap-3 justify-center">
                {currentCategoryData?.skills?.map((skill, i) => {
                  const iconClass = SKILL_ICONS[skill]
                  return (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-[rgba(191,213,245,0.8)] cursor-default select-none transition-all duration-200 hover:border-[rgba(59,130,246,0.5)] hover:bg-[#eff6ff] group"
                      style={{ background: '#f8faff' }}
                    >
                      {renderSkillIcon(skill)}
                      <span className="text-sm font-medium text-[#1e3a8a] group-hover:text-[#1e40af] transition-colors duration-150 whitespace-nowrap">
                        {skill}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      )}

      {/* ─── Services Section ─── */}
      {showServices && expertise && (
        <section className="py-24 px-container relative w-full" id="services">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Section: Badge, Title, Description, Stats */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <span className="section-badge mb-4 inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Services
              </span>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black leading-tight mt-4 text-[#0d1f3d]"
              >
                {expertise.title || 'Services to navigate your Growth'}
              </motion.h2>
              {expertise.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-muted-foreground text-lg mt-6 leading-relaxed"
                >
                  {expertise.description}
                </motion.p>
              )}

              {/* Stats */}
              {expertise.stats && expertise.stats.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-8 w-full border-t border-slate-200/60 pt-6">
                  {expertise.stats.map((stat, idx) => (
                    <motion.div
                      key={stat.id || idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      className="flex flex-col"
                    >
                      <span className="text-2xl md:text-3xl font-black text-gradient leading-none">
                        {stat.number.endsWith('+') ? stat.number : `${stat.number}+`}
                      </span>
                      <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground mt-1.5 uppercase tracking-wider leading-snug">
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Section: Vertical Stack of Rectangle Cards */}
            <div className="lg:col-span-7 flex flex-col gap-6 w-full">
              {expertise.cards && expertise.cards.length > 0 && (
                expertise.cards.map((card, idx) => {
                  return (
                    <motion.div
                      key={card.id || idx}
                      initial={{ opacity: 0, y: 35 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ x: 6 }}
                      className="group relative rounded-2xl overflow-hidden cursor-default w-full"
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid rgba(191, 213, 245, 0.9)',
                        boxShadow: '0 2px 16px rgba(30, 60, 120, 0.06)',
                        transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.boxShadow = '0 16px 48px rgba(59, 130, 246, 0.12), 0 2px 8px rgba(30, 60, 120, 0.06)'
                        el.style.borderColor = 'rgba(59, 130, 246, 0.45)'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.boxShadow = '0 2px 16px rgba(30, 60, 120, 0.06)'
                        el.style.borderColor = 'rgba(191, 213, 245, 0.9)'
                      }}
                    >
                      {/* Left border accent — grows in on hover */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-full scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-500"
                        style={{ background: 'linear-gradient(180deg, #bfdbfe, #3b82f6, #bfdbfe)' }}
                      />

                      {/* Hover blue tint overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, rgba(239,246,255,0.6) 0%, transparent 60%)' }}
                      />

                      <div className="relative z-10 py-4 px-5 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        
                        {/* Left part: Icon & Title/Description */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Icon Container */}
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                            style={{
                              background: 'rgba(239, 246, 255, 1)',
                              border: '1.5px solid rgba(147, 197, 253, 0.6)',
                              color: '#1e40af',
                            }}
                          >
                            {getServiceIcon(card.icon, "w-5 h-5")}
                          </div>

                          {/* Content */}
                          <div className="min-w-0">
                            <h3
                              className="text-base font-black leading-tight mb-1 transition-colors duration-300 group-hover:text-blue-700"
                              style={{ color: '#0d1f3d' }}
                            >
                              {card.title}
                            </h3>
                            {card.description && (
                              <p
                                className="text-xs leading-relaxed"
                                style={{ color: 'rgba(30, 58, 138, 0.6)' }}
                              >
                                {card.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right part: CTA Button */}
                        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-blue-100/50">
                          <motion.div
                            whileHover={{ x: 3 }}
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              background: 'rgba(239, 246, 255, 1)',
                              border: '1.5px solid rgba(147, 197, 253, 0.7)',
                              color: '#1e40af',
                            }}
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.div>
                        </div>

                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── Work Experience Section ─── */}
      {showExperience && workExperience && workExperience.timeline && workExperience.timeline.length > 0 && (
        <section className="py-24 relative overflow-hidden" id="experience">
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="w-full px-container relative z-10">
            {/* Standardized Section Badge & Heading */}
            <div className="mb-16 text-left">
              <span className="section-badge mb-4 inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Experience
              </span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black tracking-tight mt-4 text-[#0d1f3d] dark:text-foreground"
              >
                {workExperience.title || 'My Work Experience'}
              </motion.h2>
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
              {workExperience.timeline.map((item, idx) => {
                const [companyName, ...locationParts] = item.company.split(',')
                const companyLocation = locationParts.join(',').trim()

                return (
                  <div
                    key={item.id || idx}
                    className="py-12 first:pt-0 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
                  >
                    {/* Left Column: Company Info (5/12 cols, aligns with Services left column) */}
                    <div className="lg:col-span-5 flex flex-col space-y-1 text-left">
                      <h4 className="text-xl md:text-2xl font-black text-foreground tracking-tight leading-tight">
                        {companyName}
                      </h4>
                      {companyLocation && (
                        <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                          {companyLocation}
                        </p>
                      )}
                      {item.duration && (
                        <p className="text-sm text-muted-foreground/60 font-semibold tracking-wider uppercase mt-1">
                          {item.duration}
                        </p>
                      )}
                    </div>

                    {/* Right Column: Role & Content (7/12 cols, aligns with Services right cards column) */}
                    <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight">
                          {item.role}
                        </h3>
                      </div>

                      {/* Content Description */}
                      <div className="relative z-10">
                        {renderTimelineDescription(item.description)}
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Projects Section (Text Cards Grid) ─── */}
      {showProjects && projectsSection && populatedProjectsSectionWorks.length > 0 && (
        <section className="py-24 px-container relative w-full" id="projects">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="mb-16 text-left">
            <span className="section-badge mb-4 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Projects
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black tracking-tight mt-4 text-[#0d1f3d] dark:text-foreground"
            >
              {projectsSection.title || 'Projects/Contractual'}
            </motion.h2>
            {projectsSection.subtitle && (
              <p className="text-muted-foreground text-base mt-2">{projectsSection.subtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {populatedProjectsSectionWorks
              .slice(0, showAllProjects ? undefined : 6)
              .map((project, index) => (
                <TextProjectCard
                  key={`text-proj-${project.id || index}`}
                  project={project}
                  index={index}
                  backUrl={pathname}
                />
              ))}
          </div>

          {populatedProjectsSectionWorks.length > 6 && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="btn-dark text-white px-8 py-3.5 rounded-xl text-sm font-bold tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-md uppercase"
              >
                {showAllProjects ? 'Show Less Projects ↑' : 'View All Projects ↓'}
              </button>
            </div>
          )}
        </section>
      )}

      {/* ─── Selected Projects Section ─── */}
      {showLatestWorks && latestWorks && populatedWorks.length > 0 && (
        <section className="py-24 px-container relative w-full" id="portfolio">
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <span className="section-badge mb-4 inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Portfolio
              </span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black tracking-tight mt-4"
              >
                {latestWorks.title === 'Selected Projects' ? 'Featured Portfolios' : (latestWorks.title || 'Featured Portfolios')}
              </motion.h2>
              {latestWorks.subtitle && (
                <p className="text-muted-foreground text-base mt-2">{latestWorks.subtitle}</p>
              )}
            </div>
            {latestWorks.exploreMoreLabel && (
              <Link
                href={latestWorks.exploreMoreLink || '#'}
                className="text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group transition-colors"
              >
                {latestWorks.exploreMoreLabel}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className="transition-opacity duration-300 ease-out" style={{ opacity: isInitialized ? 1 : 0 }}>
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="glass-panel p-1.5 rounded-full flex items-center border border-slate-200 shadow-lg relative flex-wrap gap-1 justify-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key)
                      setSelectedDomain('All')
                      setCurrentPage(1)
                    }}
                    className={`relative z-10 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                      activeTab === tab.key
                        ? 'btn-dark text-white font-semibold shadow-md'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain Sub-filters */}
            {uniqueDomains.length > 0 && (
              <div className="flex justify-center mb-12">
                <div className="flex flex-wrap gap-2.5 justify-center items-center max-w-5xl">
                  {uniqueDomains.map((domain) => {
                    const isSelected = selectedDomain.toLowerCase() === domain.toLowerCase()
                    return (
                      <button
                        key={domain}
                        onClick={() => {
                          setSelectedDomain(isSelected ? 'All' : domain)
                          setCurrentPage(1)
                        }}
                        className={`px-5 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-300 uppercase border select-none hover:scale-[1.02] active:scale-95 ${
                          isSelected
                            ? 'btn-dark text-white border-transparent shadow-md'
                            : 'glass-panel border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                        }`}
                      >
                        {domain}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tab Contents */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${selectedDomain}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((item, index) => (
                      <CustomProjectCard
                        key={`${item.types.join('-')}-${item.project.id || index}`}
                        project={item.project}
                        types={projectTypesMap[item.project.id] || item.types}
                        index={index}
                        backUrl={pathname}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center text-muted-foreground glass-panel border border-blue-900/20 rounded-2xl">
                      {activeTabItems.length === 0
                        ? `No ${activeTab === 'all' ? '' : activeTab === 'web' ? 'web ' : activeTab === 'mobile' ? 'mobile ' : 'AI '}projects added yet.`
                        : `No projects matching "${selectedDomain}" found in this category.`}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    className="flex items-center justify-center gap-2 mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <button
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                        document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full glass-panel border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page)
                          document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                          currentPage === page
                            ? 'btn-dark text-white'
                            : 'glass-panel border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-400'
                        }`}
                        aria-label={`Page ${page}`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-full glass-panel border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}


      {/* ─── Testimonials Section ─── */}
      {showTestimonials && testimonials.length > 0 && (
        <section className="py-24 text-center relative overflow-hidden" id="testimonials">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

          <div className="w-full px-container relative z-10">
            <SectionTitle
              badge="Testimonials"
              title={<>{testimonialsSection?.title || 'What Clients Say'}</>}
              subtitle={testimonialsSection?.subtitle ?? undefined}
              theme="light"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {testimonials.map((item, idx) => {
                const avatarObj = item.avatar as Media
                const avatarUrl = avatarObj?.url || ''
                const avatarAlt = avatarObj?.alt || item.name

                const accentColor = '#0d1f3d'

                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`premium-card p-8 rounded-2xl relative flex flex-col justify-between ${
                      item.isFeatured ? 'md:scale-[1.03] !border-primary/30 shadow-[0_12px_40px_rgba(13,31,61,0.05)]' : ''
                    } ${idx === activeTestimonialIdx ? 'flex' : 'hidden md:flex'}`}
                  >
                    <div
                      className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full overflow-hidden border-2 bg-card"
                      style={{ borderColor: accentColor }}
                    >
                      {avatarUrl && (
                        <Image src={avatarUrl} alt={avatarAlt} width={48} height={48} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="mt-4 mb-4 text-3xl" style={{ color: accentColor }}>❝</div>

                    <p className="text-muted-foreground italic text-sm leading-relaxed flex-grow">
                      {item.quote}
                    </p>

                    <div className="mt-8 pt-4 border-t border-border">
                      <div className="flex justify-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, si) => (
                          <Star key={si} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <h5 className="text-base font-bold" style={{ color: accentColor }}>{item.name}</h5>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{item.role}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {testimonials.length > 1 && (
              <div className="flex justify-center gap-3 mt-12">
                <button
                  onClick={() => setActiveTestimonialIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-blue-100 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 shadow-sm transition-all"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveTestimonialIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="w-10 h-10 rounded-full btn-dark flex items-center justify-center text-white hover:scale-105 transition-transform"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── CTA / Contact Section & Footer ─── */}
      {showCta && (
      <section className="bg-[#0d1f3d] text-zinc-100 py-24 border-t border-[#0b1628]/80 relative overflow-hidden" id="contact">
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
        <div className="w-full px-container text-center space-y-8 relative z-10">
          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-black leading-tight uppercase tracking-wider text-white">
                {cta.title || "OK. LET'S CREATE SOMETHING GREAT TOGETHER."}
              </h2>
              
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-6">
                {hero?.titleHighlight ? `${hero.titleHighlight.split(' ')[0]}.` : 'Pruthvish.'}
              </h3>

              {/* One line professional and email, number, address */}
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs md:text-sm text-zinc-300 font-medium mt-4">
                <span>{hero?.introduction || "Senior Full-Stack Developer & AI-First Engineer"}</span>
                <span className="text-blue-400/40 hidden sm:inline">•</span>
                <a href={`mailto:${cta.email || hero?.email || 'iampruthvishmodi@gmail.com'}`} className="hover:text-blue-300 text-white transition-colors">
                  {cta.email || hero?.email || 'iampruthvishmodi@gmail.com'}
                </a>
                <span className="text-blue-400/40 hidden sm:inline">•</span>
                <a href={`tel:${hero?.phone || '+916353538827'}`} className="hover:text-blue-300 text-white transition-colors">
                  {hero?.phone || '+916353538827'}
                </a>
                <span className="text-blue-400/40 hidden sm:inline">•</span>
                <span className="text-zinc-300">{cta.address || hero?.location || '8 GaneshKunj Society New Ranip Ahemdabad,Gujarat 382480'}</span>
              </div>
            </motion.div>
          )}

          {/* Social Icons */}
          <div className="flex justify-center items-center gap-6 pt-4">
            {(cta?.links && cta.links.length > 0 ? cta.links : [
              { label: 'GitHub', url: hero?.githubLink || 'https://github.com/Pruthvishmodi' },
              { label: 'LinkedIn', url: hero?.linkedinLink || 'https://www.linkedin.com/in/impruthvish-modi/' }
            ]).map((link) => (
              <a
                key={link.id || link.label}
                href={link.url}
                className="text-zinc-300 hover:text-white transition-colors p-2 hover:scale-110 transform duration-200"
                aria-label={link.label}
              >
                {getSocialIcon(link.label)}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="pt-12 border-t border-blue-900/40 text-[11px] text-zinc-400 tracking-wider font-normal">
            {'©'} 2026 {hero?.titleHighlight || 'Pruthvish Modi'}. All Rights Reserved
          </div>
        </div>
      </section>
      )}
    </div>
  )
}

export const PersonalPortfolio: React.FC<PersonalPortfolioBlockProps> = (props) => {
  return <PersonalPortfolioComponent {...props} />
}
