
const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware setup

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfqqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);  // for connection check

// insert data

async function run(){

    try{

        await client.connect();

        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders');
        console.log('connected to db')  // connection check to db


        // get data from db

        app.get('/services', async (req, res) =>{

           
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })


        // get single data from db

        app.get('/services/:id', async(req, res) =>{

            const id = req.params.id
            console.log('hit the id', id)
            const query ={ _id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        // POST data from API to db

        app.post('/services', async(req, res)=>{

            const service = req.body;
            console.log('hit the post', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)

        })

        // Add Orders API
        app.get('/orders', async (req, res) => {

                let query = {};
                const email = req.query.email;
                if(email){
                    query = {email: email};

                }
                const cursor = orderCollection.find(query);
                const orders = await cursor.toArray();
                res.json(orders);
            

        });

        app.get('/services', async (req, res) => {

            let query = {};
            const email = req.query.email;
            if(email){
                query = {email: email};

            }
            const cursor = servicesCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        

    });

        // send orders info to database

        app.post('/orders', async (req, res) => {
            const order = req.body;
            order.createdAt = new Date();
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        // Delete API
         app.delete('/services/:id', async(req, res) =>{

            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
         })


    }

    finally{
       // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) =>{

    res.send('runnig genius car');


})

app.listen( port, () =>{

    console.log('running genius server', port);
})