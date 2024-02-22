const express = require('express')
const app = express()
const port = process.env.PORT = 5000;
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//midleWere :
app.use(cors())
app.use(express.json())

//mongoDB
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.bqchovi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const carConnection = client.db('carManager').collection('cars ')

        app.get('/cars', async (req, res) => {
            const query = carConnection.find()
            const result = await query.toArray()
            res.send(result)
        })
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await carConnection.findOne(query)
            res.send(result)
        })
        app.post('/cars', async (req, res) => {
            const user = req.body;
            const result = await carConnection.insertOne(user)
            res.send(result)
        })
        app.patch('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const options = { upsert: true }
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    ...user
                }
            }
            const result = await carConnection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        app.delete('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await carConnection.deleteOne(filter)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('car doctor is runing')
})

app.listen(port, () => {
    console.log(`car doctor project : ${port}`)
})