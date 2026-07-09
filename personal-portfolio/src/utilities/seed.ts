// @ts-nocheck
import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'
import { seedDatabase } from './seedDatabase'

async function run() {
  const payload = await getPayload({ config: configPromise })
  await seedDatabase(payload)
  process.exit(0)
}

run().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
