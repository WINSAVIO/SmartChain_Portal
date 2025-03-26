const admin = require("firebase-admin");
const serviceAccount = require("./publicAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seedDatabase() {
  try {
    // 1. Populate the `suppliers` collection
    const suppliers = [
      { name: "Office Supplies Co." },
      { name: "Lighting Solutions Inc." },
      { name: "Tech Supplies Ltd." },
      { name: "Furniture Plus" },
      { name: "Business Supplies Inc." },
    ];

    console.log("Populating suppliers...");
    for (const supplier of suppliers) {
      await db.collection("suppliers").add(supplier);
      console.log(`Added supplier: ${supplier.name}`);
    }

    // 2. Populate the `categories` collection
    const categories = [
      { name: "Furniture" },
      { name: "Lighting" },
      { name: "Electronics" },
      { name: "Office Supplies" },
    ];

    console.log("Populating categories...");
    for (const category of categories) {
      await db.collection("categories").add(category);
      console.log(`Added category: ${category.name}`);
    }

    // 3. Populate the `inventoryItems` collection
    const inventoryItems = [
      {
        name: "Office Chairs",
        supplier: "Office Supplies Co.",
        quantity: 85,
        reorderPoint: 20,
        category: "Furniture",
      },
      {
        name: "Desk Lamps",
        supplier: "Lighting Solutions Inc.",
        quantity: 120,
        reorderPoint: 30,
        category: "Lighting",
      },
      {
        name: "Monitors",
        supplier: "Tech Supplies Ltd.",
        quantity: 15,
        reorderPoint: 20,
        category: "Electronics",
      },
      {
        name: "Keyboards",
        supplier: "Tech Supplies Ltd.",
        quantity: 45,
        reorderPoint: 25,
        category: "Electronics",
      },
      {
        name: "Desk Organizers",
        supplier: "Office Supplies Co.",
        quantity: 200,
        reorderPoint: 50,
        category: "Office Supplies",
      },
      {
        name: "Whiteboards",
        supplier: "Office Supplies Co.",
        quantity: 8,
        reorderPoint: 10,
        category: "Office Supplies",
      },
      {
        name: "Filing Cabinets",
        supplier: "Office Supplies Co.",
        quantity: 12,
        reorderPoint: 15,
        category: "Furniture",
      },
    ];

    console.log("Populating inventory items...");
    for (const item of inventoryItems) {
      await db.collection("inventoryItems").add(item);
      console.log(`Added item: ${item.name}`);
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Exit the process after completion
    process.exit();
  }
}

// Run the seeding function
seedDatabase();