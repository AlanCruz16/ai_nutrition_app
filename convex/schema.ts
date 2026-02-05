import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    meal_logs: defineTable({
        user_id: v.string(), // Clerk user ID
        description: v.string(),
        calories: v.number(),
        protein: v.number(),
        carbs: v.number(),
        fat: v.number(),
        created_at: v.number(), // Store as timestamp (ms) for easier sorting
    }).index("by_user", ["user_id"]),
    recipes: defineTable({
        user_id: v.string(),
        name: v.string(),
        description: v.string(),
    }).index("by_user", ["user_id"]),
});
