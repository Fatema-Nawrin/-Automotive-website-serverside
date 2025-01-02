const { ObjectId } = require('mongodb');
const { bookingsCollection, paymentsCollection } = require('../config/db');

const getBookingsByEmail = async (req, res) => {
  try {
    const buyerEmail = req.query.buyerEmail;
    const decodedEmail = req.decoded.email;

    if (buyerEmail !== decodedEmail) {
      return res.status(403).send({ error: 'Forbidden access' });
    }

    const filter = { buyerEmail: buyerEmail };
    const bookings = await bookingsCollection.find(filter).toArray();
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch bookings' });
  }
};
const getAllBookings = async (req, res) => {
  try {
    const query = {};
    const bookings = await bookingsCollection.find(query).toArray();
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch all bookings' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await bookingsCollection.findOne({ _id: ObjectId(id) });
    res.send(booking);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch booking' });
  }
};

const createBooking = async (req, res) => {
  try {
    const booking = req.body;
    const result = await bookingsCollection.insertOne(booking);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to create booking' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const result = await bookingsCollection.deleteOne(filter);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete booking' });
  }
};

const updateBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const payment = req.body;
    const filter = { _id: ObjectId(id) };
    const updatedDoc = {
      $set: {
        paid: true,
        transactionId: payment.transactionId,
      },
    };
    const result = await paymentsCollection.insertOne(payment);
    const updatedBooking = await bookingsCollection.updateOne(filter, updatedDoc);
    res.send(updatedBooking);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update booking' });
  }
};

module.exports = {
  getBookingsByEmail,
  getAllBookings,
  getBookingById,
  createBooking,
  deleteBooking,
  updateBooking,
};
