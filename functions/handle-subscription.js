const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const fetch = require('node-fetch')
const productToRoles = {
  prod_Ii7252PFMlTKgu: 'premium',
  prod_Ii71iUsj9BBb3x: 'basic',
  prod_Ii70cBGRNqc0RD: 'free',
}
exports.handler = async ({body, headers}, context) => {
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    )

    if (stripeEvent.type === 'customer.subscription.updated') {
      const subscription = stripeEvent.data.object

      const stripe_customer_id = subscription.customer
      const productID = subscription.items.data[0].plan.product

      const role = `${productToRoles[productID]}`

      const result = await await fetch(process.env.HASURA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': `${process.env.HASURA_ADMIN_SECRET}`,
        },
        body: JSON.stringify({
          query: `
          query GetUserByStripeId($stripe_customer_id: String) {
            user(where: {stripe_customer_id: {_eq: $stripe_customer_id}}) {
              user_id
            }
          }
          `,
          variables: {
            stripe_customer_id,
          },
        }),
      }).then((res) => res.json())

      const netlifyID = result.data.user[0].user_id
      const {identity} = context.clientContext
      const response = await fetch(`${identity.url}/admin/users/${netlifyID}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${identity.token}`,
        },
        body: JSON.stringify({
          app_metadata: {
            roles: [role],
          },
        }),
      })
        .then((res) => res.json())
        .catch((err) => console.error(err))

      console.log(response)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({received: true}),
    }
  } catch (err) {
    console.log(`Stripe webhook failed with ${err}`)

    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    }
  }
}
