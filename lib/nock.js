const nock = require('nock')
module.exports = {
  PaymentIntent_requires_capture: () => {
    nock('http://localhost:12111')
    .get('/v1/payment_intents/pi_123')
      .reply(200, {
        amount: 1099,
        amount_capturable: 0,
        amount_received: 0,
        application: null,
        application_fee_amount: null,
        canceled_at: 1234567890,
        cancellation_reason: null,
        capture_method: 'manual',
        charges: {
          data: [ [Object]  ],
          has_more: false,
          object: 'list',
          url: '/v1/charges?payment_intent=pi_123'
        },
        client_secret: 'pi_123_secret_QNBWGwNj7E2h1pyZsKAKZYcs1',
        confirmation_method: 'automatic',
        created: 1234567890,
        currency: 'usd',
        customer: null,
        description: null,
        id: 'pi_123',
        invoice: null,
        last_payment_error: null,
        livemode: false,
        metadata: {
          slotId: '67890'
        },
        next_action: null,
        object: 'payment_intent',
        on_behalf_of: null,
        payment_method: null,
        payment_method_options: {},
        payment_method_types: [ 'card'  ],
        receipt_email: null,
        review: null,
        setup_future_usage: null,
        shipping: null,
        statement_descriptor: null,
        statement_descriptor_suffix: null,
        /**
         * TOGGLE THIS VALUE TO TEST FUNCTION BEHAVIOR!
         */
        status: 'requires_capture',

        transfer_data: null,
        transfer_group: null
      })
  }
}
