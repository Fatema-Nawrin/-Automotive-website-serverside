const express = require('express')
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const app = express()
const port = process.env.PORT || 5000;
// midlleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ykv1v.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: 'Unauthorized access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ error: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('blackstone_automotor').collection('products');
        const bookingsCollection = client.db('blackstone_automotor').collection('bookings');
        const reviewsCollection = client.db('blackstone_automotor').collection('reviews');
        const usersCollection = client.db('blackstone_automotor').collection('users');
        const paymentsCollection = client.db('blackstone_automotor').collection('payments');

        const verifyAdmin = async (req, res, next) => {
            const requester = req.decoded.email;
            const query = { email: requester }
            const requesterInfo = await usersCollection.findOne(query);
            if (requesterInfo.role === 'admin') {
                next();
            }
            else {
                return res.status(403).send({ error: 'Forbidden access' })
            }
        }

        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.send(product);
        })

        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct)
            res.send(result);
        })

        app.get('/bookings', verifyJWT, async (req, res) => {
            const buyerEmail = req.query.buyerEmail;
            const decodedEmail = req.decoded.email;
            if (buyerEmail === decodedEmail) {
                const filter = { buyerEmail: buyerEmail };
                const bookings = await bookingsCollection.find(filter).toArray();
                res.send(bookings)
            }
            else {
                return res.status(403).send({ error: 'Forbidden access' })
            }
        })

        app.get('/bookings/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const booking = await bookingsCollection.findOne(query);
            res.send(booking);
        })

        app.get('/allbookings', verifyJWT, verifyAdmin, async (req, res) => {
            const query = {};
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);

        })

        app.patch('/bookings/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const payment = req.body;
            console.log(payment);
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    paid: true,
                    transactionId: payment.transactionId
                }
            }
            const result = await paymentsCollection.insertOne(payment);
            const updatedBooking = await bookingsCollection.updateOne(filter, updatedDoc);
            res.send(updatedBooking);
        })

        app.post('/create-payment-intent', verifyJWT, async (req, res) => {
            const booking = req.body;
            const cost = booking.cost;
            const amount = cost * 100;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            });
            res.send({ clientSecret: paymentIntent.client_secret })
        });

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result)
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(filter);
            res.send(result);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result)
        })
        app.get('/reviews', async (req, res) => {
            const query = {};
            const reviews = await reviewsCollection.find(query).toArray();
            res.send(reviews);
        })

        app.get('/users', verifyJWT, async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.send(users)
        })

        app.get('/users/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.send(user)
        })

        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
        })

        app.put('/users/admin/:email', verifyJWT, verifyAdmin, async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'admin' },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ result, token })
        })

        app.put('/usersinfo/:email', async (req, res) => {
            const email = req.params.email;
            const userInfo = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: userInfo
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        })


    }
    finally {

    }

}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Blackstone Tire website server')
})

app.listen(port, () => {
    console.log(`Blackstone tire site listening on port ${port}`)
})