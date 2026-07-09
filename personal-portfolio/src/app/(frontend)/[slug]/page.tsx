import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import React from 'react'
import { RenderBlocks } from '@/components/RenderBlocks'
import type { Metadata } from 'next'

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  
  if (slug === 'favicon.ico' || slug.startsWith('api') || slug.startsWith('admin')) {
    return {}
  }

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
  })

  const page = result.docs?.[0] || null
  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.title,
  }
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function PageBySlug({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  
  if (slug === 'favicon.ico' || slug.startsWith('api') || slug.startsWith('admin')) {
    notFound()
  }

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 5,
  })

  const page = result.docs?.[0] || null
  if (!page) notFound()

  return (
    <RenderBlocks blocks={page.layout} />
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    limit: 100,
    select: {
      slug: true,
    },
  })

  return result.docs.map((doc) => ({
    slug: doc.slug,
  }))
}
