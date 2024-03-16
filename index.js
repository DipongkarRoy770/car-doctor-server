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
         client.connect();

        const carConnection = client.db('carManager').collection('cars ')
        const carBooking = client.db('carbook').collection('carData')

        app.get('/cars', async (req, res) => {
           // let query = {}
           
             const sort = req.query.sort;
             const search= req.query.search ;
             
             const query = {title: { $regex: search, $options: 'i'}}
            

             const options={
                
                    sort: { 
                        price:sort==='asc'?1:-1 
                    }
                
            }
            const cursor = carConnection.find( query,options)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const options = {title:1 ,price:1 ,cars_id:1 ,img:1}
            const result = await carConnection.findOne(query ,options)
            res.send(result)
        })
        // app.post('/cars', async (req, res) => {
        //     const user = req.body;
        //     const result = await carConnection.insertOne(user)
        //     res.send(result)
        // }) 
        
        // app.put('/cars/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const user = req.body;
        //     const options = { upsert: true }
        //     const filter = { _id: new ObjectId(id) }
        //     const updateDoc = {
        //         $set: {
        //             ...user
        //         }
        //     }
        //     const result = await carConnection.updateOne(filter, updateDoc, options)
        //     res.send(result)
        // })
        // app.delete('/cars/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) }
        //     const result = await carConnection.deleteOne(filter)
        //     res.send(result)
        // })
        //booking data:

        app.post('/booking', async (req, res) => {
            const user = req.body;
            const result = await carBooking.insertOne(user)
            res.send(result)
        }) 
        app.get('/booking', async (req, res) => {
            console.log(req.query.email)
            let query = {}
            if(req.query?.email){
                query={email: req.query.email}
            }
            const result = await carBooking.find(query).toArray()
            res.send(result)
        })
        app.get('/booking/:id' ,async(req,res)=>{
            const id = req.params.id ;
            const query = {_id: new ObjectId(id)}
            const result = await carBooking.findOne(query)
            res.send(result)
        })
        app.patch('/booking/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter= {_id: new ObjectId(id)}
            const updateBooking = req.body
            console.log(updateBooking)
            const updateDoc={
                $set:{
                    status:updateBooking.status
                }
            }
            const  result =await carBooking.updateOne(filter,updateDoc)
            res.send(result)
        })
        app.delete('/booking/:id', async(req ,res)=>{
            const id = req.params.id
            console.log(id)
            const query = {_id:new ObjectId(id)}
            const result = await carBooking.deleteOne(query)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        //await client.db("admin").command({ ping: 1 });
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