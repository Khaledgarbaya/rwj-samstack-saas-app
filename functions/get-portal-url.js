const stripe = require('stripe')(process.env.STRIPE_SECRET)

exports.handler = async (event, context) => {
  const {user} = context.clientContext

  console.log(user)
  try {
    const data = await fetch(process.env.HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': `${process.env.HASURA_ADMIN_SECRET}`,
      },
      body: JSON.stringify({
        query: `
        query GetUserByNetlifyId($user_id: String) {
          user(where: {user_id: {_eq: $user_id}}) {
            user_id
            stripe_customer_id
          }
        }
        `,
        variables: {
          user_id: user.sub,
        },
      }),
    }).then((res) => res.json())
  } catch (e) {
    console.error(JSON.stringify(e), null, 2)
    return {
      statusCode: 500,
    }
  }

  const stripe_customer_id = data.user[0].stripe_customer_id
  const link = await stripe.billingPortal.sessions.create({
    customer: stripe_customer_id,
    return_url: process.env.URL,
  })

  return {
    statusCode: 200,
    body: JSON.stringify(link.url),
  }
}
