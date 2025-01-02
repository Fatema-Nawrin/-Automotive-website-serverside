const { reviewsCollection } = require('../config/db');

const addReview = async (req, res) => {
  try {
    const review = req.body;
    const result = await reviewsCollection.insertOne(review);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to add review' });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await reviewsCollection.find().toArray();
    res.send(reviews);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch reviews' });
  }
};
module.exports = { addReview, getReviews };
