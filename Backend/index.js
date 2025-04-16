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
    req.user = decodedToken; // Store decoded token with email, uid, etc.
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Map user (create or update user data in Firestore and assign retailer ID)
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

    // Assign or update retailer ID in user_details
    const retailerId = `RT-${String((await db.collection("user_details").where("typeOfUser", "==", "retailers").get()).size + 1).padStart(3, "0")}`;
    await db.collection("user_details").doc(retailerId).set({
      id: retailerId,
      typeOfUser: "retailers",
      companyName: companyName || email.split("@")[0],
      address: address || "",
      taxId: taxId || "",
    }, { merge: true });

    console.log("User data and retailer ID saved to Firestore:", { uid, email, companyName, address, taxId, retailerId });

    res.status(200).json({ message: "User mapped successfully", retailerId });
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
      return res.status(200).json({
        email: req.user.email || "",
        companyName: "",
        address: "",
        taxId: "",
      });
    }

    const data = doc.data();
    res.status(200).json(data.profile || { email: req.user.email || "", companyName: "", address: "", taxId: "" });
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
          email: email || req.user.email || "",
          companyName: companyName || "",
          address: address || "",
          taxId: taxId || "",
        },
      },
      { merge: true }
    );

    // Update corresponding retailer entry in user_details
    const retailerSnapshot = await db.collection("user_details")
      .where("typeOfUser", "==", "retailers")
      .where("companyName", "==", companyName || "")
      .limit(1)
      .get();
    if (!retailerSnapshot.empty) {
      const retailerId = retailerSnapshot.docs[0].id;
      await db.collection("user_details").doc(retailerId).update({
        companyName: companyName || "",
        address: address || "",
        taxId: taxId || "",
      });
    }

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

// Get all suppliers (global)
app.get("/api/suppliers", authenticateToken, async (req, res) => {
  try {
    const userDetailsRef = db.collection("user_details");
    const snapshot = await userDetailsRef.where("typeOfUser", "==", "suppliers").get();
    const suppliers = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().companyName || "Unnamed Supplier",
    }));
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers from user_details:", error);
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
      name: doc.data().name || "Unnamed Category",
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
      itemId: doc.data().itemId || doc.id,
      name: doc.data().name || "Unnamed Item",
      supplier: doc.data().supplier || "Unknown Supplier",
      quantity: doc.data().quantity || 0,
      reorderPoint: doc.data().reorderPoint || 0,
      category: doc.data().category || "Uncategorized",
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
    const snapshot = await inventoryRef.get();
    const itemCount = snapshot.size;
    const newItemId = `ITM-${String(itemCount + 1).padStart(3, "0")}`;

    const newItem = {
      itemId: newItemId,
      name,
      supplier,
      quantity: parseInt(quantity),
      reorderPoint: parseInt(reorderPoint),
      category,
    };
    await inventoryRef.doc(newItemId).set(newItem);
    res.status(201).json({ id: newItemId, ...newItem });
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.status(500).json({ message: "Failed to add inventory item" });
  }
});

// Get all sales reports with time period filtering
app.get("/api/sales-reports", authenticateToken, async (req, res) => {
  try {
    const { period = "week", startDate, endDate } = req.query;
    const currentDate = new Date("2025-04-11"); // Current date
    let start, end;

    switch (period) {
      case "day":
        start = new Date(currentDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(currentDate);
        end.setHours(23, 59, 59, 999);
        break;
      case "week":
        start = new Date(currentDate);
        start.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the week (Sunday)
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6); // End of the week (Saturday)
        end.setHours(23, 59, 59, 999);
        break;
      case "month":
        start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case "quarter":
        const quarter = Math.floor(currentDate.getMonth() / 3);
        start = new Date(currentDate.getFullYear(), quarter * 3, 1);
        end = new Date(currentDate.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59, 999);
        break;
      case "year":
        start = new Date(currentDate.getFullYear(), 0, 1);
        end = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        start = new Date(currentDate);
        start.setDate(currentDate.getDate() - currentDate.getDay());
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
    }

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    }

    const salesRef = db.collection("sales_report");
    const snapshot = await salesRef
      .where("date", ">=", start.toISOString())
      .where("date", "<=", end.toISOString())
      .get();

    // Fetch inventory items to map itemId to product name
    const inventorySnapshot = await db.collection("inventoryItems").get();
    const inventoryMap = {};
    inventorySnapshot.forEach((doc) => {
      const data = doc.data();
      inventoryMap[data.itemId] = data.name;
    });

    // Fetch retailers from user_details
    const retailerSnapshot = await db.collection("user_details")
      .where("typeOfUser", "==", "retailers")
      .get();
    const retailerMap = {};
    retailerSnapshot.forEach((doc) => {
      retailerMap[doc.id] = doc.data().companyName || "Unknown Retailer";
    });

    const reports = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.reportId || doc.id, // Use custom reportId if present, fallback to doc.id
        retailerId: data.retailerId,
        retailerName: retailerMap[data.retailerId] || "Unknown Retailer",
        product: inventoryMap[data.itemId] || "Unknown Product",
        quantity: data.noOfUnitsSold || 0,
        amount: data.sales || 0,
        dateTime: data.date,
      };
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching sales reports:", error);
    res.status(500).json({ message: "Failed to fetch sales reports" });
  }
});

