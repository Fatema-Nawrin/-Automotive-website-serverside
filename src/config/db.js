const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ykv1v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let productsCollection, usersCollection, bookingsCollection, reviewsCollection, paymentsCollection;

try {
  client.connect();
  console.log('Connected to MongoDB');

  const db = client.db('blackstone_automotor');
  productsCollection = db.collection('products');
  bookingsCollection = db.collection('bookings');
  reviewsCollection = db.collection('reviews');
  usersCollection = db.collection('users');
  paymentsCollection = db.collection('payments');
} catch (err) {
  console.error('Error connecting to MongoDB:', err);
}

module.exports = {
  productsCollection,
  usersCollection,
  bookingsCollection,
  reviewsCollection,
  paymentsCollection,
};
