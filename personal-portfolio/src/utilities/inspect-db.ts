import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function inspect() {
  const payload = await getPayload({ config: configPromise })
  
  // Find published page
  const publishedResult = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    depth: 5,
  })

  // Find draft page
  const draftResult = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    draft: true,
    depth: 5,
  })

  console.log('--- INSPECTING PUBLISHED HOME PAGE ---')
  if (publishedResult.docs.length > 0) {
    const doc = publishedResult.docs[0]
    console.log(`Published Page: ${doc.title} (status: ${doc._status})`)
    console.log('Published Layout:', JSON.stringify(doc.layout, null, 2))
  } else {
    console.log('No published home page found')
  }

  console.log('\n--- INSPECTING DRAFT/LATEST HOME PAGE ---')
  if (draftResult.docs.length > 0) {
    const doc = draftResult.docs[0]
    console.log(`Draft/Latest Page: ${doc.title} (status: ${doc._status})`)
    console.log('Draft/Latest Layout:', JSON.stringify(doc.layout, null, 2))
  } else {
    console.log('No draft/latest home page found')
  }
}

inspect().catch(console.error)
