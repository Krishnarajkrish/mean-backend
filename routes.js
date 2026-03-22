require('dotenv').config();
const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("meanDB");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
  }
}
connectDB();

// CREATE
router.post('/products', async (req, res) => {
  const result = await db.collection('products').insertOne(req.body);
  res.send(result);
});

// READ
router.get('/products', async (req, res) => {
  const data = await db.collection('products').find().toArray();
  res.send(data);
});

// UPDATE
router.put('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID" });
    }

    const updatedData = { ...req.body };
    delete updatedData._id;

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    res.send(result);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).send({ error: err.message });
  }
});

// DELETE
router.delete('/products/:id', async (req, res) => {
  const id = req.params.id;
  const result = await db.collection('products').deleteOne({
    _id: new ObjectId(id)
  });
  res.send(result);
});

module.exports = router;