// Add new sales report with generated report ID
app.post("/api/sales-reports", authenticateToken, async (req, res) => {
  const { retailerId, itemId, noOfUnitsSold, sales, date, categoryOfItem, season } = req.body;

  if (!retailerId || !itemId || !noOfUnitsSold || !sales || !date || !categoryOfItem || !season) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const salesRef = db.collection("sales_report");
    const snapshot = await salesRef.get();
    const reportCount = snapshot.size + 1; // Get the next sequence number
    const reportId = `RE-${String(reportCount).padStart(3, "0")}`; // Generate ID like "RE-001"

    const newReport = {
      reportId, // Add the generated report ID
      retailerId,
      itemId,
      noOfUnitsSold: parseInt(noOfUnitsSold),
      sales: parseFloat(sales),
      date,
      categoryOfItem,
      season,
    };
    await salesRef.add(newReport);
    res.status(201).json({ message: "Sales report added successfully", id: reportId });
  } catch (error) {
    console.error("Error adding sales report:", error);
    res.status(500).json({ message: "Failed to add sales report" });
  }
});

// Get all restock requests with time period filtering
app.get("/api/restock-requests", authenticateToken, async (req, res) => {
  try {
    const { period = "week", startDate, endDate } = req.query;
    const currentDate = new Date("2025-04-11"); // Current date
    let start, end;

    switch (period) {
      case "day":
        start = new Date(currentDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(currentDate);
        end.setHours(23, 59, 59, 999);
        break;
      case "week":
        start = new Date(currentDate);
        start.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the week (Sunday)
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6); // End of the week (Saturday)
        end.setHours(23, 59, 59, 999);
        break;
      case "month":
        start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case "quarter":
        const quarter = Math.floor(currentDate.getMonth() / 3);
        start = new Date(currentDate.getFullYear(), quarter * 3, 1);
        end = new Date(currentDate.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59, 999);
        break;
      case "year":
        start = new Date(currentDate.getFullYear(), 0, 1);
        end = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        start = new Date(currentDate);
        start.setDate(currentDate.getDate() - currentDate.getDay());
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
    }

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    }

    const restockRef = db.collection("restock_requests");
    const snapshot = await restockRef
      .where("dateOfRequest", ">=", start.toISOString())
      .where("dateOfRequest", "<=", end.toISOString())
      .get();

    // Fetch inventory items to map productId to product name
    const inventorySnapshot = await db.collection("inventoryItems").get();
    const inventoryMap = {};
    inventorySnapshot.forEach((doc) => {
      const data = doc.data();
      inventoryMap[data.itemId] = data.name;
    });

    // Fetch retailers from user_details
    const retailerSnapshot = await db.collection("user_details")
      .where("typeOfUser", "==", "retailers")
      .get();
    const retailerMap = {};
    retailerSnapshot.forEach((doc) => {
      retailerMap[doc.id] = doc.data().companyName || "Unknown Retailer";
    });

    const requests = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        states: data.states || "Pending",
        dateOfRequest: data.dateOfRequest,
        productName: inventoryMap[data.productId] || data.productName || "Unknown Product",
        quantity: data.quantity || 0,
        urgency: data.urgency || "Normal",
        vendorSupplierId: data.vendorSupplierId || "Unknown Supplier",
        requestedBy: retailerMap[data.retailerId] || "Unknown",
        requested: data.requested,
        underReview: data.underReview,
        approved: data.approved,
      };
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching restock requests:", error);
    res.status(500).json({ message: "Failed to fetch restock requests" });
  }
});

