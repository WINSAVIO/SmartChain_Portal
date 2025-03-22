const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const mlRoutes = require('./routes/mlRouter');
// const { db } = require('./config/firebase');

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// // Routes
// app.use('/api/ml', mlRoutes);

// User Registration (without Firebase Auth)
// app.post("/register", async (req, res) => {
//   const { fullName, dateOfBirth, email, phoneNumber, username, password } = req.body;

//   // Validate required fields
//   if (!fullName || !dateOfBirth || !email || !phoneNumber || !username || !password) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     // Check if username is already taken
//     const usernameSnapshot = await db
//       .collection("users")
//       .where("username", "==", username)
//       .get();

//     if (!usernameSnapshot.empty) {
//       return res.status(400).json({ error: "Username already taken" });
//     }

//     // Store user data in Firestore
//     await db.collection("users").add({
//       fullName,
//       dateOfBirth, // Store as "yyyy-mm-dd" format
//       phoneNumber,
//       username,
//       email,
//       password, 
//       createdAt: new Date(),
//     });

//     // Send success response
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
