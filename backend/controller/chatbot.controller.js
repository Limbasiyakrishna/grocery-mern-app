import axios from "axios";
import Blog from "../models/blog.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini if API key is provided
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Local cooking knowledge dictionary
const cookInfo = {
    "boil": "Bring liquid to 100°C where bubbles rise to the surface. Tip: Add salt to water to season from within.",
    "saute": "Cook quickly in a small amount of fat over high heat. Essential for developing flavor in onions and garlic.",
    "al dente": "The perfect stage for pasta—firm to the bite, not mushy.",
    "mirepoix": "The holy trinity of cooking: onions, carrots, and celery. The base for almost all great soups and stews.",
    "deglaize": "Adding liquid to a hot pan to loosen the flavorful browned bits (fond) stuck to the bottom.",
    "blanch": "Scalding vegetables in boiling water then plunging into ice water to preserve color and crunch.",
};

export const chatWithChef = async (req, res) => {
    try {
        const { message } = req.body;
        const lowerMsg = message.toLowerCase();

        // --- OPTION 1: Use Gemini AI (If Key is Provided) ---
        if (genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `You are the FreshNest AI Chef, a friendly and expert culinary assistant. 
                Your goal is to provide cooking information, recipes, and ingredient advice.
                Use emojis to make the conversation lively. 
                Keep your tone encouraging and professional.
                If asked for a recipe, provide a clear title, ingredients list, and instructions.
                If asked about FreshNest, mention we provide the freshest organic groceries.
                
                USER MESSAGE: ${message}`;

                const result = await model.generateContent(prompt);
                const reply = result.response.text();
                return res.json({ success: true, reply });
            } catch (aiError) {
                console.error("Gemini AI Error:", aiError.message);
                // Fallback to local logic if AI fails
            }
        }

        // --- OPTION 2: Advanced Fallback Logic ---
        
        // A. Recipe Search (Enhanced)
        const recipeKeywords = ["recipe", "how to cook", "make", "prepare", "cook", "ingredients for"];
        if (recipeKeywords.some(k => lowerMsg.includes(k))) {
            let query = lowerMsg;
            recipeKeywords.forEach(k => { query = query.replace(k, ""); });
            query = query.replace("can you", "").replace("provide", "").replace("the", "").replace("a", "").trim();

            if (query.length > 2) {
                try {
                    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
                    const meals = response.data.meals;

                    if (meals && meals.length > 0) {
                        const meal = meals[0];
                        const ingredients = [];
                        for (let i = 1; i <= 20; i++) {
                            if (meal[`strIngredient${i}`]) {
                                ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
                            }
                        }

                        const reply = `I've found a classic recipe for **${meal.strMeal}**! 🥘\n\n` +
                                     `🛒 **Ingredients:**\n${ingredients.map(ing => `• ${ing}`).join("\n")}\n\n` +
                                     `👩‍🍳 **Instructions:**\n${meal.strInstructions.length > 800 ? meal.strInstructions.substring(0, 800) + '...' : meal.strInstructions}\n\n` +
                                     `Tip: You can find all these fresh ingredients at FreshNest! 🥦`;
                        
                        return res.json({ success: true, reply });
                    }
                } catch (e) {
                    console.error("MealDB Fallback Error:", e);
                }
            }
        }

        // B. Blog Search
        const blogs = await Blog.find({ category: "Cooking Tips" });
        const matchingBlog = blogs.find(b => 
            lowerMsg.includes(b.title.toLowerCase()) || 
            (b.ingredients && b.ingredients.some(ing => lowerMsg.includes(ing.toLowerCase())))
        );

        if (matchingBlog) {
            return res.json({ 
                success: true, 
                reply: `We have a perfect guide for that! 📖 Check our blog: "**${matchingBlog.title}**". \n\nInsight: ${matchingBlog.excerpt} \n\nYou can read the full detail in our Blog section! ✨` 
            });
        }

        // C. Kitchen Dictionary Search
        for (const [key, val] of Object.entries(cookInfo)) {
            if (lowerMsg.includes(key)) {
                return res.json({ 
                    success: true, 
                    reply: `Culinary Tip: **${key.toUpperCase()}** refers to ${val} 💡` 
                });
            }
        }

        // D. Contextual Greetings / Help
        if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("hey")) {
            return res.json({ 
                success: true, 
                reply: "Hello! I'm your FreshNest AI Chef. 🧑‍🍳 I'm here to help you turn groceries into gourmet meals. Ask me for a recipe (e.g., 'Pasta recipe') or a cooking tip!" 
            });
        }

        // E. Default "Smart" Response
        const suggestions = [
            "I'm not sure about that specific request, but I can provide recipes for Chicken, Pasta, Beef, or Salads! Try asking: 'Give me a pasta recipe' 🍝",
            "Cooking is an art! While I look into that, remember that fresh ingredients are the secret to any great dish. Check our store for the best produce! 🍅",
            "I'm still expanding my recipe book. If you're looking for help with a specific dish, just name it! 🥘",
            "That sounds interesting! For specialized cooking advice, our Blog section is also a treasure trove of information. 💎"
        ];

        res.json({ 
            success: true, 
            reply: suggestions[Math.floor(Math.random() * suggestions.length)] 
        });

    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
