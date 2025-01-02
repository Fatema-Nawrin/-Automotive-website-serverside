const express = require('express');
const cors = require('cors');
require('dotenv').config();
const productRoutes = require('./routes/products');
const bookingRoutes = require('./routes/bookings');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/bookings', bookingRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Blackstone Tire website server');
});
// Start the server
app.listen(port, () => {
  console.log(`Blackstone tire site listening on port ${port}`);
});
