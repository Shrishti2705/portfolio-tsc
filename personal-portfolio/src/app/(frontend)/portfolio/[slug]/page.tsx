import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import React from 'react'
import { PortfolioDetailComponent } from '@/blocks/PortfolioDetail/Component'
import type { Metadata } from 'next'

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'portfolios',
    where: { slug: { equals: slug } },
  })

  const portfolio = result.docs?.[0] || null
  if (!portfolio) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: portfolio.title,
    description: portfolio.shortDescription || `Detailed case study for ${portfolio.title}`,
  }
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function PortfolioDetailPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'portfolios',
    where: { slug: { equals: slug } },
    depth: 5,
  })

  const portfolio = result.docs?.[0] || null
  if (!portfolio) notFound()

  // Fetch related portfolios
  const relatedResult = await payload.find({
    collection: 'portfolios',
    limit: 3,
    where: { slug: { not_equals: slug } },
  })

  return (
    <main className="py-16">
      <PortfolioDetailComponent 
        portfolio={portfolio} 
        relatedPortfolios={relatedResult.docs} 
      />
    </main>
  )
}
