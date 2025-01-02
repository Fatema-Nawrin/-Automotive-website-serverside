const { ObjectId } = require('mongodb');
const { productsCollection } = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const products = await productsCollection.find({}).toArray();

    res.send(products);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productsCollection.findOne({ _id: ObjectId(id) });
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch product' });
  }
};

const addProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await productsCollection.insertOne(newProduct);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to add product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
};
