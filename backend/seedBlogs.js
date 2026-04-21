import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "./models/blog.model.js";

dotenv.config();

const blogs = [
  {
    title: "5 Tips for Fresh Groceries",
    category: "Latest News",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    excerpt: "Keeping your vegetables and fruits fresh for longer is an art. Here's a quick guide.",
    content: `Keeping your vegetables and fruits fresh for longer is an art. Here's a quick guide on how to maximize the shelf life of your ingredients.

1. Leafy Greens: Store them in a container with a damp paper towel to maintain humidity.
2. Root Vegetables: Keep them in a cool, dark, and dry place.
3. Ethylene Producers: Keep apples and bananas away from other produce as they speed up ripening.
4. Herbs: Treat them like flowers; put the stems in water.
5. Don't Wash Early: Only wash your produce right before you're ready to use it to prevent mold growth.

By following these simple steps, you can reduce waste and save money while enjoying the best flavors your groceries have to offer.`
  },
  {
    title: "How to Cook the Perfect Pasta",
    category: "Cooking Tips",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800",
    excerpt: "Pasta should be al dente, but what does that really mean? Let's dive into Italian cooking.",
    ingredients: ["Pasta", "Tomato Sauce", "Olive Oil", "Garlic"],
    content: `Pasta is the ultimate comfort food, but achieving that perfect 'al dente' texture requires attention to detail.

First, always use a large pot of water. Pasta needs room to move around so it doesn't stick together. Salt the water heavily—it should taste like the sea. This is your only chance to season the pasta itself.

Don't add oil to the water; it prevents the sauce from sticking to the pasta. Instead, stir frequently during the first few minutes of cooking.

Start testing the pasta two minutes before the package directions suggest. It should have a slight bite in the center. Save a cup of the pasta water before draining—this liquid gold is the secret to a silky, emulsified sauce.

Combine the pasta and sauce in a pan with a splash of that reserved water, and toss over heat for a minute. This 'mantecatura' process ensures every strand is perfectly coated.`
  },
  {
    title: "Benefits of Leafy Greens",
    category: "Health & Wellness",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
    excerpt: "Spinach, Kale and Chard. The powerhouses of nutrition that you MUST add to your diet.",
    content: `Leafy greens are among the most nutrient-dense foods on the planet. Packed with vitamins, minerals, and fiber, they are essential for a healthy body and mind.

Spinach is a great source of iron and vitamins A and C. Kale provides a massive amount of vitamin K, which is crucial for bone health. Swiss Chard is loaded with magnesium, helping with muscle and nerve function.

Why should you eat them?
- Heart Health: High in nitrates that help lower blood pressure.
- Brain Function: Slows cognitive decline as you age.
- Digestive Health: High fiber content keeps your system regular.

Try to include at least one serving of leafy greens in every meal. Mix them into smoothies, sauté them as a side dish, or make a fresh salad the star of your lunch.`
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for seeding...");
    
    await Blog.deleteMany({});
    console.log("Cleared existing blogs.");
    
    await Blog.insertMany(blogs);
    console.log("Inserted seed blogs!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding DB:", error);
    process.exit(1);
  }
};

seedDB();
