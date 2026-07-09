import type { Block } from 'payload'

export const PersonalPortfolio: Block = {
  slug: 'personalPortfolio',
  interfaceName: 'PersonalPortfolioBlock',
  dbName: 'pers_port',
  labels: {
    singular: 'Personal Portfolio',
    plural: 'Personal Portfolios',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '⚙️ Section Visibility',
          description: 'Toggle each section on or off. Disabled sections will be completely hidden from the portfolio page.',
          fields: [
            {
              name: 'sectionVisibility',
              type: 'group',
              label: 'Visible Sections',
              admin: {
                description: 'Check a section to show it on the portfolio. Uncheck to temporarily hide it.',
              },
              fields: [
                {
                  name: 'hero',
                  type: 'checkbox',
                  label: '🏠 Hero Section',
                  defaultValue: true,
                },
                {
                  name: 'skills',
                  type: 'checkbox',
                  label: '🛠️ Skills Section',
                  defaultValue: true,
                },
                {
                  name: 'services',
                  type: 'checkbox',
                  label: '💼 Services Section',
                  defaultValue: true,
                },
                {
                  name: 'experience',
                  type: 'checkbox',
                  label: '📋 Work Experience Section',
                  defaultValue: true,
                },
                {
                  name: 'projects',
                  type: 'checkbox',
                  label: '📁 Projects Section',
                  defaultValue: true,
                },
                {
                  name: 'latestWorks',
                  type: 'checkbox',
                  label: '🖼️ Latest Works / Portfolio Section',
                  defaultValue: true,
                },
                {
                  name: 'testimonials',
                  type: 'checkbox',
                  label: '💬 Testimonials Section',
                  defaultValue: true,
                },
                {
                  name: 'cta',
                  type: 'checkbox',
                  label: '📨 Contact / CTA Section',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: 'Hero Section Settings',
              fields: [
                {
                  name: 'badgeText',
                  type: 'text',
                  label: 'Badge Text',
                  defaultValue: 'AVAILABLE FOR REMOTE OPPORTUNITIES',
                },
                {
                  name: 'titlePreHighlight',
                  type: 'text',
                  label: 'Title Pre-Highlight',
                  defaultValue: 'I’m',
                },
                {
                  name: 'titleHighlight',
                  type: 'text',
                  label: 'Title Highlighted Text',
                  defaultValue: 'Pruthvish Modi',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  defaultValue: "I'm Sr.Software Developer and I hold expertise in making digital space more interactive through coding..",
                },
                {
                  name: 'experienceYears',
                  type: 'text',
                  label: 'Experience Years / Stat 1 Number',
                  defaultValue: '10+',
                },
                {
                  name: 'experienceLabel',
                  type: 'text',
                  label: 'Experience Label / Stat 1 Label',
                  defaultValue: 'YEARS OF EXPERIENCE',
                },
                {
                  name: 'certificationTitle',
                  type: 'text',
                  label: 'Certification Title / Stat 2 Number',
                  defaultValue: '15',
                },
                {
                  name: 'certificationLabel',
                  type: 'text',
                  label: 'Certification Label / Stat 2 Label',
                  defaultValue: 'COMPLETED PROJECTS',
                },
                {
                  name: 'stat3Number',
                  type: 'text',
                  label: 'Stat 3 Number',
                  defaultValue: '50+',
                },
                {
                  name: 'stat3Label',
                  type: 'text',
                  label: 'Stat 3 Label',
                  defaultValue: 'GLOBAL CLIENTS',
                },
                {
                  name: 'stat4Number',
                  type: 'text',
                  label: 'Stat 4 Number',
                  defaultValue: '300+',
                },
                {
                  name: 'stat4Label',
                  type: 'text',
                  label: 'Stat 4 Label',
                  defaultValue: 'API ENDPOINTS',
                },
                {
                  name: 'sayHiLabel',
                  type: 'text',
                  label: 'Say Hi Button Label',
                  defaultValue: 'CONTACT ME',
                },
                {
                  name: 'sayHiLink',
                  type: 'text',
                  label: 'Say Hi Button Link',
                  defaultValue: '#contact',
                },
                {
                  name: 'downloadCvLabel',
                  type: 'text',
                  label: 'Download CV Button Label',
                  defaultValue: 'Download CV',
                },
                {
                  name: 'downloadCvFile',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Download CV File',
                },
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Hero Profile Image',
                  required: true,
                },
                {
                  name: 'introduction',
                  type: 'text',
                  label: 'Introduction Subheading',
                  defaultValue: 'Senior Full-Stack Developer & AI-First Engineer',
                },
                {
                  name: 'location',
                  type: 'text',
                  label: 'Location',
                  defaultValue: '8 GaneshKunj Society New Ranip Ahemdabad,Gujarat 382480',
                },
                {
                  name: 'email',
                  type: 'text',
                  label: 'Email',
                  defaultValue: 'iampruthvishmodi@gmail.com',
                },
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Phone',
                  defaultValue: '+916353538827',
                },
                {
                  name: 'linkedinLabel',
                  type: 'text',
                  label: 'LinkedIn Button Label',
                  defaultValue: 'LinkedIn',
                },
                {
                  name: 'linkedinLink',
                  type: 'text',
                  label: 'LinkedIn Button Link',
                  defaultValue: 'https://www.linkedin.com/in/impruthvish-modi/',
                },
                {
                  name: 'githubLabel',
                  type: 'text',
                  label: 'GitHub Button Label',
                  defaultValue: 'GitHub',
                },
                {
                  name: 'githubLink',
                  type: 'text',
                  label: 'GitHub Profile URL',
                  defaultValue: 'https://github.com/Pruthvishmodi',
                },
              ],
            },
          ],
        },
        {
          label: 'Skills Section',
          fields: [
            {
              name: 'skillsTitle',
              type: 'text',
              label: 'Skills Section Title',
              defaultValue: 'My Expertise that provides Value',
            },
            {
              name: 'skillsDescription',
              type: 'textarea',
              label: 'Skills Section Description',
              defaultValue:
                "Having accumulated a wealth of experience spanning over 9+ years in the corporate landscape, I can readily attest to having engaged with a diverse array of technologies. Throughout my journey, I've actively embraced and navigated through numerous technological domains, making me a versatile player in this dynamic field. The proficiencies highlighted in this context accurately reflect the areas where I have honed my expertise, showcasing the depth of my skillset and underscoring my ability to excel in multifaceted roles.",
            },
            {
              name: 'skillsCategories',
              type: 'array',
              label: 'Skills Categories',
              labels: {
                singular: 'Category',
                plural: 'Categories',
              },
              defaultValue: [
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
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Category Name',
                  required: true,
                },
                {
                  name: 'iconName',
                  type: 'select',
                  label: 'Category Icon',
                  defaultValue: 'layout',
                  options: [
                    { label: 'Layout (Frontend)', value: 'layout' },
                    { label: 'Server (Backend)', value: 'server' },
                    { label: 'Database', value: 'database' },
                    { label: 'Smartphone (Mobile)', value: 'smartphone' },
                    { label: 'Cloud (DevOps)', value: 'cloud' },
                    { label: 'File Text (CMS)', value: 'file-text' },
                    { label: 'Shopping Bag (E-Commerce)', value: 'shopping-bag' },
                    { label: 'Search', value: 'search' },
                    { label: 'CPU (AI)', value: 'cpu' },
                    { label: 'Zap (No-Code)', value: 'zap' },
                    { label: 'Credit Card (Payments)', value: 'credit-card' },
                    { label: 'Truck (Logistics)', value: 'truck' },
                  ],
                },
                {
                  name: 'skills',
                  type: 'array',
                  label: 'Skills in Category',
                  labels: {
                    singular: 'Skill',
                    plural: 'Skills',
                  },
                  fields: [
                    {
                      name: 'skillName',
                      type: 'text',
                      label: 'Skill Name',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Services Section',
          fields: [
            {
              name: 'expertise',
              type: 'group',
              label: 'Services / Expertise Settings',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Section Headline',
                  defaultValue: 'Services to navigate your Growth',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Section Description',
                  defaultValue:
                    'Being an expert at creating customer-centric solutions and making different technologies work together smoothly, think of me as your trusted guide in the digital world. By collaboration, I can help you lead your business to stay ahead in the ever-changing digital landscape.',
                },
                {
                  name: 'stats',
                  type: 'array',
                  label: 'Stat Highlights (e.g. 285+ Projects)',
                  admin: {
                    description: 'Shown as highlighted stat boxes on the right side of the headline.',
                  },
                  defaultValue: [],
                  fields: [
                    {
                      name: 'number',
                      type: 'text',
                      label: 'Stat Number (e.g., 285+)',
                      required: true,
                    },
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Stat Label',
                      required: true,
                    },
                    {
                      name: 'color',
                      type: 'select',
                      dbName: 'pp_stat_color',
                      label: 'Stat Color',
                      defaultValue: 'primary',
                      options: [
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Tertiary', value: 'tertiary' },
                      ],
                    },
                  ],
                },
                {
                  name: 'cards',
                  type: 'array',
                  label: 'Service Cards',
                  admin: {
                    description: 'The service offering cards shown below the headline (e.g. Website Design, Mobile App, Brand Identity).',
                  },
                  defaultValue: [
                    {
                      title: 'Web Application',
                      description: 'I can help you create attractive websites using the latest technology to improve user experience and increase your...',
                      projectsCountText: 'READ MORE',
                      icon: 'globe',
                      color: 'primary',
                    },
                    {
                      title: 'Web Services',
                      description: 'For Backend services, I mostly use Node.JS or Golang as it is opensource, performance-oriented, and highly...',
                      projectsCountText: 'READ MORE',
                      icon: 'dns',
                      color: 'secondary',
                    },
                    {
                      title: 'Mobile Application',
                      description: 'Android, iOS, or PWA or all - you pick a choice, I do it for you. I work with React Native and Flutter that ranks top amon...',
                      projectsCountText: 'READ MORE',
                      icon: 'smartphone',
                      color: 'tertiary',
                    },
                    {
                      title: 'DevOps',
                      description: 'For Web, I use Docker, Jenkins, GitHub Actions, and any cloud provider while for Mobile I use Fastlane and Jenkins.',
                      projectsCountText: 'READ MORE',
                      icon: 'code',
                      color: 'primary',
                    },
                    {
                      title: 'Consulting',
                      description: 'Any business or technology consulting needs? Talk to me and I will most likely be able to help.',
                      projectsCountText: 'READ MORE',
                      icon: 'laptop_mac',
                      color: 'secondary',
                    },
                  ],
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Service Title',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Service Description',
                      defaultValue: 'High-converting landing pages and enterprise SaaS platforms designed for performance.',
                    },
                    {
                      name: 'projectsCountText',
                      type: 'text',
                      label: 'Projects Count Text',
                      defaultValue: '76 PROJECTS',
                    },
                    {
                      name: 'icon',
                      type: 'text',
                      label: 'Material Icon Name',
                      defaultValue: 'desktop_windows',
                    },
                    {
                      name: 'color',
                      type: 'select',
                      dbName: 'pp_card_color',
                      label: 'Card Theme Color',
                      defaultValue: 'primary',
                      options: [
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Tertiary', value: 'tertiary' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Experience Section',
          fields: [
            {
              name: 'workExperience',
              type: 'group',
              label: 'Work Experience Settings',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Section Title',
                  defaultValue: 'My Work Experience',
                },
                {
                  name: 'timeline',
                  type: 'array',
                  label: 'Timeline Entries',
                  fields: [
                    {
                      name: 'company',
                      type: 'text',
                      label: 'Company Name / Location',
                      required: true,
                    },
                    {
                      name: 'duration',
                      type: 'text',
                      label: 'Duration (e.g., Sep 2016 - Aug 2014)',
                      required: false,
                    },
                    {
                      name: 'role',
                      type: 'text',
                      label: 'Role Title',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Role Description',
                      required: true,
                    },
                    {
                      name: 'color',
                      type: 'select',
                      dbName: 'pp_timeline_color',
                      label: 'Timeline Dot/Title Color',
                      defaultValue: 'primary',
                      options: [
                        { label: 'Primary (Purple-blue)', value: 'primary' },
                        { label: 'Secondary (Teal-blue)', value: 'secondary' },
                        { label: 'Tertiary (Orange)', value: 'tertiary' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Projects Section',
          fields: [
            {
              name: 'projectsSection',
              type: 'group',
              label: 'Projects Section (Text Cards) Settings',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Section Title',
                  defaultValue: 'Projects/Contractual',
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Section Subtitle',
                  defaultValue: 'A selective list of our works',
                },
                {
                  name: 'selectedProjects',
                  type: 'relationship',
                  relationTo: 'portfolios',
                  hasMany: true,
                  label: 'Selected Projects',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Latest Works Section',
          fields: [
            {
              name: 'latestWorks',
              type: 'group',
              label: 'Latest Works Section Settings',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Section Title',
                  defaultValue: 'My Latest Works',
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Section Subtitle',
                  defaultValue: 'Perfect solution for digital experience',
                },
                {
                  name: 'exploreMoreLabel',
                  type: 'text',
                  label: 'Explore More Link Label',
                  defaultValue: 'EXPLORE MORE WORKS',
                },
                {
                  name: 'exploreMoreLink',
                  type: 'text',
                  label: 'Explore More Link Path',
                  defaultValue: '/portfolio',
                },
                {
                  name: 'selectedWorks',
                  type: 'relationship',
                  relationTo: 'portfolios',
                  hasMany: true,
                  label: 'Selected Portfolio Projects',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Testimonials Section',
          fields: [
            {
              name: 'testimonialsSection',
              type: 'group',
              label: 'Testimonials Section Settings',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Section Title',
                  defaultValue: 'People talk about us',
                },
                {
                  name: 'subtitle',
                  type: 'textarea',
                  label: 'Section Subtitle',
                  defaultValue: 'I got a job that was in accordance with the salary and field of work. The process of submitting an application was quite cozy.',
                },
                {
                  name: 'testimonialsList',
                  type: 'array',
                  dbName: 'pp_testimonials',
                  label: 'Testimonials List',
                  fields: [
                    {
                      name: 'avatar',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Client Avatar',
                      required: true,
                    },
                    {
                      name: 'quote',
                      type: 'textarea',
                      label: 'Quote',
                      required: true,
                    },
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Client Name',
                      required: true,
                    },
                    {
                      name: 'role',
                      type: 'text',
                      label: 'Client Role/Title',
                      required: true,
                    },
                    {
                      name: 'color',
                      type: 'select',
                      dbName: 'pp_testimonial_color',
                      label: 'Card Frame/Theme Color',
                      defaultValue: 'primary',
                      options: [
                        { label: 'Primary (Purple-blue)', value: 'primary' },
                        { label: 'Secondary (Teal-blue)', value: 'secondary' },
                        { label: 'Tertiary (Orange)', value: 'tertiary' },
                      ],
                    },
                    {
                      name: 'isFeatured',
                      type: 'checkbox',
                      label: 'Featured Card (slightly scaled up)',
                      defaultValue: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'CTA Section',
          fields: [
            {
              name: 'cta',
              type: 'group',
              label: 'CTA Section Settings',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'CTA Title',
                  defaultValue: 'Let’s make something amazing together.',
                },
                {
                  name: 'preEmailText',
                  type: 'text',
                  label: 'Pre-Email Text',
                  defaultValue: 'Start by saying hi',
                },
                {
                  name: 'email',
                  type: 'text',
                  label: 'Email Address',
                  defaultValue: 'iampruthvishmodi@gmail.com',
                },
                {
                  name: 'addressTitle',
                  type: 'text',
                  label: 'Address Section Title',
                  defaultValue: 'INFORMATION',
                },
                {
                  name: 'address',
                  type: 'text',
                  label: 'Address Text',
                  defaultValue: '8 GaneshKunj Society New Ranip Ahemdabad,Gujarat 382480',
                },
                {
                  name: 'links',
                  type: 'array',
                  label: 'Quick Links',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Link Label',
                      required: true,
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'Link URL',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
