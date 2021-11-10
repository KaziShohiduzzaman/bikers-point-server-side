const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9zo1c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
async function run() {
    try {
        await client.connect();
        const database = client.db('bikeWala');
        const productsCollection = database.collection('products');
        const orderCollection = database.collection('orders');

        //Post api for Products 
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result)
        })

        //GET  api for Products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({}).limit(6);
            const product = await cursor.toArray();
            res.send(product);
        })

        //GET  api for all Products
        app.get('/allProducts', async (req, res) => {
            const cursor = productsCollection.find({});
            const product = await cursor.toArray();
            res.send(product);
        })

        // for dynamic route 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const event = await productsCollection.findOne(query);
            res.send(event);
        })

        //post orders api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })

        //get orders api

        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        //DELETE api for specific id
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        })

        //GET specific id for delete
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.findOne(query);
            res.send(result);
        })






    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Bike wala Server Running')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
