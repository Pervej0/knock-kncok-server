const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// databse details-
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjbgh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    console.log("DB is connected");
    const database = client.db("knock_knock_DB");
    const servicesCollection = database.collection("knock_knock_Services");
    const orderCollection = database.collection("order_collection");
    // get all products
    app.get("/products", async (req, res) => {
      const query = await servicesCollection.find({}).toArray();
      res.send(query);
    });

    // get speacific product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    // inseert order details
    app.post("/orders", async (req, res) => {
      const doc = req.body;
      const result = await orderCollection.insertOne(doc);
      res.send(result);
    });

    // get ordered product
    app.get("/myOrders/:email", async (req, res) => {
      const email = req.params.email;
      const result = await orderCollection.find({ email: email }).toArray();
      res.send(result);
      // console.log("helllllowin", email);
    });

    // delete specific order
    app.delete("/myOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    // get all orders-
    app.get("/myOrders", async (req, res) => {
      const query = await orderCollection.find({}).toArray();
      res.send(query);
    });

    // update order status
    app.put("/myOrders/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "approved",
        },
      };
      const result = await orderCollection.updateOne(filter, updateDoc);
      res.send(result);
      console.log(result);
    });
  } finally {
    // client.close();
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("WELCOME TO SERVER WORLD");
});

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
