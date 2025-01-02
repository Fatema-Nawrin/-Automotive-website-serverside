const jwt = require('jsonwebtoken');
const { usersCollection } = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch users' });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await usersCollection.findOne({ email });
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch user by email' });
  }
};

const checkAdmin = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await usersCollection.findOne({ email });
    const isAdmin = user?.role === 'admin';
    res.send({ admin: isAdmin });
  } catch (error) {
    res.status(500).send({ error: 'Failed to check admin status' });
  }
};

const setAdmin = async (req, res) => {
  try {
    const email = req.params.email;
    const filter = { email };
    const updateDoc = { $set: { role: 'admin' } };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to set user as admin' });
  }
};

const upsertUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = req.body;
    const filter = { email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.send({ result, token });
  } catch (error) {
    res.status(500).send({ error: 'Failed to upsert user' });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const email = req.params.email;
    const userInfo = req.body;
    const filter = { email };
    const options = { upsert: true };
    const updateDoc = { $set: userInfo };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update user info' });
  }
};
module.exports = {
  updateUserInfo,
  upsertUser,
  setAdmin,
  checkAdmin,
  getUserByEmail,
  getAllUsers,
};
