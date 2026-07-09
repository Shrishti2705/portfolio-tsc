import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { slugField } from 'payload'
import { populatePublishedAt } from '../hooks/populatePublishedAt'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Portfolios: CollectionConfig = {
  slug: 'portfolios',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'domain', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Portfolio title',
      },
    },
    {
      name: 'domain',
      type: 'select',
      label: 'Domain / Industry',
      required: true,
      hasMany: true,
      options: [
        { label: 'Health', value: 'Health' },
        { label: 'SaaS', value: 'SaaS' },
        { label: 'Fintech', value: 'Fintech' },
        { label: 'Education', value: 'Education' },
        { label: 'Ecommerce', value: 'Ecommerce' },
        { label: 'AI', value: 'AI' },
        { label: 'Real Estate', value: 'Real Estate' },
        { label: 'Other', value: 'Other' },
      ],
      admin: {
        description: 'Choose one or more industry domains',
      },
    },
    {
      name: 'customDomain',
      type: 'text',
      label: 'Custom Domain / Industry',
      admin: {
        condition: (data) => Array.isArray(data?.domain) ? data.domain.includes('Other') : data?.domain === 'Other',
        description: 'Specify your custom domain/industry',
      },
      validate: (
        val: string | undefined | null,
        { data, siblingData }: { data?: Record<string, unknown>; siblingData?: Record<string, unknown> },
      ) => {
        if (data?._status === 'draft' || siblingData?._status === 'draft') {
          return true
        }
        const domain = data?.domain ?? siblingData?.domain
        const hasOther = Array.isArray(domain) ? domain.includes('Other') : domain === 'Other'
        if (hasOther && !val) {
          return 'This field is required when Domain / Industry includes Other'
        }
        return true
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'Short summary of the project',
      },
    },
    {
      name: 'fullDescription',
      type: 'richText',
      admin: {
        description: 'Comprehensive description / case study',
      },
    },
    // Project Links
    {
      type: 'row',
      fields: [
        {
          name: 'liveProjectUrl',
          type: 'text',
          label: 'Live Project URL',
          admin: {
            description: 'External link to the live project',
            width: '25%',
          },
        },
        {
          name: 'githubProjectUrl',
          type: 'text',
          label: 'GitHub Project URL',
          admin: {
            description: 'Link to GitHub repository',
            width: '25%',
          },
        },
        {
          name: 'androidProjectUrl',
          type: 'text',
          label: 'Android Project URL',
          admin: {
            description: 'Link to Google Play Store / Android App',
            width: '25%',
          },
        },
        {
          name: 'iosProjectUrl',
          type: 'text',
          label: 'iOS Project URL',
          admin: {
            description: 'Link to Apple App Store / iOS App',
            width: '25%',
          },
        },
      ],
    },
    {
      name: 'projectLinks',
      type: 'array',
      label: 'Additional Project Links',
      admin: {
        description: 'Specify any other links for this project (e.g. documentation, client site, blog post, etc.)',
      },
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
    {
      name: 'youtubeVideoUrl',
      type: 'text',
      label: 'YouTube Video URL',
      admin: {
        description: 'YouTube link for project video/demo',
      },
    },
    // Technology tags
    {
      name: 'techStack',
      type: 'select',
      label: 'Tech Stack (Tags)',
      hasMany: true,
      required: true,
      options: [
        { label: 'React', value: 'React' },
        { label: 'Next.js', value: 'Next.js' },
        { label: 'Payload CMS', value: 'Payload CMS' },
        { label: 'Node.js', value: 'Node.js' },
        { label: 'AI', value: 'AI' },
        { label: 'React Native', value: 'React Native' },
        { label: 'Flutter', value: 'Flutter' },
        { label: 'TypeScript', value: 'TypeScript' },
        { label: 'TailwindCSS', value: 'TailwindCSS' },
        { label: 'PostgreSQL', value: 'PostgreSQL' },
        { label: 'AWS', value: 'AWS' },
        { label: 'Docker', value: 'Docker' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      name: 'customTechStack',
      type: 'array',
      label: 'Custom Tech Stack (Tags)',
      admin: {
        condition: (data) => data?.techStack?.includes('Other'),
        description: 'Specify your custom technologies/tags',
      },
      fields: [
        {
          name: 'tech',
          type: 'text',
          required: true,
        },
      ],
      validate: (
        val: unknown[] | undefined | null,
        { data, siblingData }: { data?: Record<string, unknown>; siblingData?: Record<string, unknown> },
      ) => {
        if (data?._status === 'draft' || siblingData?._status === 'draft') {
          return true
        }
        const techStack = data?.techStack ?? siblingData?.techStack
        if (Array.isArray(techStack) && techStack.includes('Other') && (!val || val.length === 0)) {
          return 'Please add at least one custom tech tag when Tech Stack includes Other'
        }
        return true
      },
    },
    // Media Section
    {
      name: 'shortVideo',
      type: 'upload',
      relationTo: 'media',
      label: 'Local Video',
      admin: {
        description: 'Local video (.mp4) uploaded to Media if you don\'t want to use YouTube',
      },
    },
    {
      name: 'videoThumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Video Thumbnail',
      admin: {
        description: 'Thumbnail image for the hero video',
      },
    },
    {
      name: 'screenshots',
      type: 'array',
      label: 'Project Screenshots',
      admin: {
        description: 'Gallery of screenshots of the project',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Screenshot Image',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption (optional)',
        },
      ],
    },
    // Additional Details
    {
      name: 'clientName',
      type: 'text',
      label: 'Client Name',
      admin: {
        description: 'Name of the client (optional)',
      },
    },
    {
      name: 'projectDuration',
      type: 'text',
      label: 'Project Duration',
      admin: {
        description: 'e.g., "3 Months"',
      },
    },
    {
      name: 'teamSize',
      type: 'text',
      label: 'Team Size',
      admin: {
        description: 'e.g., "5 Developers"',
      },
    },
    {
      name: 'keyFeatures',
      type: 'array',
      label: 'Key Features',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'challenges',
      type: 'array',
      label: 'Challenges Faced',
      fields: [
        {
          name: 'challenge',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'solutions',
      type: 'array',
      label: 'Solutions Implemented',
      fields: [
        {
          name: 'solution',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'results',
      type: 'array',
      label: 'Results & Outcomes',
      fields: [
        {
          name: 'result',
          type: 'text',
          required: true,
        },
      ],
    },
    // SEO
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'meta.image',
        }),
        MetaTitleField({
          hasGenerateFn: true,
        }),
        MetaImageField({
          relationTo: 'media',
        }),
        MetaDescriptionField({}),
        PreviewField({
          hasGenerateFn: true,
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
        }),
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
