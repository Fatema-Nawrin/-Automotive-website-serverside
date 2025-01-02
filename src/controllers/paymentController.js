const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const booking = req.body;
    const cost = booking.cost;
    const amount = cost * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    console.log(paymentIntent.client_secret);

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to create payment intent' });
  }
};

module.exports = {
  createPaymentIntent,
};
