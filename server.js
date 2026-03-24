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

    db = client.db(process.env.DB_NAME);

  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
}

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.post("/contact", async (req, res) => {
  try {
    // 🚨 CHECK DB CONNECTION
    if (!db) {
      return res.status(500).json({
        message: "Database not connected ❌"
      });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields required ⚠️"
      });
    }

    // ✅ INSERT INTO DB
    const result = await db.collection("contacts").insertOne({
      name,
      email,
      message,
      createdAt: new Date()
    });

    console.log("Saved:", result.insertedId); // DEBUG

    res.status(200).json({
      success: true,
      message: "Message saved successfully ✅"
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

// 🚨 IMPORTANT: WAIT FOR DB BEFORE STARTING SERVER
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});