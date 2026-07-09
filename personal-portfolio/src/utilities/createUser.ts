import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function run() {
  const payload = await getPayload({ config: configPromise })
  
  const email = 'contact@thespecialcharacter.com'
  const password = 'Password1!'

  // Find if user already exists
  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: email,
      },
    },
  })

  if (existingUsers.docs.length > 0) {
    console.log(`User ${email} already exists. Updating password...`)
    await payload.update({
      collection: 'users',
      id: existingUsers.docs[0].id,
      data: {
        password: password,
      },
    })
    console.log('Password updated successfully!')
  } else {
    console.log(`Creating user ${email}...`)
    await payload.create({
      collection: 'users',
      data: {
        email: email,
        password: password,
      },
    })
    console.log('User created successfully!')
  }

  process.exit(0)
}

run().catch((err) => {
  console.error('Error creating user:', err)
  process.exit(1)
})
