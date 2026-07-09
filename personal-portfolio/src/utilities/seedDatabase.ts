// @ts-nocheck
import { Payload } from 'payload'
import tscProjects from './tsc_portfolios_detail.json'

async function getOrCreateImage(payload: any): Promise<number> {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: 'Pruthvish Profile' } },
  })
  if (existing.docs.length > 0) {
    return existing.docs[0].id
  }

  let buffer: Buffer
  try {
    const res = await fetch('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500')
    buffer = Buffer.from(await res.arrayBuffer())
  } catch (e) {
    buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')
  }

  const mediaDoc = await payload.create({
    collection: 'media',
    data: {
      alt: 'Pruthvish Profile',
    },
    file: {
      data: buffer,
      name: 'pruthvish.jpg',
      mimetype: 'image/jpeg',
      size: buffer.length,
    },
  })

  return mediaDoc.id
}

async function getOrCreateCV(payload: any): Promise<number> {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: 'Pruthvish Modi CV' } },
  })
  if (existing.docs.length > 0) {
    return existing.docs[0].id
  }

  let buffer: Buffer
  try {
    const fs = await import('fs')
    const path = await import('path')
    const fileURLToPath = await import('url').then(u => u.fileURLToPath)
    const filename = fileURLToPath(import.meta.url)
    const dirname = path.dirname(filename)
    const cvPath = path.resolve(dirname, '../../public/media/Pruthvish_Modi_CV.pdf')
    if (fs.existsSync(cvPath)) {
      buffer = fs.readFileSync(cvPath)
    } else {
      buffer = Buffer.from('placeholder')
    }
  } catch (e) {
    buffer = Buffer.from('placeholder')
  }

  const mediaDoc = await payload.create({
    collection: 'media',
    data: {
      alt: 'Pruthvish Modi CV',
    },
    file: {
      data: buffer,
      name: 'Pruthvish_Modi_CV.pdf',
      mimetype: 'application/pdf',
      size: buffer.length,
    },
  })

  return mediaDoc.id
}

function getProjectCategory(project: any) {
  const domains = project.domain || []
  const tech = [...(project.techStack || []), ...(project.customTechStack || []).map((t: any) => t.tech)]

  if (domains.includes('AI') || tech.some((t: string) => ['AI', 'n8n', 'Gemini', 'LLM', 'Hermes', 'APIfy'].includes(t))) {
    return 'ai'
  }
  if (tech.some((t: string) => ['React Native', 'Flutter'].includes(t))) {
    return 'mobile'
  }
  return 'web'
}

