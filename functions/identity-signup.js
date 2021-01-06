const fetch = require('node-fetch')
const stripe = require('stripe')(process.env.STRIPE_SECRET)
exports.handler = async (event) => {
  const {user} = JSON.parse(event.body)

  // create a stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
  })

  // assign free subscription
  await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        price: process.env.FREE_PLAN_PRICE,
      },
    ],
  })

  try {
    const data = await fetch(process.env.HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': `${process.env.HASURA_ADMIN_SECRET}`,
      },
      body: JSON.stringify({
        query: `
        mutation UserMutation($email: String, $user_id: String, $stripe_customer_id: String) {
          insert_user(objects: {email: $email, user_id: $user_id, stripe_customer_id: $stripe_customer_id}) {
            affected_rows
          }
        }
        `,
        variables: {
          email: user.email,
          user_id: user.id,
          stripe_customer_id: customer.id,
        },
      }),
    }).then((res) => res.json())
  } catch (e) {
    console.error(JSON.stringify(e), null, 2)
    return {
      statusCode: 500,
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        role: ['free'],
      },
    }),
  }
}
