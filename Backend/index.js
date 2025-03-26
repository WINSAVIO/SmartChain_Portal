const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./publicAccountKey.json");

// Initialize Firebase Admin SDK with Firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Initialize Firestore

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to verify Firebase ID token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Map user (create or update user data in Firestore)
app.post("/api/map-user", authenticateToken, async (req, res) => {
  const { uid, email, companyName, address, taxId } = req.body;
  if (!uid || !email) {
    return res.status(400).json({ message: "Missing uid or email" });
  }

  try {
    const userRef = db.collection("users").doc(uid);
    await userRef.set(
      {
        profile: {
          email,
          companyName: companyName || "",
          address: address || "",
          taxId: taxId || "",
        },
        notificationSettings: {
          emailNotifications: true,
          pushNotifications: true,
          weeklyReports: true,
          stockAlerts: true,
        },
      },
      { merge: true }
    );

    console.log("User data saved to Firestore:", { uid, email, companyName, address, taxId });

    res.status(200).json({ message: "User mapped successfully" });
  } catch (error) {
    console.error("Error saving user data to Firestore:", error);
    res.status(500).json({ message: "Failed to save user data" });
  }
});

// Get user profile
app.get("/api/user-profile", authenticateToken, async (req, res) => {
  const uid = req.user.uid;

  try {
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      // If the document doesn't exist, return default values
      return res.status(200).json({
        email: req.user.email,
        companyName: "",
        address: "",
        taxId: "",
      });
    }

    const data = doc.data();
    res.status(200).json(data.profile || { email: req.user.email, companyName: "", address: "", taxId: "" });
  } catch (error) {
    console.error("Error fetching user profile from Firestore:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
});

// Update user profile
app.put("/api/user-profile", authenticateToken, async (req, res) => {
  const uid = req.user.uid;
  const { email, companyName, address, taxId } = req.body;

  try {
    const userRef = db.collection("users").doc(uid);
    await userRef.set(
      {
        profile: {
          email: email || req.user.email,
          companyName: companyName || "",
          address: address || "",
          taxId: taxId || "",
        },
      },
      { merge: true }
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile in Firestore:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
});

// Get notification settings
app.get("/api/notification-settings", authenticateToken, async (req, res) => {
  const uid = req.user.uid;

  try {
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      // If the document doesn't exist, return default values
      return res.status(200).json({
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: true,
        stockAlerts: true,
      });
    }

    const data = doc.data();
    res.status(200).json(
      data.notificationSettings || {
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: true,
        stockAlerts: true,
      }
    );
  } catch (error) {
    console.error("Error fetching notification settings from Firestore:", error);
    res.status(500).json({ message: "Failed to fetch notification settings" });
  }
});

// Update notification settings
app.put("/api/notification-settings", authenticateToken, async (req, res) => {
  const uid = req.user.uid;
  const { emailNotifications, pushNotifications, weeklyReports, stockAlerts } = req.body;

  try {
    const userRef = db.collection("users").doc(uid);
    await userRef.set(
      {
        notificationSettings: {
          emailNotifications: emailNotifications ?? true,
          pushNotifications: pushNotifications ?? true,
          weeklyReports: weeklyReports ?? true,
          stockAlerts: stockAlerts ?? true,
        },
      },
      { merge: true }
    );

    res.status(200).json({ message: "Notification settings updated successfully" });
  } catch (error) {
    console.error("Error updating notification settings in Firestore:", error);
    res.status(500).json({ message: "Failed to update notification settings" });
  }
});

// NEW ENDPOINTS APPENDED BELOW

// Get all suppliers (global)
app.get("/api/suppliers", authenticateToken, async (req, res) => {
  try {
    const suppliersRef = db.collection("suppliers");
    const snapshot = await suppliersRef.get();
    const suppliers = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ message: "Failed to fetch suppliers" });
  }
});

// Get all categories (global)
app.get("/api/categories", authenticateToken, async (req, res) => {
  try {
    const categoriesRef = db.collection("categories");
    const snapshot = await categoriesRef.get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Get all inventory items (global)
app.get("/api/inventory-items", authenticateToken, async (req, res) => {
  try {
    const inventoryRef = db.collection("inventoryItems");
    const snapshot = await inventoryRef.get();
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.status(500).json({ message: "Failed to fetch inventory items" });
  }
});

// Add a new inventory item (global)
app.post("/api/inventory-items", authenticateToken, async (req, res) => {
  const { name, supplier, quantity, reorderPoint, category } = req.body;

  if (!name || !supplier || !quantity || !reorderPoint || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const inventoryRef = db.collection("inventoryItems");
    const newItem = {
      name,
      supplier,
      quantity: parseInt(quantity),
      reorderPoint: parseInt(reorderPoint),
      category,
    };
    const docRef = await inventoryRef.add(newItem);
    res.status(201).json({ id: docRef.id, ...newItem });
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.status(500).json({ message: "Failed to add inventory item" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});