export async function seedDatabase(payload: Payload) {
  console.log('Seeding database...')

  const profileImageId = await getOrCreateImage(payload)
  const cvFileId = await getOrCreateCV(payload)

  // Create default admin user if not exists
  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'contact@thespecialcharacter.com',
      },
    },
  })
  if (existingUsers.docs.length === 0) {
    console.log('Creating default admin user...')
    await payload.create({
      collection: 'users',
      data: {
        email: 'contact@thespecialcharacter.com',
        password: 'Password1!',
      },
    })
  }

  // Clean existing portfolios
  const existingPortfolios = await payload.find({
    collection: 'portfolios',
    limit: 150,
  })
  for (const port of existingPortfolios.docs) {
    await payload.delete({
      collection: 'portfolios',
      id: port.id,
    })
  }

  // Seed mock portfolios
  console.log('Creating portfolio items...')

  // Mock portfolios with screenshots for Selected Works (original image-heavy UI)
  const craveable = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Craveable: Food Delivery Reimagined',
      slug: 'craveable-food-delivery-reimagined',
      domain: ['Other'],
      customDomain: 'Food Tech',
      shortDescription: 'A sleek mobile application design reimagining the food delivery user journey.',
      techStack: ['React Native', 'TypeScript'],
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  const solstice = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Solstice: High-Fashion Editorial Web',
      slug: 'solstice-high-fashion-editorial-web',
      domain: ['Other'],
      customDomain: 'Fashion',
      shortDescription: 'A modern layout presenting editorials and fashion lookbooks.',
      techStack: ['React', 'Next.js'],
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  const aether = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Aether: Systematic Brand Evolution',
      slug: 'aether-systematic-brand-evolution',
      domain: ['Other'],
      customDomain: 'Branding',
      shortDescription: 'A clean system-oriented redesign showing a unified brand image.',
      techStack: ['Other'],
      customTechStack: [{ tech: 'Figma' }],
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 1. RoboSoft
  const robosoft = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'RoboSoft | CAS CMS (OTT Platform)',
      slug: 'robosoft-cas-cms-ott-platform',
      domain: ['Other'],
      customDomain: 'OTT Platform',
      shortDescription: 'OTT Content Management System platform providing modular backend services and content workflows.',
      keyFeatures: [
        { feature: 'Built and maintained scalable APIs for an OTT CMS platform using Node.js and Strapi within a monorepo architecture' },
        { feature: 'Developed modular backend services to manage content workflows, metadata, and publishing operations' },
        { feature: 'Improved code reusability and service maintainability through structured monorepo practices, supporting efficient OTT content management and platform scalability' },
      ],
      techStack: ['Node.js', 'Other'],
      customTechStack: [
        { tech: 'Strapi' },
        { tech: 'Monorepo' },
        { tech: 'PostgreSQL' },
        { tech: 'REST APIs' },
      ],
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 2. Multilingual Automation
  const multilingual = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Multilingual Automation',
      slug: 'multilingual-automation',
      domain: ['Other'],
      customDomain: 'Automation',
      shortDescription: 'Custom Strapi content translation plugin supporting 200+ languages and locale management.',
      keyFeatures: [
        { feature: 'Built a custom Strapi plugin enabling content translation into 200+ languages from the admin panel' },
        { feature: 'Developed a React-based UI for bulk translation, locale management, and real-time status tracking' },
        { feature: 'Integrated translation APIs with scalable background processing and multi-locale publishing support' },
      ],
      techStack: ['React', 'Node.js', 'Other'],
      customTechStack: [
        { tech: 'Sanity CMS' },
        { tech: 'PostgreSQL' },
      ],
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 3. Veltries
  const veltries = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Veltries | Future.works: ERP for Architects',
      slug: 'veltries-future-works-erp-for-architects',
      domain: ['Other'],
      customDomain: 'ERP',
      shortDescription: 'Full-stack eco-friendly packaging platform with 2D customization and bulk ordering.',
      keyFeatures: [
        { feature: 'Built full-stack eco-friendly packaging platform with product customization engine' },
        { feature: 'Designed 2D real-time preview tools for customization' },
        { feature: 'Implemented bulk ordering, custom branding tools, and seamless checkout for B2B/B2C segments' },
      ],
      techStack: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Other'],
      customTechStack: [
        { tech: 'Sanity CMS' },
        { tech: 'Hygraph' },
      ],
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 4. Yogateria (Mock)
  const yogateria = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Yogateria | A well-being E-commerce',
      slug: 'yogateria-well-being-ecommerce',
      domain: ['Ecommerce'],
      shortDescription: 'Intuitive and responsive well-being e-commerce platform built with Next.js and Medusa.js.',
      keyFeatures: [
        { feature: 'Collaborated on building an intuitive and responsive user interface' },
        { feature: 'Contributed to the development and delivery of a robust and scalable e-commerce stack' },
        { feature: 'Integrated Next.js with Medusa.js backend for high performance' },
      ],
      techStack: ['React', 'Next.js', 'TailwindCSS', 'PostgreSQL', 'Other'],
      customTechStack: [
        { tech: 'Sanity' },
        { tech: 'Medusa.js' },
        { tech: 'Redis' },
        { tech: 'shadcn/ui' },
      ],
      liveProjectUrl: 'https://yogateria.com',
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 5. Skillmatics (Mock)
  const skillmatics = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Skillmatics | Educational Products E-commerce Platform',
      slug: 'skillmatics-educational-products-ecommerce',
      domain: ['Ecommerce', 'Education'],
      shortDescription: 'High-performance e-commerce platform for educational products with Razorpay/Stripe integration.',
      keyFeatures: [
        { feature: 'Developed a high-performance, scalable e-commerce platform for educational products' },
        { feature: 'Focused on user experience, conversion optimization, and SEO' },
        { feature: 'Implemented responsive UI, optimized page load speed, and integrated secure payment gateways' },
      ],
      techStack: ['Next.js', 'React', 'TailwindCSS', 'Other'],
      customTechStack: [
        { tech: 'Shopify' },
        { tech: 'Razorpay' },
        { tech: 'Stripe' },
        { tech: 'REST APIs' },
      ],
      liveProjectUrl: 'https://skillmatics.in',
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 6. Strainex (Mock)
  const strainex = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Strainex | Clean-Tech & Smart Grid Solutions',
      slug: 'strainex-clean-tech-smart-grid-solutions',
      domain: ['Ecommerce', 'Other'],
      customDomain: 'Clean-Tech',
      shortDescription: 'Headless commerce platform for energy-efficient equipment serving international markets.',
      keyFeatures: [
        { feature: 'Developed headless commerce platform for energy-efficient equipment, telecom infrastructure, and solar products' },
        { feature: 'Built services targeting Dubai, India, and USA markets' },
        { feature: 'Integrated Next.js 15, Medusa.js, and Supabase for real-time commerce features' },
      ],
      techStack: ['React', 'Next.js', 'PostgreSQL', 'Other'],
      customTechStack: [
        { tech: 'React 19' },
        { tech: 'Next.js 15' },
        { tech: 'Medusa.js' },
        { tech: 'Sanity CMS' },
        { tech: 'Supabase' },
        { tech: 'Redis' },
        { tech: 'Meilisearch' },
      ],
      liveProjectUrl: 'https://strainex.com',
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 7. Wraprr (Mock)
  const wraprr = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Wraprr | Sustainable Packaging E-commerce',
      slug: 'wraprr-sustainable-packaging-ecommerce',
      domain: ['Ecommerce', 'Other'],
      customDomain: 'Packaging',
      shortDescription: 'Full-stack eco-friendly packaging platform with a 2D customization engine and Fabric.js.',
      keyFeatures: [
        { feature: 'Built full-stack eco-friendly packaging platform with product customization engine' },
        { feature: 'Developed 2D design and real-time preview tools using Fabric.js' },
        { feature: 'Implemented bulk ordering, custom branding, and seamless checkout with Vercel deployment' },
      ],
      techStack: ['React', 'Next.js', 'Payload CMS', 'PostgreSQL', 'Other'],
      customTechStack: [
        { tech: 'React 19' },
        { tech: 'Next.js 15' },
        { tech: 'Medusa.js' },
        { tech: 'Supabase' },
        { tech: 'Redis' },
        { tech: 'Meilisearch' },
        { tech: 'FabricJs' },
        { tech: 'Vercel' },
      ],
      liveProjectUrl: 'https://wraprr.com',
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 8. MedicalAlert (Mock)
  const medicalalert = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'MedicalAlert UK | Healthcare Membership Platform',
      slug: 'medicalalert-uk-healthcare-membership-platform',
      domain: ['Health', 'Other'],
      customDomain: 'Membership Platform',
      shortDescription: 'Responsive healthcare platform for managing medical profiles and emergency health information.',
      keyFeatures: [
        { feature: 'Contributed to the development of the MedicalAlert UK platform enabling users to manage medical profiles' },
        { feature: 'Built responsive pages and optimized performance for a seamless user experience' },
        { feature: 'Integrated PWA capabilities, Google Tag Manager, and Facebook Pixel tracking' },
      ],
      techStack: ['AWS', 'Other'],
      customTechStack: [
        { tech: 'PHP' },
        { tech: 'MySQL' },
        { tech: 'jQuery' },
        { tech: 'PWA' },
        { tech: 'Google Tag Manager' },
        { tech: 'Facebook Pixel' },
        { tech: 'Hotjar' },
      ],
      liveProjectUrl: 'https://medicalalert.org.uk',
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 9. Bharat Rojgaar (Mock)
  const bharatrojgaar = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Bharat Rojgaar | Government Employment & Job Portal',
      slug: 'bharat-rojgaar-government-employment-job-portal',
      domain: ['Other'],
      customDomain: 'Job Portal',
      shortDescription: 'Nationwide employment platform connecting job seekers and employers.',
      keyFeatures: [
        { feature: 'Developed a nationwide employment platform connecting job seekers and employers' },
        { feature: 'Built dynamic multi-role registration and job posting workflows' },
        { feature: 'Implemented advanced job search, filtering features, and optimized UI performance' },
      ],
      techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Node.js', 'Other'],
      customTechStack: [
        { tech: 'Medusa.js' },
        { tech: 'Payload CMS' },
        { tech: 'Supabase' },
        { tech: 'REST APIs' },
        { tech: 'Vercel' },
      ],
      liveProjectUrl: 'https://bharatrojgaar.com',
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 10. Mass Media (Mock)
  const massmedia = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Mass Media Application | Content Management Platform',
      slug: 'mass-media-application-content-management-platform',
      domain: ['Other'],
      customDomain: 'Media Platform',
      shortDescription: 'Custom content management system featuring a Material UI mobile and web app.',
      keyFeatures: [
        { feature: 'Led team to fix UI bugs, implement responsive components, and manage CMS architecture' },
        { feature: 'Developed scalable components for an enhanced user experience' },
        { feature: 'Integrated Kentico CMS with a Redux Toolkit state management layer' },
      ],
      techStack: ['React', 'React Native', 'Other'],
      customTechStack: [
        { tech: 'Redux Toolkit' },
        { tech: 'Kentico CMS' },
        { tech: 'Material UI' },
      ],
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 11. Synechron (Mock)
  const synechron = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'Synechron | 55/Redefined',
      slug: 'synechron-55-redefined',
      domain: ['Other'],
      customDomain: 'Career Platform',
      shortDescription: 'Career opportunities and lifestyle platform empowering individuals over 50.',
      keyFeatures: [
        { feature: 'A pioneering platform dedicated to empowering individuals over 50' },
        { feature: 'Offered tailored career opportunities, lifestyle content, and enterprise solutions' },
        { feature: 'Developed responsive frontend and integrated Strapi CMS backend services' },
      ],
      techStack: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Node.js', 'Other'],
      customTechStack: [
        { tech: 'Strapi' },
      ],
      liveProjectUrl: 'https://55redefined.com',
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 12. FoodBoss (Mock)
  const foodboss = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'FoodBoss | Web & Mobile Application',
      slug: 'foodboss-web-mobile-application',
      domain: ['Ecommerce', 'Other'],
      customDomain: 'Food Delivery',
      shortDescription: 'E-commerce application for customers, sellers, and riders with 99.5% order accuracy.',
      keyFeatures: [
        { feature: 'Easily accessible application for customers, sellers & riders with 99.5% order accuracy' },
        { feature: 'Developed cross-platform mobile apps using Flutter and Node.js' },
        { feature: 'Implemented robust testing with Jest/Enzyme/React Testing Library' },
      ],
      techStack: ['Flutter', 'React', 'Next.js', 'TailwindCSS', 'Node.js', 'PostgreSQL', 'Other'],
      customTechStack: [
        { tech: 'Express.js' },
        { tech: 'MongoDB' },
        { tech: 'Jest' },
        { tech: 'Enzyme' },
        { tech: 'Strapi.js' },
      ],
      liveProjectUrl: 'https://foodboss.in',
      androidProjectUrl: 'https://play.google.com/store/apps/details?id=com.foodboss.user',
      iosProjectUrl: 'https://apps.apple.com/in/app/foodboss-grocery-ka-boss/id1640038993',
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // 13. RamSoft - Blume (Mock)
  const ramsoft = await payload.create({
    collection: 'portfolios',
    data: {
      title: 'RamSoft - Blume | Healthcare Imaging Platform',
      slug: 'ramsoft-blume-healthcare-imaging-platform',
      domain: ['Health', 'Other'],
      customDomain: 'Healthcare Imaging',
      shortDescription: 'Medical record management module for a healthcare imaging patient engagement platform.',
      keyFeatures: [
        { feature: 'Developed and maintained the Medical Record Management module for a healthcare imaging platform' },
        { feature: 'Developed a React-based UI for bulk translation, locale management, and real-time status tracking' },
        { feature: 'Built responsive and reusable UI components and containerized development using Docker' },
      ],
      techStack: ['React', 'React Native', 'Other'],
      customTechStack: [
        { tech: 'Redux' },
        { tech: 'GraphQL' },
        { tech: 'React Hook Form' },
        { tech: 'Jest' },
        { tech: 'Docker' },
      ],
      screenshots: [{ image: profileImageId }],
      _status: 'published',
    },
  })

  // ─── TSC Portfolio Projects (from tsc_portfolios_detail.json) ──
  console.log('Loading TSC portfolios detail JSON...')

  const tscDbMap: Record<string, number> = {}
  const webProjects: Array<{ project: number }> = []
  const mobileProjects: Array<{ project: number }> = []
  const aiProjects: Array<{ project: number }> = []
  const allProjects: Array<number> = []

  for (const proj of tscProjects) {
    const slugLower = proj.slug.toLowerCase()
    console.log(`Seeding: ${proj.title} (slug: ${slugLower})`)
    const created = await payload.create({
      collection: 'portfolios',
      data: {
        title: proj.title,
        slug: slugLower, // Explicitly specify lowercase slug for clean URLs
        domain: proj.domain,
        customDomain: proj.customDomain || undefined,
        shortDescription: proj.shortDescription,
        fullDescription: proj.fullDescription || undefined, // Rich text Lexical JSON structure!
        techStack: proj.techStack,
        customTechStack: proj.customTechStack,
        liveProjectUrl: proj.liveProjectUrl || undefined,
        androidProjectUrl: proj.androidProjectUrl || undefined,
        iosProjectUrl: proj.iosProjectUrl || undefined,
        youtubeVideoUrl: proj.youtubeVideoUrl || undefined,
        screenshots: [{ image: profileImageId }],
        _status: 'published',
      },
    })

    tscDbMap[slugLower] = created.id
    allProjects.push(created.id)

    const cat = getProjectCategory(proj)
    if (cat === 'ai') {
      aiProjects.push({ project: created.id })
    } else if (cat === 'mobile') {
      mobileProjects.push({ project: created.id })
    } else {
      webProjects.push({ project: created.id })
    }
  }

  // Clean existing pages
  const existingPages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
  })
  for (const page of existingPages.docs) {
    await payload.delete({
      collection: 'pages',
      id: page.id,
    })
  }

  console.log('Creating home page...')
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      _status: 'published',
      layout: [
        {
          blockType: 'personalPortfolio',
          hero: {
            badgeText: 'AVAILABLE FOR REMOTE OPPORTUNITIES',
            titlePreHighlight: "I'm",
            titleHighlight: 'Pruthvish Modi',
            description:
              "Through years of exposure in the technical field, I have worked on numerous web projects and helped my clients achieve their business goals. As an experienced web developer and coder, I pride myself on creating high-quality, functional, and visually appealing websites. With my expertise in various programming languages, frameworks, and platforms, I can build custom solutions that are specific to my clients' needs. From design to development and beyond, I am dedicated to providing exceptional service and support throughout the entire process.",
            experienceYears: '10',
            experienceLabel: 'YEARS OF EXPERIENCE',
            certificationTitle: '15',
            certificationLabel: 'COMPLETED PROJECTS',
            sayHiLabel: 'CONTACT ME',
            sayHiLink: '#contact',
            downloadCvLabel: 'Download CV',
            downloadCvFile: cvFileId,
            heroImage: profileImageId,
            introduction: 'Senior Full-Stack Developer & AI-First Engineer',
            location: '8 GaneshKunj Society New Ranip Ahemdabad,Gujarat 382480',
            email: 'iampruthvishmodi@gmail.com',
            phone: '+916353538827',
            linkedinLabel: 'LinkedIn',
            linkedinLink: 'https://www.linkedin.com/in/impruthvish-modi/',
            githubLabel: 'GitHub',
            githubLink: 'https://github.com/Pruthvishmodi',
          },
          skillsTitle: 'My Expertise that provides Value',
          skillsDescription:
            "Having accumulated a wealth of experience spanning over 10+ years in the corporate landscape, I can readily attest to having engaged with a diverse array of technologies. Throughout my journey, I've actively embraced and navigated through numerous technological domains, making me a versatile player in this dynamic field. The proficiencies highlighted in this context accurately reflect the areas where I have honed my expertise, showcasing the depth of my skillset and underscoring my ability to excel in multifaceted roles.",
          skillsCategories: [
            {
              title: 'Frontend',
              iconName: 'layout',
              skills: [
                { skillName: 'HTML5' },
                { skillName: 'CSS3' },
                { skillName: 'JavaScript' },
                { skillName: 'TypeScript' },
                { skillName: 'React 19' },
                { skillName: 'Redux Toolkit' },
                { skillName: 'Next.js 15' },
                { skillName: 'Vue.js' },
                { skillName: 'Tailwind' },
                { skillName: 'Material UI' },
                { skillName: 'Shadcn' },
              ],
            },
            {
              title: 'Backend',
              iconName: 'server',
              skills: [
                { skillName: 'Node.js' },
                { skillName: 'Express' },
                { skillName: 'GraphQL' },
                { skillName: 'REST APIs' },
                { skillName: 'WebSockets' },
                { skillName: 'Microservices' },
              ],
            },
            {
              title: 'Mobile',
              iconName: 'smartphone',
              skills: [
                { skillName: 'React Native' },
                { skillName: 'Flutter' },
              ],
            },
            {
              title: 'Databases',
              iconName: 'database',
              skills: [
                { skillName: 'PostgreSQL' },
                { skillName: 'MongoDB' },
                { skillName: 'Supabase' },
                { skillName: 'Redis' },
                { skillName: 'MySQL' },
                { skillName: 'Meilisearch' },
              ],
            },
            {
              title: 'DevOps & QA',
              iconName: 'cloud',
              skills: [
                { skillName: 'Docker' },
                { skillName: 'Vercel' },
                { skillName: 'AWS' },
                { skillName: 'GCP' },
                { skillName: 'CI/CD' },
                { skillName: 'Git' },
                { skillName: 'Jest' },
                { skillName: 'React Testing Library' },
              ],
            },
            {
              title: 'CMS',
              iconName: 'file-text',
              skills: [
                { skillName: 'Strapi' },
                { skillName: 'Sanity' },
                { skillName: 'Payload CMS' },
              ],
            },
            {
              title: 'E-Commerce',
              iconName: 'shopping-bag',
              skills: [
                { skillName: 'WooCommerce' },
                { skillName: 'Big Commerce' },
                { skillName: 'Medusa.js' },
                { skillName: 'Shopify' },
                { skillName: 'Lovable' },
              ],
            },
            {
              title: 'AI & Automation',
              iconName: 'cpu',
              skills: [
                { skillName: 'N8N' },
                { skillName: 'Agentic AI' },
                { skillName: 'MCP Implementation' },
                { skillName: 'Prompt Engineering' },
              ],
            },
            {
              title: 'No-Code',
              iconName: 'zap',
              skills: [
                { skillName: 'Builder.io' },
                { skillName: 'Framer' },
                { skillName: 'Webflow' },
              ],
            },
            {
              title: 'Payments',
              iconName: 'credit-card',
              skills: [
                { skillName: 'MIPS' },
                { skillName: 'PagSeguro' },
                { skillName: 'RazorPay' },
                { skillName: 'PhonePe' },
                { skillName: 'Stripe' },
              ],
            },
            {
              title: 'Logistics',
              iconName: 'truck',
              skills: [
                { skillName: 'Shippo' },
                { skillName: 'Amazon Shipping' },
                { skillName: 'Delhivery' },
                { skillName: 'FedEx' },
              ],
            },
          ],
          expertise: {
            title: 'Services to navigate your Growth',
            description:
              'Being an expert at creating customer-centric solutions and making different technologies work together smoothly, think of me as your trusted guide in the digital world. By collaboration, I can help you lead your business to stay ahead in the ever-changing digital landscape.',
            stats: [
              { number: '10', label: 'YEARS OF EXPERIENCE', color: 'primary' },
              { number: '15', label: 'COMPLETED PROJECTS', color: 'secondary' },
              { number: '50+', label: 'GLOBAL CLIENTS', color: 'tertiary' },
              { number: '300+', label: 'API ENDPOINTS', color: 'primary' },
            ],
            cards: [
              {
                title: 'Web Application',
                description:
                  'I can help you create attractive websites using the latest technology to improve user experience and increase your...',
                projectsCountText: '25+ Projects',
                icon: 'globe',
                color: 'primary',
              },
              {
                title: 'Web Services',
                description:
                  'For Backend services, I mostly use Node.JS or Golang as it is opensource, performance-oriented, and highly...',
                projectsCountText: '40+ APIs',
                icon: 'dns',
                color: 'secondary',
              },
              {
                title: 'Mobile Application',
                description:
                  'Android, iOS, or PWA or all - you pick a choice, I do it for you. I work with React Native and Flutter that ranks top amon...',
                projectsCountText: '12+ Apps',
                icon: 'smartphone',
                color: 'tertiary',
              },
              {
                title: 'DevOps',
                description:
                  'For Web, I use Docker, Jenkins, GitHub Actions, and any cloud provider while for Mobile I use Fastlane and Jenkins.',
                projectsCountText: '18+ Deploys',
                icon: 'code',
                color: 'primary',
              },
              {
                title: 'Consulting',
                description: 'Any business or technology consulting needs? Talk to me and I will most likely be able to help.',
                projectsCountText: '30+ Clients',
                icon: 'laptop_mac',
                color: 'secondary',
              },
            ],
          },
          workExperience: {
            title: 'My Work Experience',
            timeline: [
              {
                company: 'Publicis Sapient, Remote',
                duration: '',
                role: 'Lead Experience Engineer',
                description:
                  '• Deutsche Bank - Credit Risk Management (Portfolio Monitoring System): Developed and enhanced the rule engine module for credit risk evaluation, enabling dynamic configuration and execution of risk rules across financial portfolios. Implemented Key Risk Indicators (KRIs) for real-time monitoring, threshold-based alerting, and proactive risk mitigation.\nStack: React.js (Vite), Context API, Material UI\n\n• Natwest Commercial - Client relation management: Built comprehensive dashboard for relationship managers to track business client interactions, engagement strategies, and historical data for improved decision-making.\nStack: React.js, Redux Toolkit, Jest\n\n• OptumRx Meteor: Architected healthcare prescription platform: reduced load times 40%, achieved 85% test coverage. Mentored 5 engineers on TypeScript best practices and modern development workflows\nStack: React 19, Next.js 15, Node.js, PostgreSQL\n\n• Enrich-Plus Employee Management System: Migrated legacy Next.js app to latest version using micro-frontend architecture and Module Federation for scalable, maintainable codebase\nStack: Next.js 15, GraphQL, Material UI, Module Federation',
                color: 'secondary',
              },
              {
                company: 'Yunay LLC, Remote',
                duration: '',
                role: 'Senior Software Engineer',
                description:
                  '• BuildWise & Designer ERP: Custom project management systems (Next.js, Strapi, PostgreSQL) - cut planning time 70%\nStack: Next.js, Strapi, PostgreSQL\n\n• Developed contact modules with TypeScript and Tailwind for lifestyle platform\nStack: TypeScript, Tailwind CSS',
                color: 'primary',
              },
              {
                company: 'Solas Marine LLC, Remote',
                duration: '',
                role: 'Senior Software Engineer',
                description:
                  '• Solas Tank Monitoring: Real-time marine IoT system (Node.js, WebSockets, MySQL) — 10K readings/min, 99.9% uptime\nStack: Node.js, WebSockets, MySQL',
                color: 'tertiary',
              },
              {
                company: 'NEPRA Technologies, Ahmedabad, India',
                duration: '',
                role: 'Software Engineer',
                description:
                  '• ESG Konnect: Sustainability consulting tool (React.js, Chart.js, MySQL) with interactive dashboards for ESG tracking\nStack: React.js, Chart.js, MySQL',
                color: 'secondary',
              },
            ],
          },
          projectsSection: {
            title: 'Projects/Contractual',
            subtitle: 'A selective list of our works',
            selectedProjects: [
              robosoft.id,
              multilingual.id,
              veltries.id,
              yogateria.id,
              skillmatics.id,
              strainex.id,
              wraprr.id,
              medicalalert.id,
              bharatrojgaar.id,
              massmedia.id,
              synechron.id,
              foodboss.id,
              ramsoft.id,
            ],
          },
          latestWorks: {
            title: 'Featured Portfolios',
            subtitle: 'A showcase of recent digital experiences.',
            selectedWorks: allProjects,
          },
          testimonialsSection: {
            title: 'What Clients Say',
            subtitle: 'Trusted by industry leaders and creative professionals worldwide.',
            testimonialsList: [
              {
                name: 'Arjun Mehta',
                role: 'CTO, FinEdge Solutions',
                quote:
                  'Working with Pruthvish was a game-changer for our fintech dashboard. He delivered a pixel-perfect, performant React app on time and introduced us to Payload CMS — our team loves it.',
                color: 'primary',
                isFeatured: true,
                avatar: profileImageId,
              },
              {
                name: 'Sofia Eriksson',
                role: 'Founder, NordStyle Commerce',
                quote:
                  'We needed a Medusa.js + Next.js e-commerce solution fast. Pruthvish set up our full headless stack in under 3 weeks including integrations with Stripe and a custom CMS. Exceptional quality.',
                color: 'secondary',
                isFeatured: false,
                avatar: profileImageId,
              },
              {
                name: 'Marcus Obi',
                role: 'Product Manager, HealthTrack AI',
                quote:
                  "Our AI health analytics dashboard required complex data visualisations and real-time updates. Pruthvish nailed every requirement, and his proactive communication kept us in the loop throughout.",
                color: 'tertiary',
                isFeatured: false,
                avatar: profileImageId,
              },
            ],
          },
          cta: {
            title: "Let's Work Together",
            preEmailText: 'Start by saying hi',
            email: 'iampruthvishmodi@gmail.com',
            addressTitle: 'INFORMATION',
            address: '8 GaneshKunj Society New Ranip Ahemdabad,Gujarat 382480',
            links: [
              { label: 'GitHub', url: 'https://github.com/Pruthvishmodi' },
              { label: 'LinkedIn', url: 'https://www.linkedin.com/in/impruthvish-modi/' }
            ],
          },
        },
      ],
    },
  })

  // ─── Seed the standalone /portfolio page ─────────────────────────────────────
  const existingPortfolioPage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'portfolio' } },
  })
  for (const page of existingPortfolioPage.docs) {
    await payload.delete({ collection: 'pages', id: page.id })
  }

  console.log('Creating portfolio page...')
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Portfolio',
      slug: 'portfolio',
      _status: 'published',
      layout: [
        {
          blockType: 'portfolio',
          title: 'Our Portfolio',
          subtitle: 'A curated showcase of projects across Web, Mobile, and AI domains.',
          selectedProjects: allProjects,
          webProjects: webProjects,
          mobileProjects: mobileProjects,
          aiVideos: aiProjects,
        },
      ],
    },
  })

  console.log('✅ Seeding complete!')
  console.log(`   • 13 original portfolio items`)
  console.log(`   • 24 TSC portfolio projects (with full richText details!)`)
  console.log(`   • Home page created`)
  console.log(`   • Portfolio page created`)
}
