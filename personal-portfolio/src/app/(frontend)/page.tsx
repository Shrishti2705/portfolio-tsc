import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import configPromise from '@payload-config'
import { RenderBlocks } from '@/components/RenderBlocks'

// Always fetch fresh data — so Payload content/image changes appear immediately
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  // Find page with slug 'home'
  let result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 5,
  })

  // If no 'home' page, fetch the first available page
  if (result.docs.length === 0) {
    result = await payload.find({
      collection: 'pages',
      limit: 1,
      depth: 5,
    })
  }

  const page = result.docs?.[0] || null

  if (page) {
    return <RenderBlocks blocks={page.layout} />
  }

  // If absolutely no pages exist in the DB, render a friendly setup screen in light mode
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <span className="material-symbols-outlined text-4xl leading-none">auto_awesome</span>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Setup Your Portfolio</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Welcome to your new portfolio site. Let's create your home page in the Payload admin panel to get started.
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs space-y-2">
          <p className="font-semibold text-slate-700">Next Steps:</p>
          <ol className="list-decimal list-inside text-slate-500 space-y-1.5 leading-relaxed">
            <li>Go to the <a href="/admin" className="text-indigo-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Payload Admin Panel</a></li>
            <li>Create a new Page in the <strong>Pages</strong> collection</li>
            <li>Set the title to <strong>Home</strong> and slug to <strong>home</strong></li>
            <li>Add the <strong>Personal Portfolio</strong> block or <strong>Portfolio</strong> block, populate content, and publish!</li>
          </ol>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <a
            href="/admin"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 px-4 rounded-xl text-center shadow-sm shadow-indigo-100 transition-colors"
          >
            Go to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
