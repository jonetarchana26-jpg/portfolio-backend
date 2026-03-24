// ===== IMPORTS =====
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

// ===== APP =====
const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== VARIABLES =====
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

// ===== CONNECT TO MONGODB =====
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected");

    db = client.db(process.env.DB_NAME); // database name from .env
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
}

connectDB();

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// ===== POST ROUTE =====
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // validation
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields required ⚠️"
      });
    }

    // insert into MongoDB
    const result = await db.collection("contacts").insertOne({
      name,
      email,
      message,
      createdAt: new Date()
    });

    // success response
    res.status(200).json({
      success: true,
      message: "Message saved successfully ✅",
      id: result.insertedId
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      message: "Server error ❌"
    });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});