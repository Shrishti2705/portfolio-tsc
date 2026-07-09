/**
 * Fetches all portfolio items from TSC Payload CMS API, preserving full rich text
 * and structured detail fields, saving it directly to a JSON file.
 */

import { writeFileSync } from 'fs'

const BASE_URL = 'https://thespecialcharacter.com'

// Map TSC domains to local portfolios schema domain options
const DOMAIN_MAP = {
  'Ecommerce': 'Ecommerce',
  'SaaS': 'SaaS',
  'Fintech': 'Fintech',
  'AI': 'AI',
  'Education': 'Education',
  'Health': 'Health',
  'Other': 'Other',
  'Real Estate': 'Real Estate',
}

// Map TSC tech stack to local portfolios schema options
const TECH_OPTIONS = ['React', 'Next.js', 'Payload CMS', 'Node.js', 'AI', 'React Native', 
  'Flutter', 'TypeScript', 'TailwindCSS', 'PostgreSQL', 'AWS', 'Docker', 'Other']

async function fetchAPI(url) {
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

function mapDomains(domains) {
  const mapped = (domains || []).map(d => DOMAIN_MAP[d]).filter(Boolean)
  if (mapped.length === 0) mapped.push('Other')
  return [...new Set(mapped)]
}

function mapTechStack(techs) {
  const mapped = (techs || []).filter(t => TECH_OPTIONS.includes(t))
  const unmapped = (techs || []).filter(t => !TECH_OPTIONS.includes(t))
  if (mapped.length === 0) mapped.push('Other')
  if (unmapped.length > 0 && !mapped.includes('Other')) mapped.push('Other')
  return { mapped: [...new Set(mapped)], unmapped }
}

async function main() {
  console.log('Fetching full portfolios from TSC API...')
  const data = await fetchAPI(`${BASE_URL}/api/portfolios?limit=100&depth=2`)
  console.log(`Fetched ${data.docs.length} portfolios.`)

  const formatted = data.docs.map(doc => {
    const domains = mapDomains(doc.domain)
    const { mapped: tech, unmapped } = mapTechStack(doc.techStack)
    
    // Custom tech stack items formatting
    const customTechsFromTechStack = unmapped.map(t => ({ tech: t }))
    const customTechsFromDoc = (doc.customTechStack || []).map(t => ({ tech: t.tech || t.value || t }))
    const customTechStack = [...customTechsFromTechStack, ...customTechsFromDoc]

    return {
      slug: doc.slug,
      title: doc.title,
      domain: domains,
      customDomain: doc.customDomain || '',
      shortDescription: doc.shortDescription || '',
      fullDescription: doc.fullDescription || null, // Full Lexical JSON object
      techStack: tech,
      customTechStack,
      liveProjectUrl: doc.liveProjectUrl || '',
      androidProjectUrl: doc.androidProjectUrl || '',
      iosProjectUrl: doc.iosProjectUrl || '',
      youtubeVideoUrl: doc.youtubeVideoUrl || '',
      screenshots: (doc.screenshots || []).map(s => {
        const img = s.image
        if (img && img.url) {
          return {
            url: img.url,
            filename: img.filename,
            mimeType: img.mimeType,
            alt: img.alt || '',
          }
        }
        return null
      }).filter(Boolean),
      videoThumbnail: doc.videoThumbnail && doc.videoThumbnail.url ? {
        url: doc.videoThumbnail.url,
        filename: doc.videoThumbnail.filename,
        mimeType: doc.videoThumbnail.mimeType,
        alt: doc.videoThumbnail.alt || '',
      } : null,
    }
  })

  writeFileSync('src/utilities/tsc_portfolios_detail.json', JSON.stringify(formatted, null, 2))
  console.log('Saved all ' + formatted.length + ' projects with full details and screenshots to src/utilities/tsc_portfolios_detail.json')
}

main().catch(console.error)

