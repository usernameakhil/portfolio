require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./models/Contact'); // Import the model we just made

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON data
app.use(cors()); // Allows your frontend (localhost:5173) to talk to this backend

// Connect to MongoDB
// (Make sure to create a .env file with MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- API Routes ---

// POST Route to handle the Contact Form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, contact, subject, message } = req.body;

    // Simple Validation
    if (!name || !contact || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Create and Save to DB
    const newMessage = new Contact({ name, contact, subject, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});