// Get a specific restock request by ID
app.get("/api/restock-requests/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const restockRef = db.collection("restock_requests").doc(id);
    const doc = await restockRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Restock request not found" });
    }

    const data = doc.data();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching restock request:", error);
    res.status(500).json({ message: "Failed to fetch restock request" });
  }
});

// Add new restock request with generated ID "RR-001"
app.post("/api/restock-requests", authenticateToken, async (req, res) => {
  const { productName, quantity, urgency, shortNote, vendorSupplierId } = req.body;

  if (!productName || !quantity || !vendorSupplierId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const restockRef = db.collection("restock_requests");
    const snapshot = await restockRef.get();
    const requestCount = snapshot.size + 1;
    const requestId = `RR-${String(requestCount).padStart(3, "0")}`; // Generate ID like "RR-001"

    // Map authenticated user's UID to a retailer ID from user_details
    const userProfile = (await db.collection("users").doc(req.user.uid).get()).data()?.profile || {};
    const retailerSnapshot = await db.collection("user_details")
      .where("typeOfUser", "==", "retailers")
      .where("companyName", "==", userProfile.companyName || req.user.email.split("@")[0])
      .limit(1)
      .get();
    const retailerId = retailerSnapshot.empty
      ? `RT-${String((await db.collection("user_details").where("typeOfUser", "==", "retailers").get()).size + 1).padStart(3, "0")}`
      : retailerSnapshot.docs[0].id;

    const productSnapshot = await db.collection("inventoryItems")
      .where("name", "==", productName)
      .limit(1)
      .get();
    const productData = productSnapshot.docs[0]?.data() || { itemId: requestId.replace("RR", "ITM"), category: "Unknown" };

    const newRequest = {
      id: requestId, // Assign the generated ID
      states: "Pending",
      dateOfRequest: new Date().toISOString(),
      productId: productData.itemId,
      productName,
      vendorSupplierId,
      quantity: parseInt(quantity),
      urgency,
      shortNote: shortNote || "",
      stockCategory: productData.category,
      description: shortNote || "",
      retailerId, // Use the mapped or newly assigned retailer ID
      requested: { date: new Date().toISOString(), user: req.user.email?.split("@")[0] || req.user.name || req.user.uid || "Unknown User" },
      underReview: null,
      approved: null,
    };
    await restockRef.doc(requestId).set(newRequest); // Use the generated ID as document ID
    res.status(201).json({ message: "Restock request added successfully", id: requestId });
  } catch (error) {
    console.error("Error adding restock request:", error);
    res.status(500).json({ message: "Failed to add restock request" });
  }
});

// Update restock request state
app.put("/api/restock-requests/:id/state", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { state, user: requestUser } = req.body; // Allow custom user from request, fallback to authenticated user

  try {
    const restockRef = db.collection("restock_requests").doc(id);
    const doc = await restockRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Restock request not found" });
    }

    const data = doc.data();
    const updates = {};
    const username = requestUser || req.user.email?.split("@")[0] || req.user.name || req.user.uid || "Unknown User";

    switch (state) {
      case "underReview":
        if (!data.underReview) {
          updates.underReview = { date: new Date().toISOString(), user: username };
          updates.states = "Under Review";
        }
        break;
      case "approved":
        if (!data.approved) {
          updates.approved = { date: new Date().toISOString(), user: username };
          updates.states = "Approved";
        }
        break;
      default:
        return res.status(400).json({ message: "Invalid state" });
    }

    if (Object.keys(updates).length > 0) {
      await restockRef.update(updates);
      res.status(200).json({ message: `Request marked as ${state} successfully` });
    } else {
      res.status(400).json({ message: `Request already ${state}` });
    }
  } catch (error) {
    console.error("Error updating restock request state:", error);
    res.status(500).json({ message: "Failed to update restock request state" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});