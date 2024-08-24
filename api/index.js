const express = require("express");
const port = 3000;
const { MongoClient } = require("mongodb");
var cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies


let database;

const uri = process.env.MONGODB_URI;
const dbName = "todoappdb";
const collectionName = "todoappcollection";

const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    database = client.db(dbName);
    console.log("Connected to the database.");
  } catch (error) {
    console.error("Failed to connect to the database: ", error);
    process.exit(1); // Exit the process if connection fails
  }
}

connectToDatabase();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/api/todoapp/GetNotes", async (req, res) => {
  try {
    const collection = database.collection(collectionName);
    const documents = await collection.find({}).toArray();
    res.json(documents);
  } catch (error) {
    res.status(500).send("Error fetching data from MongoDB: " + error.message);
  }
});

app.post("/api/todoapp/AddNotes", async (req, res) => {
  try {
    const collection = database.collection(collectionName);
    const documentsLength = await collection.countDocuments(); // Get the number of documents in the collection
    await collection.insertOne({
      id: `${documentsLength+1}`.toString(),
      description: req.body.description,
    });
    res.json("Added Successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/api/todoapp/DeleteNotes", async (req, res) => {
  try {
    const collection = database.collection(collectionName);
    await collection.deleteOne({ id: req.query.id });
    res.json("Deleted Successfully");
  } catch (error) {
    res.status(500).send("Error deleting data from MongoDB: " + error.message);
  }
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await client.close();
  process.exit(0);
});
