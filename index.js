const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())


// coffee-emporium
// IMEUetdLFJgoF5lH



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { emit } = require('nodemon');
const uri = "mongodb+srv://coffee-emporium:IMEUetdLFJgoF5lH@cluster0.gegfn.mongodb.net/?retryWrites=true&w=majority";

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    const database = client.db("coffeesDB").collection('newCoffees')
    const UserCollection = client.db('coffeesDB').collection('newSigenUp')
    // const haiku = database.collection("haiku");
app.post('/users', async(req, res)=>{
  const user = req.body
  const result = await UserCollection.insertOne(user)
  res.send(result)
})

app.get('/users', async(req, res) =>{
  const cursor = UserCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})

app.delete('/users/:id', async(req, res)=>{
  const id = req.params.id
  console.log(id)
  const filter = {_id: new ObjectId(id)}
  const result = await UserCollection.deleteOne(filter)
  console.log(result)
  res.send(result)
})
app.patch('/users', async(req, res)=>{
  const user = req.body;
  const filter = {email : user.email}
  const updateDoc = {
    $set: {
      lastTimelogin: user.lastTimelogin
    },
  };
  const result = await UserCollection.updateOne(filter, updateDoc)
  res.send(result)
})

app.get('/coffees', async(req, res) =>{
    const cursor = database.find();
    const result = await cursor.toArray()
    res.send(result)
})

app.post('/coffees', async(req, res)=>{
    const coffee = req.body
    console.log('hitting to cilent side' ,coffee)
    const result = await database.insertOne(coffee);
    res.send(result)

})
app.put('/coffees/:id', async (req, res)=>{
  const id = req.params.id;
  const coffee = req.body
  console.log(coffee)
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true }
  const updateCoffee = {
    $set: {
      name: coffee.name,
      chef: coffee.chef,
      supplier: coffee.supplier,
      taste: coffee.taste,
      category: coffee.category,
      details: coffee.details,
      photo: coffee.photo
    },
    
  };
  const update = await database.updateOne(filter, updateCoffee, options)
  res.send(update)
})

app.delete('/coffees/:id' ,async(req, res) =>{
    const id = req.params.id
    console.log(id)
    const query = { _id : new ObjectId(id) };
    const result = await database.deleteOne(query);
    console.log(result)
    res.send(result)
})

app.get('/coffees/:id', async(req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const findone = await database.findOne(query)
  res.send(findone)

})

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    console.log('we are cannect with server');
    res.send('hitting the server')
})
app.listen(port, ()=>{
    console.log('this is server sit', port)
})